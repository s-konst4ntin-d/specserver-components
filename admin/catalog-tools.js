(function (root) {
  "use strict";
  const specFields = { category: "Категория", brand: "Производитель", interface: "Интерфейс", type: "Тип", speed: "Скорость", length: "Длина", capacity: "Емкость", connector: "Разъем", condition: "Состояние товара" };
  const labels = { ...specFields, name: "Название", sku: "SKU", price: "Цена с НДС", stockQty: "Остаток", active: "Публикация", status: "Сценарий продажи", description: "Описание", descriptionMode: "Режим описания", compatibility: "Совместимость", image: "Главное фото", images: "Фотографии", role: "Роль", blocked: "Блокировка", approval: "Проверка", managerId: "Менеджер" };
  const actionLabels = {};
  function filterProducts(items, query) {
    const q = (query.q || "").toLocaleLowerCase("ru");
    const filtered = items.filter((p) => [p.name, p.sku, p.brand, p.category, p.interface].join(" ").toLocaleLowerCase("ru").includes(q))
      .filter((p) => ["category", "brand", "interface"].every((key) => !query[key] || p[key] === query[key]))
      .filter((p) => query.published !== "1" || p.active)
      .filter((p) => ({ active: p.active, hidden: !p.active, noPrice: p.price === null, noStock: !p.stockQty, noImage: !p.image }[query.quality] ?? true));
    const [key, direction] = (query.sort || "").split(":");
    if (["price", "stockQty"].includes(key)) filtered.sort((a, b) => {
      if (a[key] == null) return b[key] == null ? 0 : 1;
      if (b[key] == null) return -1;
      return (a[key] - b[key]) * (direction === "desc" ? -1 : 1);
    });
    if (key === "name") filtered.sort((a, b) => a.name.localeCompare(b.name, "ru"));
    return filtered;
  }
  function auditChanges(row, dictionaries = {}) {
    const before = JSON.parse(row.before_data), after = JSON.parse(row.after_data);
    const format = (key, value) => {
      if (key === "active") return value ? "опубликован" : "скрыт";
      if (key === "blocked") return value ? "заблокирован" : "активен";
      if (value === undefined || value === null || value === "") return "не указано";
      if (key === "price") return new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 2 }).format(value);
      if (key === "stockQty") return value + " шт.";
      if (key === "status") return dictionaries.statuses?.[value] || ({ cart: "корзина", request: "запрос" }[value]) || value;
      if (key === "descriptionMode") return value === "custom" ? "свой текст" : "автоматически";
      if (key === "role") return dictionaries.roles?.[value] || value;
      if (key === "approval") return dictionaries.approvals?.[value] || value;
      if (key === "managerId") return dictionaries.managers?.[value] || value;
      if (key === "image") return String(value).split("/").pop();
      if (Array.isArray(value)) return key === "images" ? value.length + " фото" : value.join(", ");
      return typeof value === "object" ? "изменено" : String(value);
    };
    const scalarKey = { "order.status": "status", "order.assign": "managerId", "role.bootstrap": "role" }[row.action];
    if (scalarKey) return [`${scalarKey === "status" ? "Статус заявки" : labels[scalarKey]}: ${format(scalarKey, before)} → ${format(scalarKey, after)}`];
    if (row.action.endsWith(".note")) return [String(after || "")];
    if (row.action === "notification.retry") return ["Уведомление поставлено в очередь"];
    if (row.action === "catalog.create") return [`Добавлен товар: ${after.name} (${after.sku})`];
    if (row.action === "catalog.image.upload") return [`Загружено фото: ${after.name}`];
    if (row.action === "catalog.import") return [`Импортировано товаров: ${after.count}`, `Режим: ${after.mode === "replace" ? "замена ассортимента" : "обновление и добавление"}`];
    if (row.action === "catalog.restore") return ["Каталог восстановлен из резервной копии"];
    const changes = [];
    for (const [key, label] of Object.entries(labels)) {
      if (key === "descriptionMode" && (before?.[key] || "auto") === (after?.[key] || "auto")) continue;
      if (key === "images" && JSON.stringify(before?.[key] || []) === JSON.stringify(after?.[key] || [])) continue;
      if (JSON.stringify(before?.[key]) !== JSON.stringify(after?.[key])) changes.push(`${label}: ${format(key, before?.[key])} → ${format(key, after?.[key])}`);
    }
    for (const key of new Set([...Object.keys(before?.specs || {}), ...Object.keys(after?.specs || {})])) {
      if (Object.values(specFields).includes(key) || key === "Цена с НДС") continue;
      if (before?.specs?.[key] !== after?.specs?.[key]) changes.push(`${key}: ${format(key, before?.specs?.[key])} → ${format(key, after?.specs?.[key])}`);
    }
    return changes.length ? changes : ["Технические данные обновлены"];
  }
  function orderTotalText(order, money) {
    if (order.total !== null && order.total !== undefined) return money(order.total);
    const known = (order.items || []).some((item) => item.price !== null && item.price !== undefined);
    return known ? "Сумма уточняется; известная часть: " + money(order.knownSubtotal) : "По запросу";
  }
  function routeHash(route, query, page = 1) {
    const params = new URLSearchParams(Object.entries(query).filter(([key, value]) => key !== "page" && value !== "" && value != null));
    if (page > 1) params.set("page", page);
    return "#" + route + (params.size ? "?" + params.toString() : "");
  }
  function readRoute(hash) {
    const [route, raw] = hash.replace(/^#/, "").split("?");
    const params = new URLSearchParams(raw || "");
    const page = Math.max(1, Math.min(100000, Number.parseInt(params.get("page"), 10) || 1));
    params.delete("page");
    return { route, query: Object.fromEntries(params), page };
  }
  async function collectAudit(fetchPage, query, limit = 10000) {
    const snapshotQuery = { ...query };
    delete snapshotQuery.page;
    const rows = [];
    let page = 1, through, total;
    do {
      const result = await fetchPage({ ...snapshotQuery, page, ...(through === undefined ? {} : { through }) });
      if (result.total > limit || rows.length + result.items.length > limit) throw new Error("Для экспорта более " + limit.toLocaleString("ru-RU") + " записей уточните поиск.");
      if (total !== undefined && total !== result.total) throw new Error("Журнал изменился. Повторите экспорт.");
      through = result.upperId; total = result.total;
      if (!result.items.length && rows.length < total) throw new Error("Не удалось получить все записи журнала.");
      rows.push(...result.items); page += 1;
    } while (rows.length < total);
    return rows;
  }
  const tools = { specFields, labels, actionLabels, filterProducts, auditChanges, orderTotalText, routeHash, readRoute, collectAudit };
  if (typeof module !== "undefined" && module.exports) module.exports = tools;
  else root.catalogTools = tools;
})(globalThis);
