"""Server-owned accounts, sessions and order history. No browser roles are trusted."""
import hashlib
import hmac
import json
import math
import re
import secrets
import sqlite3
import time
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path

STATUSES = {
    "new": "Новая", "processing": "В обработке", "payment": "Ожидает оплаты",
    "paid": "Оплачена", "shipped": "Отгружена", "completed": "Завершена", "cancelled": "Отменена",
}


class ApiError(Exception):
    def __init__(self, message, status=400):
        super().__init__(message)
        self.status = status


def now():
    return datetime.now(timezone.utc).isoformat()


def text(value, limit=800):
    return str(value or "").strip()[:limit]


def phone_key(value):
    value = text(value, 80)
    if not re.fullmatch(r"\+?[\d\s().-]+", value, re.ASCII):
        return ""
    digits = re.sub(r"\D", "", value)
    if not value.startswith("+"):
        if len(digits) == 11 and digits.startswith("8"):
            digits = "7" + digits[1:]
        elif len(digits) == 10:
            digits = "7" + digits
    return digits if 10 <= len(digits) <= 15 else ""


def password_hash(password, salt=None):
    salt = salt or secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), bytes.fromhex(salt), 600_000).hex()
    return salt + ":" + digest


def customer_data(data):
    if not isinstance(data, dict):
        raise ApiError("Укажите данные клиента.")
    result = {key: text(data.get(key), limit) for key, limit in {
        "name": 120, "phone": 80, "email": 160, "company": 200,
        "inn": 12, "kpp": 9, "requisites": 2000,
    }.items()}
    result["email"] = result["email"].lower()
    result["clientType"] = "legal" if data.get("clientType") == "legal" else "person"
    if not result["name"]:
        raise ApiError("Укажите имя.")
    if result["phone"] and not phone_key(result["phone"]):
        raise ApiError("Проверьте номер телефона.")
    if result["email"] and not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", result["email"]):
        raise ApiError("Проверьте email.")
    if not result["phone"] and not result["email"]:
        raise ApiError("Укажите телефон или email.")
    if result["clientType"] == "legal" and (
        not result["company"] or not re.fullmatch(r"(?:[0-9]{10}|[0-9]{12})", result["inn"])
    ):
        raise ApiError("Для юрлица нужны компания и ИНН из 10 или 12 цифр.")
    if data.get("consent") is not True:
        raise ApiError("Подтвердите согласие на обработку персональных данных.")
    result["consent"] = True
    result["consentDetails"] = {
        "accepted": True, "acceptedAt": now(), "policyVersion": "2026-08-31", "source": "server-form",
    }
    addresses = data.get("addresses", [])
    result["addresses"] = [text(v, 500) for v in addresses[:20]] if isinstance(addresses, list) else []
    return result


def order_totals(items):
    unknown = sum(item.get("price") is None for item in items)
    known = round(sum(item["price"] * item.get("qty", 1) for item in items if item.get("price") is not None), 2)
    complete = bool(items) and not unknown
    return {"total": known if complete else None, "knownSubtotal": known, "unpricedCount": unknown, "totalComplete": complete}


