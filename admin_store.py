"""Server-authorized manager operations, catalog revisions and append-only audit."""
import csv
import io
import json
import math
import re
import secrets
import time
from contextlib import contextmanager
from datetime import date, datetime, time as day_time, timedelta, timezone
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from order_store import ApiError, STATUSES, now, text, order_totals

ROLES = {"user": "Покупатель", "manager": "Менеджер", "admin": "Администратор"}
APPROVALS = {"pending": "На проверке", "confirmed": "Подтверждён", "clarification": "Уточнение", "rejected": "Отклонён"}
ACTION_LABELS = {"catalog.update": "Изменение товара", "catalog.create": "Добавление товара", "catalog.import": "Импорт каталога", "catalog.restore": "Восстановление каталога", "catalog.image.upload": "Загрузка фотографии", "client.update": "Изменение клиента", "client.note": "Заметка о клиенте", "order.note": "Комментарий к заявке", "order.assign": "Назначение менеджера", "order.status": "Изменение статуса", "role.bootstrap": "Назначение администратора", "notification.retry": "Повторная отправка уведомления"}
CSV_FIELDS = ["id", "sku", "name", "category", "brand", "interface", "price", "stockQty", "status", "active", "image"]
PRODUCT_FIELDS = CSV_FIELDS + ["type", "speed", "length", "capacity", "connector", "condition", "compatibility", "description", "descriptionMode", "specs", "images"]
SPEC_FIELDS = {"category": "Категория", "brand": "Производитель", "interface": "Интерфейс", "type": "Тип", "speed": "Скорость", "length": "Длина", "capacity": "Емкость", "connector": "Разъем", "condition": "Состояние товара"}


def dump(value):
    return json.dumps(value, ensure_ascii=False, allow_nan=False)


def version_matches(row, supplied):
    if type(supplied) is not int or row["version"] != supplied:
        raise ApiError("Запись уже изменилась. Обновите данные перед сохранением.", 409)


def audit(db, actor, action, entity, entity_id, before, after):
    db.execute("INSERT INTO audit_log(actor_id,actor_name,source,ip,session_id,action,entity,entity_id,before_data,after_data,at) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
               (actor["id"], actor["name"], actor.get("source", "admin"), actor.get("ip", ""), actor.get("session_id", ""), action, entity, entity_id, dump(before), dump(after), now()))


