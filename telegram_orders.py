"""Telegram status controls and a persistent notification outbox."""
import json
import logging
import os
import re
import threading
import time
import urllib.error
import urllib.parse
import urllib.request

from order_store import ApiError, STATUSES, text, now

log = logging.getLogger(__name__)


class TelegramAPI:
    def __init__(self):
        self.token = os.getenv("TELEGRAM_BOT_TOKEN", "")
        self.relay = os.getenv("TELEGRAM_RELAY_URL", "")
        self.relay_token = os.getenv("TELEGRAM_RELAY_TOKEN", "")

    def call(self, method, body=None):
        body = body or {}
        headers = {"Content-Type": "application/json"}
        if self.relay:
            if not self.relay_token:
                raise RuntimeError("Telegram relay authentication is missing")
            parts = urllib.parse.urlsplit(self.relay)
            url = urllib.parse.urlunsplit(parts._replace(path="/api/telegram-method", query="", fragment=""))
            headers["x-telegram-relay-token"] = self.relay_token
            payload = {"method": method, "body": body}
        else:
            if not self.token:
                raise RuntimeError("Telegram token is missing")
            url = "https://api.telegram.org/bot" + self.token + "/" + method
            payload = body
        request = urllib.request.Request(url, data=json.dumps(payload).encode(), headers=headers)
        try:
            with urllib.request.urlopen(request, timeout=35) as response:
                result = json.load(response)
        except urllib.error.HTTPError as error:
            try:
                result = json.load(error)
            except (ValueError, OSError):
                raise RuntimeError("Telegram HTTP error") from None
        except (OSError, ValueError):
            raise RuntimeError("Telegram connection unavailable") from None
        if result.get("ok") is not True:
            if "message is not modified" in str(result.get("description", "")):
                return True
            raise RuntimeError("Telegram request rejected: " + text(result.get("description") or result.get("message"), 160))
        return result.get("result")