class OrderStore:
    def __init__(self, path, catalogue=None):
        self.path = Path(path)
        self.catalogue = {item["id"]: item for item in catalogue} if catalogue is not None else None
        self.path.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
        with self.connect() as db:
            db.execute("PRAGMA journal_mode=WAL")
            db.executescript('''
                CREATE TABLE IF NOT EXISTS accounts (
                    id TEXT PRIMARY KEY, phone TEXT UNIQUE, email TEXT UNIQUE,
                    password TEXT NOT NULL, profile TEXT NOT NULL, created_at TEXT NOT NULL
                );
                CREATE TABLE IF NOT EXISTS sessions (
                    token TEXT PRIMARY KEY, id TEXT NOT NULL, user_id TEXT REFERENCES accounts(id), expires REAL NOT NULL
                );
                CREATE TABLE IF NOT EXISTS orders (
                    id TEXT PRIMARY KEY, request_key TEXT NOT NULL UNIQUE,
                    user_id TEXT REFERENCES accounts(id), session_id TEXT NOT NULL,
                    payload TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'new', version INTEGER NOT NULL DEFAULT 0,
                    created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
                    message_id INTEGER, dirty INTEGER NOT NULL DEFAULT 1,
                    attempts INTEGER NOT NULL DEFAULT 0, retry_at REAL NOT NULL DEFAULT 0
                );
                CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id, created_at);
                CREATE INDEX IF NOT EXISTS idx_orders_session ON orders(session_id, created_at);
                CREATE INDEX IF NOT EXISTS idx_orders_outbox ON orders(dirty, retry_at);
                CREATE TABLE IF NOT EXISTS order_history (
                    id INTEGER PRIMARY KEY, order_id TEXT NOT NULL REFERENCES orders(id),
                    old_status TEXT, new_status TEXT NOT NULL, actor_id TEXT NOT NULL, actor_name TEXT NOT NULL, at TEXT NOT NULL
                );
                CREATE INDEX IF NOT EXISTS idx_history_order ON order_history(order_id, id);
                CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
                CREATE TABLE IF NOT EXISTS confirmations (
                    token TEXT PRIMARY KEY, order_id TEXT NOT NULL, version INTEGER NOT NULL,
                    actor_id TEXT NOT NULL, expires REAL NOT NULL
                );
                CREATE TABLE IF NOT EXISTS limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires REAL NOT NULL);
            ''')
        self.path.chmod(0o600)
        from admin_store import AdminStore
        self.admin = AdminStore(self, catalogue)

    @contextmanager
    def connect(self):
        db = sqlite3.connect(self.path, timeout=15)
        db.row_factory = sqlite3.Row
        db.create_function("CASEFOLD", 1, lambda value: str(value or "").casefold(), deterministic=True)
        db.execute("PRAGMA foreign_keys=ON")
        try:
            with db:
                yield db
        finally:
            db.close()

    def limit(self, key, count, seconds):
        key = hashlib.sha256(key.encode()).hexdigest()
        with self.connect() as db:
            db.execute("BEGIN IMMEDIATE")
            db.execute("DELETE FROM limits WHERE expires < ?", (time.time(),))
            row = db.execute("SELECT count FROM limits WHERE key=?", (key,)).fetchone()
            if row and row["count"] >= count:
                raise ApiError("Слишком много попыток. Попробуйте позже.", 429)
            db.execute("INSERT INTO limits VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1", (key, time.time() + seconds))

    def session(self, token, create=False):
        hashed = hashlib.sha256(text(token, 200).encode()).hexdigest()
        with self.connect() as db:
            row = db.execute("SELECT s.* FROM sessions s LEFT JOIN accounts a ON a.id=s.user_id WHERE s.token=? AND s.expires>? AND (s.user_id IS NULL OR a.blocked=0)", (hashed, time.time())).fetchone()
            if row:
                return dict(row), None
            if not create:
                return None, None
            db.execute("DELETE FROM sessions WHERE expires<?", (time.time(),))
            token = secrets.token_urlsafe(32)
            row = {"id": secrets.token_hex(16), "token": hashlib.sha256(token.encode()).hexdigest(), "user_id": None, "expires": time.time() + 30 * 86400}
            db.execute("INSERT INTO sessions VALUES (:token,:id,:user_id,:expires)", row)
            return row, token

    def public_user(self, user_id):
        if not user_id:
            return None
        with self.connect() as db:
            row = db.execute("SELECT * FROM accounts WHERE id=?", (user_id,)).fetchone()
        if not row:
            return None
        profile = json.loads(row["profile"])
        if row["blocked"]:
            return None
        return {**profile, "id": row["id"], "role": row["role"], "approval": row["approval"], "createdAt": row["created_at"]}

    def authenticate(self, session, data, register=False):
        password = str(data.get("password") or "")
        if not 10 <= len(password) <= 256:
            raise ApiError("Введите пароль длиной от 10 до 256 символов.")
        if register:
            profile = customer_data(data)
            user_id = "user-" + secrets.token_hex(16)
            hashed = password_hash(password)
            try:
                with self.connect() as db:
                    db.execute("INSERT INTO accounts(id,phone,email,password,profile,created_at,approval) VALUES (?,?,?,?,?,?,?)", (user_id, phone_key(profile["phone"]) or None, profile["email"] or None, hashed, json.dumps(profile, ensure_ascii=False), now(), "pending" if profile["clientType"] == "legal" else "confirmed"))
            except sqlite3.IntegrityError:
                raise ApiError("Телефон или email уже зарегистрирован. Используйте вход.", 409)
        else:
            login = text(data.get("login"), 160).lower()
            column, value = ("email", login) if "@" in login else ("phone", phone_key(login))
            with self.connect() as db:
                row = db.execute("SELECT id,password FROM accounts WHERE " + column + "=? AND blocked=0", (value or None,)).fetchone()
            # Use the same expensive hash for unknown accounts to avoid a fast identity oracle.
            stored = row["password"] if row else "0" * 32 + ":" + "0" * 64
            if not hmac.compare_digest(password_hash(password, stored.split(":")[0]), stored) or not row:
                raise ApiError("Неверный телефон, email или пароль. Для старого локального аккаунта нужна регистрация на сервере.", 401)
            user_id = row["id"]
        token = secrets.token_urlsafe(32)
        with self.connect() as db:
            db.execute("BEGIN IMMEDIATE")
            account = db.execute("SELECT role,blocked FROM accounts WHERE id=?", (user_id,)).fetchone()
            if not account or account["blocked"]:
                raise ApiError("Аккаунт недоступен.", 403)
            db.execute("UPDATE orders SET user_id=? WHERE session_id=? AND user_id IS NULL", (user_id, session["id"]))
            db.execute("DELETE FROM sessions WHERE token=?", (session["token"],))
            lifetime = 8 * 3600 if account["role"] in {"admin", "manager"} else 30 * 86400
            db.execute("INSERT INTO sessions VALUES (?,?,?,?)", (hashlib.sha256(token.encode()).hexdigest(), session["id"], user_id, time.time() + lifetime))
        return self.public_user(user_id), token

    def logout(self, session):
        with self.connect() as db:
            db.execute("DELETE FROM sessions WHERE token=?", (session["token"],))

    def update_profile(self, user_id, data):
        current = self.public_user(user_id)
        if not current:
            raise ApiError("Войдите в аккаунт.", 401)
        data = {**data, "clientType": current["clientType"]}
        profile = customer_data(data)
        try:
            with self.connect() as db:
                recheck = current["clientType"] == "legal" and any(profile.get(k) != current.get(k) for k in ["company", "inn", "kpp", "requisites"])
                db.execute("UPDATE accounts SET profile=?,phone=?,email=?,version=version+1,approval=CASE WHEN ? THEN 'pending' ELSE approval END WHERE id=?", (json.dumps(profile, ensure_ascii=False), phone_key(profile["phone"]) or None, profile["email"] or None, recheck, user_id))
        except sqlite3.IntegrityError:
            raise ApiError("Телефон или email уже используется.", 409)
        return self.public_user(user_id)

    def create_order(self, session, data):
        request_key = text(data.get("clientRequestId"), 100)
        if not re.fullmatch(r"[a-zA-Z0-9-]{16,100}", request_key):
            raise ApiError("Обновите страницу перед отправкой заявки.")
        with self.connect() as db:
            existing = db.execute("SELECT * FROM orders WHERE request_key=?", (request_key,)).fetchone()
        if existing:
            if not self.owns(existing, session):
                raise ApiError("Повторите отправку с новым номером заявки.", 409)
            return self.order(existing["id"])
        customer = customer_data(data.get("customer"))
        items = data.get("items", [])
        if not isinstance(items, list) or len(items) > 200:
            raise ApiError("Некорректный состав заказа.")
        cleaned = []
        with self.connect() as db:
            catalogue_revision = self.admin.revision(db)
            catalogue = {p["id"]: p for p in self.admin.catalog_rows(db, active_only=True)} if self.catalogue is not None else None
        for item in items:
            if not isinstance(item, dict):
                raise ApiError("Некорректный товар.")
            if catalogue is not None:
                product = catalogue.get(text(item.get("id"), 120))
                if not product:
                    raise ApiError("Товар больше недоступен. Обновите каталог.")
                item = {**item, **product, "qty": item.get("qty", 1)}
            try:
                qty = int(item.get("qty", 1))
                price = float(item["price"]) if item.get("price") is not None else None
            except (ValueError, TypeError, OverflowError):
                raise ApiError("Некорректная цена или количество.")
            if not 1 <= qty <= 100000 or (price is not None and (not math.isfinite(price) or not 0 <= price <= 1e9)):
                raise ApiError("Некорректная цена или количество.")
            cleaned.append({"id": text(item.get("id"), 120), "sku": text(item.get("sku"), 120), "name": text(item.get("name"), 300), "qty": qty, "price": price})
        payload = {"kind": text(data.get("kind"), 100), "customer": customer, "items": cleaned, "comment": text(data.get("comment"), 4000), **order_totals(cleaned)}
        order_id = "SSC-" + secrets.token_hex(6).upper()
        stamp = now()
        with self.connect() as db:
            db.execute("BEGIN IMMEDIATE")
            if self.admin.revision(db) != catalogue_revision:
                raise ApiError("Каталог обновился. Проверьте цены и повторите отправку.", 409)
            existing = db.execute("SELECT * FROM orders WHERE request_key=?", (request_key,)).fetchone()
            if existing:
                if not self.owns(existing, session):
                    raise ApiError("Заявка недоступна.", 403)
                order_id = existing["id"]
            else:
                db.execute("INSERT INTO orders(id,request_key,user_id,session_id,payload,created_at,updated_at) VALUES (?,?,?,?,?,?,?)", (order_id, request_key, session["user_id"], session["id"], json.dumps(payload, ensure_ascii=False), stamp, stamp))
                db.execute("INSERT INTO order_history(order_id,new_status,actor_id,actor_name,at) VALUES (?,?,?,?,?)", (order_id, "new", "site", "Сайт", stamp))
        return self.order(order_id)

    @staticmethod
    def owns(row, session):
        return bool(session and ((row["user_id"] and row["user_id"] == session["user_id"]) or (not row["user_id"] and row["session_id"] == session["id"])))

    def order(self, order_id):
        with self.connect() as db:
            row = db.execute("SELECT * FROM orders WHERE id=?", (order_id,)).fetchone()
            history = db.execute("SELECT old_status,new_status,actor_name,at FROM order_history WHERE order_id=? ORDER BY id", (order_id,)).fetchall()
        if not row:
            raise ApiError("Заявка не найдена.", 404)
        payload = json.loads(row["payload"])
        return {**payload, **order_totals(payload.get("items", [])), "id": row["id"], "userId": row["user_id"] or "", "status": STATUSES[row["status"]], "statusCode": row["status"], "version": row["version"], "createdAt": row["created_at"], "updatedAt": row["updated_at"], "serverManaged": True, "notificationPending": row["message_id"] is None, "history": [{"from": STATUSES.get(h["old_status"], ""), "to": STATUSES[h["new_status"]], "actor": h["actor_name"], "at": h["at"]} for h in history]}

    def list_orders(self, session):
        with self.connect() as db:
            if session["user_id"]:
                rows = db.execute("SELECT id FROM orders WHERE user_id=? ORDER BY created_at DESC LIMIT 500", (session["user_id"],)).fetchall()
            else:
                rows = db.execute("SELECT id FROM orders WHERE user_id IS NULL AND session_id=? ORDER BY created_at DESC LIMIT 500", (session["id"],)).fetchall()
        return [self.order(row["id"]) for row in rows]

    def confirm_cancel(self, order_id, version, actor):
        token = secrets.token_hex(12)
        with self.connect() as db:
            db.execute("DELETE FROM confirmations WHERE expires<?", (time.time(),))
            db.execute("INSERT INTO confirmations VALUES (?,?,?,?,?)", (token, order_id, version, str(actor), time.time() + 120))
        return token

    def set_status(self, order_id, version, status, actor, actor_name, confirmation=""):
        with self.connect() as db:
            db.execute("BEGIN IMMEDIATE")
            self.set_status_in_db(db, order_id, version, status, actor, actor_name, confirmation)
        return self.order(order_id)

    def set_status_in_db(self, db, order_id, version, status, actor, actor_name, confirmation="", audit_actor=None):
        from admin_store import audit
        if not isinstance(status, str) or status not in STATUSES:
            raise ApiError("Неизвестный статус.")
        row = db.execute("SELECT status,version FROM orders WHERE id=?", (order_id,)).fetchone()
        if not row:
            raise ApiError("Заявка не найдена.", 404)
        if row["version"] != version:
            raise ApiError("Статус уже изменён. Откройте выбор заново.", 409)
        if status == "cancelled" and row["status"] != status:
            valid = db.execute("SELECT token FROM confirmations WHERE token=? AND order_id=? AND version=? AND actor_id=? AND expires>?", (confirmation, order_id, version, str(actor), time.time())).fetchone()
            if not valid:
                raise ApiError("Подтвердите отмену заявки.", 409)
            db.execute("DELETE FROM confirmations WHERE token=?", (confirmation,))
        if row["status"] != status:
            stamp = now()
            db.execute("UPDATE orders SET status=?,version=version+1,updated_at=?,dirty=1,retry_at=0 WHERE id=?", (status, stamp, order_id))
            db.execute("INSERT INTO order_history(order_id,old_status,new_status,actor_id,actor_name,at) VALUES (?,?,?,?,?,?)", (order_id, row["status"], status, str(actor), text(actor_name, 120), stamp))
            audit(db, audit_actor or {"id": str(actor), "name": text(actor_name, 120), "source": "telegram"}, "order.status", "order", order_id, row["status"], status)

    def setting(self, key, value=None):
        with self.connect() as db:
            if value is not None:
                db.execute("INSERT INTO settings VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value", (key, str(value)))
            row = db.execute("SELECT value FROM settings WHERE key=?", (key,)).fetchone()
        return row["value"] if row else None