class AdminStore:
    def __init__(self, store, catalogue):
        self.store = store
        with store.connect() as db:
            # Additive migration: existing credentials, sessions and order history remain intact.
            db.execute("BEGIN IMMEDIATE")
            additions = {
                "accounts": {"role": "TEXT NOT NULL DEFAULT 'user'", "blocked": "INTEGER NOT NULL DEFAULT 0", "approval": "TEXT NOT NULL DEFAULT 'pending'", "manager_id": "TEXT", "version": "INTEGER NOT NULL DEFAULT 0"},
                "orders": {"manager_id": "TEXT", "last_error": "TEXT NOT NULL DEFAULT ''", "last_attempt": "TEXT"},
            }
            for table, columns in additions.items():
                existing = {r["name"] for r in db.execute("PRAGMA table_info(" + table + ")")}
                for column, definition in columns.items():
                    if column not in existing:
                        db.execute(f"ALTER TABLE {table} ADD COLUMN {column} {definition}")
                        if table == "accounts" and column == "approval":
                            db.execute("UPDATE accounts SET approval='confirmed' WHERE json_extract(profile,'$.clientType')!='legal'")
            statements = [
                "CREATE TABLE IF NOT EXISTS audit_log(id INTEGER PRIMARY KEY,actor_id TEXT NOT NULL,actor_name TEXT NOT NULL,source TEXT NOT NULL,ip TEXT NOT NULL,session_id TEXT NOT NULL,action TEXT NOT NULL,entity TEXT NOT NULL,entity_id TEXT NOT NULL,before_data TEXT NOT NULL,after_data TEXT NOT NULL,at TEXT NOT NULL)",
                "CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_log(entity,entity_id,id)",
                "CREATE TABLE IF NOT EXISTS internal_notes(id INTEGER PRIMARY KEY,entity TEXT NOT NULL,entity_id TEXT NOT NULL,actor_id TEXT NOT NULL,actor_name TEXT NOT NULL,body TEXT NOT NULL,at TEXT NOT NULL)",
                "CREATE INDEX IF NOT EXISTS idx_notes_entity ON internal_notes(entity,entity_id,id)",
                "CREATE TABLE IF NOT EXISTS catalog_products(id TEXT PRIMARY KEY,sku TEXT NOT NULL UNIQUE COLLATE NOCASE,data TEXT NOT NULL,active INTEGER NOT NULL,version INTEGER NOT NULL DEFAULT 0)",
                "CREATE TABLE IF NOT EXISTS catalog_snapshots(id TEXT PRIMARY KEY,actor_id TEXT NOT NULL,label TEXT NOT NULL,data TEXT NOT NULL,at TEXT NOT NULL)",
                "CREATE TABLE IF NOT EXISTS catalog_imports(token TEXT PRIMARY KEY,actor_id TEXT NOT NULL,revision INTEGER NOT NULL,mode TEXT NOT NULL,data TEXT NOT NULL,expires REAL NOT NULL)",
                "CREATE TABLE IF NOT EXISTS notification_attempts(id INTEGER PRIMARY KEY,order_id TEXT NOT NULL,outcome TEXT NOT NULL,error TEXT NOT NULL,at TEXT NOT NULL)",
                "CREATE INDEX IF NOT EXISTS idx_attempts_order ON notification_attempts(order_id,id)",
                "CREATE TABLE IF NOT EXISTS catalog_media(url TEXT PRIMARY KEY,name TEXT NOT NULL,size INTEGER NOT NULL,actor_id TEXT NOT NULL,at TEXT NOT NULL)",
                "CREATE INDEX IF NOT EXISTS idx_orders_status_date ON orders(status,created_at)",
                "CREATE INDEX IF NOT EXISTS idx_orders_manager ON orders(manager_id,created_at)",
            ]
            for statement in statements:
                db.execute(statement)
            seeded = db.execute("SELECT value FROM settings WHERE key='catalog_revision'").fetchone()
            if not seeded and catalogue is not None:
                for item in catalogue:
                    product = self.normalize_product(item)
                    db.execute("INSERT INTO catalog_products VALUES (?,?,?,?,0)", (product["id"], product["sku"], dump(product), int(product["active"])))
                db.execute("INSERT INTO settings VALUES ('catalog_revision','1')")

    def actor(self, db, context, admin_only=False):
        row = db.execute("SELECT a.id,a.role,a.blocked,a.profile,s.id AS session_id FROM accounts a JOIN sessions s ON s.user_id=a.id WHERE s.token=? AND s.expires>?", (context.get("token", ""), time.time())).fetchone()
        if not row or row["blocked"]:
            raise ApiError("Войдите в кабинет сотрудника.", 401)
        if row["role"] not in ({"admin"} if admin_only else {"admin", "manager"}):
            raise ApiError("Недостаточно прав для этого действия.", 403)
        return {"id": row["id"], "role": row["role"], "name": json.loads(row["profile"])["name"], "session_id": row["session_id"], "ip": context.get("ip", ""), "source": "admin"}

    @contextmanager
    def access(self, context, write=False, admin_only=False):
        with self.store.connect() as db:
            db.execute("BEGIN IMMEDIATE" if write else "BEGIN")
            yield db, self.actor(db, context, admin_only)

    def me(self, context):
        with self.access(context) as (db, actor):
            staff = [{"id": r["id"], "name": json.loads(r["profile"])["name"], "role": r["role"]} for r in db.execute("SELECT id,profile,role FROM accounts WHERE role IN ('admin','manager') AND blocked=0 ORDER BY created_at")]
            return {"user": {k: actor[k] for k in ("id", "name", "role")}, "staff": staff, "statuses": STATUSES, "approvals": APPROVALS, "roles": ROLES, "events": ACTION_LABELS}

    def overview(self, context):
        with self.access(context) as (db, actor):
            statuses = {r["status"]: r["n"] for r in db.execute("SELECT status,COUNT(*) AS n FROM orders GROUP BY status")}
            products = self.catalog_rows(db)
            return {"statuses": statuses, "clientsPending": db.execute("SELECT COUNT(*) FROM accounts WHERE approval='pending' AND json_extract(profile,'$.clientType')='legal'").fetchone()[0],
                    "notificationErrors": db.execute("SELECT COUNT(*) FROM orders WHERE dirty=1 AND attempts>0").fetchone()[0],
                    "withoutPrice": sum(p["price"] is None for p in products if p["active"]),
                    "withoutStock": sum(p.get("stockQty") in (0, None) for p in products if p["active"]),
                    "products": len(products), "clients": db.execute("SELECT COUNT(*) FROM accounts").fetchone()[0], "updatedAt": now()}

    @staticmethod
    def pagination(query):
        try:
            page = max(1, min(100000, int(query.get("page", "1"))))
        except (ValueError, TypeError):
            raise ApiError("Некорректная страница.")
        return page, 30, (page - 1) * 30

    def orders(self, context, query):
        page, limit, offset = self.pagination(query)
        where, args = ["1=1"], []
        if query.get("status") == "open":
            where.append("status NOT IN ('completed','cancelled')")
        for key, column in [("status", "status"), ("manager", "manager_id"), ("client", "user_id")]:
            if key == "status" and query.get(key) == "open":
                continue
            if query.get(key):
                where.append(column + "=?")
                args.append(text(query[key], 120))
        try:
            zone = ZoneInfo(query.get("timeZone", "UTC"))
            dates = {key: date.fromisoformat(query[key]) for key in ("from", "to") if query.get(key)}
            if dates.get("from", date.min) > dates.get("to", date.max):
                raise ValueError()
            for key, operator in [("from", ">="), ("to", "<")]:
                if key in dates:
                    day = dates[key] + (timedelta(days=1) if key == "to" else timedelta())
                    bound = datetime.combine(day, day_time.min, zone).astimezone(timezone.utc)
                    where.append("julianday(created_at)" + operator + "julianday(?)")
                    args.append(bound.isoformat())
        except (ValueError, TypeError, OverflowError, ZoneInfoNotFoundError):
            raise ApiError("Проверьте диапазон дат и часовой пояс.") from None
        if query.get("q"):
            where.append("(CASEFOLD(id) LIKE ? OR CASEFOLD(payload) LIKE ?)")
            args.extend(["%" + text(query["q"], 120).casefold() + "%"] * 2)
        with self.access(context) as (db, actor):
            clause = " AND ".join(where)
            total = db.execute("SELECT COUNT(*) FROM orders WHERE " + clause, args).fetchone()[0]
            counts = {r["status"]: r["n"] for r in db.execute("SELECT status,COUNT(*) AS n FROM orders WHERE " + clause + " GROUP BY status", args)}
            if query.get("view") == "board":
                columns = {}
                for code in STATUSES:
                    count = counts.get(code, 0)
                    column_page, _, _ = self.pagination({"page": query.get("page_" + code, "1")})
                    column_page = min(column_page, max(1, (count + limit - 1) // limit))
                    rows = db.execute("SELECT * FROM orders WHERE " + clause + " AND status=? ORDER BY created_at DESC,id DESC LIMIT ? OFFSET ?", [*args, code, limit, (column_page - 1) * limit]).fetchall()
                    columns[code] = {"items": [self.order_summary(r) for r in rows], "total": count, "page": column_page, "pageSize": limit}
                return {"columns": columns, "total": total, "counts": counts}
            rows = db.execute("SELECT * FROM orders WHERE " + clause + " ORDER BY created_at DESC,id DESC LIMIT ? OFFSET ?", [*args, limit, offset]).fetchall()
            return {"items": [self.order_summary(r) for r in rows], "total": total, "page": page, "pageSize": limit}

    @staticmethod
    def order_summary(row):
        data = json.loads(row["payload"])
        return {**data, **order_totals(data.get("items", [])), "id": row["id"], "userId": row["user_id"], "statusCode": row["status"], "status": STATUSES[row["status"]], "version": row["version"], "managerId": row["manager_id"] or "", "createdAt": row["created_at"], "updatedAt": row["updated_at"]}

    def order(self, context, order_id):
        with self.access(context) as (db, actor):
            row = db.execute("SELECT * FROM orders WHERE id=?", (order_id,)).fetchone()
            if not row:
                raise ApiError("Заявка не найдена.", 404)
            history = [dict(r) for r in db.execute("SELECT old_status,new_status,actor_name,at FROM order_history WHERE order_id=? ORDER BY id", (order_id,))]
            return {"order": self.order_summary(row), "history": history, "notes": self.notes(db, "order", order_id)}

    @staticmethod
    def notes(db, entity, entity_id):
        return [dict(r) for r in db.execute("SELECT actor_name,body,at FROM internal_notes WHERE entity=? AND entity_id=? ORDER BY id", (entity, entity_id))]

    @staticmethod
    def check_manager(db, manager):
        if manager and not db.execute("SELECT id FROM accounts WHERE id=? AND role IN ('admin','manager') AND blocked=0", (manager,)).fetchone():
            raise ApiError("Выберите действующего сотрудника.")

    def update_order(self, context, order_id, data):
        with self.access(context, write=True) as (db, actor):
            row = db.execute("SELECT * FROM orders WHERE id=?", (order_id,)).fetchone()
            if not row:
                raise ApiError("Заявка не найдена.", 404)
            version_matches(row, data.get("version"))
            manager = text(data.get("managerId", row["manager_id"]), 100) or None
            self.check_manager(db, manager)
            status = data.get("status", row["status"])
            self.store.set_status_in_db(db, order_id, row["version"], status, actor["id"], actor["name"], data.get("confirmation", ""), actor)
            if manager != row["manager_id"]:
                db.execute("UPDATE orders SET manager_id=?,version=version+1,updated_at=? WHERE id=?", (manager, now(), order_id))
                audit(db, actor, "order.assign", "order", order_id, row["manager_id"], manager)
            self.add_note(db, actor, "order", order_id, data.get("note"))
        return self.order(context, order_id)

    def cancel_token(self, context, order_id, data):
        with self.access(context, write=True) as (db, actor):
            row = db.execute("SELECT version FROM orders WHERE id=?", (order_id,)).fetchone()
            if not row:
                raise ApiError("Заявка не найдена.", 404)
            version_matches(row, data.get("version"))
            token = secrets.token_hex(12)
            db.execute("DELETE FROM confirmations WHERE expires<?", (time.time(),))
            db.execute("INSERT INTO confirmations VALUES (?,?,?,?,?)", (token, order_id, row["version"], actor["id"], time.time() + 120))
            return {"confirmation": token}

    @staticmethod
    def add_note(db, actor, entity, entity_id, value):
        body = text(value, 4000)
        if body:
            db.execute("INSERT INTO internal_notes(entity,entity_id,actor_id,actor_name,body,at) VALUES (?,?,?,?,?,?)", (entity, entity_id, actor["id"], actor["name"], body, now()))
            audit(db, actor, entity + ".note", entity, entity_id, None, body)

    def clients(self, context, query):
        page, limit, offset = self.pagination(query)
        where, args = ["1=1"], []
        if query.get("q"):
            where.append("CASEFOLD(profile) LIKE ?")
            args.append("%" + text(query["q"], 120).casefold() + "%")
        if query.get("approval"):
            where.append("approval=?")
            args.append(query["approval"])
        if query.get("clientType") in {"legal", "person"}:
            where.append("json_extract(profile,'$.clientType')=?")
            args.append(query["clientType"])
        with self.access(context) as (db, actor):
            clause = " AND ".join(where)
            total = db.execute("SELECT COUNT(*) FROM accounts WHERE " + clause, args).fetchone()[0]
            rows = db.execute("SELECT id,profile,role,blocked,approval,manager_id,version,created_at FROM accounts WHERE " + clause + " ORDER BY created_at DESC LIMIT ? OFFSET ?", [*args, limit, offset]).fetchall()
            return {"items": [self.client_record(r) for r in rows], "total": total, "page": page, "pageSize": limit}

    @staticmethod
    def client_record(row):
        return {**json.loads(row["profile"]), "id": row["id"], "role": row["role"], "blocked": bool(row["blocked"]), "approval": row["approval"], "managerId": row["manager_id"] or "", "version": row["version"], "createdAt": row["created_at"]}

    def client(self, context, user_id):
        with self.access(context) as (db, actor):
            row = db.execute("SELECT * FROM accounts WHERE id=?", (user_id,)).fetchone()
            if not row:
                raise ApiError("Клиент не найден.", 404)
            return {"client": self.client_record(row), "notes": self.notes(db, "client", user_id)}

    def update_client(self, context, user_id, data):
        with self.access(context, write=True) as (db, actor):
            row = db.execute("SELECT * FROM accounts WHERE id=?", (user_id,)).fetchone()
            if not row:
                raise ApiError("Клиент не найден.", 404)
            version_matches(row, data.get("version"))
            role = data.get("role", row["role"])
            blocked = data.get("blocked", bool(row["blocked"]))
            approval = data.get("approval", row["approval"])
            manager = text(data.get("managerId", row["manager_id"]), 100) or None
            if not isinstance(role, str) or not isinstance(approval, str) or role not in ROLES or approval not in APPROVALS or type(blocked) is not bool:
                raise ApiError("Некорректные настройки клиента.")
            if actor["role"] != "admin" and (role != row["role"] or blocked != bool(row["blocked"]) or row["role"] != "user"):
                raise ApiError("Роли и блокировки доступны только администратору.", 403)
            if user_id == actor["id"] and (blocked or role != row["role"]):
                raise ApiError("Нельзя заблокировать себя или изменить собственную роль.", 409)
            if row["role"] == "admin" and not row["blocked"] and (role != "admin" or blocked):
                if db.execute("SELECT COUNT(*) FROM accounts WHERE role='admin' AND blocked=0").fetchone()[0] <= 1:
                    raise ApiError("Нельзя отключить последнего администратора.", 409)
            self.check_manager(db, manager)
            before = {"role": row["role"], "blocked": bool(row["blocked"]), "approval": row["approval"], "managerId": row["manager_id"] or ""}
            after = {"role": role, "blocked": blocked, "approval": approval, "managerId": manager or ""}
            if before != after:
                db.execute("UPDATE accounts SET role=?,blocked=?,approval=?,manager_id=?,version=version+1 WHERE id=?", (role, int(blocked), approval, manager, user_id))
                if role != row["role"] or blocked != bool(row["blocked"]):
                    db.execute("DELETE FROM sessions WHERE user_id=?", (user_id,))
                audit(db, actor, "client.update", "client", user_id, before, after)
            self.add_note(db, actor, "client", user_id, data.get("note"))
        return self.client(context, user_id)

    @staticmethod
    def normalize_product(value, previous=None):
        product = {**(previous or {}), **value}
        product["id"] = text(product.get("id"), 120)
        product["sku"] = text(product.get("sku") or product["id"], 120)
        product["name"] = text(product.get("name"), 300)
        if not re.fullmatch(r"[a-zA-Z0-9_-]+", product["id"]) or not product["sku"] or not product["name"]:
            raise ApiError("Товару нужны корректные id, SKU и название.")
        for key in ["category", "brand", "interface", "type", "speed", "length", "capacity", "connector", "condition"]:
            product[key] = text(product.get(key), 160)
        price = product.get("price")
        try:
            price = None if price in (None, "") else float(price)
        except (TypeError, ValueError):
            raise ApiError("Некорректная цена.")
        if price is not None and (not math.isfinite(price) or not 0 <= price <= 1e9):
            raise ApiError("Цена должна быть от 0 до 1 000 000 000.")
        product["price"] = round(price, 2) if price is not None else None
        qty = product.get("stockQty")
        if "stockQty" not in product:
            match = re.search(r"\d+", str(product.get("stock", "")))
            qty = int(match[0]) if match else None
        if qty in (None, ""):
            qty = None
        else:
            try:
                if isinstance(qty, bool) or float(qty) != int(qty) or not 0 <= int(qty) <= 100000:
                    raise ValueError()
                qty = int(qty)
            except (ValueError, TypeError, OverflowError):
                raise ApiError("Остаток должен быть целым числом от 0 до 100000.")
        product["stockQty"] = qty
        product["stock"] = "Под заказ / уточнить наличие" if qty is None else f"В наличии: {qty} шт." if qty else "Нет в наличии"
        product["status"] = product.get("status") or ("cart" if price is not None and qty else "request")
        if not isinstance(product["status"], str) or product["status"] not in {"cart", "request"}:
            raise ApiError("Сценарий продажи: cart или request.")
        if price is None or qty == 0:
            product["status"] = "request"
        active = product.get("active", True)
        if isinstance(active, str):
            if active.lower() not in {"true", "false", "1", "0"}:
                raise ApiError("active должен быть true или false.")
            active = active.lower() in {"true", "1"}
        if type(active) is not bool:
            raise ApiError("Некорректный признак публикации.")
        product["active"] = active
        if product["condition"] not in {"", "Новый", "Б/У"}:
            raise ApiError("Состояние товара: Новый или Б/У.")
        product["image"] = AdminStore.image_path(product.get("image", ""))
        images = product.get("images", [])
        if not isinstance(images, list) or len(images) > 12:
            raise ApiError("Допускается до 12 фотографий товара.")
        # Legacy galleries may contain position metadata; keep it on partial edits.
        checked_images = []
        for image in images:
            url = AdminStore.image_path(image.get("src", "") if isinstance(image, dict) else image)
            if url:
                checked_images.append({**image, "src": url} if isinstance(image, dict) else url)
        product["images"] = checked_images
        compatibility = product.get("compatibility", [])
        if not isinstance(compatibility, list) or len(compatibility) > 50 or any(not isinstance(item, str) or len(item) > 160 for item in compatibility):
            raise ApiError("Совместимость: до 50 значений длиной до 160 символов.")
        product["compatibility"] = list(dict.fromkeys(item.strip() for item in compatibility if item.strip()))
        description = product.get("description", "")
        if not isinstance(description, str) or len(description) > 6000:
            raise ApiError("Описание должно быть текстом до 6000 символов.")
        product["description"] = description.strip()
        product["descriptionMode"] = product.get("descriptionMode", "auto")
        if product["descriptionMode"] not in ("auto", "custom"):
            raise ApiError("Некорректный режим описания.")
        specs = product.get("specs", {})
        if not isinstance(specs, dict) or len(specs) > 50 or any(not isinstance(k, str) or not k.strip() or len(k) > 100 or not isinstance(v, str) or len(v) > 1000 for k, v in specs.items()):
            raise ApiError("Характеристики: до 50 текстовых пар, название до 100, значение до 1000 символов.")
        product["specs"] = {k.strip(): v.strip() for k, v in specs.items()}
        for key, label in SPEC_FIELDS.items():
            product["specs"].pop(label, None)
            if product[key]:
                product["specs"][label] = product[key]
        product["vat"] = True
        product.pop("version", None)
        return product

    @staticmethod
    def image_path(value):
        if not isinstance(value, str) or len(value) > 500:
            raise ApiError("Некорректный путь изображения.")
        if value and (not re.fullmatch(r"(?:\./|/)?assets/[a-zA-Z0-9_./-]+\.(?:png|jpg|jpeg|webp|avif)", value, re.I) or ".." in value):
            raise ApiError("Выберите изображение из файлов каталога.")
        return value

    @staticmethod
    def catalog_rows(db, active_only=False):
        return [{**json.loads(r["data"]), "version": r["version"]} for r in db.execute("SELECT data,version FROM catalog_products" + (" WHERE active=1" if active_only else "") + " ORDER BY rowid")]

    @staticmethod
    def revision(db):
        row = db.execute("SELECT value FROM settings WHERE key='catalog_revision'").fetchone()
        return int(row[0]) if row else 0

    @staticmethod
    def bump_catalog(db):
        db.execute("UPDATE settings SET value=CAST(value AS INTEGER)+1 WHERE key='catalog_revision'")

    def catalog(self, context=None):
        with self.store.connect() as db:
            if context is not None:
                self.actor(db, context)
            return {"items": self.catalog_rows(db, active_only=context is None), "revision": self.revision(db)}

    def update_product(self, context, product_id, data):
        with self.access(context, write=True, admin_only=True) as (db, actor):
            row = db.execute("SELECT * FROM catalog_products WHERE id=?", (product_id,)).fetchone()
            if not row:
                raise ApiError("Товар не найден.", 404)
            version_matches(row, data.get("version"))
            if data.get("revision") != self.revision(db):
                raise ApiError("Каталог обновился. Откройте товар заново.", 409)
            before = json.loads(row["data"])
            fields = {key: data[key] for key in PRODUCT_FIELDS if key in data and key != "id"}
            after = self.normalize_product(fields, before)
            if "images" not in fields and after["image"] != before.get("image", ""):
                after["images"] = [after["image"]] if after["image"] else []
            try:
                db.execute("UPDATE catalog_products SET sku=?,data=?,active=?,version=version+1 WHERE id=?", (after["sku"], dump(after), int(after["active"]), product_id))
            except Exception as error:
                import sqlite3
                if isinstance(error, sqlite3.IntegrityError):
                    raise ApiError("SKU уже используется.", 409) from None
                raise
            self.bump_catalog(db)
            audit(db, actor, "catalog.update", "product", product_id, before, after)
        return {"ok": True}

    def create_product(self, context, data):
        import sqlite3
        with self.access(context, write=True, admin_only=True) as (db, actor):
            if data.get("revision") != self.revision(db):
                raise ApiError("Каталог обновился. Обновите список перед добавлением.", 409)
            fields = {key: data[key] for key in PRODUCT_FIELDS if key in data and key != "id"}
            if not text(fields.get("sku"), 120):
                raise ApiError("Укажите SKU товара.")
            product = self.normalize_product({**fields, "id": "product-" + secrets.token_hex(12)})
            try:
                db.execute("INSERT INTO catalog_products VALUES (?,?,?,?,0)", (product["id"], product["sku"], dump(product), int(product["active"])))
            except sqlite3.IntegrityError:
                raise ApiError("SKU уже используется.", 409) from None
            self.bump_catalog(db)
            audit(db, actor, "catalog.create", "product", product["id"], None, product)
            return {"id": product["id"], "revision": self.revision(db)}

    def bulk_products(self, context, data):
        with self.access(context, write=True, admin_only=True) as (db, actor):
            if data.get("revision") != self.revision(db) or data.get("confirm") is not True:
                raise ApiError("Обновите каталог и подтвердите массовое изменение.", 409)
            ids, changes = data.get("ids"), data.get("changes")
            if not isinstance(ids, list) or not 1 <= len(ids) <= 100 or any(not isinstance(i, str) for i in ids) or len(set(ids)) != len(ids):
                raise ApiError("Выберите от 1 до 100 разных товаров.")
            if not isinstance(changes, dict) or not changes or set(changes) - {"active", "price", "stockQty", "status"}:
                raise ApiError("Допустимы цена, остаток, публикация и сценарий продажи.")
            updates = []
            for product_id in ids:
                row = db.execute("SELECT data FROM catalog_products WHERE id=?", (product_id,)).fetchone()
                if not row:
                    raise ApiError("Один из выбранных товаров не найден.", 404)
                before = json.loads(row["data"])
                updates.append((product_id, before, self.normalize_product(changes, before)))
            snapshot = self.snapshot(db, actor, "Перед массовым изменением")
            for product_id, before, after in updates:
                db.execute("UPDATE catalog_products SET data=?,active=?,version=version+1 WHERE id=?", (dump(after), int(after["active"]), product_id))
                audit(db, actor, "catalog.update", "product", product_id, before, after)
            self.bump_catalog(db)
            return {"count": len(updates), "snapshotId": snapshot, "revision": self.revision(db)}

    def preview_import(self, context, data):
        mode = data.get("mode", "merge")
        if not isinstance(mode, str) or mode not in {"merge", "replace"}:
            raise ApiError("Выберите режим merge или replace.")
        source = data.get("csv", "")
        if not isinstance(source, str) or not 0 < len(source.encode()) <= 1024 * 1024:
            raise ApiError("CSV должен быть не больше 1 МБ.")
        with self.access(context, write=True, admin_only=True) as (db, actor):
            current = {p["id"]: p for p in self.catalog_rows(db)}
            try:
                dialect = csv.Sniffer().sniff(source[:4096], delimiters=",;\t")
                reader = csv.DictReader(io.StringIO(source.lstrip('\ufeff')), dialect=dialect)
                if not reader.fieldnames or len(set(reader.fieldnames)) != len(reader.fieldnames) or not {"id", "sku", "name"}.issubset(reader.fieldnames) or set(reader.fieldnames) - set(CSV_FIELDS):
                    raise ApiError("Заголовки CSV: " + ", ".join(CSV_FIELDS))
                products, errors, seen = [], [], set()
                for number, row in enumerate(reader, 2):
                    if number > 1001:
                        raise ApiError("За один импорт допускается до 1000 товаров.")
                    try:
                        if None in row or any(v is None for v in row.values()):
                            raise ApiError("Число столбцов не соответствует заголовкам.")
                        product = self.normalize_product(row, current.get(row.get("id")))
                        if "image" in row and row["image"] != current.get(row.get("id"), {}).get("image", ""):
                            product["images"] = [product["image"]] if product["image"] else []
                        if product["id"] in seen:
                            raise ApiError("Повторяющийся id.")
                        seen.add(product["id"])
                        products.append(product)
                    except ApiError as error:
                        errors.append({"row": number, "message": str(error)})
            except csv.Error:
                raise ApiError("Не удалось разобрать CSV. Проверьте разделители и кавычки.")
            if not products and not errors:
                raise ApiError("CSV не содержит товаров.")
            target = dict(current)
            target.update({p["id"]: p for p in products})
            skus = [p["sku"].casefold() for p in target.values()]
            if len(skus) != len(set(skus)):
                errors.append({"row": 0, "message": "SKU должны быть уникальны, включая сохранённые товары."})
            token = secrets.token_hex(24) if not errors else ""
            revision = self.revision(db)
            db.execute("DELETE FROM catalog_imports WHERE expires<?", (time.time(),))
            if token:
                db.execute("INSERT INTO catalog_imports VALUES (?,?,?,?,?,?)", (token, actor["id"], revision, mode, dump(products), time.time() + 900))
            return {"token": token, "revision": revision, "errors": errors, "items": products, "added": sum(p["id"] not in current for p in products), "updated": sum(p["id"] in current for p in products), "hidden": sum(p["active"] and p["id"] not in seen for p in current.values()) if mode == "replace" else 0, "mode": mode}

    def snapshot(self, db, actor, label):
        snapshot_id = secrets.token_hex(12)
        db.execute("INSERT INTO catalog_snapshots VALUES (?,?,?,?,?)", (snapshot_id, actor["id"], label, dump(self.catalog_rows(db)), now()))
        return snapshot_id

    def apply_import(self, context, data):
        with self.access(context, write=True, admin_only=True) as (db, actor):
            row = db.execute("SELECT * FROM catalog_imports WHERE token=? AND actor_id=? AND expires>?", (text(data.get("token"), 100), actor["id"], time.time())).fetchone()
            if not row:
                raise ApiError("Предпросмотр истёк или уже применён. Загрузите CSV снова.", 409)
            if row["revision"] != self.revision(db):
                raise ApiError("Каталог изменился после предпросмотра. Проверьте CSV заново.", 409)
            if data.get("confirm") is not True:
                raise ApiError("Подтвердите применение импорта.")
            snapshot = self.snapshot(db, actor, "Перед импортом " + row["mode"])
            items = json.loads(row["data"])
            if row["mode"] == "replace":
                db.execute("UPDATE catalog_products SET active=0,data=json_set(data,'$.active',json('false')),version=version+1")
            # Temporarily free unique SKUs to allow an explicitly reviewed SKU swap.
            for product in items:
                db.execute("UPDATE catalog_products SET sku=? WHERE id=?", ("__import_" + secrets.token_hex(16), product["id"]))
            for product in items:
                db.execute("INSERT INTO catalog_products VALUES (?,?,?,?,0) ON CONFLICT(id) DO UPDATE SET sku=excluded.sku,data=excluded.data,active=excluded.active,version=catalog_products.version+1", (product["id"], product["sku"], dump(product), int(product["active"])))
            self.bump_catalog(db)
            db.execute("DELETE FROM catalog_imports WHERE token=?", (row["token"],))
            audit(db, actor, "catalog.import", "catalog", snapshot, {"revision": row["revision"]}, {"mode": row["mode"], "count": len(items), "backup": snapshot})
            return {"snapshotId": snapshot, "revision": self.revision(db)}

    def snapshots(self, context):
        with self.access(context, admin_only=True) as (db, actor):
            return {"items": [dict(r) for r in db.execute("SELECT id,label,at FROM catalog_snapshots ORDER BY at DESC LIMIT 50")]}

    def restore_catalog(self, context, data):
        with self.access(context, write=True, admin_only=True) as (db, actor):
            if data.get("revision") != self.revision(db) or data.get("confirm") is not True:
                raise ApiError("Обновите каталог и подтвердите восстановление.", 409)
            row = db.execute("SELECT * FROM catalog_snapshots WHERE id=?", (text(data.get("snapshotId"), 100),)).fetchone()
            if not row:
                raise ApiError("Резервная копия не найдена.", 404)
            backup = self.snapshot(db, actor, "Перед восстановлением")
            before = self.revision(db)
            products = json.loads(row["data"])
            versions = {r["id"]: r["version"] for r in db.execute("SELECT id,version FROM catalog_products")}
            db.execute("DELETE FROM catalog_products")
            for product in products:
                version = max(versions.get(product["id"], 0), product.pop("version", 0)) + 1
                db.execute("INSERT INTO catalog_products VALUES (?,?,?,?,?)", (product["id"], product["sku"], dump(product), int(product["active"]), version))
            self.bump_catalog(db)
            audit(db, actor, "catalog.restore", "catalog", row["id"], {"revision": before}, {"backup": backup, "restored": row["id"]})
            return {"snapshotId": backup, "revision": self.revision(db)}

    def notifications(self, context, query):
        page, limit, offset = self.pagination(query)
        with self.access(context) as (db, actor):
            conditions, args = [], []
            if query.get("pending") == "1":
                conditions.append("dirty=1")
            if query.get("errors") == "1":
                conditions.append("dirty=1 AND attempts>0")
            if query.get("q"):
                conditions.append("(CASEFOLD(id) LIKE ? OR CASEFOLD(last_error) LIKE ?)")
                args.extend(["%" + text(query["q"], 120).casefold() + "%"] * 2)
            where = "WHERE " + " AND ".join(conditions) if conditions else ""
            rows = db.execute("SELECT id,status,message_id,dirty,attempts,retry_at,last_error,last_attempt FROM orders " + where + " ORDER BY created_at DESC LIMIT ? OFFSET ?", [*args, limit, offset]).fetchall()
            heartbeat = db.execute("SELECT value FROM settings WHERE key='telegram_heartbeat'").fetchone()
            count = db.execute("SELECT COUNT(*) FROM orders " + where, args).fetchone()[0]
            return {"items": [dict(r) for r in rows], "total": count, "page": page, "pageSize": limit, "heartbeat": float(heartbeat[0]) if heartbeat else None}

    def attempts(self, context, order_id):
        with self.access(context) as (db, actor):
            return {"items": [dict(r) for r in db.execute("SELECT outcome,error,at FROM notification_attempts WHERE order_id=? ORDER BY id DESC LIMIT 100", (order_id,))]}

    def retry(self, context, order_id):
        with self.access(context, write=True) as (db, actor):
            row = db.execute("SELECT dirty,attempts FROM orders WHERE id=?", (order_id,)).fetchone()
            if not row:
                raise ApiError("Заявка не найдена.", 404)
            db.execute("UPDATE orders SET dirty=1,retry_at=0 WHERE id=?", (order_id,))
            audit(db, actor, "notification.retry", "order", order_id, dict(row), {"queued": True})
            return {"queued": True}

    def audit_log(self, context, query):
        page, limit, offset = self.pagination(query)
        with self.access(context, admin_only=True) as (db, actor):
            upper = db.execute("SELECT COALESCE(MAX(id),0) FROM audit_log").fetchone()[0]
            if query.get("through"):
                try:
                    upper = min(upper, max(0, int(query["through"])))
                except (TypeError, ValueError):
                    raise ApiError("Некорректная граница журнала.")
            where, args = " WHERE id<=?", [upper]
            if query.get("q"):
                search = text(query["q"], 120).casefold()
                matching = [code for code, label in ACTION_LABELS.items() if search in label.casefold()]
                where += " AND (CASEFOLD(entity_id) LIKE ? OR CASEFOLD(actor_name) LIKE ? OR CASEFOLD(action) LIKE ?"
                args.extend(["%" + search + "%"] * 3)
                if matching:
                    where += " OR action IN (" + ",".join("?" for _ in matching) + ")"
                    args.extend(matching)
                where += ")"
            total = db.execute("SELECT COUNT(*) FROM audit_log" + where, args).fetchone()[0]
            rows = [dict(r) for r in db.execute("SELECT * FROM audit_log" + where + " ORDER BY id DESC LIMIT ? OFFSET ?", [*args, limit, offset])]
            return {"items": rows, "total": total, "page": page, "pageSize": limit, "upperId": upper}

    def bootstrap_admin(self, login):
        from order_store import phone_key
        with self.store.connect() as db:
            db.execute("BEGIN IMMEDIATE")
            if db.execute("SELECT id FROM accounts WHERE role='admin' AND blocked=0").fetchone():
                raise ApiError("Администратор уже назначен. Используйте кабинет.", 409)
            column, value = ("email", login.lower()) if "@" in login else ("phone", phone_key(login))
            row = db.execute("SELECT id,profile FROM accounts WHERE " + column + "=? AND blocked=0", (value,)).fetchone()
            if not row:
                raise ApiError("Сначала зарегистрируйте аккаунт на сайте.", 404)
            db.execute("UPDATE accounts SET role='admin',version=version+1 WHERE id=?", (row["id"],))
            db.execute("DELETE FROM sessions WHERE user_id=?", (row["id"],))
            audit(db, {"id": "server-owner", "name": "Владелец сервера", "source": "cli"}, "role.bootstrap", "client", row["id"], "user", "admin")
            return row["id"]
