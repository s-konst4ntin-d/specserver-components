#!/usr/bin/env python3
import html
import json
import mimetypes
import os
import logging
import time
from http.cookies import SimpleCookie
from urllib.parse import parse_qs, unquote, urlsplit
import urllib.error
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from order_store import ApiError, OrderStore, order_totals
from telegram_orders import TelegramOrders


ROOT = Path(__file__).resolve().parent
HOST = os.getenv("SPEC_HOST", "0.0.0.0")
PORT = int(os.getenv("SPEC_PORT", "8080"))
ROOT = Path(os.getenv("SPEC_STATIC_ROOT", str(ROOT))).resolve()
STORE = None


def clean_text(value, limit=800):
    return " ".join(str(value or "").split())[:limit]


def format_money(value):
    try:
        number = float(value)
    except (TypeError, ValueError):
        return "по запросу"
    if not number.is_integer():
        return f"{number:,.2f} ₽".replace(",", " ")
    return f"{int(number):,} ₽".replace(",", " ")


def format_consent(customer):
    details = customer.get("consentDetails") if isinstance(customer.get("consentDetails"), dict) else {}
    if details.get("accepted"):
        accepted_at = clean_text(details.get("acceptedAt") or "дата не указана")
        version = clean_text(details.get("policyVersion") or "не указана")
        source = clean_text(details.get("source") or "форма сайта")
        return f"принято, {accepted_at}, версия {version}, источник {source}"
    if customer.get("consent") is True:
        return "принято"
    return "не указано"


def format_lead_text(payload):
    order = payload.get("order") or {}
    customer = order.get("customer") or {}
    items = order.get("items") if isinstance(order.get("items"), list) else []

    lines = [
        "<b>Новая заявка Белый Ветер</b>",
        "",
        f"<b>Номер:</b> {html.escape(clean_text(order.get('id') or 'без номера'))}",
        f"<b>Тип:</b> {html.escape(clean_text(order.get('kind') or 'Заявка с сайта'))}",
        f"<b>Дата:</b> {html.escape(clean_text(order.get('createdAt') or ''))}",
        "",
        "<b>Клиент</b>",
        f"Имя: {html.escape(clean_text(customer.get('name') or 'не указано'))}",
        f"Телефон: {html.escape(clean_text(customer.get('phone') or 'не указан'))}",
        f"Email: {html.escape(clean_text(customer.get('email') or 'не указан'))}",
        f"Компания: {html.escape(clean_text(customer.get('company') or 'не указана'))}",
        f"ИНН: {html.escape(clean_text(customer.get('inn') or 'не указан'))}",
        f"КПП: {html.escape(clean_text(customer.get('kpp') or 'не указан'))}",
        f"Согласие ПДн: {html.escape(format_consent(customer))}",
    ]

    if clean_text(order.get("delivery")):
        lines.extend(
            [
                "",
                "<b>Доставка</b>",
                f"Способ доставки: {html.escape(clean_text(order.get('delivery') or 'не выбран'))}",
            ]
        )
    if clean_text(order.get("attachmentName")):
        lines.append(f"Файл: {html.escape(clean_text(order.get('attachmentName')))}")

    comment = clean_text(order.get("comment"), 1600)
    if comment:
        lines.extend(["", "<b>Комментарий</b>", html.escape(comment)])

    if items:
        lines.extend(["", "<b>Товары</b>"])
        for index, item in enumerate(items[:20], start=1):
            name = html.escape(clean_text(item.get("name") or item.get("sku") or "Товар"))
            sku = html.escape(clean_text(item.get("sku") or "-"))
            qty = html.escape(clean_text(item.get("qty") or 1))
            price = html.escape(format_money(item.get("price")))
            lines.append(f"{index}. {name} | SKU: {sku} | кол-во: {qty} | цена: {price}")
        if len(items) > 20:
            lines.append(f"Еще позиций: {len(items) - 20}")
    else:
        lines.extend(["", "<b>Товары</b>", "Без товарных позиций, сообщение из контактной формы."])

    totals = order_totals(items)
    lines.extend(["", f"<b>Итого:</b> {html.escape(format_money(totals['total']))}"])
    if totals["unpricedCount"]:
        lines.append(f"Без цены: {totals['unpricedCount']} поз. Сумма уточняется.")
        if any(item.get("price") is not None for item in items):
            lines.append(f"Известная часть (не итог): {html.escape(format_money(totals['knownSubtotal']))}")
    if payload.get("page"):
        lines.append(f"<b>Страница:</b> {html.escape(clean_text(payload.get('page')))}")
    return "\n".join(lines)[:3900]


