(() => {
  "use strict";

  const STORAGE = {
    products: "vmz.products.v1",
    cart: "vmz.cart.v1",
    favorites: "vmz.favorites.v1",
    orders: "vmz.orders.v1",
    profile: "vmz.profile.v1",
  };

  const heroImage = "assets/server-components-hero.png";

  const defaultProducts = [
    {
      id: "sfp-10g-sr-cisco",
      category: "Трансиверы",
      name: "Трансивер Cisco SFP-10G-SR совместимый",
      sku: "SFP-10G-SR-VMZ",
      brand: "Cisco",
      type: "SFP+",
      interface: "LC Duplex",
      speed: "10G",
      length: "300 м",
      connector: "LC",
      compatibility: ["Cisco", "HPE", "MikroTik"],
      condition: "Refurbished",
      stock: "В наличии: 18 шт.",
      price: 4200,
      vat: true,
      status: "cart",
      thumbPosition: "50% 54%",
      description: "Оптический SR-модуль 850 нм для серверных и сетевых подключений 10G.",
      specs: {
        Формфактор: "SFP+",
        Дальность: "до 300 м",
        Волокно: "MMF OM3/OM4",
        Температура: "0...70 C",
        Гарантия: "12 месяцев",
      },
    },
    {
      id: "sfp-10g-lr-oem",
      category: "Трансиверы",
      name: "Трансивер SFP+ 10G LR 1310 нм",
      sku: "SFP-10G-LR-OEM",
      brand: "OEM",
      type: "SFP+",
      interface: "LC Duplex",
      speed: "10G",
      length: "10 км",
      connector: "LC",
      compatibility: ["Cisco", "Juniper", "Huawei"],
      condition: "Новый",
      stock: "Под заказ: 3-5 дней",
      price: null,
      vat: true,
      status: "request",
      thumbPosition: "46% 58%",
      description: "Дальнобойный LR-трансивер для одномодовой оптики и корпоративных сетей.",
      specs: {
        Формфактор: "SFP+",
        Дальность: "до 10 км",
        Волокно: "SMF OS2",
        Длина_волны: "1310 нм",
        Гарантия: "12 месяцев",
      },
    },
    {
      id: "dac-10g-3m",
      category: "Кабели",
      name: "DAC-кабель SFP+ 10G 3 м",
      sku: "DAC-SFP-10G-3M",
      brand: "VMZ",
      type: "DAC",
      interface: "SFP+",
      speed: "10G",
      length: "3 м",
      connector: "SFP+",
      compatibility: ["Cisco", "Mellanox", "HPE"],
      condition: "Новый",
      stock: "В наличии: 42 шт.",
      price: 3100,
      vat: true,
      status: "cart",
      thumbPosition: "52% 68%",
      description: "Пассивный медный twinax-кабель для коротких соединений внутри стойки.",
      specs: {
        Тип: "Passive Twinax",
        Оболочка: "PVC",
        Радиус_изгиба: "30 мм",
        Гарантия: "12 месяцев",
      },
    },
    {
      id: "qsfp-40g-sr4",
      category: "Трансиверы",
      name: "QSFP+ 40G SR4 MPO 850 нм",
      sku: "QSFP-40G-SR4",
      brand: "Mellanox",
      type: "QSFP+",
      interface: "MPO",
      speed: "40G",
      length: "150 м",
      connector: "MPO",
      compatibility: ["Mellanox", "Cisco", "Arista"],
      condition: "Refurbished",
      stock: "В наличии: 7 шт.",
      price: 9800,
      vat: true,
      status: "cart",
      thumbPosition: "64% 62%",
      description: "Модуль SR4 для 40G-соединений в ЦОД и серверных кластерах.",
      specs: {
        Формфактор: "QSFP+",
        Волокно: "MMF",
        Дальность: "до 150 м",
        Разъем: "MPO/MTP",
        Гарантия: "6 месяцев",
      },
    },
    {
      id: "patch-lc-lc-om4-3m",
      category: "Оптические патч-корды",
      name: "Патч-корд LC-LC OM4 Duplex 3 м",
      sku: "LC-LC-OM4-3M",
      brand: "Corning",
      type: "Патч-корд",
      interface: "LC-LC",
      speed: "10G/40G",
      length: "3 м",
      connector: "LC",
      compatibility: ["SFP", "SFP+", "QSFP breakout"],
      condition: "Новый",
      stock: "В наличии: 120 шт.",
      price: 760,
      vat: true,
      status: "cart",
      thumbPosition: "27% 76%",
      description: "Мультимодовый патч-корд для серверных стоек и кроссовых панелей.",
      specs: {
        Волокно: "OM4 MMF",
        Полировка: "UPC",
        Оболочка: "LSZH",
        Цвет: "бирюзовый",
      },
    },
    {
      id: "patch-lc-lc-os2-10m",
      category: "Оптические патч-корды",
      name: "Патч-корд LC-LC OS2 Duplex 10 м",
      sku: "LC-LC-OS2-10M",
      brand: "Fujikura",
      type: "Патч-корд",
      interface: "LC-LC",
      speed: "1G/10G",
      length: "10 м",
      connector: "LC",
      compatibility: ["SFP", "SFP+"],
      condition: "Новый",
      stock: "Под заказ: 2-4 дня",
      price: 1180,
      vat: true,
      status: "cart",
      thumbPosition: "35% 72%",
      description: "Одномодовый патч-корд для соединений между шкафами и оптическими линиями.",
      specs: {
        Волокно: "OS2 SMF",
        Полировка: "UPC",
        Оболочка: "LSZH",
        Цвет: "желтый",
      },
    },
    {
      id: "sas-hd-1m",
      category: "Кабели",
      name: "Кабель Mini SAS HD SFF-8643 1 м",
      sku: "SFF-8643-1M",
      brand: "Broadcom",
      type: "SAS",
      interface: "SFF-8643",
      speed: "12G SAS",
      length: "1 м",
      connector: "Mini SAS HD",
      compatibility: ["LSI", "Broadcom", "Supermicro"],
      condition: "Новый",
      stock: "В наличии: 25 шт.",
      price: 2450,
      vat: true,
      status: "cart",
      thumbPosition: "54% 71%",
      description: "Внутренний кабель для подключения HBA/RAID-контроллеров к backplane.",
      specs: {
        Интерфейс: "SAS 12G",
        Разъемы: "SFF-8643 to SFF-8643",
        Экранирование: "да",
        Гарантия: "12 месяцев",
      },
    },
    {
      id: "intel-x520-da2",
      category: "Адаптеры",
      name: "Сетевой адаптер Intel X520-DA2 2x10GbE",
      sku: "X520-DA2",
      brand: "Intel",
      type: "NIC",
      interface: "PCIe 2.0 x8",
      speed: "2x10G",
      length: "Low Profile",
      connector: "SFP+",
      compatibility: ["Dell", "HPE", "Supermicro"],
      condition: "Refurbished",
      stock: "В наличии: 9 шт.",
      price: 8600,
      vat: true,
      status: "cart",
      thumbPosition: "76% 71%",
      description: "Двухпортовый серверный сетевой адаптер с поддержкой SFP+ модулей и DAC.",
      specs: {
        Чипсет: "Intel 82599",
        Порты: "2 x SFP+",
        Профиль: "low profile bracket",
        Гарантия: "6 месяцев",
      },
    },
    {
      id: "lsi-9300-8i",
      category: "Адаптеры",
      name: "HBA LSI 9300-8i SAS 12G",
      sku: "LSI-9300-8I",
      brand: "Broadcom",
      type: "HBA",
      interface: "PCIe 3.0 x8",
      speed: "12G SAS",
      length: "Full Height",
      connector: "SFF-8643",
      compatibility: ["Supermicro", "Dell", "Lenovo"],
      condition: "Refurbished",
      stock: "Под заказ: 5-7 дней",
      price: null,
      vat: true,
      status: "request",
      thumbPosition: "73% 78%",
      description: "Контроллер HBA для дисковых полок, backplane и серверных хранилищ.",
      specs: {
        Порты: "8 internal SAS lanes",
        Режим: "IT mode по запросу",
        Кабели: "SFF-8643",
        Гарантия: "6 месяцев",
      },
    },
    {
      id: "power-c13-c14-2m",
      category: "Кабели",
      name: "Кабель питания C13-C14 2 м",
      sku: "PWR-C13-C14-2M",
      brand: "VMZ",
      type: "Питание",
      interface: "IEC",
      speed: "10A",
      length: "2 м",
      connector: "C13-C14",
      compatibility: ["PDU", "Серверы", "ИБП"],
      condition: "Новый",
      stock: "В наличии: 210 шт.",
      price: 390,
      vat: true,
      status: "cart",
      thumbPosition: "56% 72%",
      description: "Силовой кабель для серверов, PDU и ИБП в стойке.",
      specs: {
        Нагрузка: "до 10A",
        Сечение: "3 x 1.0 мм2",
        Цвет: "черный",
        Гарантия: "12 месяцев",
      },
    },
    {
      id: "cat6a-2m",
      category: "Кабели",
      name: "Патч-корд RJ45 Cat.6A UTP 2 м",
      sku: "RJ45-CAT6A-2M",
      brand: "Legrand",
      type: "Ethernet",
      interface: "RJ45",
      speed: "10GBase-T",
      length: "2 м",
      connector: "RJ45",
      compatibility: ["Коммутаторы", "Серверы", "Патч-панели"],
      condition: "Новый",
      stock: "В наличии: 86 шт.",
      price: 540,
      vat: true,
      status: "cart",
      thumbPosition: "61% 68%",
      description: "Медный патч-корд для сетевых подключений до 10GBase-T.",
      specs: {
        Категория: "Cat.6A",
        Экранирование: "UTP",
        Оболочка: "PVC",
        Гарантия: "12 месяцев",
      },
    },
    {
      id: "aoc-qsfp28-100g-5m",
      category: "Кабели",
      name: "AOC QSFP28 100G 5 м",
      sku: "AOC-QSFP28-100G-5M",
      brand: "Mellanox",
      type: "AOC",
      interface: "QSFP28",
      speed: "100G",
      length: "5 м",
      connector: "QSFP28",
      compatibility: ["Mellanox", "NVIDIA", "Arista"],
      condition: "Новый",
      stock: "Нет в наличии",
      price: null,
      vat: true,
      status: "request",
      thumbPosition: "49% 69%",
      description: "Активный оптический кабель для высокоскоростных соединений 100G.",
      specs: {
        Тип: "Active Optical Cable",
        Дальность: "5 м",
        Питание: "от порта QSFP28",
        Поставка: "по запросу",
      },
    },
  ];

  const categorySeo = {
    Все: "Сводный каталог комплектующих для серверов, сетевой инфраструктуры и ЦОД.",
    Трансиверы: "SFP, SFP+, QSFP+ и QSFP28 модули с фильтрами по скорости, разъему, дальности и совместимости.",
    Кабели: "DAC, AOC, SAS, Ethernet и силовые кабели для серверных стоек, PDU и систем хранения.",
    "Оптические патч-корды": "Патч-корды OM4 и OS2 с разъемами LC, MPO и другими типами для кроссовых подключений.",
    Адаптеры: "Сетевые адаптеры, HBA и серверные платы расширения для Dell, HPE, Supermicro и других платформ.",
  };

  const filterConfig = [
    { key: "brand", label: "Производитель" },
    { key: "type", label: "Тип товара" },
    { key: "interface", label: "Интерфейс" },
    { key: "speed", label: "Скорость" },
    { key: "length", label: "Длина/дальность" },
    { key: "connector", label: "Тип разъема" },
    { key: "compatibility", label: "Совместимость" },
    { key: "condition", label: "Состояние" },
    { key: "availability", label: "Наличие" },
  ];

  const state = {
    category: "Все",
    search: "",
    sort: "relevance",
    page: 1,
    pageSize: 6,
    priceMin: "",
    priceMax: "",
    filters: Object.fromEntries(filterConfig.map((item) => [item.key, new Set()])),
    leadContext: { type: "quote", productId: null, items: [] },
    csvPreview: [],
  };

  let products = loadJSON(STORAGE.products, defaultProducts);
  let cart = loadJSON(STORAGE.cart, []);
  let favorites = new Set(loadJSON(STORAGE.favorites, []));
  let orders = loadJSON(STORAGE.orders, []);
  let profile = loadJSON(STORAGE.profile, null);

  const $ = (selector) => document.querySelector(selector);
  const refs = {
    metricSku: $("#metricSku"),
    categoryTabs: $("#categoryTabs"),
    breadcrumbs: $("#breadcrumbs"),
    categorySeo: $("#categorySeo"),
    catalogSearch: $("#catalogSearch"),
    heroSearch: $("#heroSearch"),
    sortSelect: $("#sortSelect"),
    priceMin: $("#priceMin"),
    priceMax: $("#priceMax"),
    facetFilters: $("#facetFilters"),
    activeFilterCount: $("#activeFilterCount"),
    selectedFilters: $("#selectedFilters"),
    resultCount: $("#resultCount"),
    productGrid: $("#productGrid"),
    emptyState: $("#emptyState"),
    pagination: $("#pagination"),
    cartCount: $("#cartCount"),
    favoritesCount: $("#favoritesCount"),
    cartDialog: $("#cartDialog"),
    cartBody: $("#cartBody"),
    productDialog: $("#productDialog"),
    productDialogTitle: $("#productDialogTitle"),
    productDialogBody: $("#productDialogBody"),
    productBreadcrumb: $("#productBreadcrumb"),
    leadDialog: $("#leadDialog"),
    leadForm: $("#leadForm"),
    leadTitle: $("#leadTitle"),
    leadEyebrow: $("#leadEyebrow"),
    leadProductSummary: $("#leadProductSummary"),
    accountDialog: $("#accountDialog"),
    accountBody: $("#accountBody"),
    toast: $("#toast"),
    csvText: $("#csvText"),
    csvFile: $("#csvFile"),
    adminPreview: $("#adminPreview"),
    adminProductSelect: $("#adminProductSelect"),
    adminPrice: $("#adminPrice"),
    adminStock: $("#adminStock"),
    adminStatus: $("#adminStatus"),
  };

  function loadJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function saveJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function normalize(value) {
    return String(value ?? "")
      .toLowerCase()
      .replaceAll("ё", "е")
      .trim();
  }

  function formatPrice(price) {
    if (!Number.isFinite(Number(price))) return "Цена по запросу";
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(Number(price));
  }

  function formatDate(value) {
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  }

  function stockGroup(product) {
    const stock = normalize(product.stock);
    if (stock.includes("нет")) return "Нет в наличии";
    if (stock.includes("под заказ")) return "Под заказ";
    return "В наличии";
  }

  function stockClass(product) {
    const group = stockGroup(product);
    if (group === "Нет в наличии") return "danger";
    if (group === "Под заказ") return "warning";
    return "";
  }

  function canAddToCart(product) {
    return product.status === "cart" && Number.isFinite(Number(product.price)) && stockGroup(product) !== "Нет в наличии";
  }

  function productSearchText(product) {
    return normalize(
      [
        product.name,
        product.sku,
        product.brand,
        product.category,
        product.type,
        product.interface,
        product.speed,
        product.connector,
        product.description,
        product.condition,
        product.stock,
        ...(product.compatibility || []),
        ...Object.values(product.specs || {}),
      ].join(" ")
    );
  }

  function categoryList() {
    return ["Все", ...Array.from(new Set(products.map((product) => product.category))).sort((a, b) => a.localeCompare(b, "ru"))];
  }

  function getFacetValue(product, key) {
    if (key === "availability") return [stockGroup(product)];
    if (key === "compatibility") return product.compatibility || [];
    return [product[key]].filter(Boolean);
  }

  function productsForCategory() {
    return state.category === "Все"
      ? products
      : products.filter((product) => product.category === state.category);
  }

  function filteredProducts() {
    let result = productsForCategory();
    const query = normalize(state.search);

    if (query) {
      result = result.filter((product) => productSearchText(product).includes(query));
    }

    for (const { key } of filterConfig) {
      const selected = state.filters[key];
      if (!selected.size) continue;
      result = result.filter((product) => {
        const values = getFacetValue(product, key).map(normalize);
        return [...selected].some((selectedValue) => values.includes(normalize(selectedValue)));
      });
    }

    const min = Number(state.priceMin);
    const max = Number(state.priceMax);
    if (state.priceMin !== "") {
      result = result.filter((product) => Number.isFinite(Number(product.price)) && Number(product.price) >= min);
    }
    if (state.priceMax !== "") {
      result = result.filter((product) => Number.isFinite(Number(product.price)) && Number(product.price) <= max);
    }

    return result.sort((a, b) => {
      if (state.sort === "priceAsc") return priceSortValue(a) - priceSortValue(b);
      if (state.sort === "priceDesc") return priceSortValue(b) - priceSortValue(a);
      if (state.sort === "stock") return stockRank(a) - stockRank(b) || a.name.localeCompare(b.name, "ru");
      if (state.sort === "name") return a.name.localeCompare(b.name, "ru");
      return relevanceRank(a) - relevanceRank(b);
    });
  }

  function priceSortValue(product) {
    return Number.isFinite(Number(product.price)) ? Number(product.price) : Number.MAX_SAFE_INTEGER;
  }

  function stockRank(product) {
    const group = stockGroup(product);
    if (group === "В наличии") return 0;
    if (group === "Под заказ") return 1;
    return 2;
  }

  function relevanceRank(product) {
    const groupRank = stockRank(product);
    const priceRank = Number.isFinite(Number(product.price)) ? 0 : 1;
    return groupRank * 10 + priceRank;
  }

  function activeFilterTotal() {
    const facets = Object.values(state.filters).reduce((sum, set) => sum + set.size, 0);
    const price = Number(Boolean(state.priceMin)) + Number(Boolean(state.priceMax));
    return facets + price + Number(Boolean(state.search));
  }

  function renderAll() {
    refs.metricSku.textContent = String(products.length);
    renderCategories();
    renderFacets();
    renderProducts();
    renderCounters();
    renderAdminSelect();
  }

  function renderCategories() {
    refs.categoryTabs.innerHTML = categoryList()
      .map((category) => {
        const count = category === "Все" ? products.length : products.filter((product) => product.category === category).length;
        return `<button class="category-tab" type="button" role="tab" aria-selected="${category === state.category}" data-category="${escapeAttr(category)}">${escapeHTML(category)} <span class="count-pill">${count}</span></button>`;
      })
      .join("");

    refs.breadcrumbs.textContent = state.category === "Все" ? "Главная / Каталог" : `Главная / Каталог / ${state.category}`;
    refs.categorySeo.textContent = categorySeo[state.category] || categorySeo["Все"];
  }

  function renderFacets() {
    const base = productsForCategory();
    refs.facetFilters.innerHTML = filterConfig
      .map(({ key, label }) => {
        const counts = new Map();
        for (const product of base) {
          for (const value of getFacetValue(product, key)) {
            counts.set(value, (counts.get(value) || 0) + 1);
          }
        }
        const options = [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0], "ru"));
        if (!options.length) return "";
        return `
          <fieldset class="facet-group">
            <legend class="facet-title">${escapeHTML(label)} <span>${options.length}</span></legend>
            <div class="facet-options">
              ${options
                .map(([value, count]) => {
                  const checked = state.filters[key].has(value) ? "checked" : "";
                  return `
                    <label class="check-row">
                      <input class="filter-checkbox" type="checkbox" data-filter="${key}" value="${escapeAttr(value)}" ${checked} />
                      <span>${escapeHTML(value)}</span>
                      <small>${count}</small>
                    </label>`;
                })
                .join("")}
            </div>
          </fieldset>`;
      })
      .join("");
    refs.activeFilterCount.textContent = `${activeFilterTotal()} активно`;
  }

  function renderProducts() {
    const result = filteredProducts();
    const totalPages = Math.max(1, Math.ceil(result.length / state.pageSize));
    state.page = Math.min(state.page, totalPages);
    const start = (state.page - 1) * state.pageSize;
    const visible = result.slice(start, start + state.pageSize);

    refs.resultCount.textContent = plural(result.length, ["товар", "товара", "товаров"]);
    refs.productGrid.innerHTML = visible.map(renderProductCard).join("");
    refs.emptyState.classList.toggle("hidden", result.length > 0);
    refs.productGrid.classList.toggle("hidden", result.length === 0);
    renderSelectedFilters();
    renderPagination(totalPages);
  }

  function renderProductCard(product) {
    const favorite = favorites.has(product.id);
    const addDisabled = canAddToCart(product) ? "" : "disabled";
    const addLabel = canAddToCart(product) ? "В корзину" : "Через КП";
    return `
      <article class="product-card" data-product-id="${escapeAttr(product.id)}">
        <div class="product-thumb">
          <img src="${heroImage}" alt="${escapeAttr(product.name)}" style="object-position:${escapeAttr(product.thumbPosition || "center")}" loading="lazy" />
          <span class="thumb-label">${escapeHTML(product.type)} / ${escapeHTML(product.speed)}</span>
          <button class="favorite-toggle" type="button" aria-label="${favorite ? "Убрать из избранного" : "Добавить в избранное"}" aria-pressed="${favorite}" data-action="favorite" data-id="${escapeAttr(product.id)}">${favorite ? "✓" : "+"}</button>
        </div>
        <div class="product-body">
          <div class="product-meta">
            <span class="stock-chip ${stockClass(product)}">${escapeHTML(stockGroup(product))}</span>
            <span class="status-chip">${escapeHTML(product.condition)}</span>
          </div>
          <h3 class="product-title">${escapeHTML(product.name)}</h3>
          <p class="product-sku">${escapeHTML(product.sku)}</p>
          <p class="product-description">${escapeHTML(product.description)}</p>
        </div>
        <div class="product-footer">
          <div class="price-row">
            <span class="price">${formatPrice(product.price)}</span>
            <span class="vat-note">${product.vat ? "с НДС" : "без НДС"}</span>
          </div>
          <div class="card-actions">
            <button class="secondary-button compact details-button" type="button" data-action="details" data-id="${escapeAttr(product.id)}">Карточка товара</button>
            <button class="primary-button compact" type="button" data-action="add" data-id="${escapeAttr(product.id)}" ${addDisabled}>${addLabel}</button>
            <button class="secondary-button compact" type="button" data-action="quote" data-id="${escapeAttr(product.id)}">Запросить КП</button>
          </div>
        </div>
      </article>`;
  }

  function renderSelectedFilters() {
    const chips = [];
    if (state.search) chips.push(`Поиск: ${state.search}`);
    if (state.priceMin) chips.push(`от ${state.priceMin} ₽`);
    if (state.priceMax) chips.push(`до ${state.priceMax} ₽`);
    for (const { key, label } of filterConfig) {
      for (const value of state.filters[key]) {
        chips.push(`${label}: ${value}`);
      }
    }
    refs.selectedFilters.innerHTML = chips.map((chip) => `<span class="filter-chip">${escapeHTML(chip)}</span>`).join("");
  }

  function renderPagination(totalPages) {
    if (totalPages <= 1) {
      refs.pagination.innerHTML = "";
      return;
    }
    refs.pagination.innerHTML = Array.from({ length: totalPages }, (_, index) => {
      const page = index + 1;
      return `<button type="button" data-page="${page}" aria-current="${page === state.page ? "page" : "false"}">${page}</button>`;
    }).join("");
  }

  function renderCounters() {
    refs.cartCount.textContent = String(cart.reduce((sum, item) => sum + item.qty, 0));
    refs.favoritesCount.textContent = String(favorites.size);
  }

  function renderCart() {
    if (!cart.length) {
      refs.cartBody.innerHTML = `
        <div class="empty-state">
          <h3>Корзина пуста</h3>
          <p>Добавьте товары из каталога или отправьте запрос на подбор.</p>
          <button class="primary-button" type="button" data-lead="quote">Запросить подбор</button>
        </div>`;
      return;
    }

    const lines = cart
      .map((item) => {
        const product = findProduct(item.id);
        if (!product) return "";
        return `
          <div class="cart-line">
            <div>
              <h3>${escapeHTML(product.name)}</h3>
              <p class="product-sku">${escapeHTML(product.sku)}</p>
              <p class="cart-meta"><span class="stock-chip ${stockClass(product)}">${escapeHTML(product.stock)}</span></p>
            </div>
            <div class="cart-controls" aria-label="Количество">
              <button class="qty-button" type="button" data-cart="minus" data-id="${escapeAttr(product.id)}">−</button>
              <strong>${item.qty}</strong>
              <button class="qty-button" type="button" data-cart="plus" data-id="${escapeAttr(product.id)}">+</button>
              <button class="secondary-button compact" type="button" data-cart="remove" data-id="${escapeAttr(product.id)}">Удалить</button>
            </div>
            <strong>${formatPrice(Number(product.price) * item.qty)}</strong>
          </div>`;
      })
      .join("");

    refs.cartBody.innerHTML = `
      <div class="cart-items">${lines}</div>
      <div class="cart-summary">
        <strong>Итого ориентировочно: ${formatPrice(cartTotal())}</strong>
        <p class="muted">Финальная цена, наличие и срок поставки подтверждаются менеджером.</p>
      </div>
      <form class="checkout-form" id="checkoutForm">
        ${customerFields()}
        <label>
          <span>Комментарий</span>
          <textarea class="input textarea" name="comment" rows="4" placeholder="Например: нужен счет на юрлицо, доставка ТК, аналоги при отсутствии"></textarea>
        </label>
        ${antiSpamFields()}
        <button class="primary-button" type="submit">Отправить заявку</button>
      </form>`;
    prefillCustomerForm($("#checkoutForm"));
  }

  function renderProductDialog(product) {
    refs.productDialogTitle.textContent = product.name;
    refs.productBreadcrumb.textContent = `Каталог / ${product.category} / ${product.sku}`;
    const specs = {
      Артикул: product.sku,
      Производитель: product.brand,
      Тип: product.type,
      Интерфейс: product.interface,
      Скорость: product.speed,
      "Длина/дальность": product.length,
      Разъем: product.connector,
      Состояние: product.condition,
      Наличие: product.stock,
      ...product.specs,
    };
    refs.productDialogBody.innerHTML = `
      <div class="product-detail-grid">
        <div class="detail-image">
          <img src="${heroImage}" alt="${escapeAttr(product.name)}" style="object-position:${escapeAttr(product.thumbPosition || "center")}" />
        </div>
        <div>
          <div class="product-meta">
            <span class="stock-chip ${stockClass(product)}">${escapeHTML(product.stock)}</span>
            <span class="status-chip">${escapeHTML(product.vat ? "цена с НДС" : "без НДС")}</span>
          </div>
          <p>${escapeHTML(product.description)}</p>
          <div class="price-row">
            <span class="price">${formatPrice(product.price)}</span>
            <span class="vat-note">${product.status === "request" ? "условия уточняет менеджер" : "можно добавить в корзину"}</span>
          </div>
          <h3>Совместимость</h3>
          <div class="compat-list">${(product.compatibility || []).map((item) => `<span class="spec-chip">${escapeHTML(item)}</span>`).join("")}</div>
          <div class="button-row">
            <button class="primary-button" type="button" data-action="add" data-id="${escapeAttr(product.id)}" ${canAddToCart(product) ? "" : "disabled"}>Добавить в корзину</button>
            <button class="secondary-button" type="button" data-action="quote" data-id="${escapeAttr(product.id)}">Запросить КП</button>
            <button class="secondary-button" type="button" data-action="question" data-id="${escapeAttr(product.id)}">Задать вопрос</button>
          </div>
        </div>
      </div>
      <table class="spec-table">
        <tbody>
          ${Object.entries(specs)
            .map(([key, value]) => `<tr><th>${escapeHTML(key.replaceAll("_", " "))}</th><td>${escapeHTML(value)}</td></tr>`)
            .join("")}
        </tbody>
      </table>`;
  }

  function renderLeadDialog(type, productId = null, items = []) {
    state.leadContext = { type, productId, items };
    const product = productId ? findProduct(productId) : null;
    refs.leadEyebrow.textContent = type === "question" ? "Вопрос менеджеру" : "Коммерческое предложение";
    refs.leadTitle.textContent = type === "question" ? "Задать вопрос" : "Запросить КП";
    refs.leadProductSummary.innerHTML = product
      ? `<strong>${escapeHTML(product.name)}</strong><p class="product-sku">${escapeHTML(product.sku)}</p>`
      : `<strong>Подбор по списку</strong><p class="muted">Менеджер получит комментарий и уточнит параметры.</p>`;
    refs.leadForm.reset();
    refs.leadForm.dataset.startedAt = String(Date.now());
    prefillCustomerForm(refs.leadForm);
  }

  function renderAccount() {
    if (!profile) {
      refs.accountBody.innerHTML = `
        <form class="profile-form" id="profileForm">
          <p class="muted">Сохраните контактные данные и реквизиты. Они будут подставляться в заявки.</p>
          ${customerFields()}
          ${antiSpamFields()}
          <button class="primary-button" type="submit">Сохранить профиль</button>
        </form>`;
      return;
    }

    const favoriteProducts = [...favorites].map(findProduct).filter(Boolean);
    refs.accountBody.innerHTML = `
      <div class="profile-card">
        <strong>${escapeHTML(profile.company)}</strong>
        <p>${escapeHTML(profile.name)} · ${escapeHTML(profile.phone)} · ${escapeHTML(profile.email)}</p>
        <p class="product-sku">ИНН: ${escapeHTML(profile.inn || "не указан")}</p>
      </div>
      <div class="button-row">
        <button class="secondary-button" type="button" data-account="edit">Изменить профиль</button>
        <button class="secondary-button" type="button" data-account="clear">Выйти из демо-кабинета</button>
      </div>
      <h3>Избранное</h3>
      <div class="favorites-list">
        ${
          favoriteProducts.length
            ? favoriteProducts.map((product) => `<button class="secondary-button compact" type="button" data-action="details" data-id="${escapeAttr(product.id)}">${escapeHTML(product.sku)}</button>`).join("")
            : `<span class="muted">Пока нет избранных товаров.</span>`
        }
      </div>
      <h3>История заявок</h3>
      <div class="orders-list">
        ${
          orders.length
            ? orders
                .map(
                  (order) => `
                    <div class="order-line">
                      <div>
                        <h3>${escapeHTML(order.id)} · ${escapeHTML(order.kind)}</h3>
                        <p class="muted">${formatDate(order.createdAt)} · ${plural(order.items.length, ["позиция", "позиции", "позиций"])} · ${escapeHTML(order.status)}</p>
                      </div>
                      <button class="secondary-button compact" type="button" data-repeat="${escapeAttr(order.id)}">Повторить заявку</button>
                    </div>`
                )
                .join("")
            : `<p class="muted">Заявки появятся после отправки формы или корзины.</p>`
        }
      </div>`;
  }

  function renderAdminSelect() {
    refs.adminProductSelect.innerHTML = products
      .map((product) => `<option value="${escapeAttr(product.id)}">${escapeHTML(product.sku)} · ${escapeHTML(product.name)}</option>`)
      .join("");
    fillAdminForm(refs.adminProductSelect.value || products[0]?.id);
  }

  function renderAdminPreview(rows = state.csvPreview) {
    if (!rows.length) {
      refs.adminPreview.innerHTML = `<p class="muted">Предпросмотр импорта появится здесь.</p>`;
      return;
    }
    refs.adminPreview.innerHTML = `
      <table class="data-table">
        <thead>
          <tr>
            <th>Категория</th>
            <th>Название</th>
            <th>SKU</th>
            <th>Бренд</th>
            <th>Цена</th>
            <th>Наличие</th>
            <th>Сценарий</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (product) => `
                <tr>
                  <td>${escapeHTML(product.category)}</td>
                  <td>${escapeHTML(product.name)}</td>
                  <td>${escapeHTML(product.sku)}</td>
                  <td>${escapeHTML(product.brand)}</td>
                  <td>${formatPrice(product.price)}</td>
                  <td>${escapeHTML(product.stock)}</td>
                  <td>${product.status === "cart" ? "корзина" : "КП"}</td>
                </tr>`
            )
            .join("")}
        </tbody>
      </table>`;
  }

  function customerFields() {
    return `
      <label>
        <span>Имя</span>
        <input class="input" name="name" required />
      </label>
      <label>
        <span>Телефон</span>
        <input class="input" name="phone" required />
      </label>
      <label>
        <span>Email</span>
        <input class="input" name="email" type="email" required />
      </label>
      <label>
        <span>Компания</span>
        <input class="input" name="company" required />
      </label>
      <label>
        <span>ИНН</span>
        <input class="input" name="inn" inputmode="numeric" />
      </label>`;
  }

  function antiSpamFields() {
    return `<input type="text" name="website" tabindex="-1" autocomplete="off" class="visually-hidden" aria-hidden="true" />`;
  }

  function prefillCustomerForm(form) {
    if (!profile || !form) return;
    for (const key of ["name", "phone", "email", "company", "inn"]) {
      const field = form.elements[key];
      if (field) field.value = profile[key] || "";
    }
  }

  function collectCustomer(form) {
    const data = new FormData(form);
    return {
      name: String(data.get("name") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      email: String(data.get("email") || "").trim(),
      company: String(data.get("company") || "").trim(),
      inn: String(data.get("inn") || "").trim(),
    };
  }

  function validateAntiSpam(form) {
    const startedAt = Number(form.dataset.startedAt || Date.now() - 1000);
    const honey = String(new FormData(form).get("website") || "");
    return Date.now() - startedAt > 450 && honey.length === 0;
  }

  function addToCart(productId, qty = 1) {
    const product = findProduct(productId);
    if (!product) return;
    if (!canAddToCart(product)) {
      openLead("quote", productId);
      openDialog(refs.leadDialog);
      return;
    }
    const existing = cart.find((item) => item.id === productId);
    if (existing) existing.qty += qty;
    else cart.push({ id: productId, qty });
    saveJSON(STORAGE.cart, cart);
    renderCounters();
    trackGoal("add_to_cart", { sku: product.sku });
    showToast(`${product.sku} добавлен в корзину`);
  }

  function updateCart(productId, action) {
    const item = cart.find((line) => line.id === productId);
    if (!item) return;
    if (action === "plus") item.qty += 1;
    if (action === "minus") item.qty -= 1;
    if (action === "remove" || item.qty <= 0) cart = cart.filter((line) => line.id !== productId);
    saveJSON(STORAGE.cart, cart);
    renderCounters();
    renderCart();
  }

  function toggleFavorite(productId) {
    if (favorites.has(productId)) favorites.delete(productId);
    else favorites.add(productId);
    saveJSON(STORAGE.favorites, [...favorites]);
    renderCounters();
    renderProducts();
    trackGoal("toggle_favorite", { productId, enabled: favorites.has(productId) });
  }

  function cartTotal() {
    return cart.reduce((sum, item) => {
      const product = findProduct(item.id);
      return sum + (Number(product?.price) || 0) * item.qty;
    }, 0);
  }

  function buildOrder(kind, customer, items, comment = "") {
    const orderItems = items.map((item) => {
      const product = findProduct(item.id);
      return {
        id: item.id,
        sku: product?.sku || item.sku || item.id,
        name: product?.name || item.name || "Товар",
        qty: item.qty || 1,
        price: product?.price ?? item.price ?? null,
      };
    });
    return {
      id: `VMZ-${String(Date.now()).slice(-8)}`,
      kind,
      status: "Новая заявка, ожидает подтверждения менеджером",
      createdAt: new Date().toISOString(),
      customer,
      comment,
      items: orderItems,
      total: orderItems.reduce((sum, item) => sum + (Number(item.price) || 0) * item.qty, 0),
      notification: {
        email: "sales@example.ru",
        telegram: "sales-team-chat",
        mode: "demo-payload",
      },
    };
  }

  function submitOrder(order) {
    orders.unshift(order);
    saveJSON(STORAGE.orders, orders);
    profile = { ...profile, ...order.customer };
    saveJSON(STORAGE.profile, profile);
    trackGoal("lead_submit", { kind: order.kind, items: order.items.length });
    return order;
  }

  function showPayload(target, order) {
    const payload = {
      event: "new_lead",
      orderId: order.id,
      sendTo: order.notification,
      customer: order.customer,
      items: order.items,
      totalWithVat: order.total,
      comment: order.comment,
    };
    target.insertAdjacentHTML(
      "beforeend",
      `<pre class="payload-box">${escapeHTML(JSON.stringify(payload, null, 2))}</pre>`
    );
  }

  function findProduct(productId) {
    return products.find((product) => product.id === productId);
  }

  function openLead(type, productId = null) {
    renderLeadDialog(type, productId);
    openDialog(refs.leadDialog);
  }

  function openDialog(dialog) {
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  }

  function closeDialog(dialog) {
    if (dialog.open && typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  }

  function showToast(message) {
    refs.toast.textContent = message;
    refs.toast.classList.add("visible");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => refs.toast.classList.remove("visible"), 3200);
  }

  function trackGoal(name, data = {}) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: name, ...data });
    if (typeof window.ym === "function" && window.YM_COUNTER_ID) {
      window.ym(window.YM_COUNTER_ID, "reachGoal", name, data);
    }
  }

  function parseCsv(text) {
    const rows = [];
    let row = [];
    let cell = "";
    let quoted = false;
    const firstLine = text.split(/\r?\n/).find(Boolean) || "";
    const delimiter = (firstLine.match(/;/g) || []).length >= (firstLine.match(/,/g) || []).length ? ";" : ",";

    for (let index = 0; index < text.length; index += 1) {
      const char = text[index];
      const next = text[index + 1];
      if (char === '"' && quoted && next === '"') {
        cell += '"';
        index += 1;
      } else if (char === '"') {
        quoted = !quoted;
      } else if (char === delimiter && !quoted) {
        row.push(cell);
        cell = "";
      } else if ((char === "\n" || char === "\r") && !quoted) {
        if (char === "\r" && next === "\n") index += 1;
        row.push(cell);
        if (row.some((value) => value.trim())) rows.push(row);
        row = [];
        cell = "";
      } else {
        cell += char;
      }
    }
    row.push(cell);
    if (row.some((value) => value.trim())) rows.push(row);
    if (rows.length < 2) return [];

    const headers = rows.shift().map((header) => normalize(header));
    return rows.map((values) => {
      const raw = Object.fromEntries(headers.map((header, index) => [header, values[index] || ""]));
      return csvRowToProduct(raw);
    });
  }

  function valueByAlias(row, aliases) {
    for (const alias of aliases) {
      const value = row[normalize(alias)];
      if (value !== undefined && String(value).trim() !== "") return String(value).trim();
    }
    return "";
  }

  function csvRowToProduct(row) {
    const sku = valueByAlias(row, ["sku", "артикул", "код"]) || `SKU-${Date.now()}`;
    const priceRaw = valueByAlias(row, ["price", "цена", "цена с ндс"]).replace(/\s/g, "").replace(",", ".");
    const price = priceRaw === "" ? null : Number(priceRaw);
    const statusRaw = normalize(valueByAlias(row, ["status", "сценарий", "статус продажи"]));
    const stock = valueByAlias(row, ["stock", "наличие", "остаток"]) || "Под заказ";
    const compatibility = valueByAlias(row, ["compatibility", "совместимость"])
      .split(/[|,]/)
      .map((item) => item.trim())
      .filter(Boolean);
    return {
      id: slugify(sku),
      category: valueByAlias(row, ["category", "категория"]) || "Серверное оборудование",
      name: valueByAlias(row, ["name", "название", "товар"]) || sku,
      sku,
      brand: valueByAlias(row, ["brand", "бренд", "производитель"]) || "OEM",
      type: valueByAlias(row, ["type", "тип"]) || "Комплектующие",
      interface: valueByAlias(row, ["interface", "интерфейс"]) || "не указан",
      speed: valueByAlias(row, ["speed", "скорость"]) || "не указана",
      length: valueByAlias(row, ["length", "длина", "дальность"]) || "не указана",
      connector: valueByAlias(row, ["connector", "разъем", "тип разъема"]) || "не указан",
      compatibility,
      condition: valueByAlias(row, ["condition", "состояние"]) || "Новый",
      stock,
      price: Number.isFinite(price) ? price : null,
      vat: normalize(valueByAlias(row, ["vat", "ндс"])) !== "без ндс",
      status: statusRaw.includes("request") || statusRaw.includes("кп") || !Number.isFinite(price) ? "request" : "cart",
      thumbPosition: "50% 64%",
      description: valueByAlias(row, ["description", "описание"]) || "Описание будет заполнено менеджером каталога.",
      specs: {
        Интерфейс: valueByAlias(row, ["interface", "интерфейс"]) || "не указан",
        Скорость: valueByAlias(row, ["speed", "скорость"]) || "не указана",
        Разъем: valueByAlias(row, ["connector", "разъем", "тип разъема"]) || "не указан",
      },
    };
  }

  function mergeProducts(incoming, replace = false) {
    if (replace) {
      products = incoming;
    } else {
      const bySku = new Map(products.map((product) => [normalize(product.sku), product]));
      for (const product of incoming) bySku.set(normalize(product.sku), { ...bySku.get(normalize(product.sku)), ...product });
      products = [...bySku.values()];
    }
    saveJSON(STORAGE.products, products);
    state.category = "Все";
    clearFilters();
    renderAll();
  }

  function fillAdminForm(productId) {
    const product = findProduct(productId);
    if (!product) return;
    refs.adminPrice.value = Number.isFinite(Number(product.price)) ? product.price : "";
    refs.adminStock.value = product.stock;
    refs.adminStatus.value = product.status;
  }

  function sampleCsv() {
    return [
      "category;name;sku;brand;type;interface;speed;length;connector;compatibility;condition;stock;price;vat;status;description",
      "Трансиверы;SFP28 25G SR 850 нм;SFP28-25G-SR;OEM;SFP28;LC Duplex;25G;100 м;LC;Cisco|Mellanox|Arista;Новый;В наличии: 14 шт.;6900;с НДС;cart;Трансивер для коротких 25G-соединений внутри ЦОД",
      "Кабели;DAC QSFP28 100G 2 м;DAC-QSFP28-100G-2M;NVIDIA;DAC;QSFP28;100G;2 м;QSFP28;Mellanox|NVIDIA;Новый;Под заказ: 3 дня;;с НДС;request;Пассивный кабель для 100G-подключений",
    ].join("\n");
  }

  function clearFilters() {
    state.search = "";
    state.priceMin = "";
    state.priceMax = "";
    state.page = 1;
    for (const set of Object.values(state.filters)) set.clear();
    refs.catalogSearch.value = "";
    refs.heroSearch.value = "";
    refs.priceMin.value = "";
    refs.priceMax.value = "";
    refs.sortSelect.value = "relevance";
    state.sort = "relevance";
  }

  function plural(count, forms) {
    const mod10 = count % 10;
    const mod100 = count % 100;
    const form = mod10 === 1 && mod100 !== 11 ? forms[0] : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14) ? forms[1] : forms[2];
    return `${count} ${form}`;
  }

  function slugify(value) {
    return normalize(value)
      .replace(/[^a-zа-я0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80);
  }

  function escapeHTML(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function escapeAttr(value) {
    return escapeHTML(value).replaceAll("`", "&#096;");
  }

  refs.categoryTabs.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    state.category = button.dataset.category;
    state.page = 1;
    renderAll();
    trackGoal("category_select", { category: state.category });
  });

  refs.facetFilters.addEventListener("change", (event) => {
    const input = event.target.closest(".filter-checkbox");
    if (!input) return;
    const filterSet = state.filters[input.dataset.filter];
    if (input.checked) filterSet.add(input.value);
    else filterSet.delete(input.value);
    state.page = 1;
    renderFacets();
    renderProducts();
  });

  refs.catalogSearch.addEventListener("input", (event) => {
    state.search = event.target.value;
    refs.heroSearch.value = state.search;
    state.page = 1;
    renderProducts();
  });

  $("#heroSearchForm").addEventListener("submit", (event) => {
    event.preventDefault();
    state.search = refs.heroSearch.value;
    refs.catalogSearch.value = state.search;
    state.page = 1;
    renderProducts();
    document.querySelector("#catalog").scrollIntoView({ behavior: "smooth", block: "start" });
    trackGoal("site_search", { query: state.search });
  });

  refs.sortSelect.addEventListener("change", (event) => {
    state.sort = event.target.value;
    renderProducts();
  });

  refs.priceMin.addEventListener("input", (event) => {
    state.priceMin = event.target.value;
    state.page = 1;
    renderFacets();
    renderProducts();
  });

  refs.priceMax.addEventListener("input", (event) => {
    state.priceMax = event.target.value;
    state.page = 1;
    renderFacets();
    renderProducts();
  });

  $("#resetCatalogButton").addEventListener("click", () => {
    clearFilters();
    renderAll();
  });

  refs.pagination.addEventListener("click", (event) => {
    const button = event.target.closest("[data-page]");
    if (!button) return;
    state.page = Number(button.dataset.page);
    renderProducts();
    refs.productGrid.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  document.addEventListener("click", (event) => {
    const actionButton = event.target.closest("[data-action]");
    if (actionButton) {
      const action = actionButton.dataset.action;
      const id = actionButton.dataset.id;
      const product = findProduct(id);
      if (action === "favorite") toggleFavorite(id);
      if (action === "add") addToCart(id);
      if (action === "details" && product) {
        renderProductDialog(product);
        openDialog(refs.productDialog);
        trackGoal("product_view", { sku: product.sku });
      }
      if (action === "quote") openLead("quote", id);
      if (action === "question") openLead("question", id);
    }

    const leadButton = event.target.closest("[data-lead]");
    if (leadButton) openLead(leadButton.dataset.lead);
  });

  $("#cartButton").addEventListener("click", () => {
    renderCart();
    openDialog(refs.cartDialog);
  });

  $("#favoritesButton").addEventListener("click", () => {
    renderAccount();
    openDialog(refs.accountDialog);
  });

  $("#accountButton").addEventListener("click", () => {
    renderAccount();
    openDialog(refs.accountDialog);
  });

  refs.cartBody.addEventListener("click", (event) => {
    const button = event.target.closest("[data-cart]");
    if (!button) return;
    updateCart(button.dataset.id, button.dataset.cart);
  });

  refs.cartBody.addEventListener("submit", (event) => {
    if (event.target.id !== "checkoutForm") return;
    event.preventDefault();
    if (!validateAntiSpam(event.target)) {
      showToast("Форма отклонена защитой от спама. Попробуйте еще раз.");
      return;
    }
    const customer = collectCustomer(event.target);
    const comment = String(new FormData(event.target).get("comment") || "").trim();
    const order = submitOrder(buildOrder("Заказ из корзины", customer, cart, comment));
    cart = [];
    saveJSON(STORAGE.cart, cart);
    renderCounters();
    renderCart();
    showPayload(refs.cartBody, order);
    showToast(`Заявка ${order.id} подготовлена для email и Telegram`);
  });

  refs.leadForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validateAntiSpam(event.target)) {
      showToast("Форма отклонена защитой от спама. Попробуйте еще раз.");
      return;
    }
    const product = state.leadContext.productId ? findProduct(state.leadContext.productId) : null;
    const items = product ? [{ id: product.id, qty: 1 }] : state.leadContext.items;
    const customer = collectCustomer(event.target);
    const data = new FormData(event.target);
    const kind = state.leadContext.type === "question" ? "Вопрос по товару" : "Запрос КП";
    const order = submitOrder(buildOrder(kind, customer, items, String(data.get("comment") || "").trim()));
    showPayload(refs.leadForm, order);
    showToast(`${order.id} подготовлена для отправки менеджеру`);
  });

  refs.accountBody.addEventListener("submit", (event) => {
    if (event.target.id !== "profileForm") return;
    event.preventDefault();
    if (!validateAntiSpam(event.target)) {
      showToast("Форма отклонена защитой от спама. Попробуйте еще раз.");
      return;
    }
    profile = collectCustomer(event.target);
    saveJSON(STORAGE.profile, profile);
    renderAccount();
    showToast("Профиль сохранен");
  });

  refs.accountBody.addEventListener("click", (event) => {
    const accountButton = event.target.closest("[data-account]");
    if (accountButton?.dataset.account === "edit") {
      const current = profile;
      profile = null;
      renderAccount();
      profile = current;
      prefillCustomerForm($("#profileForm"));
    }
    if (accountButton?.dataset.account === "clear") {
      profile = null;
      saveJSON(STORAGE.profile, profile);
      renderAccount();
    }
    const repeatButton = event.target.closest("[data-repeat]");
    if (repeatButton) {
      const order = orders.find((item) => item.id === repeatButton.dataset.repeat);
      if (!order) return;
      for (const item of order.items) addToCart(item.id, item.qty);
      closeDialog(refs.accountDialog);
      renderCart();
      openDialog(refs.cartDialog);
    }
  });

  $("#contactForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const order = submitOrder(
      buildOrder(
        "Сообщение с сайта",
        {
          name: String(formData.get("name") || ""),
          phone: String(formData.get("contact") || ""),
          email: String(formData.get("contact") || ""),
          company: "Не указана",
          inn: "",
        },
        [],
        String(formData.get("message") || "")
      )
    );
    event.target.reset();
    showToast(`Сообщение ${order.id} подготовлено для менеджера`);
  });

  $("#loadSampleCsvButton").addEventListener("click", () => {
    refs.csvText.value = sampleCsv();
  });

  refs.csvFile.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    refs.csvText.value = await file.text();
  });

  $("#previewCsvButton").addEventListener("click", () => {
    state.csvPreview = parseCsv(refs.csvText.value);
    renderAdminPreview();
    showToast(plural(state.csvPreview.length, ["строка распознана", "строки распознаны", "строк распознано"]));
  });

  $("#mergeCsvButton").addEventListener("click", () => {
    const incoming = parseCsv(refs.csvText.value);
    if (!incoming.length) {
      showToast("CSV не содержит товаров для импорта");
      return;
    }
    mergeProducts(incoming, false);
    state.csvPreview = incoming;
    renderAdminPreview();
    showToast("Каталог обновлен из CSV");
  });

  $("#replaceCsvButton").addEventListener("click", () => {
    const incoming = parseCsv(refs.csvText.value);
    if (!incoming.length) {
      showToast("CSV не содержит товаров для импорта");
      return;
    }
    mergeProducts(incoming, true);
    state.csvPreview = incoming;
    renderAdminPreview();
    showToast("Каталог заменен импортом CSV");
  });

  $("#downloadCsvButton").addEventListener("click", () => {
    const blob = new Blob([sampleCsv()], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "vmz-catalog-sample.csv";
    link.click();
    URL.revokeObjectURL(url);
  });

  refs.adminProductSelect.addEventListener("change", (event) => fillAdminForm(event.target.value));

  $("#quickEditForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const product = findProduct(refs.adminProductSelect.value);
    if (!product) return;
    const price = Number(refs.adminPrice.value);
    product.price = Number.isFinite(price) && refs.adminPrice.value !== "" ? price : null;
    product.stock = refs.adminStock.value.trim() || "Под заказ";
    product.status = refs.adminStatus.value;
    saveJSON(STORAGE.products, products);
    renderAll();
    showToast("Товар обновлен");
  });

  $("#restoreDemoButton").addEventListener("click", () => {
    products = structuredClone(defaultProducts);
    saveJSON(STORAGE.products, products);
    clearFilters();
    renderAll();
    showToast("Демо-каталог восстановлен");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    for (const dialog of [refs.cartDialog, refs.productDialog, refs.leadDialog, refs.accountDialog]) {
      if (dialog.open) closeDialog(dialog);
    }
  });

  renderAll();
  renderAdminPreview();
})();