class TelegramOrders:
    def __init__(self, store, formatter, api=None, chat_id=None, managers=None, admin_mode=None):
        self.store = store
        self.formatter = formatter
        self.api = api or TelegramAPI()
        self.chat_id = str(chat_id if chat_id is not None else os.getenv("TELEGRAM_CHAT_ID", ""))
        self.managers = {str(item) for item in managers} if managers is not None else set(filter(None, re.split(r"[\s,]+", os.getenv("TELEGRAM_MANAGER_IDS", ""))))
        self.admin_mode = admin_mode if admin_mode is not None else os.getenv("TELEGRAM_ADMIN_MODE", "allowlist")
        self.stop = threading.Event()
        self.username = ""
        with store.connect() as db:
            db.execute("CREATE TABLE IF NOT EXISTS telegram_messages (chat_id TEXT, message_id INTEGER, order_id TEXT NOT NULL REFERENCES orders(id), PRIMARY KEY(chat_id,message_id))")

    def allowed(self, user, chat):
        if str(chat.get("id")) != self.chat_id or user.get("is_bot") or not user.get("id"):
            return False
        if str(user["id"]) in self.managers:
            return True
        if self.admin_mode == "chat_admins" and chat.get("type") in {"group", "supergroup"}:
            member = self.api.call("getChatMember", {"chat_id": self.chat_id, "user_id": user["id"]})
            return member.get("status") in {"creator", "administrator"}
        return False

    def remember_message(self, message_id, order_id):
        with self.store.connect() as db:
            db.execute("INSERT OR IGNORE INTO telegram_messages VALUES (?,?,?)", (self.chat_id, message_id, order_id))

    def button(self, label, data):
        return {"text": label, "callback_data": data}

    def keyboard(self, order, expanded=False):
        order_id, version = order["id"], order["version"]
        if not expanded:
            return {"inline_keyboard": [[self.button("Изменить статус", "om:" + order_id)]]}
        buttons = [self.button(label, f"os:{order_id}:{version}:{code}") for code, label in STATUSES.items() if code != order["statusCode"]]
        rows = [buttons[index:index + 2] for index in range(0, len(buttons), 2)]
        rows.append([self.button("Закрыть", "ob:" + order_id)])
        return {"inline_keyboard": rows}

    def message_text(self, order):
        header = f"Статус: {order['status']}\nОбновлено: {order['updatedAt']}\n\n"
        return header + self.formatter({"order": order})

    def refresh(self, order, message_id, expanded=False):
        self.api.call("editMessageText", {"chat_id": self.chat_id, "message_id": message_id, "text": self.message_text(order), "parse_mode": "HTML", "reply_markup": self.keyboard(order, expanded)})

    def send_order(self, order, expanded=False):
        result = self.api.call("sendMessage", {"chat_id": self.chat_id, "text": self.message_text(order), "parse_mode": "HTML", "reply_markup": self.keyboard(order, expanded)})
        self.remember_message(result["message_id"], order["id"])
        return result["message_id"]

    def flush_outbox(self):
        with self.store.connect() as db:
            rows = db.execute("SELECT id,message_id,attempts FROM orders WHERE dirty=1 AND retry_at<=? ORDER BY created_at LIMIT 3", (time.time(),)).fetchall()
        for row in rows:
            order = self.store.order(row["id"])
            try:
                message_id = row["message_id"]
                if message_id:
                    self.refresh(order, message_id)
                else:
                    message_id = self.send_order(order)
                with self.store.connect() as db:
                    db.execute("UPDATE orders SET message_id=?,dirty=CASE WHEN version=? THEN 0 ELSE 1 END,attempts=0,retry_at=0,last_error='',last_attempt=? WHERE id=?", (message_id, order["version"], now(), order["id"]))
                    db.execute("INSERT INTO notification_attempts(order_id,outcome,error,at) VALUES (?,'sent','',?)", (order["id"], now()))
            except Exception:
                delay = min(300, 5 * 2 ** min(row["attempts"], 6))
                with self.store.connect() as db:
                    db.execute("UPDATE orders SET attempts=attempts+1,retry_at=?,last_error=?,last_attempt=? WHERE id=?", (time.time() + delay, "Telegram недоступен или отклонил сообщение", now(), row["id"]))
                    db.execute("INSERT INTO notification_attempts(order_id,outcome,error,at) VALUES (?,'error',?,?)", (row["id"], "Ошибка отправки в Telegram", now()))
                log.warning("Order notification queued for retry: %s", row["id"])

    def handle_update(self, update):
        callback = update.get("callback_query")
        if callback:
            message = callback.get("message") or {}
            user = callback.get("from") or {}
            try:
                if not self.allowed(user, message.get("chat") or {}):
                    raise ApiError("Нет доступа к изменению статусов.", 403)
                with self.store.connect() as db:
                    linked = db.execute("SELECT order_id FROM telegram_messages WHERE chat_id=? AND message_id=?", (self.chat_id, message.get("message_id"))).fetchone()
                data = str(callback.get("data", "")).split(":")
                if len(data) < 2 or not linked or data[1] != linked["order_id"]:
                    raise ApiError("Откройте заявку командой /status ID.")
                order = self.store.order(data[1])
                if data[0] in {"om", "ob"} and len(data) == 2:
                    self.refresh(order, message["message_id"], expanded=data[0] == "om")
                    answer = "Выберите статус" if data[0] == "om" else "Готово"
                elif data[0] == "os" and len(data) in {4, 5}:
                    version = int(data[2])
                    if version != order["version"]:
                        self.refresh(order, message["message_id"], expanded=True)
                        raise ApiError("Другой менеджер уже изменил статус. Выберите снова.")
                    if data[3] == "cancelled" and len(data) == 4:
                        token = self.store.confirm_cancel(order["id"], version, user["id"])
                        markup = {"inline_keyboard": [[self.button("Да, отменить заявку", f"os:{order['id']}:{version}:cancelled:{token}")], [self.button("Назад", "om:" + order["id"])]]}
                        self.api.call("editMessageReplyMarkup", {"chat_id": self.chat_id, "message_id": message["message_id"], "reply_markup": markup})
                        answer = "Подтвердите отмену"
                    else:
                        order = self.store.set_status(order["id"], version, data[3], user["id"], user.get("first_name", "Менеджер"), data[4] if len(data) == 5 else "")
                        answer = "Сохранено: " + order["status"]
                        try:
                            self.refresh(order, message["message_id"])
                        except Exception:
                            # The database commit remains authoritative; the outbox refreshes the original message.
                            answer += ". Сообщение обновится позже."
                else:
                    raise ApiError("Неизвестная команда.")
            except (ApiError, ValueError) as error:
                answer = str(error) if isinstance(error, ApiError) else "Некорректная команда."
            self.api.call("answerCallbackQuery", {"callback_query_id": callback["id"], "text": answer[:190], "show_alert": True})
            return
        message = update.get("message") or {}
        body = str(message.get("text", "")).strip()
        match = re.fullmatch(r"/status(?:@([a-zA-Z0-9_]+))?(?:\s+(SSC-[a-zA-Z0-9]+))?", body, re.IGNORECASE)
        if not match or (match[1] and match[1].lower() != self.username.lower()):
            return
        if not self.allowed(message.get("from") or {}, message.get("chat") or {}):
            return
        if not match[2]:
            self.api.call("sendMessage", {"chat_id": self.chat_id, "text": "Укажите номер: /status SSC-XXXXXXXXXXXX"})
            return
        try:
            self.send_order(self.store.order(match[2].upper()), expanded=True)
        except ApiError:
            self.api.call("sendMessage", {"chat_id": self.chat_id, "text": "Заявка не найдена в серверной базе. Старые заявки хранились только в браузере."})

    def run(self):
        while not self.stop.is_set():
            try:
                webhook = self.api.call("getWebhookInfo")
                if webhook.get("url"):
                    log.error("Telegram polling disabled: another webhook is configured")
                    return
                self.username = self.api.call("getMe")["username"]
                break
            except Exception:
                log.warning("Telegram connection unavailable; retrying")
                self.stop.wait(15)
        while not self.stop.is_set():
            try:
                offset = int(self.store.setting("telegram_offset") or 0)
                updates = self.api.call("getUpdates", {"offset": offset, "timeout": 15, "allowed_updates": ["message", "callback_query"]})
                for update in updates:
                    self.handle_update(update)
                    self.store.setting("telegram_offset", update["update_id"] + 1)
                self.store.setting("telegram_heartbeat", time.time())
            except Exception:
                log.warning("Telegram updates unavailable; retrying without discarding updates")
                self.stop.wait(5)

    def outbox_loop(self):
        while not self.stop.is_set():
            try:
                self.flush_outbox()
            except Exception:
                log.exception("Outbox storage unavailable")
            self.stop.wait(2)

    def start(self):
        threading.Thread(target=self.run, daemon=True, name="telegram-updates").start()
        threading.Thread(target=self.outbox_loop, daemon=True, name="telegram-outbox").start()