def validate_payload(payload):
    if not isinstance(payload, dict):
        return "Заявка не передана."
    order = payload.get("order")
    if not isinstance(order, dict):
        return "Заявка не передана."
    customer = order.get("customer") if isinstance(order.get("customer"), dict) else {}
    if not clean_text(customer.get("name"), 120):
        return "Укажите имя."
    if not clean_text(customer.get("phone"), 120) and not clean_text(customer.get("email"), 160):
        return "Укажите телефон или email."
    if clean_text(customer.get("clientType"), 40) == "legal":
        if not clean_text(customer.get("company"), 160):
            return "Укажите компанию для юрлица."
        inn = "".join(symbol for symbol in clean_text(customer.get("inn"), 40) if symbol.isdigit())
        if len(inn) not in (10, 12):
            return "ИНН должен содержать 10 или 12 цифр."
    anti_spam = payload.get("antiSpam") if isinstance(payload.get("antiSpam"), dict) else {}
    if clean_text(anti_spam.get("website"), 200):
        return "Форма отклонена защитой от спама."
    return ""


def read_error_body(error):
    try:
        return error.read().decode("utf-8", errors="ignore")
    except Exception:
        return ""


def send_telegram_relay(payload):
    relay_url = clean_text(os.getenv("TELEGRAM_RELAY_URL"), 1000)
    if not relay_url:
        return {"channel": "telegram", "provider": "relay", "sent": False, "reason": "not_configured"}

    relay_token = clean_text(os.getenv("TELEGRAM_RELAY_TOKEN"), 500)
    headers = {"content-type": "application/json; charset=utf-8"}
    if relay_token:
        headers["x-telegram-relay-token"] = relay_token

    request = urllib.request.Request(
        relay_url,
        data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
        headers=headers,
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=25) as response:
            result = json.loads(response.read().decode("utf-8"))
            if result.get("ok") is True:
                return {"channel": "telegram", "provider": "relay", "sent": True}
            return {
                "channel": "telegram",
                "provider": "relay",
                "sent": False,
                "reason": clean_text(result.get("reason") or "relay_error", 100),
                "message": clean_text(result.get("message"), 400),
            }
    except urllib.error.HTTPError as error:
        return {
            "channel": "telegram",
            "provider": "relay",
            "sent": False,
            "reason": "relay_http_error",
            "status": error.code,
            "message": clean_text(read_error_body(error), 400),
        }
    except Exception as error:
        return {"channel": "telegram", "provider": "relay", "sent": False, "reason": "relay_network_error", "message": clean_text(error, 400)}


def send_telegram_direct(payload):
    token = clean_text(os.getenv("TELEGRAM_BOT_TOKEN"), 200)
    chat_id = clean_text(os.getenv("TELEGRAM_CHAT_ID"), 100)
    if not token or not chat_id:
        return {"channel": "telegram", "provider": "direct", "sent": False, "reason": "not_configured"}

    body = json.dumps(
        {
            "chat_id": chat_id,
            "text": format_lead_text(payload),
            "parse_mode": "HTML",
            "disable_web_page_preview": True,
        }
    ).encode("utf-8")
    request = urllib.request.Request(
        f"https://api.telegram.org/bot{token}/sendMessage",
        data=body,
        headers={"content-type": "application/json; charset=utf-8"},
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=15) as response:
            result = json.loads(response.read().decode("utf-8"))
            if result.get("ok") is False:
                return {
                    "channel": "telegram",
                    "provider": "direct",
                    "sent": False,
                    "reason": "api_error",
                    "message": clean_text(result.get("description"), 400),
                }
            return {"channel": "telegram", "provider": "direct", "sent": True}
    except urllib.error.HTTPError as error:
        return {"channel": "telegram", "provider": "direct", "sent": False, "reason": "api_error", "status": error.code, "message": clean_text(read_error_body(error), 400)}
    except Exception as error:
        return {"channel": "telegram", "provider": "direct", "sent": False, "reason": "network_error", "message": clean_text(error, 400)}


