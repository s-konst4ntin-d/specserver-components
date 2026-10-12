(() => {
  "use strict";
  const $ = (selector) => document.querySelector(selector);
  const e = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  const money = (value) => value === null || value === undefined ? "По запросу" : new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 2 }).format(value);
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const date = (value) => value ? new Date(value).toLocaleString("ru-RU", { dateStyle: "short", timeStyle: "short", timeZone }) : "Нет данных";
  const icons = () => window.lucide?.createIcons();
  const icon = (name) => `<i data-lucide="${name}"></i>`;
  const pill = (label, code) => `<span class="pill status-${e(code)}">${e(label)}</span>`;
  const empty = (message) => `<div class="empty">${e(message)}</div>`;
  const button = (action, label, glyph, id = "", className = "") => `<button type="button" class="${className}" data-action="${action}" data-id="${e(id)}">${glyph ? icon(glyph) : ""}${e(label)}</button>`;
  const iconButton = (action, label, glyph, id = "") => `<button type="button" class="icon-button" data-action="${action}" data-id="${e(id)}" aria-label="${e(label)}" title="${e(label)}">${icon(glyph)}</button>`;
  const option = (value, label, selected) => `<option value="${e(value)}"${String(value) === String(selected) ? " selected" : ""}>${e(label)}</option>`;
  const select = (name, label, values, selected, blank = "", disabled = false) => `<label>${e(label)}<select name="${name}"${disabled ? " disabled" : ""}>${blank ? option("", blank, selected) : ""}${Object.entries(values).map(([value, title]) => option(value, title, selected)).join("")}</select></label>`;
  const field = (name, label, value = "", type = "text", extra = "") => `<label>${e(label)}<input name="${name}" type="${type}" value="${e(value)}" ${extra}></label>`;
  const table = (headers, rows, className = "") => `<div class="table-wrap ${className}" tabindex="0" role="region" aria-label="Таблица ${e($("#pageTitle")?.textContent || "данных")}"><table><thead><tr>${headers.map((header) => `<th scope="col">${e(header)}</th>`).join("")}</tr></thead><tbody>${rows.join("")}</tbody></table></div>`;
  const cell = (html, className = "") => `<td class="${className}">${html}</td>`;
  const values = (form) => Object.fromEntries(new FormData(form));
  async function api(path, data) {
    const response = await fetch(path, {
      method: data === undefined ? "GET" : "POST", credentials: "same-origin", cache: "no-store",
      headers: { "Content-Type": "application/json", "X-Site-Request": "1" },
      body: data === undefined ? undefined : JSON.stringify(data), signal: AbortSignal.timeout(30000),
    });
    const result = await response.json();
    if (!response.ok || !result.ok) {
      const error = new Error(result.message || "Сервер временно недоступен.");
      error.status = response.status;
      throw error;
    }
    return result;
  }
  function showError(error, form) {
    const node = form?.querySelector("[data-form-error]") || $("#notice") || $("#loginError");
    if (!node) return;
    node.hidden = false;
    node.className = "error";
    node.textContent = error.message || "Не удалось выполнить действие.";
    if (error.status === 401 && !$("#adminLogin")) {
      node.textContent = "Сессия завершена. Войдите в кабинет заново.";
      const link = document.createElement("a");
      link.href = "/admin"; link.textContent = " Войти"; node.append(link);
    }
  }
  function notify(message) {
    $("#notice").hidden = false;
    $("#notice").className = "";
    $("#notice").textContent = message;
  }
  function download(name, rows) {
    const protect = (value) => {
      let string = String(value ?? "");
      if (/^[\s]*[=+@-]/.test(string)) string = "'" + string;
      return '"' + string.replaceAll('"', '""') + '"';
    };
    const blob = new Blob(["\ufeff", rows.map((row) => row.map(protect).join(";")).join("\r\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a"); link.href = url; link.download = name; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  icons();
  if ($("#adminLogin")) {
    $("#adminLogin").addEventListener("submit", async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      form.querySelector("button").disabled = true;
      $("#loginError").hidden = true;
      try {
        await api("/api/session");
        await api("/api/auth/login", values(form));
        await api("/api/admin/me");
        location.replace("/admin");
      } catch (error) { showError(error); }
      finally { form.querySelector("button").disabled = false; }
    });
    return;
  }

  const titles = { overview: "Обзор", orders: "Заявки и КП", clients: "Клиенты", catalog: "Каталог", notifications: "Уведомления", audit: "Журнал действий" };
  const state = { route: "overview", query: {}, page: 1, mode: "table", me: null, staff: [], statuses: {}, roles: {}, approvals: {}, result: null, detail: null, preview: null, catalogue: null, sequence: 0, selected: new Set(), photos: [], media: [], photoQuery: "", editorRevision: null };
  const { specFields, actionLabels, filterProducts, auditChanges, orderTotalText, routeHash, readRoute, collectAudit } = window.catalogTools;
  const changesFor = (row) => auditChanges(row, { statuses: state.statuses, roles: state.roles, approvals: state.approvals, managers: managerOptions() });
  const routeLink = (route, query, content, className = "") => `<a class="${className}" href="#${route}${Object.keys(query).length ? "?" + e(new URLSearchParams(query).toString()) : ""}">${content}</a>`;
  const managerOptions = () => Object.fromEntries(state.staff.map((person) => [person.id, person.name]));
  const managerName = (id) => state.staff.find((person) => person.id === id)?.name || (id ? "Сотрудник недоступен" : "Не назначен");
  const isAdmin = () => state.me?.role === "admin";
  const queryString = () => new URLSearchParams({ ...state.query, page: state.page, timeZone }).toString();
  const formFooter = (title = "Сохранить") => `<div class="form-footer"><button class="primary" type="submit">${icon("save")}${e(title)}</button><p class="error" data-form-error role="alert" hidden></p></div>`;
  let dialogTrigger = null;
  let focusPending = false;
  function restoreDialogFocus() {
    if (!focusPending || $("#detailDialog").open || $("#content").getAttribute("aria-busy") === "true") return;
    const previous = dialogTrigger;
    const candidate = previous?.element?.isConnected && !previous.element.matches(":disabled") ? previous.element : [...document.querySelectorAll("[data-action]")].find((node) => !node.closest("dialog") && node.dataset.action === previous?.action && node.dataset.id === previous?.id && !node.matches(":disabled"));
    const target = previous?.route === state.route && candidate ? candidate : $("#content .table-wrap") || $("#pageTitle");
    focusPending = false;
    if (target === $("#pageTitle")) target.tabIndex = -1;
    target.focus({ preventScroll: true });
  }
  function openDialog(title, content) {
    $("#detailTitle").textContent = title;
    $("#detailBody").innerHTML = content;
    if (!$("#detailDialog").open) $("#detailDialog").showModal();
    $("#detailBody").scrollTop = 0;
    icons();
  }
  function readFields(fields) {
    return `<dl class="read-fields">${fields.map(([title, value]) => `<div><dt>${e(title)}</dt><dd>${e(value || "Не указано")}</dd></div>`).join("")}</dl>`;
  }
  function notes(items) {
    return items.length ? `<ul class="note-list">${items.map((note) => `<li><strong>${e(note.actor_name)}</strong> <small>${e(date(note.at))}</small><p>${e(note.body)}</p></li>`).join("")}</ul>` : `<p class="muted">Комментариев пока нет.</p>`;
  }
  function pageControls(result) {
    const pages = Math.max(1, Math.ceil(result.total / result.pageSize));
    $("#pagination").innerHTML = `<span>Всего: ${result.total}</span>${iconButton("previous", "Предыдущая страница", "chevron-left")}<span>${result.page} / ${pages}</span>${iconButton("next", "Следующая страница", "chevron-right")}`;
    $("[data-action=previous]").disabled = result.page <= 1;
    $("[data-action=next]").disabled = result.page >= pages;
  }
  function ordersTable(items) {
    if (!items.length) return empty("Заявок по выбранным условиям нет.");
    return table(["Заявка", "Клиент", "Статус", "Сумма с НДС", "Менеджер"], items.map((order) => `<tr>${cell(`<button class="cell-action" data-action="order" data-id="${e(order.id)}">${e(order.id)}</button><small>${e(date(order.createdAt))} · ${e(order.kind)}</small>`)}${cell(`<strong>${e(order.customer.company || order.customer.name)}</strong><small>${e(order.customer.inn || order.customer.email || order.customer.phone)}</small>`)}${cell(pill(order.status, order.statusCode))}${cell(e(orderTotalText(order, money)), "number order-amount")}${cell(e(managerName(order.managerId)))}</tr>`));
  }
  function ordersBoard(result) {
    return `<div class="board">${Object.entries(state.statuses).map(([code, label]) => {
      const column = result.columns[code];
      const pages = Math.max(1, Math.ceil(column.total / column.pageSize));
      return `<section class="board-column"><h3>${e(label)} · ${column.total}</h3>${column.items.map((order) => `<article class="order-tile"><button class="cell-action" data-action="order" data-id="${e(order.id)}">${e(order.id)}</button><span>${e(order.customer.company || order.customer.name)}</span><strong>${e(orderTotalText(order, money))}</strong><small>${e(managerName(order.managerId))}</small></article>`).join("")}${pages > 1 ? `<div class="board-pagination"><button type="button" class="icon-button" data-action="boardPrevious" data-id="${code}" aria-label="Предыдущая страница: ${e(label)}"${column.page <= 1 ? " disabled" : ""}>${icon("chevron-left")}</button><span>${column.page} / ${pages}</span><button type="button" class="icon-button" data-action="boardNext" data-id="${code}" aria-label="Следующая страница: ${e(label)}"${column.page >= pages ? " disabled" : ""}>${icon("chevron-right")}</button></div>` : ""}</section>`;
    }).join("")}</div>`;
  }
  function orderToolbar() {
    return `<form id="filters" class="filters">${select("status", "Статус", { open: "Все открытые", ...state.statuses }, state.query.status, "Все статусы")}${select("manager", "Менеджер", managerOptions(), state.query.manager, "Все сотрудники")}${field("from", "С даты", state.query.from, "date")}${field("to", "По дату", state.query.to, "date")}<span class="muted filter-timezone">Часовой пояс: ${e(timeZone)}</span><button type="submit">Применить</button>${button("reset", "Сбросить", "filter-x")}<div class="segments" aria-label="Представление"><button type="button" data-action="table" aria-pressed="${state.mode === "table"}">${icon("table-2")}Таблица</button><button type="button" data-action="board" aria-pressed="${state.mode === "board"}">${icon("columns-3")}Канбан</button></div></form>`;
  }
  async function load() {
    const sequence = ++state.sequence;
    $("#pageTitle").textContent = titles[state.route];
    $("#pagination").innerHTML = "";
    $("#content").setAttribute("aria-busy", "true");
    $("#refresh").disabled = true;
    for (const link of document.querySelectorAll("[data-route]")) {
      if (link.dataset.route === state.route) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    }
    try {
      const route = state.route;
      const result = await api("/api/admin/" + route + "?" + queryString());
      if (sequence !== state.sequence) return;
      state.result = result;
      $("#toolbar").innerHTML = "";
      if (route === "overview") {
        const open = Object.entries(result.statuses).filter(([code]) => !["completed", "cancelled"].includes(code)).reduce((sum, [, count]) => sum + count, 0);
        const metrics = [["Новые заявки", result.statuses.new || 0, "orders", { status: "new" }], ["Открытые заявки", open, "orders", { status: "open" }], ["Юрлица на проверке", result.clientsPending, "clients", { approval: "pending", clientType: "legal" }], ["Ошибки уведомлений", result.notificationErrors, "notifications", { errors: "1" }]];
        const summary = [["Клиенты", result.clients, "clients", {}], ["Товары", result.products, "catalog", {}], ["Цена по запросу", result.withoutPrice, "catalog", { quality: "noPrice", published: "1" }], ["Наличие требует проверки", result.withoutStock, "catalog", { quality: "noStock", published: "1" }]];
        $("#content").innerHTML = `<div class="metrics">${metrics.map(([label, count, target, query]) => routeLink(target, query, `<strong>${count}</strong><span>${e(label)}</span>`, "metric")).join("")}</div><div class="overview-sections"><section><h2>Последние заявки</h2><div id="recentOrders"></div></section><section><h2>Сводка</h2><ul class="summary-list">${summary.map(([label, count, target, query]) => `<li>${routeLink(target, query, `<span>${e(label)}</span><strong>${count}</strong>`)}</li>`).join("")}</ul></section></div>`;
        const recent = await api("/api/admin/orders?page=1");
        if (sequence === state.sequence) $("#recentOrders").innerHTML = ordersTable(recent.items.slice(0, 8));
      } else if (route === "orders") {
        $("#toolbar").innerHTML = orderToolbar();
        $("#content").innerHTML = state.mode === "table" ? ordersTable(result.items) : ordersBoard(result);
        if (state.mode === "table") pageControls(result);
      } else if (route === "clients") {
        $("#toolbar").innerHTML = `<form id="filters" class="filters">${select("approval", "Проверка", state.approvals, state.query.approval, "Все клиенты")}${select("clientType", "Тип клиента", { person: "Физлицо", legal: "Юрлицо" }, state.query.clientType, "Все типы")}<button>Применить</button>${button("reset", "Сбросить", "filter-x")}</form>`;
        $("#content").innerHTML = result.items.length ? table(["Клиент", "Контакты", "Проверка", "Роль", "Менеджер", "Регистрация"], result.items.map((client) => `<tr>${cell(`<button class="cell-action" data-action="client" data-id="${e(client.id)}">${e(client.company || client.name)}</button><small>${e(client.inn ? "ИНН " + client.inn : "Физлицо")}</small>`)}${cell(`${e(client.phone)}<small>${e(client.email)}</small>`)}${cell(pill(state.approvals[client.approval], client.approval) + (client.blocked ? `<small>${pill("Заблокирован", "error")}</small>` : ""))}${cell(e(state.roles[client.role]))}${cell(e(managerName(client.managerId)))}${cell(e(date(client.createdAt)))}</tr>`)) : empty("Зарегистрированных клиентов по выбранным условиям нет.");
        pageControls(result);
      } else if (route === "catalog") {
        if (state.catalogue?.revision !== result.revision) state.selected.clear();
        state.catalogue = result;
        $("#toolbar").innerHTML = catalogToolbar();
        renderCatalog();
      } else if (route === "notifications") {
        $("#toolbar").innerHTML = `<form id="filters" class="filters"><label class="check"><input type="checkbox" name="pending" value="1"${state.query.pending === "1" ? " checked" : ""}>Ожидают отправки</label><label class="check"><input type="checkbox" name="errors" value="1"${state.query.errors === "1" ? " checked" : ""}>С ошибкой доставки</label><button>Применить</button><span class="muted">Последний успешный опрос Telegram: ${result.heartbeat ? e(date(result.heartbeat * 1000)) : "нет данных"}</span></form>`;
        $("#content").innerHTML = result.items.length ? table(["Заявка", "Доставка", "Неудачных попыток", "Последняя попытка", "Ошибка", "Действия"], result.items.map((row) => `<tr>${cell(`<button class="cell-action" data-action="order" data-id="${e(row.id)}">${e(row.id)}</button>`)}${cell(pill(row.dirty ? (row.attempts ? "Повторная отправка" : "В очереди") : "Доставлено", row.dirty ? "processing" : "confirmed"))}${cell(e(row.attempts))}${cell(e(date(row.last_attempt)))}${cell(e(row.last_error || "Нет"))}${cell(`<div class="actions">${iconButton("retry", "Повторить отправку", "send", row.id)}${iconButton("attempts", "Журнал попыток", "history", row.id)}</div>`)}</tr>`)) : empty("Уведомлений по выбранным условиям нет.");
        pageControls(result);
      } else if (route === "audit") {
        $("#toolbar").innerHTML = `<div class="filters">${button("exportAudit", "Экспорт журнала", "download")}</div>`;
        $("#content").innerHTML = result.items.length ? table(["Дата", "Сотрудник", "Изменение", "Объект", "Источник", ""], result.items.map((row) => `<tr>${cell(e(date(row.at)))}${cell(e(row.actor_name))}${cell(`<strong>${e(actionLabels[row.action] || row.action)}</strong><small class="audit-summary">${e(changesFor(row).slice(0, 3).join("; "))}</small>`)}${cell(e(row.entity_id))}${cell(`${e(row.source)}<small>${e(row.ip)}</small>`)}${cell(iconButton("auditEntry", "Подробности изменения", "expand", row.id))}</tr>`)) : empty("Изменений пока нет.");
        pageControls(result);
      }
      $("#updatedAt").textContent = "Обновлено: " + date(result.updatedAt || Date.now());
      icons();
    } catch (error) { if (sequence === state.sequence) { $("#content").innerHTML = empty("Данные не загружены."); showError(error); } }
    finally { if (sequence === state.sequence) { $("#content").removeAttribute("aria-busy"); $("#refresh").disabled = false; requestAnimationFrame(restoreDialogFocus); } }
  }
  function catalogToolbar() {
    const choices = (key) => Object.fromEntries([...new Set(state.catalogue.items.map((p) => p[key]).filter(Boolean))].sort((a, b) => a.localeCompare(b, "ru")).map((v) => [v, v]));
    return `<form id="catalogFilters" class="filters">${select("quality", "Показать", { all: "Все товары", active: "Опубликованные", hidden: "Скрытые", noPrice: "Без цены", noStock: "Без остатка", noImage: "Без фото" }, state.query.quality || "all")}${select("category", "Категория", choices("category"), state.query.category, "Все категории")}${select("brand", "Производитель", choices("brand"), state.query.brand, "Все производители")}${select("interface", "Интерфейс", choices("interface"), state.query.interface, "Все интерфейсы")}${select("sort", "Сортировка", { "": "По каталогу", "name:asc": "По названию", "price:asc": "Цена: по возрастанию", "price:desc": "Цена: по убыванию", "stockQty:asc": "Остаток: по возрастанию", "stockQty:desc": "Остаток: по убыванию" }, state.query.sort || "")}<label class="check"><input type="checkbox" name="published" value="1"${state.query.published === "1" ? " checked" : ""}>Только опубликованные</label>${button("reset", "Сбросить", "filter-x")}</form><div class="catalog-commands actions">${isAdmin() ? button("newProduct", "Добавить товар", "plus", "", "primary") : ""}${button("exportCatalog", "Экспорт CSV", "download")}${isAdmin() ? button("import", "Импорт CSV", "upload") + button("snapshots", "Резервные копии", "history") : ""}</div>`;
  }
  function filteredProducts() { return filterProducts(state.catalogue.items, state.query); }
  function applyCatalogFilters(form) {
    const q = state.query.q;
    state.query = Object.fromEntries(Object.entries(values(form)).filter(([, value]) => value !== ""));
    if (q) state.query.q = q;
    state.page = 1;
    state.selected.clear();
    writeNavigation();
    $("#notice").hidden = true;
    renderCatalog();
  }
  function renderCatalog() {
    const products = filteredProducts();
    state.page = Math.max(1, Math.min(state.page, Math.ceil(products.length / 30)));
    const start = (state.page - 1) * 30;
    const visible = products.slice(start, start + 30);
    const selection = isAdmin() ? `<div class="selection-bar"><label class="check"><input id="selectPage" type="checkbox" aria-label="Выбрать товары на странице">Вся страница</label><span id="selectionCount">Выбрано: 0</span>${button("bulk", "Изменить выбранные", "list-checks")}</div>` : "";
    $("#content").innerHTML = selection + (products.length ? table([...(isAdmin() ? [""] : []), "Фото", "Товар", "Категория / бренд", "Цена с НДС", "Остаток", "Продажа", "Публикация", ""], visible.map((p) => `<tr>${isAdmin() ? cell(`<input type="checkbox" data-select-product="${e(p.id)}" aria-label="Выбрать ${e(p.sku)}"${state.selected.has(p.id) ? " checked" : ""}>`, "selection-cell") : ""}${cell(p.image ? `<img class="thumb" src="${e(p.image)}" alt="" loading="lazy">` : "Нет фото", "photo-cell")}${cell(`<button class="cell-action" data-action="product" data-id="${e(p.id)}"><strong>${e(p.name)}</strong></button><small>${e(p.sku)} · ${e(p.interface)}</small>`, "product-name-cell")}${cell(`${e(p.category)}<small>${e(p.brand)}</small>`, "category-cell")}${cell(e(money(p.price)), "number")}${cell(p.stockQty === null ? "Уточнить" : e(p.stockQty), "number")}${cell(p.status === "cart" ? "Корзина" : "Запрос")}${cell(pill(p.active ? "В каталоге" : "Скрыт", p.active ? "confirmed" : "completed"))}${cell(iconButton("product", isAdmin() ? "Редактировать товар" : "Просмотреть товар", isAdmin() ? "pencil" : "eye", p.id), "edit-cell")}</tr>`), "catalog-table") : empty("Товары не найдены."));
    pageControls({ total: products.length, page: state.page, pageSize: 30 });
    updateSelection(); icons();
  }
  function updateSelection() {
    if (!$("#selectionCount")) return;
    $("#selectionCount").textContent = "Выбрано: " + state.selected.size;
    $('[data-action="bulk"]').disabled = !state.selected.size;
    const boxes = [...document.querySelectorAll("[data-select-product]")];
    $("#selectPage").checked = boxes.length > 0 && boxes.every((box) => box.checked);
    $("#selectPage").indeterminate = boxes.some((box) => box.checked) && !$("#selectPage").checked;
  }
  async function openOrder(id) {
    const result = await api("/api/admin/orders/" + encodeURIComponent(id));
    const order = result.order; state.detail = order;
    openDialog(order.id, `<section class="detail-section">${readFields([["Клиент", order.customer.name], ["Компания", order.customer.company], ["Телефон", order.customer.phone], ["Email", order.customer.email], ["ИНН", order.customer.inn], ["Создана", date(order.createdAt)], ["Комментарий клиента", order.comment], ...(order.delivery ? [["Доставка", order.delivery]] : [])])}</section><section class="detail-section"><h3>Товары</h3>${order.items.length ? table(["Наименование / SKU", "Количество", "Цена с НДС", "Сумма"], order.items.map((item) => `<tr>${cell(`${e(item.name)}<small>${e(item.sku)}</small>`)}${cell(e(item.qty), "number")}${cell(e(money(item.price)), "number")}${cell(e(money(item.price === null ? null : item.price * item.qty)), "number")}</tr>`)) : `<p class="muted">Запрос без товарных позиций.</p>`}<div class="form-footer"><strong>Итого: ${e(orderTotalText(order, money))}</strong>${button("exportQuote", "Выгрузить КП в CSV", "download")}</div></section><form id="orderForm" class="detail-section"><div class="detail-grid">${select("status", "Статус", state.statuses, order.statusCode)}${select("managerId", "Менеджер", managerOptions(), order.managerId, "Не назначен")}<label class="full">Внутренний комментарий<textarea name="note" maxlength="4000"></textarea></label></div>${formFooter()}</form><section class="detail-section"><h3>Внутренние комментарии</h3>${notes(result.notes)}</section><section><h3>История статусов</h3><ul class="note-list">${result.history.map((entry) => `<li>${pill(state.statuses[entry.new_status], entry.new_status)} <span>${e(entry.actor_name)}</span><small> · ${e(date(entry.at))}</small></li>`).join("")}</ul></section>`);
  }
  async function openClient(id) {
    const result = await api("/api/admin/clients/" + encodeURIComponent(id));
    const client = result.client; state.detail = client;
    openDialog(client.company || client.name, `<section class="detail-section">${readFields([["Имя", client.name], ["Телефон", client.phone], ["Email", client.email], ["Компания", client.company], ["ИНН", client.inn], ["КПП", client.kpp], ["Реквизиты", client.requisites], ["Адреса", (client.addresses || []).join("\n")], ["Регистрация", date(client.createdAt)]])}<div class="form-footer">${button("clientOrders", "Заявки клиента", "clipboard-list", client.id)}</div></section><form id="clientForm" class="detail-section"><div class="detail-grid">${select("approval", "Проверка", state.approvals, client.approval)}${select("managerId", "Менеджер", managerOptions(), client.managerId, "Не назначен")}${select("role", "Роль", state.roles, client.role, "", !isAdmin())}<label class="check"><input name="blocked" type="checkbox"${client.blocked ? " checked" : ""}${!isAdmin() ? " disabled" : ""}>Заблокировать аккаунт</label><label class="full">Внутренняя заметка<textarea name="note" maxlength="4000"></textarea></label></div>${formFooter()}</form><section><h3>Заметки</h3>${notes(result.notes)}</section>`);
  }
  function specRow(key = "", value = "") {
    return `<div class="spec-row"><input aria-label="Название характеристики" data-spec-key value="${e(key)}" maxlength="100" required><input aria-label="Значение характеристики" data-spec-value value="${e(value)}" maxlength="1000">${iconButton("removeSpec", "Удалить характеристику", "x")}</div>`;
  }
  async function openProduct(id) {
    const product = id ? state.catalogue.items.find((item) => item.id === id) : { name: "", sku: "", active: false, status: "request", condition: "Новый", descriptionMode: "auto", specs: {} };
    if (!product) throw new Error("Товар не найден. Обновите каталог.");
    state.detail = product;
    state.editorRevision = state.catalogue.revision;
    state.media = (await api("/api/admin/catalog/images")).items;
    const gallery = (product.images || []).map((item) => typeof item === "string" ? item : item.src).filter(Boolean);
    const canonical = (url) => "/" + url.replace(/^\.?\//, "");
    state.photos = [...new Set([product.image, ...gallery].filter(Boolean).map(canonical))];
    state.photoQuery = "";
    for (const url of state.photos) if (!state.media.some((item) => item.url === url)) state.media.push({ url, name: url.split("/").pop() });
    const extraSpecs = Object.entries(product.specs || {}).filter(([key]) => ![...Object.values(specFields), "Цена с НДС"].includes(key));
    openDialog(id ? product.sku : "Новый товар", `<form id="productForm"><fieldset class="plain-fieldset"${isAdmin() ? "" : " disabled"}><section class="detail-section"><div class="detail-grid">${field("name", "Название", product.name, "text", 'required maxlength="300"')}${field("sku", "SKU", product.sku, "text", 'required maxlength="120"')}${field("category", "Категория", product.category, "text", 'maxlength="160"')}${field("brand", "Производитель", product.brand, "text", 'maxlength="160"')}${field("price", "Цена с НДС, ₽", product.price, "number", 'min="0" max="1000000000" step="0.01"')}${field("stockQty", "Остаток, шт.", product.stockQty, "number", 'min="0" max="100000" step="1"')}${select("status", "Сценарий продажи", { cart: "Корзина", request: "Запрос" }, product.status)}<label class="check"><input name="active" type="checkbox"${product.active ? " checked" : ""}>Опубликован в каталоге</label></div></section>
      <section class="detail-section"><h3>Характеристики</h3><div class="detail-grid">${select("condition", "Состояние", { "": "Не указано", "Новый": "Новый", "Б/У": "Б/У" }, product.condition || "")}${["interface", "type", "speed", "length", "capacity", "connector"].map((key) => field(key, specFields[key], product[key], "text", 'maxlength="160"')).join("")}<label class="full">Совместимость<textarea name="compatibility" rows="3" maxlength="8000">${e((product.compatibility || []).join("\n"))}</textarea></label></div><div id="extraSpecs" class="extra-specs">${extraSpecs.map(([key, value]) => specRow(key, value)).join("")}</div>${isAdmin() ? button("addSpec", "Добавить характеристику", "plus") : ""}</section>
      <section class="detail-section"><h3>Описание</h3>${select("descriptionMode", "Источник описания", { auto: "Автоматически по данным товара", custom: "Свой текст" }, product.descriptionMode || "auto")}<label class="description-field">Текст описания<textarea name="description" maxlength="6000" rows="5"${product.descriptionMode === "custom" ? "" : " disabled"}>${e(product.description || "")}</textarea></label></section>
      <section class="detail-section"><h3>Фотографии</h3><div id="selectedPhotos" class="selected-photos"></div><div class="media-toolbar"><label>Поиск фото<input id="photoSearch" type="search"></label>${isAdmin() ? '<label>Загрузить фото (JPEG, PNG, WebP; до 5 МБ)<input id="photoUpload" type="file" accept="image/jpeg,image/png,image/webp"></label>' : ""}</div><p id="uploadStatus" role="status" hidden></p><div id="photoGallery" class="photo-gallery"></div></section>${isAdmin() ? formFooter(id ? "Сохранить" : "Добавить товар") : ""}</fieldset></form>`);
    renderPhotos();
  }
  function renderPhotos() {
    $("#selectedPhotos").innerHTML = state.photos.length ? state.photos.map((url, index) => `<div class="selected-photo"><img src="${e(url)}" alt="Фото товара ${index + 1}"><div class="actions">${index === 0 ? '<span class="pill status-confirmed">Главное</span>' : iconButton("mainPhoto", "Сделать главным", "star", url)}${iconButton("removePhoto", "Убрать из товара", "x", url)}</div></div>`).join("") : '<p class="muted">Фото не выбраны.</p>';
    renderMediaGallery(); icons();
  }
  function renderMediaGallery() {
    const q = state.photoQuery.toLocaleLowerCase("ru").trim();
    const matches = state.media.filter((item) => (item.name + " " + item.url + " " + state.catalogue.items.filter((p) => (p.image || "").replace(/^\.?\//, "") === item.url.slice(1)).map((p) => p.sku + " " + p.name).join(" ")).toLocaleLowerCase("ru").includes(q));
    $("#photoGallery").innerHTML = matches.length ? matches.map((item) => `<button type="button" class="media-item" data-action="togglePhoto" data-id="${e(item.url)}" aria-pressed="${state.photos.includes(item.url)}"><img src="${e(item.url)}" alt="" loading="lazy"><span>${e(item.name)}</span></button>`).join("") : '<p class="muted">Фото не найдены.</p>';
  }
  function bulkForm() {
    state.bulkIds = [...state.selected]; state.editorRevision = state.catalogue.revision;
    const products = state.catalogue.items.filter((p) => state.selected.has(p.id));
    openDialog("Массовое изменение", `<form id="bulkForm"><p>Выбрано товаров: <strong>${products.length}</strong></p><details><summary>Состав выборки</summary><ul>${products.map((p) => `<li>${e(p.sku)} · ${e(p.name)}</li>`).join("")}</ul></details><div class="bulk-fields">${select("active", "Публикация", { "": "Не менять", true: "Опубликовать", false: "Скрыть" }, "")}${select("status", "Сценарий продажи", { "": "Не менять", cart: "Корзина", request: "Запрос" }, "")}<label class="check"><input type="checkbox" name="changePrice">Изменить цену</label>${field("price", "Новая цена с НДС, ₽", "", "number", 'min="0" max="1000000000" step="0.01" disabled')}<label class="check"><input type="checkbox" name="changeStock">Изменить остаток</label>${field("stockQty", "Новый остаток, шт.", "", "number", 'min="0" max="100000" step="1" disabled')}</div>${formFooter("Применить")}</form>`);
  }
  function importForm() {
    state.preview = null;
    openDialog("Импорт каталога", `<form id="importForm"><div class="detail-grid"><label>CSV-файл<input name="file" type="file" accept=".csv,text/csv" required></label>${select("mode", "Режим", { merge: "Обновить и добавить", replace: "Заменить опубликованный ассортимент" }, "merge")}</div>${formFooter("Предпросмотр")}</form><div id="importPreview"></div>`);
  }
  async function openSnapshots() {
    const result = await api("/api/admin/catalog/snapshots");
    openDialog("Резервные копии каталога", result.items.length ? table(["Дата", "Копия", ""], result.items.map((item) => `<tr>${cell(e(date(item.at)))}${cell(e(item.label))}${cell(button("restore", "Восстановить", "rotate-ccw", item.id))}</tr>`)) : empty("Резервных копий пока нет."));
  }
  async function action(name, id) {
    if (name === "next" || name === "previous") { state.page += name === "next" ? 1 : -1; await commitNavigation(); }
    if (name === "boardNext" || name === "boardPrevious") { state.query["page_" + id] = state.result.columns[id].page + (name === "boardNext" ? 1 : -1); await commitNavigation(); }
    if (name === "reset") { state.selected.clear(); state.query = {}; state.page = 1; $("#search").value = ""; await commitNavigation(); }
    if (name === "table" || name === "board") { state.query.view = name; state.page = 1; await commitNavigation(); }
    if (name === "order") await openOrder(id);
    if (name === "client") await openClient(id);
    if (name === "product") await openProduct(id);
    if (name === "newProduct") await openProduct();
    if (name === "bulk") bulkForm();
    if (name === "addSpec") { $("#extraSpecs").insertAdjacentHTML("beforeend", specRow()); icons(); }
    if (["mainPhoto", "removePhoto", "togglePhoto"].includes(name)) {
      if (name === "mainPhoto") state.photos = [id, ...state.photos.filter((url) => url !== id)];
      else if (name === "removePhoto" || state.photos.includes(id)) state.photos = state.photos.filter((url) => url !== id);
      else {
        if (state.photos.length >= 12) throw new Error("Допускается до 12 фотографий.");
        state.photos.push(id);
      }
      renderPhotos();
    }
    if (name === "clientOrders") { $("#detailDialog").close(); location.hash = "orders?client=" + encodeURIComponent(id); }
    if (name === "retry") { await api("/api/admin/notifications/" + encodeURIComponent(id) + "/retry", {}); notify("Уведомление поставлено в очередь."); await load(); }
    if (name === "attempts") {
      const result = await api("/api/admin/notifications/" + encodeURIComponent(id) + "/attempts");
      openDialog("Попытки отправки · " + id, result.items.length ? table(["Дата", "Результат", "Ошибка"], result.items.map((row) => `<tr>${cell(e(date(row.at)))}${cell(row.outcome === "sent" ? "Доставлено" : "Ошибка")}${cell(e(row.error || "Нет"))}</tr>`)) : empty("Попытки до обновления журнала не записывались."));
    }
    if (name === "auditEntry") {
      const row = state.result.items.find((entry) => String(entry.id) === id);
      openDialog(actionLabels[row.action] || row.action, `${readFields([["Сотрудник", row.actor_name], ["Дата", date(row.at)], ["Объект", row.entity_id]])}<ul class="change-list">${changesFor(row).map((change) => `<li>${e(change)}</li>`).join("")}</ul><details class="technical-details"><summary>Технические данные</summary>${readFields([["IP", row.ip], ["Сессия", row.session_id], ["Источник", row.source]])}<div class="detail-grid form-footer"><section><h3>До</h3><pre class="code-value">${e(JSON.stringify(JSON.parse(row.before_data), null, 2))}</pre></section><section><h3>После</h3><pre class="code-value">${e(JSON.stringify(JSON.parse(row.after_data), null, 2))}</pre></section></div></details>`);
    }
    if (name === "exportQuote") {
      const order = state.detail;
      download(order.id + "-KP.csv", [["Заявка", order.id], ["Клиент", order.customer.company || order.customer.name], ["SKU", "Товар", "Количество", "Цена с НДС", "Сумма"], ...order.items.map((item) => [item.sku, item.name, item.qty, item.price ?? "По запросу", item.price === null ? "По запросу" : item.qty * item.price]), ["Итого", "", "", "", orderTotalText(order, money)]]);
    }
    if (name === "exportCatalog") {
      const keys = ["id", "sku", "name", "category", "brand", "interface", "price", "stockQty", "status", "active", "image"];
      download("catalog.csv", [keys, ...filteredProducts().map((p) => keys.map((key) => p[key]))]);
    }
    if (name === "exportAudit") {
      const rows = await collectAudit((query) => api("/api/admin/audit?" + new URLSearchParams(query)), state.query);
      const keys = ["id", "at", "actor_name", "source", "ip", "session_id", "action", "entity_id", "before_data", "after_data"];
      download("audit.csv", [keys, ...rows.map((row) => keys.map((key) => row[key]))]);
    }
    if (name === "import") importForm();
    if (name === "snapshots") await openSnapshots();
    if (name === "applyImport") {
      if (!state.preview?.token || !window.confirm("Применить изменения каталога? Перед импортом будет сохранена резервная копия.")) return;
      await api("/api/admin/catalog/import-apply", { token: state.preview.token, confirm: true });
      state.preview = null; $("#detailDialog").close(); notify("Импорт применён. Резервная копия сохранена."); await load();
    }
    if (name === "restore") {
      if (!window.confirm("Восстановить каталог из этой копии? Текущий каталог будет сохранён в отдельной резервной копии.")) return;
      await api("/api/admin/catalog/restore", { snapshotId: id, revision: state.catalogue.revision, confirm: true });
      $("#detailDialog").close(); notify("Каталог восстановлен."); await load();
    }
  }
  document.addEventListener("click", async (event) => {
    const control = event.target.closest("[data-action]");
    if (!control || control.disabled || control.matches(":disabled")) return;
    if (control.dataset.action === "removeSpec") { control.closest(".spec-row").remove(); return; }
    if (!control.closest("dialog")) dialogTrigger = { element: control, action: control.dataset.action, id: control.dataset.id, route: state.route };
    control.disabled = true;
    try { await action(control.dataset.action, control.dataset.id); }
    catch (error) { showError(error, $("#detailDialog[open] form")); }
    finally { control.disabled = false; }
  });
  document.addEventListener("submit", async (event) => {
    const form = event.target;
    if (!form.matches("#filters,#catalogFilters,#searchForm,#orderForm,#clientForm,#productForm,#importForm,#bulkForm")) return;
    event.preventDefault();
    const submit = form.querySelector("button[type=submit],button:not([type])");
    if (submit) submit.disabled = true;
    const errorNode = form.querySelector("[data-form-error]"); if (errorNode) errorNode.hidden = true;
    try {
      const data = values(form);
      if (form.id === "catalogFilters") {
        applyCatalogFilters(form);
      } else if (form.id === "filters") {
        state.selected.clear();
        const q = state.query.q; const client = state.query.client;
        state.query = Object.fromEntries(Object.entries(data).filter(([, value]) => value !== ""));
        if (q) state.query.q = q; if (client) state.query.client = client;
        state.page = 1;
        if (state.route === "orders") state.query.view = state.mode;
        await commitNavigation();
      } else if (form.id === "searchForm") {
        state.selected.clear();
        const q = $("#search").value.trim();
        if (state.route === "overview") location.hash = "orders?q=" + encodeURIComponent(q);
        else { state.query.q = q; resetPages(); await commitNavigation(); }
      } else if (form.id === "orderForm") {
        if (data.status === "cancelled" && state.detail.statusCode !== "cancelled") {
          if (!window.confirm("Отменить заявку " + state.detail.id + "?")) return;
          data.confirmation = (await api("/api/admin/orders/" + state.detail.id + "/cancel-token", { version: state.detail.version })).confirmation;
        }
        await api("/api/admin/orders/" + state.detail.id, { ...data, version: state.detail.version });
        await openOrder(state.detail.id); await load(); notify("Заявка сохранена.");
      } else if (form.id === "clientForm") {
        const blocked = form.elements.blocked.checked;
        if (isAdmin() && (blocked !== state.detail.blocked || data.role !== state.detail.role) && !window.confirm("Изменить права или блокировку аккаунта? Его активные сессии будут завершены.")) return;
        await api("/api/admin/clients/" + state.detail.id, { ...data, ...(isAdmin() ? { blocked } : {}), version: state.detail.version });
        state.staff = (await api("/api/admin/me")).staff;
        await openClient(state.detail.id); await load(); notify("Клиент сохранён.");
      } else if (form.id === "productForm") {
        const specs = Object.fromEntries([...form.querySelectorAll(".spec-row")].map((row) => [row.querySelector("[data-spec-key]").value.trim(), row.querySelector("[data-spec-value]").value.trim()]));
        if (Object.keys(specs).length !== form.querySelectorAll(".spec-row").length) throw new Error("Названия характеристик должны быть уникальны.");
        if (Object.keys(specs).some((key) => [...Object.values(specFields), "Цена с НДС"].includes(key))) throw new Error("Основные характеристики редактируются в полях выше.");
        const compatibility = data.compatibility.split(/[,;\n]/).map((v) => v.trim()).filter(Boolean);
        const images = state.photos.map((url) => {
          const previous = (state.detail.images || []).find((item) => typeof item === "object" && "/" + item.src.replace(/^\.?\//, "") === url);
          return previous ? { ...previous, src: url } : url;
        });
        const payload = { ...data, compatibility, specs, images, image: state.photos[0] || "", active: form.elements.active.checked, version: state.detail.version, revision: state.editorRevision };
        await api("/api/admin/catalog/" + (state.detail.id || "create"), payload);
        $("#detailDialog").close(); await load(); notify("Товар обновлён на сайте.");
      } else if (form.id === "bulkForm") {
        const changes = {};
        if (data.active) changes.active = data.active === "true";
        if (data.status) changes.status = data.status;
        if (form.elements.changePrice.checked) changes.price = data.price;
        if (form.elements.changeStock.checked) changes.stockQty = data.stockQty;
        if (!Object.keys(changes).length) throw new Error("Выберите, что изменить.");
        const summary = Object.entries(changes).map(([key, value]) => ({ active: "Публикация", status: "Продажа", price: "Цена", stockQty: "Остаток" }[key]) + ": " + (key === "active" ? (value ? "опубликовать" : "скрыть") : value === "" ? "по запросу / уточнить" : value)).join("\n");
        if (!window.confirm("Изменить " + state.bulkIds.length + " товаров?\n" + summary)) return;
        await api("/api/admin/catalog/bulk", { ids: state.bulkIds, revision: state.editorRevision, changes, confirm: true });
        $("#detailDialog").close(); state.selected.clear(); await load(); notify("Товары обновлены. Резервная копия сохранена.");
      } else if (form.id === "importForm") {
        const file = form.elements.file.files[0];
        if (!file || file.size > 1024 * 1024) throw new Error("Выберите CSV-файл размером не больше 1 МБ.");
        state.preview = await api("/api/admin/catalog/import-preview", { csv: await file.text(), mode: data.mode });
        const preview = state.preview;
        $("#importPreview").innerHTML = `<div class="import-summary"><span>Добавить: <strong>${preview.added}</strong></span><span>Обновить: <strong>${preview.updated}</strong></span><span>Скрыть: <strong>${preview.hidden}</strong></span></div>${preview.errors.length ? `<ul class="error">${preview.errors.map((err) => `<li>Строка ${err.row}: ${e(err.message)}</li>`).join("")}</ul>` : ""}${table(["SKU", "Название", "Цена", "Остаток", "Публикация"], preview.items.map((p) => `<tr>${cell(e(p.sku))}${cell(e(p.name))}${cell(e(money(p.price)))}${cell(e(p.stockQty ?? "Уточнить"))}${cell(p.active ? "Да" : "Нет")}</tr>`))}${preview.token ? `<div class="form-footer">${button("applyImport", "Применить импорт", "check", "", "primary")}</div>` : ""}`;
        icons();
      }
    } catch (error) { showError(error, form); }
    finally { if (submit) submit.disabled = false; }
  });
  document.addEventListener("input", (event) => {
    if (event.target.id === "photoSearch") { state.photoQuery = event.target.value; renderMediaGallery(); }
  });
  document.addEventListener("change", async (event) => {
    const input = event.target;
    if (input.matches("#catalogFilters select, #catalogFilters input[type=checkbox]")) {
      applyCatalogFilters(input.form);
      return;
    }
    if (input.matches("[data-select-product]")) {
      if (input.checked && state.selected.size >= 100) { input.checked = false; notify("За один раз можно изменить до 100 товаров."); }
      if (input.checked) state.selected.add(input.dataset.selectProduct); else state.selected.delete(input.dataset.selectProduct);
      updateSelection();
    }
    if (input.id === "selectPage") {
      for (const box of document.querySelectorAll("[data-select-product]")) {
        box.checked = input.checked && (state.selected.has(box.dataset.selectProduct) || state.selected.size < 100);
        if (box.checked) state.selected.add(box.dataset.selectProduct); else state.selected.delete(box.dataset.selectProduct);
      }
      updateSelection();
    }
    if (input.matches('#productForm select[name="descriptionMode"]')) $("#productForm").elements.description.disabled = input.value !== "custom";
    if (input.name === "changePrice") $("#bulkForm").elements.price.disabled = !input.checked;
    if (input.name === "changeStock") $("#bulkForm").elements.stockQty.disabled = !input.checked;
    if (input.id === "photoUpload") {
      const file = input.files[0], form = $("#productForm"), save = form.querySelector("button[type=submit]");
      if (!file) return;
      input.disabled = true; save.disabled = true;
      $("#uploadStatus").hidden = false; $("#uploadStatus").textContent = "Загрузка фото…";
      try {
        if (file.size > 5 * 1024 * 1024) throw new Error("Фото должно быть не больше 5 МБ.");
        const encoded = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result.split(",")[1]);
          reader.onerror = () => reject(new Error("Не удалось прочитать файл."));
          reader.readAsDataURL(file);
        });
        const result = await api("/api/admin/catalog/upload", { name: file.name, data: encoded });
        if (!form.isConnected) return;
        if (!state.media.some((item) => item.url === result.item.url)) state.media.unshift(result.item);
        if (state.photos.length < 12 && !state.photos.includes(result.item.url)) state.photos.push(result.item.url);
        state.photoQuery = ""; $("#photoSearch").value = ""; renderPhotos();
        $("#uploadStatus").textContent = "Фото загружено.";
      } catch (error) { if (form.isConnected) { showError(error, form); $("#uploadStatus").textContent = "Фото не загружено."; } }
      finally { input.disabled = false; save.disabled = false; input.value = ""; }
    }
  });
  function resetPages() {
    state.page = 1;
    for (const key of Object.keys(state.query)) if (key.startsWith("page_")) delete state.query[key];
  }
  function writeNavigation() {
    const hash = routeHash(state.route, state.query, state.page);
    if (location.hash !== hash) history.pushState(null, "", hash);
  }
  async function commitNavigation() {
    writeNavigation();
    await navigate();
  }
  async function navigate() {
    state.selected.clear();
    const saved = readRoute(location.hash);
    state.route = Object.hasOwn(titles, saved.route) ? saved.route : "overview";
    state.query = saved.query; state.page = saved.page;
    state.mode = state.query.view === "board" ? "board" : "table";
    $("#search").value = state.query.q || "";
    $("#notice").hidden = true;
    await load();
  }
  $("#detailDialog").addEventListener("close", () => { focusPending = true; requestAnimationFrame(restoreDialogFocus); });
  $("#closeDetail").addEventListener("click", () => $("#detailDialog").close());
  $("#refresh").addEventListener("click", load);
  $("#logout").addEventListener("click", async () => {
    try { await api("/api/auth/logout", {}); location.replace("/admin"); } catch (error) { showError(error); }
  });
  window.addEventListener("hashchange", navigate);
  api("/api/admin/me").then((result) => {
    Object.assign(actionLabels, result.events);
    state.me = result.user; state.staff = result.staff; state.statuses = result.statuses; state.roles = result.roles; state.approvals = result.approvals;
    $("#staffIdentity").innerHTML = `<strong>${e(result.user.name)}</strong><small>${e(result.roles[result.user.role])}</small>`;
    for (const node of document.querySelectorAll("[data-admin-only]")) node.hidden = !isAdmin();
    navigate();
  }).catch((error) => showError(error));
})();
