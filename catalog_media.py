"""Bounded image uploads, stored beside the database rather than in a release."""
import base64
import binascii
import hashlib
import io
import os
from pathlib import Path
import re
import threading

from admin_store import audit
from order_store import ApiError, now, text

MAX_BYTES = 5 * 1024 * 1024
UPLOAD_LOCK = threading.Lock()


def upload_root(store):
    return Path(os.getenv("SPEC_UPLOAD_DIR") or Path(store.path).parent / "uploads").resolve()


def media_list(store, context, static_root):
    with store.admin.access(context) as (db, actor):
        items = [{"url": "/" + p.relative_to(static_root).as_posix(), "name": p.name} for p in sorted((static_root / "assets/product-images").glob("*")) if p.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp", ".avif"}]
        items.extend(dict(row) for row in db.execute("SELECT url,name FROM catalog_media ORDER BY at DESC"))
        return {"items": items}


def upload(store, context, data):
    # Authorize before decoding, then recheck under the write transaction.
    with store.admin.access(context, admin_only=True):
        pass
    store.limit("image-upload:" + context["token"], 20, 60)
    encoded = data.get("data")
    if not isinstance(encoded, str) or not 0 < len(encoded) <= ((MAX_BYTES + 2) // 3) * 4:
        raise ApiError("Фото должно быть не больше 5 МБ.", 413)
    try:
        raw = base64.b64decode(encoded, validate=True)
    except (ValueError, binascii.Error):
        raise ApiError("Некорректный файл фотографии.") from None
    if not raw or len(raw) > MAX_BYTES:
        raise ApiError("Фото должно быть не больше 5 МБ.", 413)
    if not UPLOAD_LOCK.acquire(blocking=False):
        raise ApiError("Другое фото ещё загружается. Повторите попытку.", 429)
    try:
        from PIL import Image, ImageOps, UnidentifiedImageError
        try:
            with Image.open(io.BytesIO(raw), formats=["JPEG", "PNG", "WEBP"]) as source:
                if source.width * source.height > 25_000_000 or getattr(source, "n_frames", 1) != 1:
                    raise ApiError("Допускается одно фото до 25 мегапикселей, без анимации.")
                source.load()
                picture = ImageOps.exif_transpose(source).convert("RGBA")
                picture.thumbnail((2400, 2400))
                output = io.BytesIO()
                # Re-encoding strips metadata and prevents serving arbitrary uploaded bytes.
                picture.save(output, "WEBP", quality=90, method=4, exif=b"", icc_profile=b"")
                content = output.getvalue()
        except (UnidentifiedImageError, OSError, ValueError, Image.DecompressionBombError):
            raise ApiError("Не удалось прочитать фото. Выберите JPEG, PNG или WebP.") from None
        filename = hashlib.sha256(content).hexdigest() + ".webp"
        url = "/assets/uploads/" + filename
        name = text(data.get("name"), 200).replace("\\", "/").rsplit("/", 1)[-1] or "Фото товара"
        with store.admin.access(context, write=True, admin_only=True) as (db, actor):
            root = upload_root(store)
            root.mkdir(parents=True, exist_ok=True, mode=0o700)
            if db.execute("SELECT url FROM catalog_media WHERE url=?", (url,)).fetchone():
                return {"item": {"url": url, "name": name}}
            if sum(p.stat().st_size for p in root.glob("*.webp")) + len(content) > 512 * 1024 * 1024:
                raise ApiError("Хранилище фотографий заполнено. Обратитесь к администратору.", 409)
            target = root / filename
            # A failed DB commit can leave only an unreferenced safe image, never a broken record.
            with target.open("wb") as handle:
                handle.write(content)
                handle.flush()
                os.fsync(handle.fileno())
            db.execute("INSERT INTO catalog_media VALUES (?,?,?,?,?)", (url, name, len(content), actor["id"], now()))
            audit(db, actor, "catalog.image.upload", "image", filename, None, {"name": name, "image": url})
        return {"item": {"url": url, "name": name}}
    finally:
        UPLOAD_LOCK.release()


def public_image(store, path):
    name = path.removeprefix("/assets/uploads/")
    if not re.fullmatch(r"[a-f0-9]{64}\.webp", name):
        return None
    with store.connect() as db:
        if not db.execute("SELECT 1 FROM catalog_media WHERE url=?", (path,)).fetchone():
            return None
    target = upload_root(store) / name
    return target if target.is_file() else None