def send_telegram(payload):
    if clean_text(os.getenv("TELEGRAM_RELAY_URL"), 1000):
        relay = send_telegram_relay(payload)
        if relay.get("sent") is True:
            return relay

        direct = send_telegram_direct(payload)
        if direct.get("sent") is True:
            return direct
        return {"channel": "telegram", "sent": False, "reason": "all_failed", "attempts": [relay, direct]}

    return send_telegram_direct(payload)


class BeliyVeterHandler(BaseHTTPRequestHandler):
    def admin_context(self):
        session = self.require_session()
        return {"token": session["token"], "ip": self.client_address[0]}

    def admin_read(self, path):
        context = self.admin_context()
        query = {k: v[-1] for k, v in parse_qs(urlsplit(self.path).query).items()}
        parts = path.removeprefix("/api/admin/").split("/")
        admin = STORE.admin
        if parts == ["me"]:
            return admin.me(context)
        if parts == ["overview"]:
            return admin.overview(context)
        if parts == ["orders"]:
            return admin.orders(context, query)
        if len(parts) == 2 and parts[0] == "orders":
            return admin.order(context, parts[1])
        if parts == ["clients"]:
            return admin.clients(context, query)
        if len(parts) == 2 and parts[0] == "clients":
            return admin.client(context, parts[1])
        if parts == ["catalog"]:
            return admin.catalog(context)
        if parts == ["catalog", "snapshots"]:
            return admin.snapshots(context)
        if parts == ["catalog", "images"]:
            from catalog_media import media_list
            return media_list(STORE, context, ROOT)
        if parts == ["notifications"]:
            return admin.notifications(context, query)
        if len(parts) == 3 and parts[0] == "notifications" and parts[2] == "attempts":
            return admin.attempts(context, parts[1])
        if parts == ["audit"]:
            return admin.audit_log(context, query)
        raise ApiError("Not found", 404)

    def admin_write(self, path, data):
        context = self.admin_context()
        STORE.limit("admin:" + context["token"], 120, 60)
        parts = path.removeprefix("/api/admin/").split("/")
        admin = STORE.admin
        if len(parts) == 2 and parts[0] == "orders":
            return admin.update_order(context, parts[1], data)
        if len(parts) == 3 and parts[0] == "orders" and parts[2] == "cancel-token":
            return admin.cancel_token(context, parts[1], data)
        if len(parts) == 2 and parts[0] == "clients":
            return admin.update_client(context, parts[1], data)
        if parts == ["catalog", "import-preview"]:
            return admin.preview_import(context, data)
        if parts == ["catalog", "import-apply"]:
            return admin.apply_import(context, data)
        if parts == ["catalog", "restore"]:
            return admin.restore_catalog(context, data)
        if parts == ["catalog", "create"]:
            return admin.create_product(context, data)
        if parts == ["catalog", "bulk"]:
            return admin.bulk_products(context, data)
        if parts == ["catalog", "upload"]:
            from catalog_media import upload
            return upload(STORE, context, data)
        if len(parts) == 2 and parts[0] == "catalog":
            return admin.update_product(context, parts[1], data)
        if len(parts) == 3 and parts[0] == "notifications" and parts[2] == "retry":
            return admin.retry(context, parts[1])
        raise ApiError("Not found", 404)

    def read_session(self, create=False):
        cookie = SimpleCookie()
        try:
            cookie.load(self.headers.get("Cookie", ""))
            token = cookie["vmz_session"].value if "vmz_session" in cookie else ""
        except Exception:
            token = ""
        session, new_token = STORE.session(token, create=create)
        if new_token:
            self.response_token = new_token
        return session

    def require_session(self):
        session = self.read_session()
        if not session:
            raise ApiError("Обновите страницу или войдите в аккаунт.", 401)
        return session

    def require_same_origin(self):
        origin = self.headers.get("Origin")
        if self.headers.get("X-Site-Request") != "1" or (origin and urlsplit(origin).netloc != self.headers.get("Host")):
            raise ApiError("Обновите страницу перед отправкой формы.", 403)

    def end_headers(self):
        self.send_header("x-content-type-options", "nosniff")
        self.send_header("referrer-policy", "strict-origin-when-cross-origin")
        self.send_header("x-frame-options", "DENY")
        if urlsplit(self.path).path.startswith("/admin"):
            self.send_header("content-security-policy", "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'")
            self.send_header("x-robots-tag", "noindex, nofollow")
        super().end_headers()

    def do_POST(self):
        self.response_token = None
        try:
            path = urlsplit(self.path).path
            is_admin = path.startswith("/api/admin/")
            if path not in {"/api/lead", "/api/auth/register", "/api/auth/login", "/api/auth/logout", "/api/profile"} and not is_admin:
                raise ApiError("Not found", 404)
            if is_admin:
                self.require_same_origin()
                STORE.admin.me(self.admin_context())
            try:
                length = int(self.headers.get("Content-Length", "0"))
                maximum = 7 * 1024 * 1024 if path == "/api/admin/catalog/upload" else 2 * 1024 * 1024 if is_admin else 128 * 1024
                if not 0 < length <= maximum:
                    raise ApiError("Недопустимый размер запроса.", 413)
                if self.headers.get_content_type() != "application/json":
                    raise ApiError("Ожидается JSON.", 415)
                payload = json.loads(self.rfile.read(length))
                if not isinstance(payload, dict):
                    raise ValueError()
            except (ValueError, UnicodeError):
                raise ApiError("Некорректный JSON.")
            if path == "/api/lead":
                validation_error = validate_payload(payload)
                if validation_error:
                    raise ApiError(validation_error)
            self.require_same_origin()
            session = self.require_session()
            if is_admin:
                self.send_json({"ok": True, **self.admin_write(path, payload)})
            elif path in {"/api/auth/register", "/api/auth/login"}:
                STORE.limit("auth:" + self.client_address[0], 20, 900)
                user, self.response_token = STORE.authenticate(session, payload, register=path.endswith("register"))
                self.send_json({"ok": True, "user": user})
            elif path == "/api/auth/logout":
                STORE.logout(session)
                self.response_token = ""
                self.send_json({"ok": True})
            elif path == "/api/profile":
                self.send_json({"ok": True, "user": STORE.update_profile(session["user_id"], payload)})
            else:
                STORE.limit("lead:" + session["id"], 30, 3600)
                order = STORE.create_order(session, payload["order"])
                self.send_json({"ok": True, "order": order, "orderId": order["id"], "message": "Заявка сохранена. Менеджер получит уведомление."})
        except ApiError as error:
            self.send_json({"ok": False, "message": str(error)}, error.status)
        except Exception:
            logging.exception("API operation failed")
            self.send_json({"ok": False, "message": "Сервер временно недоступен. Повторите попытку."}, 503)

    def do_GET(self):
        self.response_token = None
        path = unquote(urlsplit(self.path).path)
        if path.startswith("/api/"):
            try:
                if path.startswith("/api/admin/"):
                    self.send_json({"ok": True, **self.admin_read(path)})
                elif path == "/api/catalog":
                    self.send_json({"ok": True, **STORE.admin.catalog()})
                elif path == "/api/session":
                    session = self.read_session()
                    if not session:
                        STORE.limit("session:" + self.client_address[0], 120, 3600)
                        session = self.read_session(create=True)
                    self.send_json({"ok": True, "serverOrders": True, "user": STORE.public_user(session["user_id"])})
                elif path == "/api/orders":
                    self.send_json({"ok": True, "orders": STORE.list_orders(self.require_session())})
                elif path == "/api/health":
                    self.send_json({"ok": True, "serverOrders": True})
                else:
                    self.send_json({"ok": False, "message": "Not found"}, 404)
            except ApiError as error:
                self.send_json({"ok": False, "message": str(error)}, error.status)
            except Exception:
                logging.exception("API read failed")
                self.send_json({"ok": False, "message": "Сервер временно недоступен."}, 503)
            return
        if path == "/admin/":
            self.send_response(302)
            self.send_header("location", "/admin")
            self.send_header("cache-control", "no-store")
            self.end_headers()
            return
        if path == "/admin":
            try:
                STORE.admin.me(self.admin_context())
                target = ROOT / "admin/index.html"
            except ApiError:
                target = ROOT / "admin/login.html"
            self.send_response(200)
            self.send_header("content-type", "text/html; charset=utf-8")
            self.send_header("cache-control", "no-store")
            self.end_headers()
            self.wfile.write(target.read_bytes())
            return
        if path == "/":
            path = "/index.html"
        if path.startswith("/assets/uploads/"):
            from catalog_media import public_image
            target = public_image(STORE, path)
            if not target:
                self.send_json({"ok": False, "message": "Not found"}, 404)
                return
            self.send_response(200)
            self.send_header("content-type", "image/webp")
            self.send_header("cache-control", "public, max-age=31536000, immutable")
            self.end_headers()
            self.wfile.write(target.read_bytes())
            return
        if path not in {"/index.html", "/app.js", "/styles.css", "/robots.txt", "/sitemap.xml", "/admin/admin.js", "/admin/admin.css", "/admin/catalog-tools.js", "/admin/lucide.js"} and not path.startswith("/assets/"):
            self.send_json({"ok": False, "message": "Not found"}, 404)
            return
        target = (ROOT / path.lstrip("/")).resolve()
        if ROOT not in target.parents and target != ROOT:
            self.send_json({"ok": False, "message": "Not found"}, 404)
            return
        if path.startswith("/assets/") and (ROOT / "assets").resolve() not in target.parents:
            self.send_json({"ok": False, "message": "Not found"}, 404)
            return
        if not target.is_file():
            self.send_json({"ok": False, "message": "Not found"}, 404)
            return

        content_type = mimetypes.guess_type(str(target))[0] or "application/octet-stream"
        self.send_response(200)
        self.send_header("content-type", content_type)
        self.send_header("cache-control", "no-cache" if target.suffix == ".html" else "public, max-age=300" if target.suffix in {".css", ".js"} else "public, max-age=31536000")
        self.end_headers()
        self.wfile.write(target.read_bytes())

    def send_json(self, data, status=200):
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("content-type", "application/json; charset=utf-8")
        self.send_header("cache-control", "no-store")
        token = getattr(self, "response_token", None)
        if token is not None:
            secure = "; Secure" if os.getenv("SPEC_SECURE_COOKIE") == "1" else ""
            self.send_header("Set-Cookie", f"vmz_session={token}; Path=/; HttpOnly; SameSite=Lax; Max-Age={2592000 if token else 0}{secure}")
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, message_format, *args):
        print("%s - - [%s] %s" % (self.address_string(), self.log_date_time_string(), message_format % args))


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    default_db = Path(__file__).resolve().parent / ".data" / "orders.sqlite3"
    catalogue = json.loads((ROOT / "catalog.json").read_text(encoding="utf-8"))
    STORE = OrderStore(os.getenv("SPEC_DATABASE") or str(default_db), catalogue)
    bot = TelegramOrders(STORE, format_lead_text)
    if os.getenv("TELEGRAM_ORDERS_ENABLED") == "1":
        bot.start()
    server = ThreadingHTTPServer((HOST, PORT), BeliyVeterHandler)
    print(f"Белый Ветер listening on http://{HOST}:{PORT}")
    server.serve_forever()
