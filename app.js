(() => {
  "use strict";

  const STORAGE = {
    products: "vmz.products.v1",
    cart: "vmz.cart.v1",
    favorites: "vmz.favorites.v1",
    orders: "vmz.orders.v1",
    profile: "vmz.profile.v1",
    users: "vmz.users.v1",
    session: "vmz.session.v1",
    seedVersion: "vmz.seedVersion.v1",
    managerAccess: "vmz.managerAccess.v1",
  };

  const CATALOG_SEED_VERSION = "2026-09-02-purchase-cta";
  const retiredProductIds = new Set(["avito-ssd-intel-3-2tb", "avito-ssd-king-4tb"]);
  const PRIVACY_POLICY_VERSION = "2026-08-31";
  const heroImage = "assets/server-components-hero-1280.webp";
  const productImagePath = "assets/product-images/";
  const productImageMap = {
      "LR-SLLP-100": [
          "catalog-001-lr-sllp-100.webp"
      ],
      "BY-LR-SLLP-100": [
          "catalog-002-by-lr-sllp-100.webp"
      ],
      "LR-SLLP-80": [
          "catalog-003-lr-sllp-80.webp"
      ],
      "LR-SLLP-70": [
          "catalog-004-lr-sllp-70.webp"
      ],
      "LR-SLLP-60": [
          "catalog-005-lr-sllp-60.webp"
      ],
      "BY-LR-SL-100": [
          "catalog-006-by-lr-sl-100.webp"
      ],
      "BY-LR-SL-80": [
          "catalog-007-by-lr-sl-80.webp"
      ],
      "LR-MC-80": [
          "catalog-008-lr-mc-80.webp"
      ],
      "LR-MCU2-80": [
          "catalog-009-lr-mcu2-80.webp"
      ],
      "LR-SLU2-60": [
          "catalog-010-lr-slu2-60.webp"
      ],
      "LR-AD-MC-G5": [
          "catalog-011-lr-ad-mc-g5.webp"
      ],
      "10GT-AD-MC-G5": [
          "catalog-012-10gt-ad-mc-g5.webp"
      ],
      "LR-AD-4SL-G4": [
          "catalog-013-lr-ad-4sl-g4.webp"
      ],
      "LR-AD-SL-G4": [
          "catalog-014-lr-ad-sl-g4.webp"
      ],
      "10GT-SLLP-100": [
          "catalog-015-10gt-sllp-100.webp"
      ],
      "BY-10GT-SLLP-100": [
          "catalog-016-by-10gt-sllp-100.webp"
      ],
      "BY-10GT-SLLP-80": [
          "catalog-017-by-10gt-sllp-80.webp"
      ],
      "BY-10GT-SLLP-70": [
          "catalog-018-by-10gt-sllp-70.webp"
      ],
      "BY-10GT-SLLP-60": [
          "catalog-019-by-10gt-sllp-60.webp"
      ],
      "BY-10GT-SL-75": [
          "catalog-020-by-10gt-sl-75.webp"
      ],
      "10GT-SL-75": [
          "catalog-021-10gt-sl-75.webp"
      ],
      "BY-10GT-SL-70": [
          "catalog-022-by-10gt-sl-70.webp"
      ],
      "10GT-SL-70": [
          "catalog-023-10gt-sl-70.webp"
      ],
      "10GT-SL-60": [
          "catalog-024-10gt-sl-60.webp"
      ],
      "10GT-MC-80": [
          "catalog-025-10gt-mc-80.webp"
      ],
      "10GT-MCU2-80": [
          "catalog-026-10gt-mcu2-80.webp"
      ],
      "RZ-100": [
          "catalog-027-rz-100.webp"
      ],
      "RZ-60": [
          "catalog-028-rz-60.webp"
      ],
      "RZ-40": [
          "catalog-029-rz-40.webp"
      ],
      "BIF-SL-G4": [
          "catalog-030-bif-sl-g4.webp"
      ],
      "10GT-XL-10G-4S": [
          "catalog-031-10gt-xl-10g-4s.webp"
      ],
      "BY-MELL-CX-25G": [
          "catalog-032-by-mell-cx-25g.webp"
      ],
      "SSD-CRUC-250GB": [
          "catalog-033-ssd-cruc-250gb.webp"
      ],
      "SSD-SAMS-250GB": [
          "catalog-035-ssd-sams-250gb.webp"
      ],
      "SSD-SAMS-500GB": [
          "catalog-036-ssd-sams-500gb.webp"
      ],
      "SSD-MSI-4TB": [
          "catalog-037-ssd-msi-4tb.webp"
      ],
      "HDD-SKY-14TB": [
          "catalog-039-hdd-sky-14tb.webp"
      ],
      "SFP-MIG-10G": [
          "catalog-040-sfp-mig-10g.webp"
      ],
      "SFP-FIBO-1G": [
          "catalog-041-sfp-fibo-1g.webp"
      ],
      "SFP-LR-RJ45": [
          "catalog-042-sfp-lr-rj45.webp"
      ],
      "SFP-FIBO-RJ45": [
          "catalog-043-sfp-fibo-rj45.webp"
      ],
      "SFP-LR-10G": [
          "catalog-044-sfp-lr-10g.webp"
      ],
      "XFP-CISCO-10G": [
          "catalog-045-xfp-cisco-10g.webp"
      ],
      "SFP-LR-T4-25G": [
          "catalog-046-sfp-lr-t4-25g.webp"
      ],
      "SFP-LR-T8-25G": [
          "catalog-047-sfp-lr-t8-25g.webp"
      ],
      "SFP-10GT-25G": [
          "catalog-048-sfp-10gt-25g.webp"
      ],
      "QSFP-MIKR-100G": [
          "catalog-049-qsfp-mikr-100g.webp"
      ],
      "QSFP-LR-100G": [
          "catalog-050-qsfp-lr-100g.webp"
      ],
      "OPTI-100G-1M": [
          "catalog-051-opti-100g-1m.webp"
      ],
      "OPTI-100G-2M": [
          "catalog-052-opti-100g-2m.webp"
      ],
      "OPTI-100G-20M": [
          "catalog-053-opti-100g-20m.webp"
      ],
      "OPTI-100G-100M": [
          "catalog-054-opti-100g-100m.webp"
      ],
      "CON-MIC-HI": [
          "catalog-055-con-mic-hi.webp"
      ],
      "CON-12-VH": [
          "catalog-056-con-12-vh.webp"
      ],
      "VENT-SNOW-1505": [
          "catalog-057-vent-snow-1505.webp"
      ],
      "VENT-RDK-150": [
          "catalog-058-vent-rdk-150.webp"
      ],
      "VENT-YD-1203": [
          "catalog-059-vent-yd-1203.webp"
      ],
      "VENT-RDK-1203": [
          "catalog-060-vent-rdk-1203.webp"
      ],
      "VENT-DC-QWE12": [
          "catalog-061-vent-dc-qwe12.webp"
      ],
      "VENT-SNOW-1203": [
          "catalog-062-vent-snow-1203.webp"
      ]
  };

  const avitoProductRows = [
      [
          "Lr-Link Slimsas Low Profile SFF-8654 8i to SFF-8654 8i 100см",
          "LR-SLLP-100",
          57,
          "Кабель",
          "Новый",
          1900
      ],
      [
          "Б/У Lr-Link Slimsas Low Profile SFF-8654 8i to SFF-8654 8i 100см",
          "BY-LR-SLLP-100",
          115,
          "Кабель",
          "Б/У",
          1200
      ],
      [
          "Lr-Link Slimsas Low Profile SFF-8654 8i to SFF-8654 8i 80см",
          "LR-SLLP-80",
          38,
          "Кабель",
          "Новый",
          1900
      ],
      [
          "Lr-Link Slimsas Low Profile SFF-8654 8i to SFF-8654 8i 70см",
          "LR-SLLP-70",
          32,
          "Кабель",
          "Новый",
          1900
      ],
      [
          "Lr-Link Slimsas Low Profile SFF-8654 8i to SFF-8654 8i 60см",
          "LR-SLLP-60",
          8,
          "Кабель",
          "Новый",
          1900
      ],
      [
          "Б/У Lr-Link Slimsas SFF-8654 8i to SFF-8654 8i 100см",
          "BY-LR-SL-100",
          115,
          "Кабель",
          "Б/У",
          1200
      ],
      [
          "Б/У Lr-Link Slimsas SFF-8654 8i to SFF-8654 8i 80см",
          "BY-LR-SL-80",
          31,
          "Кабель",
          "Б/У",
          1200
      ],
      [
          "Lr-Link MCIO 8i gen5 to MCIO 8i gen5 80см",
          "LR-MC-80",
          101,
          "Кабель",
          "Новый",
          3500
      ],
      [
          "Lr-Link MCIO x8 74 Pin x SFF-8639 U.2 (molex) length:80 cm",
          "LR-MCU2-80",
          18,
          "Кабель",
          "Новый",
          3300
      ],
      [
          "Lr-Link Slimsas Low Profile 8i gen4 to U2 (sff-6639) 60см",
          "LR-SLU2-60",
          6,
          "Кабель",
          "Новый",
          2800
      ],
      [
          "LR-Link адаптер LRFNA921A GEN5",
          "LR-AD-MC-G5",
          37,
          "Адаптер",
          "Новый",
          4500
      ],
      [
          "10Gtek адаптер SA22N216P GEN5",
          "10GT-AD-MC-G5",
          14,
          "Адаптер",
          "Новый",
          4500
      ],
      [
          "LR-Link адаптер 4 port Slimsas LRFCF931",
          "LR-AD-4SL-G4",
          8,
          "Адаптер",
          "Новый",
          4500
      ],
      [
          "LR-Link адаптер LRFCF921 GEN4",
          "LR-AD-SL-G4",
          22,
          "Адаптер",
          "Новый",
          4500
      ],
      [
          "10Gtek Slimsas Low Profile SFF-8654 8i to SFF-8654 8i 100см",
          "10GT-SLLP-100",
          72,
          "Кабель",
          "Новый",
          1900
      ],
      [
          "Б/У 10Gtek Slimsas Low Profile SFF-8654 8i to SFF-8654 8i 100см",
          "BY-10GT-SLLP-100",
          28,
          "Кабель",
          "Б/У",
          1200
      ],
      [
          "Б/У 10Gtek Slimsas Low Profile SFF-8654 8i to SFF-8654 8i 80см",
          "BY-10GT-SLLP-80",
          23,
          "Кабель",
          "Б/У",
          1200
      ],
      [
          "Б/У 10Gtek Slimsas Low Profile SFF-8654 8i to SFF-8654 8i 70см",
          "BY-10GT-SLLP-70",
          8,
          "Кабель",
          "Б/У",
          1200
      ],
      [
          "Б/У 10Gtek Slimsas Low Profile SFF-8654 8i to SFF-8654 8i 60см",
          "BY-10GT-SLLP-60",
          8,
          "Кабель",
          "Б/У",
          1200
      ],
      [
          "Б/У 10Gtek Slimsas SFF-8654 8i to SFF-8654 8i 75см",
          "BY-10GT-SL-75",
          6,
          "Кабель",
          "Б/У",
          1200
      ],
      [
          "10Gtek Slimsas SFF-8654 8i to SFF-8654 8i 75см",
          "10GT-SL-75",
          16,
          "Кабель",
          "Новый",
          1900
      ],
      [
          "Б/У 10Gtek Slimsas SFF-8654 8i to SFF-8654 8i 70см",
          "BY-10GT-SL-70",
          1,
          "Кабель",
          "Б/У",
          1200
      ],
      [
          "10Gtek Slimsas SFF-8654 8i to SFF-8654 8i 70см",
          "10GT-SL-70",
          33,
          "Кабель",
          "Новый",
          1900
      ],
      [
          "10Gtek Slimsas SFF-8654 8i to SFF-8654 8i 60см",
          "10GT-SL-60",
          49,
          "Кабель",
          "Новый",
          1900
      ],
      [
          "10Gtek MCIO 8i gen5 to MCIO 8i gen5 80см",
          "10GT-MC-80",
          56,
          "Кабель",
          "Новый",
          3500
      ],
      [
          "10Gtek MCIO 8i gen5 to U2 (sff-6639) 80см",
          "10GT-MCU2-80",
          18,
          "Кабель",
          "Новый",
          3300
      ],
      [
          "прямой 100см",
          "RZ-100",
          12,
          "Райзер ГПУ",
          "Новый",
          10000
      ],
      [
          "прямой 60см",
          "RZ-60",
          12,
          "Райзер ГПУ",
          "Новый",
          5000
      ],
      [
          "прямой 40см",
          "RZ-40",
          12,
          "Райзер ГПУ",
          "Новый",
          4000
      ],
      [
          "Lr-Link PCIe 2 ports slimsas adapter (Бифуркатор) gen4",
          "BIF-SL-G4",
          27,
          "Бифуркатор",
          "Новый",
          5000
      ],
      [
          "Сетевая карта XL710-10G-4S-X8 10Gbe",
          "10GT-XL-10G-4S",
          6,
          "Сетевая карта",
          "Новый",
          10000
      ],
      [
          "Б/У Сетевая карта CX4121A 25GbE",
          "BY-MELL-CX-25G",
          16,
          "Сетевая карта",
          "Б/У",
          6000
      ],
      [
          "SSD crucial mx500 250gb",
          "SSD-CRUC-250GB",
          1,
          "SSD",
          "Новый",
          4300
      ],
      [
          "SSD 870 EVO 250Gb",
          "SSD-SAMS-250GB",
          2,
          "SSD",
          "Новый",
          4800
      ],
      [
          "SSD samsung 980 500gb",
          "SSD-SAMS-500GB",
          1,
          "SSD",
          "Новый",
          9000
      ],
      [
          "SSD msi spatium m480pro 4tb",
          "SSD-MSI-4TB",
          3,
          "SSD",
          "Новый",
          40000
      ],
      [
          "HDD seagate skyhawk ai 14tb",
          "HDD-SKY-14TB",
          1,
          "HDD",
          "Новый",
          23000
      ],
      [
          "Make It Green 10G-SR 850nm",
          "SFP-MIG-10G",
          15,
          "Трансивер",
          "Новый",
          1000
      ],
      [
          "FIBO 1.25G",
          "SFP-FIBO-1G",
          8,
          "Трансивер",
          "Новый",
          600
      ],
      [
          "Lr-Link LRXP0010-Y3ATR RJ45",
          "SFP-LR-RJ45",
          45,
          "Трансивер",
          "Новый",
          3800
      ],
      [
          "FIВО FТ-S10-RJ45(30m) 1/10GВАSЕ-Т SFР+ RJ45",
          "SFP-FIBO-RJ45",
          8,
          "Трансивер",
          "Новый",
          3800
      ],
      [
          "Lr-Link LRXP8510-X3ATL sfp+ 10G-SR 850nm 10G",
          "SFP-LR-10G",
          68,
          "Трансивер",
          "Новый",
          1000
      ],
      [
          "Cisco XFP-10GMM-SR 10G",
          "XFP-CISCO-10G",
          10,
          "Трансивер",
          "Новый",
          5000
      ],
      [
          "Lr-Link sfp28 25G-SR 850nm 25G T4",
          "SFP-LR-T4-25G",
          63,
          "Трансивер",
          "Новый",
          1500
      ],
      [
          "Lr-Link sfp28 25G-SR 850nm 25G T8",
          "SFP-LR-T8-25G",
          70,
          "Трансивер",
          "Новый",
          1500
      ],
      [
          "10Gtek sfp28 25G-SR 850nm 25G",
          "SFP-10GT-25G",
          73,
          "Трансивер",
          "Новый",
          1500
      ],
      [
          "Mikrotik qsfp 28 100G-SR4 850nm MMF 100G",
          "QSFP-MIKR-100G",
          4,
          "Трансивер",
          "Новый",
          4000
      ],
      [
          "Lr-Link qsfp 28 100G-SR4 850nm MMF 100G",
          "QSFP-LR-100G",
          20,
          "Трансивер",
          "Новый",
          4000
      ],
      [
          "MPO\\UPC FF MM, 12 волокон, OM4 100GBASE-SR4, 1 метр",
          "OPTI-100G-1M",
          20,
          "Оптический-патчкорд",
          "Новый",
          2000
      ],
      [
          "MPO\\UPC FF MM, 12 волокон, OM4 100GBASE-SR4, 2 метра",
          "OPTI-100G-2M",
          26,
          "Оптический-патчкорд",
          "Новый",
          2500
      ],
      [
          "MPO\\UPC FF MM, 12 волокон, OM4 100GBASE-SR4, 20 метров",
          "OPTI-100G-20M",
          9,
          "Оптический-патчкорд",
          "Новый",
          5000
      ],
      [
          "MPO\\UPC FF MM, 12 волокон, OM4 100GBASE-SR4, 30 метров",
          "OPTI-100G-100M",
          15,
          "Оптический-патчкорд",
          "Новый",
          7000
      ],
      [
          "Micro-hi (8-pin, ATX 12V)",
          "CON-MIC-HI",
          1000,
          "Коннектор",
          "Новый",
          80
      ],
      [
          "12vhpwr 600w for 5090",
          "CON-12-VH",
          1000,
          "Коннектор",
          "Новый",
          100
      ],
      [
          "YY15050M12B snowfan 4.1A",
          "VENT-SNOW-1505",
          80,
          "Вентилятор ГПУ",
          "Новый",
          2000
      ],
      [
          "RA15051HD1 RDK Cooler 1.8A",
          "VENT-RDK-150",
          7,
          "Вентилятор ГПУ",
          "Новый",
          1000
      ],
      [
          "YD12038B12VNM 2.7A",
          "VENT-YD-1203",
          9,
          "Вентилятор ГПУ",
          "Новый",
          700
      ],
      [
          "RA12038HD1 RDK Cooler 2.3A",
          "VENT-RDK-1203",
          59,
          "Вентилятор ГПУ",
          "Новый",
          700
      ],
      [
          "DC BRUSHLESS QWE12038NM 2.7A",
          "VENT-DC-QWE12",
          6,
          "Вентилятор ГПУ",
          "Новый",
          800
      ],
      [
          "YY12038L12B SnowFan 2.8A",
          "VENT-SNOW-1203",
          40,
          "Вентилятор ГПУ",
          "Новый",
          600
      ]
  ];

  const seedProducts = avitoProductRows.map((row, index) => createAvitoProduct(row, index));

  const categorySeo = {
    Все: "Сводный каталог комплектующих для серверов, сетевой инфраструктуры и ЦОД.",
    Адаптер: "PCIe, MCIO и SlimSAS адаптеры с фильтрацией по интерфейсу, поколению, разъему и состоянию.",
    Бифуркатор: "PCIe бифуркаторы и платы расширения для серверных сборок и NVMe/SAS-подключений.",
    "Вентилятор ГПУ": "Вентиляторы и кулеры для GPU и серверных систем охлаждения с фильтрами по току и производителю.",
    Кабель: "SlimSAS, MCIO, U.2 и прямые кабели с подбором по длине, интерфейсу, разъему и производителю.",
    Коннектор: "Силовые и сигнальные коннекторы для серверных комплектующих и GPU-подключений.",
    "Оптический-патчкорд": "MPO/UPC OM4 патч-корды для 100GBASE-SR4 с фильтрами по длине и совместимости.",
    "Райзер ГПУ": "GPU-райзеры и прямые кабели с подбором по длине и интерфейсу.",
    "Сетевая карта": "Серверные NIC и сетевые карты с фильтрами по скорости, интерфейсу и состоянию.",
    SSD: "SSD-накопители с фильтрами по емкости, интерфейсу, производителю и наличию.",
    HDD: "HDD-накопители для серверов, СХД и видеонаблюдения с фильтрами по емкости и интерфейсу.",
    Трансивер: "SFP, SFP+, SFP28, XFP и QSFP28 трансиверы с фильтрами по скорости и разъему.",
    Трансиверы: "SFP, SFP+, QSFP+ и QSFP28 модули с фильтрами по скорости, разъему и состоянию.",
    Кабели: "DAC, AOC, SAS, Ethernet и силовые кабели для серверных стоек, PDU и систем хранения.",
    "Оптические патч-корды": "Патч-корды OM4 и OS2 с разъемами LC, MPO и другими типами для кроссовых подключений.",
    Адаптеры: "Сетевые адаптеры, HBA и серверные платы расширения для Dell, HPE, Supermicro и других платформ.",
    Накопители: "SSD и HDD для серверов, рабочих станций, систем хранения и видеонаблюдения.",
    Охлаждение: "Вентиляторы, кулеры и комплектующие охлаждения для серверных шасси и ускорителей.",
  };

  const filterDefinitions = {
    type: { key: "type", label: "Тип товара" },
    brand: { key: "brand", label: "Производитель" },
    length: { key: "length", label: "Длина" },
    capacity: { key: "capacity", label: "Емкость" },
    interface: { key: "interface", label: "Интерфейс" },
    speed: { key: "speed", label: "Скорость" },
    connector: { key: "connector", label: "Тип разъема" },
    compatibility: { key: "compatibility", label: "Совместимость" },
    condition: { key: "condition", label: "Состояние" },
  };

  const categoryFilterKeys = {
    Все: [],
    Адаптер: ["brand", "interface", "connector", "condition"],
    Бифуркатор: ["brand", "interface", "connector", "condition"],
    "Вентилятор ГПУ": ["brand", "speed", "connector", "compatibility", "condition"],
    Кабель: ["brand", "length", "interface", "speed", "condition"],
    Коннектор: ["connector", "condition"],
    "Оптический-патчкорд": ["length", "connector", "speed", "compatibility", "condition"],
    "Райзер ГПУ": ["brand", "length", "interface", "connector", "condition"],
    "Сетевая карта": ["brand", "interface", "speed", "connector", "condition"],
    SSD: ["brand", "capacity", "interface", "condition"],
    HDD: ["brand", "capacity", "interface", "condition"],
    Трансивер: ["brand", "speed", "interface", "connector", "condition"],
    Кабели: ["brand", "length", "interface", "speed", "condition"],
    Адаптеры: ["brand", "interface", "connector", "condition"],
    Накопители: ["brand", "capacity", "interface", "condition"],
    "Оптические патч-корды": ["length", "connector", "speed", "compatibility", "condition"],
    Охлаждение: ["brand", "speed", "connector", "compatibility", "condition"],
    Трансиверы: ["brand", "speed", "interface", "connector", "condition"],
  };

  const filterConfig = Object.values(filterDefinitions);

  const orderStatuses = [
    "Новая",
    "В обработке",
    "Ожидает оплаты",
    "Оплачена",
    "Отгружена",
    "Завершена",
    "Отменена",
  ];

  const roleLabels = {
    user: "Пользователь",
    manager: "Менеджер",
    admin: "Администратор",
  };

  const approvalLabels = {
    pending: "Ожидает проверки",
    confirmed: "Подтвержден",
    clarification: "Запрошено уточнение",
    rejected: "Отклонен",
  };

  const state = {
    category: "Все",
    search: "",
    sort: "relevance",
    page: 1,
    pageSize: 9,
    priceMin: "",
    priceMax: "",
    filters: Object.fromEntries(filterConfig.map((item) => [item.key, new Set()])),
    leadContext: { type: "quote", productId: null, items: [] },
    csvPreview: [],
    accountMode: "login",
    pendingCode: "",
    pendingAuth: null,
    adminUserSearch: "",
  };

  let products = hydrateProducts(loadJSON(STORAGE.products, null));
  let favorites = new Set(loadJSON(STORAGE.favorites, []));
  if ([...favorites].some((id) => retiredProductIds.has(id))) {
    favorites = new Set([...favorites].filter((id) => !retiredProductIds.has(id)));
    saveJSON(STORAGE.favorites, [...favorites]);
  }
  let orders = hydrateOrders(loadJSON(STORAGE.orders, []));
  let profile = loadJSON(STORAGE.profile, null);
  let users = hydrateUsers(loadJSON(STORAGE.users, null), profile);
  let session = loadJSON(STORAGE.session, null);
  profile = sessionUser() || profile;
  let cart = loadCartForUser(profile);
  let managerAccess = loadJSON(STORAGE.managerAccess, false) === true;
  let consentTextCache = "";
  const serverMode = true;
  let serverReady;
  let serverAccountReady = false;
  let serverAccountError = "";
  let orderRefreshBusy = false;
  if (!profile && managerAccess) {
    managerAccess = false;
    saveJSON(STORAGE.managerAccess, managerAccess);
  }

  const $ = (selector) => document.querySelector(selector);
  const refs = {
    categoryTabs: $("#categoryTabs"),
    accountButton: $("#accountButton"),
    breadcrumbs: $("#breadcrumbs"),
    categorySeo: $("#categorySeo"),
    catalogSearch: $("#catalogSearch"),
    heroSearch: $("#heroSearch"),
    sortSelect: $("#sortSelect"),
    priceMin: $("#priceMin"),
    priceMax: $("#priceMax"),
    priceRangeNote: $("#priceRangeNote"),
    facetFilters: $("#facetFilters"),
    activeFilterCount: $("#activeFilterCount"),
    selectedFilters: $("#selectedFilters"),
    resultCount: $("#resultCount"),
    productGrid: $("#productGrid"),
    emptyState: $("#emptyState"),
    pagination: $("#pagination"),
    cartCount: $("#cartCount"),
    favoritesCount: $("#favoritesCount"),
    accountLabel: $("#accountLabel"),
    mobileFavoritesCount: $("#mobileFavoritesCount"),
    cartDialog: $("#cartDialog"),
    cartBody: $("#cartBody"),
    productDialog: $("#productDialog"),
    productDialogTitle: $("#productDialogTitle"),
    productDialogBody: $("#productDialogBody"),
    productBreadcrumb: $("#productBreadcrumb"),
    productImageDialog: $("#productImageDialog"),
    productImagePreview: $("#productImagePreview"),
    productImageCaption: $("#productImageCaption"),
    leadDialog: $("#leadDialog"),
    leadForm: $("#leadForm"),
    leadTitle: $("#leadTitle"),
    leadEyebrow: $("#leadEyebrow"),
    leadProductSummary: $("#leadProductSummary"),
    leadNextSteps: $("#leadNextSteps"),
    accountDialog: $("#accountDialog"),
    accountBody: $("#accountBody"),
    adminSection: $("#admin"),
    adminNavLink: $("#adminNavLink"),
    mobileAdminNavLink: $("#mobileAdminNavLink"),
    mobileMenuButton: $("#mobileMenuButton"),
    mobileMenuPanel: $("#mobileMenuPanel"),
    mobileAccountButton: $("#mobileAccountButton"),
    mobileFavoritesButton: $("#mobileFavoritesButton"),
    personalDataConsentButton: $("#personalDataConsentButton"),
    consentDialog: $("#consentDialog"),
    consentDialogText: $("#consentDialogText"),
    consentTemplate: $("#personalDataConsentTemplate"),
    toast: $("#toast"),
    csvText: $("#csvText"),
    csvFile: $("#csvFile"),
    adminPreview: $("#adminPreview"),
    adminOps: $("#adminOps"),
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

  function normalizeCartItems(items) {
    if (!Array.isArray(items)) return [];
    return items
      .map((item) => ({
        id: String(item?.id || "").trim(),
        qty: Math.max(1, Number(item?.qty) || 1),
      }))
      .filter((item) => item.id && !retiredProductIds.has(item.id));
  }

  function cartStorageKey(user = profile) {
    return user?.id ? `${STORAGE.cart}.${user.id}` : STORAGE.cart;
  }

  function mergeCartItems(baseItems, incomingItems) {
    const merged = new Map();
    for (const item of [...normalizeCartItems(baseItems), ...normalizeCartItems(incomingItems)]) {
      merged.set(item.id, (merged.get(item.id) || 0) + item.qty);
    }
    return [...merged.entries()].map(([id, qty]) => ({ id, qty }));
  }

  function loadCartForUser(user = profile) {
    if (!user?.id) return normalizeCartItems(loadJSON(STORAGE.cart, []));

    const userKey = cartStorageKey(user);
    const savedUserCart = normalizeCartItems(loadJSON(userKey, []));
    const legacyCart = normalizeCartItems(loadJSON(STORAGE.cart, []));
    if (!savedUserCart.length && legacyCart.length) {
      saveJSON(userKey, legacyCart);
      saveJSON(STORAGE.cart, []);
      return legacyCart;
    }
    return savedUserCart;
  }

  function saveCart() {
    saveJSON(cartStorageKey(profile), normalizeCartItems(cart));
  }

  function attachCartToUser(user) {
    const guestCart = normalizeCartItems(cart);
    const userCart = normalizeCartItems(loadJSON(cartStorageKey(user), []));
    cart = mergeCartItems(userCart, guestCart);
    saveJSON(cartStorageKey(user), cart);
    if (guestCart.length) saveJSON(STORAGE.cart, []);
  }

  function saveUsers() {
    saveJSON(STORAGE.users, users);
  }

  function splitLines(value) {
    if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
    return String(value || "")
      .split(/\r?\n|;/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function normalizeConsentDetails(value, fallbackAt = "", fallbackSource = "legacy") {
    if (value && typeof value === "object") {
      const accepted = value.accepted !== false;
      return {
        accepted,
        acceptedAt: value.acceptedAt || fallbackAt || (accepted ? new Date().toISOString() : ""),
        policyVersion: value.policyVersion || PRIVACY_POLICY_VERSION,
        source: value.source || fallbackSource,
      };
    }

    if (value === true) {
      return {
        accepted: true,
        acceptedAt: fallbackAt || new Date().toISOString(),
        policyVersion: PRIVACY_POLICY_VERSION,
        source: fallbackSource,
      };
    }

    return {
      accepted: false,
      acceptedAt: "",
      policyVersion: PRIVACY_POLICY_VERSION,
      source: fallbackSource,
    };
  }

  function consentFromForm(form, existingDetails = null, source = "form") {
    const checked = form?.elements?.consent?.checked === true;
    const normalizedExisting = normalizeConsentDetails(existingDetails, "", source);
    if (!checked) return normalizeConsentDetails(false, "", source);

    if (normalizedExisting.accepted && normalizedExisting.policyVersion === PRIVACY_POLICY_VERSION) {
      return {
        ...normalizedExisting,
        source: normalizedExisting.source || source,
      };
    }

    return {
      accepted: true,
      acceptedAt: new Date().toISOString(),
      policyVersion: PRIVACY_POLICY_VERSION,
      source,
    };
  }

  function approvalForClientType(clientType, currentApproval = "") {
    if (clientType === "person") return "confirmed";
    if (currentApproval === "confirmed") return "confirmed";
    if (["pending", "clarification", "rejected"].includes(currentApproval)) return currentApproval;
    return "pending";
  }

  function hydrateUsers(savedUsers, savedProfile) {
    const list = Array.isArray(savedUsers) ? savedUsers.map(normalizeUserRecord) : [];
    if (savedProfile && !list.some((user) => sameCustomer(user, savedProfile))) {
      list.unshift(normalizeUserRecord({
        ...savedProfile,
        role: loadJSON(STORAGE.managerAccess, false) === true ? "manager" : "user",
        approval: (savedProfile.clientType || (savedProfile.inn ? "legal" : "person")) === "legal" ? "pending" : "confirmed",
      }));
    }
    if (!list.length) {
      list.push(
        normalizeUserRecord({
          name: "Демо клиент",
          phone: "+7 (343) 000-00-00",
          email: "client@beliy-veter.local",
          clientType: "legal",
          company: "ООО Тестовая закупка",
          inn: "6623147210",
          kpp: "662301001",
          requisites: "ИНН 6623147210, КПП 662301001",
          addresses: ["Нижний Тагил, ПВЗ СДЕК"],
          consent: true,
          role: "user",
          approval: "pending",
        })
      );
    }
    if (!list.some((user) => user.role === "admin")) {
      list.unshift(normalizeUserRecord({
        name: "Администратор Белый Ветер",
        phone: "+7 (343) 000-00-00",
        email: "admin@beliy-veter.local",
        password: "beliy-veter",
        clientType: "legal",
        company: "Белый Ветер",
        inn: "6623147210",
        kpp: "662301001",
        requisites: "ИНН 6623147210, КПП 662301001",
        addresses: ["Нижний Тагил"],
        consent: true,
        role: "admin",
        approval: "confirmed",
        manager: "Администратор",
      }));
    }
    saveJSON(STORAGE.users, list);
    return list;
  }

  function migrateBrandName(value) {
    const legacyBrand = ["Spec", "Server"].join("");
    const legacyDescriptor = ["Compon", "ents"].join("");
    const legacyFullBrand = `${legacyBrand} ${legacyDescriptor}`;
    return String(value || "")
      .replaceAll(legacyFullBrand, "Белый Ветер")
      .replaceAll(legacyBrand, "Белый Ветер")
      .trim();
  }

  function normalizeUserRecord(user = {}) {
    const contact = user.email || user.phone || `user-${Date.now()}-${Math.random()}`;
    const clientType = user.clientType || (user.inn ? "legal" : "person");
    const addresses = splitLines(user.addresses);
    const consentDetails = normalizeConsentDetails(
      user.consentDetails || user.consent,
      user.createdAt || user.updatedAt,
      "account"
    );
    const company = migrateBrandName(user.company);
    return {
      id: user.id || `user-${slugify(contact) || Date.now()}`,
      clientType,
      name: migrateBrandName(user.name),
      phone: String(user.phone || "").trim(),
      email: String(user.email || "").trim(),
      password: String(user.password || "").trim(),
      company: clientType === "person" && company === "Физлицо" ? "" : company,
      inn: String(user.inn || "").trim(),
      kpp: String(user.kpp || "").trim(),
      requisites: String(user.requisites || "").trim(),
      addresses,
      consent: consentDetails.accepted,
      consentDetails,
      role: ["user", "manager", "admin"].includes(user.role) ? user.role : "user",
      approval: approvalForClientType(clientType, user.approval),
      manager: migrateBrandName(user.manager),
      blocked: user.blocked === true,
      notifications: {
        email: user.notifications?.email !== false,
        telegram: user.notifications?.telegram !== false,
        phone: user.notifications?.phone === true,
        stock: user.notifications?.stock !== false,
        price: user.notifications?.price !== false,
      },
      createdAt: user.createdAt || new Date().toISOString(),
      updatedAt: user.updatedAt || new Date().toISOString(),
    };
  }

  function hydrateOrders(savedOrders) {
    if (!Array.isArray(savedOrders)) return [];
    return savedOrders.map((order) => ({
      ...order,
      ...orderAmounts(order.items || []),
      status: orderStatuses.includes(order.status) ? order.status : normalizeOrderStatus(order.status),
      delivery: order.delivery || "",
      attachmentName: order.attachmentName || "",
      manager: order.manager || "",
      teamNote: order.teamNote || "",
      comments: Array.isArray(order.comments) ? order.comments : [],
    }));
  }

  function normalizeOrderStatus(status) {
    const value = normalize(status);
    if (value.includes("отгруж")) return "Отгружена";
    if (value.includes("оплачен")) return "Оплачена";
    if (value.includes("ожидает оплат")) return "Ожидает оплаты";
    if (value.includes("обработ")) return "В обработке";
    if (value.includes("отмен")) return "Отменена";
    if (value.includes("заверш")) return "Завершена";
    return "Новая";
  }

  function sessionUser() {
    if (!session?.userId) return null;
    const user = users.find((item) => item.id === session.userId && !item.blocked);
    return user || null;
  }

  function loginUser(user) {
    const normalized = normalizeUserRecord({ ...user, updatedAt: new Date().toISOString() });
    const index = users.findIndex((item) => item.id === normalized.id);
    if (index >= 0) users[index] = normalized;
    else users.unshift(normalized);
    saveUsers();
    session = { userId: normalized.id, startedAt: new Date().toISOString() };
    saveJSON(STORAGE.session, session);
    profile = normalized;
    saveJSON(STORAGE.profile, profile);
    attachCartToUser(normalized);
    managerAccess = ["manager", "admin"].includes(normalized.role);
    saveJSON(STORAGE.managerAccess, managerAccess);
    renderManagerAccess();
    return normalized;
  }

  function logoutUser() {
    saveCart();
    session = null;
    profile = null;
    cart = loadCartForUser(null);
    managerAccess = false;
    saveJSON(STORAGE.session, session);
    saveJSON(STORAGE.profile, profile);
    saveJSON(STORAGE.managerAccess, managerAccess);
    renderManagerAccess();
  }

  function updateActiveUser(patch) {
    const current = profile || {};
    const clientType = patch.clientType || current.clientType || "person";
    const updated = normalizeUserRecord({
      ...current,
      ...patch,
      id: current.id,
      role: current.role || "user",
      approval: approvalForClientType(clientType, current.approval),
      updatedAt: new Date().toISOString(),
    });
    const index = users.findIndex((user) => user.id === updated.id);
    if (index >= 0) users[index] = updated;
    else users.unshift(updated);
    saveUsers();
    profile = updated;
    saveJSON(STORAGE.profile, profile);
    return updated;
  }

  function sameCustomer(a = {}, b = {}) {
    const emailA = normalize(a.email);
    const emailB = normalize(b.email);
    const phoneA = normalizePhone(a.phone);
    const phoneB = normalizePhone(b.phone);
    const innA = normalize(a.inn);
    const innB = normalize(b.inn);
    return Boolean((emailA && emailA === emailB) || (phoneA && phoneA === phoneB) || (innA && innA === innB));
  }

  function normalizePhone(value) {
    const phone = String(value || "").trim();
    if (!/^\+?[\d\s().-]+$/.test(phone)) return "";
    const digits = phone.replace(/\D/g, "");
    if (!phone.startsWith("+")) {
      if (/^8\d{10}$/.test(digits)) return `7${digits.slice(1)}`;
      if (/^\d{10}$/.test(digits)) return `7${digits}`;
    }
    return digits;
  }

  async function apiRequest(path, body) {
    const response = await fetch(path, {
      method: body === undefined ? "GET" : "POST",
      credentials: "same-origin", cache: "no-store",
      headers: { "content-type": "application/json", "X-Site-Request": "1" },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(20000),
    });
    const result = await response.json();
    if (!response.ok || !result.ok) throw new Error(result.message || "Сервер временно недоступен.");
    return result;
  }

  function applyServerUser(user) {
    profile = user ? normalizeUserRecord(user) : null;
    users = profile ? [profile] : [];
    session = profile ? { userId: profile.id } : null;
    managerAccess = false;
    saveJSON(STORAGE.profile, profile);
    saveJSON(STORAGE.session, session);
    saveJSON(STORAGE.managerAccess, false);
    cart = loadCartForUser(profile);
  }

  async function initializeServer() {
    try {
      const result = await apiRequest("/api/session");
      const archiveKey = "vmz.legacy-before-server-orders.v1";
      if (!localStorage.getItem(archiveKey)) {
        saveJSON(archiveKey, { orders, users: users.map(({ password, ...user }) => user) });
      }
      applyServerUser(result.user);
      products = (await apiRequest("/api/catalog")).items.map((product) => ({
        ...product,
        description: product.descriptionMode === "custom" ? product.description : buildClientProductDescription({ stockQty: product.stockQty, price: product.price, compatibility: product.compatibility || [] }),
        specs: { ...product.specs, "Цена с НДС": product.price === null ? "По запросу" : formatPrice(product.price) },
      }));
      orders = (await apiRequest("/api/orders")).orders;
      serverAccountReady = true;
      serverAccountError = "";
      renderAll();
      if (refs.accountDialog.open) renderAccount();
    } catch {
      serverAccountError = "Не удалось подключиться к кабинету. Обновите страницу и попробуйте снова.";
      if (refs.accountDialog.open) renderAccount();
    }
  }

  async function refreshServerOrders() {
    if (!serverAccountReady || orderRefreshBusy) return;
    orderRefreshBusy = true;
    const userId = profile?.id;
    try {
      const result = await apiRequest("/api/orders");
      if (userId !== profile?.id) return;
      const changed = JSON.stringify(orders) !== JSON.stringify(result.orders);
      orders = result.orders;
      const note = refs.accountBody.querySelector("[data-order-sync]");
      if (note) note.textContent = "Статусы обновлены";
      if (changed && refs.accountDialog.open && state.accountMode === "orders") {
        const expanded = [...refs.accountBody.querySelectorAll("[data-order-id] details[open]")].map((node) => node.closest("[data-order-id]").dataset.orderId);
        renderAccount();
        for (const id of expanded) {
          const details = refs.accountBody.querySelector(`[data-order-id="${escapeAttr(id)}"] details`);
          if (details) details.open = true;
        }
      }
    } catch {
      const note = refs.accountBody.querySelector("[data-order-sync]");
      if (note) note.textContent = "Не удалось обновить статусы. Повторяем подключение…";
    } finally {
      orderRefreshBusy = false;
    }
  }

  async function serverAuthSubmit(form) {
    const button = form.querySelector('button[type="submit"]');
    setSubmitState(button, true);
    try {
      await serverReady;
      if (!serverAccountReady) throw new Error(serverAccountError);
      const data = new FormData(form);
      const register = form.dataset.authMode === "register";
      const values = register
        ? { ...collectCustomer(form), password: String(data.get("password") || "") }
        : { login: String(data.get("login") || ""), password: String(data.get("password") || "") };
      const result = await apiRequest(register ? "/api/auth/register" : "/api/auth/login", values);
      applyServerUser(result.user);
      orders = (await apiRequest("/api/orders")).orders;
      state.accountMode = "profile";
      state.pendingAuth = null;
      renderAll();
      renderAccount();
      showToast("Вы вошли в кабинет");
    } catch (error) {
      showFormStatus(form, "error", error.message || "Не удалось войти.");
    } finally {
      setSubmitState(button, false);
    }
  }

  function findUserByLogin(login) {
    const value = normalize(login);
    if (!value) return undefined;
    if (value.includes("@")) {
      return users.find((user) => normalize(user.email) === value);
    }
    const phone = normalizePhone(login);
    if (!phone) return undefined;
    return users.find((user) => normalizePhone(user.phone) === phone);
  }

  function generateCode() {
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  function hydrateProducts(savedProducts) {
    if (!Array.isArray(savedProducts) || savedProducts.length === 0) {
      localStorage.setItem(STORAGE.seedVersion, CATALOG_SEED_VERSION);
      return structuredClone(seedProducts);
    }

    const migratedProducts = savedProducts
      .filter((product) => !retiredProductIds.has(product.id))
      .map(migrateVisibleBranding);
    let changed = JSON.stringify(migratedProducts) !== JSON.stringify(savedProducts);
    if (localStorage.getItem(STORAGE.seedVersion) === CATALOG_SEED_VERSION) {
      if (changed) saveJSON(STORAGE.products, migratedProducts);
      return migratedProducts;
    }

    const hydrated = structuredClone(seedProducts);
    saveJSON(STORAGE.products, hydrated);
    localStorage.setItem(STORAGE.seedVersion, CATALOG_SEED_VERSION);
    return hydrated;
  }

  function createRequestedProduct(rawName, index) {
    const name = rawName.replace(/\s+/g, " ").trim();
    const lower = normalize(name);
    const sku = `SSC-${String(index + 1).padStart(3, "0")}`;
    const category = inferCategory(lower);
    const brand = inferBrand(lower);
    const type = inferType(lower, category);
    const interfaceValue = inferInterface(lower, category);
    const speed = inferSpeed(lower, category);
    const sizeValue = inferLength(lower, category);
    const length = category === "Накопители" ? "" : sizeValue;
    const capacity = category === "Накопители" ? sizeValue : "";
    const connector = inferConnector(lower, category);
    const condition = lower.startsWith("б/у") ? "Б/У" : "Новый";
    const photo = imageForSku(sku) || imageForRequestedProduct(lower);

    return {
      id: `vmz-added-${String(index + 1).padStart(3, "0")}`,
      category,
      name,
      sku,
      brand,
      type,
      interface: interfaceValue,
      speed,
      length,
      capacity,
      connector,
      compatibility: inferCompatibility(category, lower),
      condition,
      stock: "Под заказ / уточнить наличие",
      price: null,
      vat: true,
      status: "request",
      thumbPosition: photo.position || thumbPositionForCategory(category),
      ...(photo.src ? { image: photo.src, imagePosition: photo.position } : {}),
      ...(photo.gallery ? { images: photo.gallery } : {}),
      description: buildClientProductDescription({
        stockQty: null,
        price: null,
        compatibility: inferCompatibility(category, lower),
      }),
      specs: {
        Производитель: brand,
        Тип: type,
        Интерфейс: interfaceValue,
        ...(speed ? { Скорость: speed } : {}),
        ...(length ? { Длина: length } : {}),
        ...(capacity ? { Емкость: capacity } : {}),
        Разъем: connector,
      },
    };
  }

  function createAvitoProduct(row, index) {
    const [rawName, rawSku, rawStock, rawCategory, rawType, rawPrice] = row;
    const name = String(rawName || `Товар ${index + 1}`).replace(/\s+/g, " ").trim();
    const sku = String(rawSku || `AVITO-${String(index + 1).padStart(3, "0")}`).trim();
    const category = String(rawCategory || "Кабель").trim();
    const excelType = String(rawType || (normalize(name).startsWith("б/у") ? "Б/У" : "Новый")).trim();
    const groupCategory = avitoCategoryGroup(category);
    const lower = normalize(name);
    const lookupLower = normalize(`${name} ${sku}`);
    const brand = inferBrand(lower);
    const type = inferAvitoProductType(lower, category);
    const interfaceValue = inferInterface(lower, groupCategory);
    const speed = inferSpeed(lower, groupCategory);
    const sizeValue = inferLength(lower, groupCategory);
    const isDrive = groupCategory === "Накопители";
    const length = isDrive ? "" : sizeValue;
    const capacity = isDrive ? sizeValue : "";
    const connector = inferConnector(lower, groupCategory);
    const compatibility = inferCompatibility(groupCategory, lower);
    const stockQty = Number(rawStock);
    const priceSource = String(rawPrice ?? "").replace(/\s/g, "").replace(",", ".");
    const price = Number(priceSource);
    const numericPrice = priceSource !== "" && Number.isFinite(price) ? price : null;
    const photo = imageForSku(sku) || imageForRequestedProduct(lookupLower);

    return {
      id: `avito-${slugifyId(sku || name, index)}`,
      category,
      name,
      sku,
      brand,
      type,
      interface: interfaceValue,
      speed,
      length,
      capacity,
      connector,
      compatibility,
      condition: excelType,
      stock: Number.isFinite(stockQty) && stockQty > 0 ? `В наличии: ${stockQty} шт.` : "Нет в наличии",
      price: numericPrice,
      vat: true,
      status: numericPrice !== null && Number.isFinite(stockQty) && stockQty > 0 ? "cart" : "request",
      thumbPosition: photo.position || thumbPositionForCategory(groupCategory),
      ...(photo.src ? { image: photo.src, imagePosition: photo.position } : {}),
      ...(photo.gallery ? { images: photo.gallery } : {}),
      priceBadge: "+22%",
      description: buildClientProductDescription({ stockQty, price: numericPrice, compatibility }),
      specs: {
        "Категория": category,
        "Состояние товара": excelType,
        "Цена с НДС": numericPrice === null ? "По запросу" : formatPrice(numericPrice),
        Гарантия: "1 год",
        "Срок подтверждения": "перед выставлением счета",
        Производитель: brand,
        Тип: type,
        Интерфейс: interfaceValue,
        ...(speed ? { Скорость: speed } : {}),
        ...(length ? { Длина: length } : {}),
        ...(capacity ? { Емкость: capacity } : {}),
        Разъем: connector,
      },
    };
  }

  function buildClientProductDescription({ stockQty, price, compatibility }) {
    const hasStock = Number.isFinite(stockQty) && stockQty > 0;
    const stockText = hasStock ? "В наличии." : "Наличие уточняется по запросу.";
    const hasPrice = price !== null && price !== "" && Number.isFinite(Number(price));
    const priceText = hasPrice ? "Цена указана с НДС." : "Цена по запросу.";
    const compatibilityText = Array.isArray(compatibility) && compatibility.length
      ? `Совместимость: ${compatibility.slice(0, 3).join(", ")}.`
      : "Совместимость проверяется по серверу или партномеру.";

    return `${stockText} ${priceText} Срок отгрузки подтверждается менеджером перед счетом. Гарантия 1 год. ${compatibilityText}`;
  }

  function avitoCategoryGroup(category) {
    const value = normalize(category);
    if (value === "ssd" || value === "hdd") return "Накопители";
    if (value.includes("трансивер")) return "Трансиверы";
    if (value.includes("оптический")) return "Оптические патч-корды";
    if (value.includes("вентилятор")) return "Охлаждение";
    if (value.includes("адаптер") || value.includes("сетевая карта") || value.includes("бифуркатор")) return "Адаптеры";
    return "Кабели";
  }

  function inferAvitoProductType(lower, category) {
    const value = normalize(category);
    if (value === "ssd") return "SSD";
    if (value === "hdd") return "HDD";
    if (value.includes("сетевая карта")) return "NIC";
    if (value.includes("бифуркатор")) return "PCIe бифуркатор";
    if (value.includes("вентилятор")) return lower.includes("cooler") ? "Кулер" : "Вентилятор";
    if (value.includes("коннектор")) return "Коннектор";
    if (value.includes("райзер")) return "Райзер";
    return inferType(lower, avitoCategoryGroup(category));
  }

  function slugifyId(value, index) {
    const slug = normalize(value)
      .replace(/[^a-z0-9а-я]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return slug || String(index + 1).padStart(3, "0");
  }

  function imageForRequestedProduct(lower) {
    if (/cisco.*xfp|xfp.*cisco|xfp-?10gmm-?sr|xfp-cisco-10g/.test(lower)) return productGallery("cisco-xfp-10g", 4, "webp");
    if (/ssd crucial mx500 250gb/.test(lower)) return productPhoto("crucial-mx500-250gb.webp");
    if (/ssd crucial mx500 1tb/.test(lower)) return productPhoto("crucial-mx500-box.webp");
    if (/ssd 870 evo 250gb/.test(lower)) return productPhoto("samsung-870-evo-250gb.webp");
    if (/ssd samsung 980 500gb/.test(lower)) return productPhoto("samsung-980-500gb.webp");
    if (/ssd msi spatium m480pro 4tb/.test(lower)) return productPhoto("msi-spatium-m480pro-4tb.webp");
    if (/ssd kingston fury 4tb/.test(lower)) return productPhoto("kingston-fury-4tb.webp");
    if (/hdd seagate skyhawk ai 14tb/.test(lower)) return productPhoto("seagate-skyhawk-ai-14tb.webp");
    if (/12vhpwr/.test(lower)) return productPhoto("12vhpwr-600w-5090.webp");
    if (/lr-slu2-60|8i gen4 to u2|sff-6639/.test(lower)) return productPhoto("0.6 lr-link u2.webp");
    if (/4 port slimsas|pcie 2 ports slimsas adapter|lrfcf931/.test(lower)) {
      return productPhoto("slimsas-adapter-front.webp");
    }
    if (/lrfna921a|sa22n216p|lrfcf921/.test(lower)) return productPhoto("slimsas-adapter-back.webp");
    return {};
  }

  function imageForSku(sku) {
    const files = productImageMap[sku];
    if (!files?.length) return null;
    const gallery = files.map((file) => `${productImagePath}${file}`);
    return {
      src: gallery[0],
      position: "center",
      ...(gallery.length > 1 ? { gallery } : {}),
    };
  }

  function productGallery(slug, count, extension = "jpg", position = "center") {
    const gallery = Array.from({ length: count }, (_, index) => `${productImagePath}${slug}-${index + 1}.${extension}`);
    return {
      src: gallery[0],
      position,
      gallery,
    };
  }

  function productPhoto(fileName, position = "center") {
    return {
      src: `${productImagePath}${fileName}`,
      position,
    };
  }

  function migrateVisibleBranding(product) {
    const next = { ...product };
    if (next.brand === "VMZ" || next.brand === ["Spec", "Server"].join("")) next.brand = "Белый Ветер";
    if (typeof next.sku === "string") {
      next.sku = next.sku.replaceAll("-VMZ", "-SPEC").replace(/^VMZ-/, "SSC-");
    }
    const photo = imageForSku(next.sku);
    if (photo?.src) {
      next.image = photo.src;
      next.imagePosition = photo.position;
      if (photo.gallery) {
        next.images = photo.gallery;
      } else {
        delete next.images;
      }
    }
    return next;
  }

  function inferCategory(lower) {
    if (/\b(ssd|hdd)\b/.test(lower)) return "Накопители";
    if (/snowfan|cooler|brushless|yy\d|ra\d|yd\d|qwe12038/.test(lower)) return "Охлаждение";
    if (/mpo\\?upc|12 волокон|om4 100gbase-sr4/.test(lower)) return "Оптические патч-корды";
    if (/сетевая карта|адаптер|adapter|бифуркатор|xl710|cx4121a/.test(lower)) return "Адаптеры";
    if (/sfp|qsfp|xfp|10g-sr|100g-sr4|1\.25g|1\/10g|850nm|rj45/.test(lower)) return "Трансиверы";
    return "Кабели";
  }

  function inferBrand(lower) {
    if (/10gtek|10gt/.test(lower)) return "10Gtek";
    if (/lr-link|lr link|lrfcf|lrfna|lrxp|lrxp/.test(lower)) return "LR-Link";
    if (/lr-link|lr link/.test(lower)) return "LR-Link";
    if (/cisco/.test(lower)) return "Cisco";
    if (/mikrotik/.test(lower)) return "MikroTik";
    if (/mellanox|mell|cx4121a/.test(lower)) return "Mellanox";
    if (/intel|xl710/.test(lower)) return "Intel";
    if (/make it green/.test(lower)) return "Make It Green";
    if (/fibo|fiво/.test(lower)) return "FIBO";
    if (/crucial/.test(lower)) return "Crucial";
    if (/samsung|870 evo/.test(lower)) return "Samsung";
    if (/msi/.test(lower)) return "MSI";
    if (/kingston/.test(lower)) return "Kingston";
    if (/seagate/.test(lower)) return "Seagate";
    if (/snowfan/.test(lower)) return "SnowFan";
    if (/rdk/.test(lower)) return "RDK";
    if (/oem/.test(lower)) return "OEM";
    return "OEM";
  }

  function inferType(lower, category) {
    if (category === "Накопители") return lower.includes("hdd") ? "HDD" : "SSD";
    if (category === "Охлаждение") return /cooler/.test(lower) ? "Кулер" : "Вентилятор";
    if (category === "Оптические патч-корды") return "MPO патч-корд";
    if (/сетевая карта|xl710|cx4121a/.test(lower)) return "NIC";
    if (/бифуркатор/.test(lower)) return "PCIe бифуркатор";
    if (/адаптер|adapter/.test(lower)) return "PCIe адаптер";
    if (/qsfp\s*28|qsfp28/.test(lower)) return "QSFP28";
    if (/xfp/.test(lower)) return "XFP";
    if (/sfp28/.test(lower)) return "SFP28";
    if (/sfp\+|sfp|10g-sr|1\/10g|1\.25g/.test(lower)) return "SFP/SFP+";
    if (/12vhpwr|micro-hi|atx/.test(lower)) return "Кабель питания";
    if (/mcio/.test(lower)) return "MCIO кабель";
    if (/slimsas|sff-8654|sff-8639|u\.?2|sff-6639/.test(lower)) {
      return hasExplicitU2(lower) ? "SlimSAS/U.2 кабель" : "SlimSAS кабель";
    }
    if (/прямой/.test(lower)) return "Прямой кабель";
    return "Серверные комплектующие";
  }

  function inferInterface(lower, category) {
    if (category === "Накопители") {
      if (/mx500|870 evo/.test(lower)) return "SATA 2.5";
      if (/skyhawk/.test(lower)) return "SATA 3.5";
      return "M.2 NVMe";
    }
    if (category === "Охлаждение") return "DC/PWM";
    if (/sff-8654/.test(lower)) return "SFF-8654 8i";
    if (hasExplicitU2(lower) && /sff-8639|u\.?2|sff-6639/.test(lower)) return "U.2 / SFF";
    if (/sff-8639/.test(lower)) return "SFF-8639";
    if (/sff-6639/.test(lower)) return "SFF-6639";
    if (/mcio/.test(lower)) return "MCIO";
    if (/mpo/.test(lower)) return "MPO";
    if (/rj45/.test(lower)) return "RJ45";
    if (/qsfp\s*28|qsfp28/.test(lower)) return "QSFP28";
    if (/sfp28/.test(lower)) return "SFP28";
    if (/xfp/.test(lower)) return "XFP";
    if (/sfp/.test(lower)) return "SFP/SFP+";
    if (/pcie|gen4|gen5/.test(lower)) return "PCIe";
    if (/12vhpwr|micro-hi|atx/.test(lower)) return "ATX/GPU Power";
    return "Уточняется";
  }

  function inferSpeed(lower, category) {
    if (category === "Накопители") return /hdd/.test(lower) ? "SATA HDD" : "SSD";
    if (category === "Охлаждение") {
      const amp = lower.match(/(\d+(?:[.,]\d+)?)\s*a/);
      return amp ? `${amp[1].replace(",", ".")}A` : "DC";
    }
    if (category === "Адаптеры") {
      if (/gen5|g5|sa22n216p|lrfna921a/.test(lower)) return "Gen5";
      if (/gen4|g4|lrfcf931|lrfcf921/.test(lower)) return "Gen4";
    }
    if (category === "Кабели") {
      if (/gen5/.test(lower)) return "Gen5";
      if (/gen4/.test(lower)) return "Gen4";
      if (/600w/.test(lower)) return "600W";
      if (/12g/.test(lower)) return "12G";
      return "";
    }
    if (/1\.25g/.test(lower)) return "1.25G";
    if (/1\/10g/.test(lower)) return "1/10G";
    if (/100g/.test(lower)) return "100G";
    if (/(^|[^.\d])25g/.test(lower)) return "25G";
    if (/10gbe|10g/.test(lower)) return "10G";
    if (/gen5/.test(lower)) return "Gen5";
    if (/gen4/.test(lower)) return "Gen4";
    if (/600w/.test(lower)) return "600W";
    if (/12g/.test(lower)) return "12G";
    return "Уточняется";
  }

  function inferLength(lower, category) {
    const capacity = lower.match(/(\d+(?:[.,]\d+)?)\s*(tb|gb)/);
    if (category === "Накопители" && capacity) return `${capacity[1].replace(",", ".")} ${capacity[2].toUpperCase()}`;

    const cm = lower.match(/(?:length:)?\s*(\d+)\s*(?:см|cm)/);
    if (cm) return `${cm[1]} см`;

    const meters = lower.match(/(\d+)\s*(?:метров|метра|метр)(?=$|[\s,.;:])/);
    if (meters) return meterLengthLabel(Number(meters[1]));

    const atx = lower.match(/(\d+)\s*pin/);
    if (category === "Кабели" && atx) return `${atx[1]} pin`;

    return "Уточняется";
  }

  function meterLengthLabel(value) {
    const number = Number(value);
    const lastTwo = number % 100;
    const last = number % 10;
    if (lastTwo >= 11 && lastTwo <= 14) return `${number} метров`;
    if (last === 1) return `${number} метр`;
    if (last >= 2 && last <= 4) return `${number} метра`;
    return `${number} метров`;
  }

  function inferConnector(lower, category) {
    if (category === "Накопители") return /m480|980|fury/.test(lower) ? "M.2" : "SATA";
    if (category === "Охлаждение") return "Fan header";
    if (category === "Адаптеры") {
      if (/gen5/.test(lower)) return "Gen5";
      if (/gen4/.test(lower)) return "Gen4";
    }
    if (/sff-8654/.test(lower)) return "SFF-8654";
    if (hasExplicitU2(lower) && /sff-8639|sff-6639|u\.?2/.test(lower)) return "U.2";
    if (/sff-8639/.test(lower)) return "SFF-8639";
    if (/sff-6639/.test(lower)) return "SFF-6639";
    if (/mcio/.test(lower)) return "MCIO";
    if (/mpo/.test(lower)) return "MPO/UPC";
    if (/rj45/.test(lower)) return "RJ45";
    if (/qsfp\s*28|qsfp28/.test(lower)) return "QSFP28";
    if (/sfp28/.test(lower)) return "SFP28";
    if (/xfp/.test(lower)) return "XFP";
    if (/sfp/.test(lower)) return "SFP/SFP+";
    if (/12vhpwr/.test(lower)) return "12VHPWR";
    if (/micro-hi|atx/.test(lower)) return "Micro-hi / ATX 12V";
    return "Уточняется";
  }

  function inferCompatibility(category, lower) {
    if (category === "Накопители") return ["Серверы", "СХД", "Рабочие станции"];
    if (category === "Охлаждение") return ["Серверные шасси", "GPU", "Системы охлаждения"];
    if (category === "Оптические патч-корды") return ["QSFP28", "100GBASE-SR4", "MMF OM4"];
    if (category === "Трансиверы") {
      const values = ["Коммутаторы", "Серверные NIC"];
      if (/cisco/.test(lower)) values.push("Cisco");
      if (/mikrotik/.test(lower)) values.push("MikroTik");
      if (/lr-link/.test(lower)) values.push("LR-Link");
      return values;
    }
    if (category === "Адаптеры") return ["Серверы", "PCIe", "NVMe/SAS"];
    return ["Серверы", "HBA/RAID", hasExplicitU2(lower) ? "NVMe/U.2" : "NVMe/SAS"];
  }

  function hasExplicitU2(lower) {
    return /\bu\.?2\b/.test(lower);
  }

  function thumbPositionForCategory(category) {
    if (category === "Трансиверы") return "50% 72%";
    if (category === "Оптические патч-корды") return "30% 72%";
    if (category === "Адаптеры") return "74% 72%";
    if (category === "Накопители") return "73% 66%";
    if (category === "Охлаждение") return "83% 39%";
    return "53% 69%";
  }

  function normalize(value) {
    return String(value ?? "")
      .toLowerCase()
      .replaceAll("ё", "е")
      .trim();
  }

  function formatPrice(price) {
    if (price === null || price === undefined || price === "" || !Number.isFinite(Number(price))) return "Цена по запросу";
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

  function conditionClass(product) {
    const condition = normalize(product.condition);
    return condition.includes("б/у") || condition === "бу" ? "used" : "";
  }

  function visibleProductTags(product) {
    const seen = new Set();
    return [product.type, product.speed]
      .map((value) => String(value || "").trim())
      .filter((value) => value && normalize(value) !== "уточняется")
      .filter((value) => {
        const key = normalize(value);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  }

  function productTaxLabel(product) {
    return product.vat ? "с НДС" : "без НДС";
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
        product.capacity,
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

  function cleanFacetValues(values) {
    return values
      .map((value) => String(value ?? "").trim())
      .filter((value) => value && !["уточняется", "не указан", "не указана"].includes(normalize(value)));
  }

  function getFacetValue(product, key) {
    if (key === "availability") return cleanFacetValues([stockGroup(product)]);
    if (key === "compatibility") return cleanFacetValues(product.compatibility || []);
    if (key === "capacity") return cleanFacetValues([product.capacity || (product.category === "Накопители" ? product.length : "")]);
    if (key === "length" && product.category === "Накопители") return [];
    return cleanFacetValues([product[key]]);
  }

  function productsForCategory() {
    return state.category === "Все"
      ? products
      : products.filter((product) => product.category === state.category);
  }

  function activeFilterConfig() {
    const keys = categoryFilterKeys[state.category] || categoryFilterKeys["Все"];
    return keys.map((key) => filterDefinitions[key]).filter(Boolean);
  }

  function facetLabel(filter) {
    if (filter.key === "connector" && ["Адаптер", "Адаптеры", "Бифуркатор"].includes(state.category)) {
      return "Стандарт интерфейса PCIe";
    }
    if (filter.key === "speed" && ["Кабель", "Кабели"].includes(state.category)) {
      return "Стандарт интерфейса PCIe";
    }
    return filter.label;
  }

  function facetOptionCompare(key, left, right) {
    if (key === "length" && ["Кабель", "Кабели"].includes(state.category)) {
      const orderedLengths = ["100 см", "80 см", "75 см", "70 см", "60 см"];
      const leftIndex = orderedLengths.indexOf(left[0]);
      const rightIndex = orderedLengths.indexOf(right[0]);
      if (leftIndex !== -1 || rightIndex !== -1) {
        return (leftIndex === -1 ? Number.MAX_SAFE_INTEGER : leftIndex)
          - (rightIndex === -1 ? Number.MAX_SAFE_INTEGER : rightIndex);
      }
    }
    return left[0].localeCompare(right[0], "ru", { numeric: true });
  }

  function clearInactiveFacetFilters() {
    const activeKeys = new Set(activeFilterConfig().map((filter) => filter.key));
    for (const [key, selected] of Object.entries(state.filters)) {
      if (!activeKeys.has(key)) selected.clear();
    }
  }

  function pruneUnavailableFacetValues() {
    const categoryProducts = productsForCategory();
    for (const { key } of activeFilterConfig()) {
      const available = new Set(
        categoryProducts.flatMap((product) => getFacetValue(product, key).map(normalize))
      );
      for (const value of [...state.filters[key]]) {
        if (!available.has(normalize(value))) state.filters[key].delete(value);
      }
    }
  }

  function filteredProductsForFacet(excludedKey, includePrice = true) {
    let result = productsForCategory();
    const query = normalize(state.search);

    if (query) {
      result = result.filter((product) => productSearchText(product).includes(query));
    }

    for (const { key } of activeFilterConfig()) {
      if (key === excludedKey) continue;
      const selected = state.filters[key];
      if (!selected.size) continue;
      result = result.filter((product) => {
        const values = getFacetValue(product, key).map(normalize);
        return [...selected].some((selectedValue) => values.includes(normalize(selectedValue)));
      });
    }

    if (!includePrice) return result;

    const min = Number(state.priceMin);
    const max = Number(state.priceMax);
    if (state.priceMin !== "") {
      result = result.filter((product) => Number.isFinite(Number(product.price)) && Number(product.price) >= min);
    }
    if (state.priceMax !== "") {
      result = result.filter((product) => Number.isFinite(Number(product.price)) && Number(product.price) <= max);
    }

    return result;
  }

  function filteredProducts() {
    let result = productsForCategory();
    const query = normalize(state.search);

    if (query) {
      result = result.filter((product) => productSearchText(product).includes(query));
    }

    for (const { key } of activeFilterConfig()) {
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
    const facets = activeFilterConfig().reduce((sum, filter) => sum + state.filters[filter.key].size, 0);
    const price = Number(Boolean(state.priceMin)) + Number(Boolean(state.priceMax));
    return facets + price + Number(Boolean(state.search));
  }

  function hasManagerAccess() {
    if (serverMode) return false;
    return Boolean(profile && !profile.blocked && (managerAccess || ["manager", "admin"].includes(profile.role)));
  }

  function renderManagerAccess() {
    const visible = hasManagerAccess();
    refs.adminSection.classList.toggle("hidden", !visible);
    refs.adminSection.setAttribute("aria-hidden", String(!visible));
    refs.adminNavLink.classList.toggle("hidden", !visible);
    refs.mobileAdminNavLink?.classList.toggle("hidden", !visible);
    if (!visible && window.location.hash === "#admin") {
      history.replaceState(null, "", "#catalog");
    }
  }

  function requireManagerAccess() {
    if (hasManagerAccess()) return true;
    managerAccess = false;
    saveJSON(STORAGE.managerAccess, managerAccess);
    renderManagerAccess();
    showToast("Импорт доступен только в кабинете менеджера");
    return false;
  }

  function renderAll() {
    clearInactiveFacetFilters();
    pruneUnavailableFacetValues();
    renderManagerAccess();
    renderCategories();
    renderFacets();
    renderProducts();
    renderCounters();
    renderAdminOps();
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
    refs.facetFilters.innerHTML = activeFilterConfig()
      .map((filter) => {
        const { key } = filter;
        const label = facetLabel(filter);
        const base = filteredProductsForFacet(key);
        const counts = new Map();
        for (const product of base) {
          for (const value of getFacetValue(product, key)) {
            counts.set(value, (counts.get(value) || 0) + 1);
          }
        }
        const options = [...counts.entries()].sort((a, b) => facetOptionCompare(key, a, b));
        if (!options.length) return "";
        const selectedValues = state.filters[key];
        const isPrimaryType = key === "type";
        return `
          <fieldset class="facet-group ${isPrimaryType ? "primary-facet" : ""}">
            <legend class="facet-title">${escapeHTML(label)} <span>${selectedValues.size ? `${selectedValues.size} выбрано` : options.length}</span></legend>
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
    renderPriceRange();
  }

  function renderPriceRange() {
    const prices = filteredProductsForFacet(null, false)
      .map((product) => Number(product.price))
      .filter((price) => Number.isFinite(price));

    if (!prices.length) {
      refs.priceRangeNote.textContent = "В этой выборке цены по запросу.";
      refs.priceMin.placeholder = "по запросу";
      refs.priceMax.placeholder = "по запросу";
      return;
    }

    const min = Math.min(...prices);
    const max = Math.max(...prices);
    refs.priceRangeNote.textContent = min === max
      ? `Доступная цена: ${formatPrice(min)}`
      : `Диапазон с ценами: ${formatPrice(min)} - ${formatPrice(max)}`;
    refs.priceMin.placeholder = String(min);
    refs.priceMax.placeholder = String(max);
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
    const canBuy = canAddToCart(product);
    const primaryAction = canBuy ? "add" : "quote";
    const primaryLabel = canBuy ? "В корзину" : "Запросить";
    const galleryProduct = hasProductGallery(product);
    const image = productImageList(product)[0];
    const specificImage = hasSpecificProductImage(product);
    const thumbClass = [
      "product-thumb",
      specificImage ? "has-product-photo" : "",
      galleryProduct ? "has-readable-card-image" : "",
    ].filter(Boolean).join(" ");
    const thumbLabel = visibleProductTags(product).join(" / ");
    return `
      <article class="product-card" data-product-id="${escapeAttr(product.id)}">
        <div class="${thumbClass}">
          <button class="product-image-button" type="button" data-image-preview aria-haspopup="dialog" aria-label="Увеличить фото: ${escapeAttr(product.name)}" title="Увеличить фото">
            <img src="${escapeAttr(image.src)}" alt="${escapeAttr(product.name)}" style="object-position:${escapeAttr(image.position)}" loading="lazy" />
            ${galleryProduct || !thumbLabel ? "" : `<span class="thumb-label">${escapeHTML(thumbLabel)}</span>`}
          </button>
          <button class="favorite-toggle" type="button" aria-label="${favorite ? "Убрать из избранного" : "Добавить в избранное"}" aria-pressed="${favorite}" data-action="favorite" data-id="${escapeAttr(product.id)}">${favorite ? "✓" : "+"}</button>
        </div>
        <div class="product-body">
          <div class="product-meta">
            <span class="status-chip ${conditionClass(product)}">${escapeHTML(product.condition)}</span>
          </div>
          <h3 class="product-title">
            <span>${escapeHTML(product.name)}</span>
          </h3>
          <p class="product-description">${escapeHTML(product.description)}</p>
        </div>
        <div class="product-footer">
          <div class="product-purchase">
            <div class="product-price-stack">
              <span class="price">${formatPrice(product.price)}</span>
              <span class="vat-note">${escapeHTML(productTaxLabel(product))}</span>
            </div>
            <span class="stock-chip ${stockClass(product)}">${escapeHTML(stockGroup(product))}</span>
          </div>
          <div class="card-actions">
            <button class="primary-button compact main-card-action" type="button" data-action="${primaryAction}" data-id="${escapeAttr(product.id)}">${primaryLabel}</button>
            <button class="secondary-button compact details-button" type="button" data-action="details" data-id="${escapeAttr(product.id)}">Карточка товара</button>
          </div>
        </div>
      </article>`;
  }

  function renderSelectedFilters() {
    const chips = [];
    if (state.search) chips.push(`Поиск: ${state.search}`);
    if (state.priceMin) chips.push(`от ${state.priceMin} ₽`);
    if (state.priceMax) chips.push(`до ${state.priceMax} ₽`);
    for (const { key, label } of activeFilterConfig()) {
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
    const accountName = String(profile?.name || profile?.company || "").trim();
    const accountLabel = accountName ? accountName.split(/\s+/)[0].slice(0, 18) : "Кабинет";
    if (refs.accountButton) {
      if (refs.accountLabel) refs.accountLabel.textContent = accountLabel;
      refs.accountButton.title = accountName ? `Кабинет: ${accountName}` : "Кабинет";
      refs.accountButton.setAttribute("aria-label", accountName ? `Открыть кабинет: ${accountName}` : "Открыть кабинет");
    }
    if (refs.mobileAccountButton) {
      refs.mobileAccountButton.textContent = accountName ? `Кабинет: ${accountLabel}` : "Кабинет";
    }
    const cartQty = cart.reduce((sum, item) => sum + item.qty, 0);
    refs.cartCount.textContent = String(cartQty);
    refs.cartCount.classList.toggle("is-empty", cartQty === 0);
    refs.favoritesCount.textContent = String(favorites.size);
    refs.favoritesCount.classList.toggle("is-empty", favorites.size === 0);
    if (refs.mobileFavoritesCount) refs.mobileFavoritesCount.textContent = String(favorites.size);
  }

  function setMobileMenu(open) {
    if (!refs.mobileMenuButton || !refs.mobileMenuPanel) return;
    document.querySelector(".site-header")?.classList.toggle("mobile-menu-open", open);
    refs.mobileMenuPanel.hidden = !open;
    refs.mobileMenuButton.setAttribute("aria-expanded", String(open));
    refs.mobileMenuButton.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
  }

  function closeMobileMenu() {
    setMobileMenu(false);
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
              <p class="cart-meta"><span class="stock-chip ${stockClass(product)}">${escapeHTML(stockGroup(product))}</span></p>
            </div>
            <div class="cart-controls" aria-label="Количество">
              <button class="qty-button" type="button" data-cart="minus" data-id="${escapeAttr(product.id)}">−</button>
              <strong>${item.qty}</strong>
              <button class="qty-button" type="button" data-cart="plus" data-id="${escapeAttr(product.id)}">+</button>
              <button class="secondary-button compact" type="button" data-cart="remove" data-id="${escapeAttr(product.id)}">Удалить</button>
            </div>
            <strong>${formatPrice(product.price === null ? null : Number(product.price) * item.qty)}</strong>
          </div>`;
      })
      .join("");

    refs.cartBody.innerHTML = `
      <div class="cart-items">${lines}</div>
      <div class="cart-summary">
        <strong>Итого: ${escapeHTML(orderAmountText({ items: cart.map((item) => ({ ...item, price: findProduct(item.id)?.price ?? null })) }))}</strong>
        <p class="muted">Финальная цена, наличие и срок поставки подтверждаются менеджером.</p>
        <div class="form-next-step">
          <strong>Ответим в течение 2 рабочих часов</strong>
          <span>Проверим остатки, подтвердим цену с НДС и отправим КП или счет на email.</span>
        </div>
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
    const checkoutForm = $("#checkoutForm");
    if (checkoutForm) checkoutForm.dataset.startedAt = String(Date.now());
    prefillCustomerForm(checkoutForm);
    syncClientTypeFields(checkoutForm);
  }

  function renderProductDialog(product) {
    const images = productImageList(product);
    const mainImage = images[0];
    const galleryProduct = hasProductGallery(product);
    const specificImage = hasSpecificProductImage(product);
    const imageClass = [
      "detail-image",
      specificImage ? "has-product-photo" : "",
      galleryProduct ? "has-readable-card-image" : "",
    ].filter(Boolean).join(" ");
    refs.productDialogTitle.textContent = product.name;
    refs.productBreadcrumb.textContent = hasManagerAccess()
      ? `Каталог / ${product.category} / ${product.sku}`
      : `Каталог / ${product.category}`;
    const canBuy = canAddToCart(product);
    const detailPrimaryAction = canBuy ? "add" : "quote";
    const detailPrimaryLabel = canBuy ? "Добавить в корзину" : "Запросить";
    const specs = {
      Производитель: product.brand,
      Тип: product.type,
      Интерфейс: product.interface,
      ...(product.speed ? { Скорость: product.speed } : {}),
      ...(product.capacity ? { Емкость: product.capacity } : { "Длина/дальность": product.length }),
      Разъем: product.connector,
      Состояние: product.condition,
      Наличие: stockGroup(product),
      ...product.specs,
    };
    if (hasManagerAccess()) specs.Артикул = product.sku;
    refs.productDialogBody.innerHTML = `
      <div class="product-detail-grid">
        <div class="product-gallery">
          <div class="${imageClass}">
            <button class="detail-image-button" type="button" data-image-preview aria-haspopup="dialog" aria-label="Увеличить фото: ${escapeAttr(product.name)}" title="Увеличить фото">
              <img data-gallery-main src="${escapeAttr(mainImage.src)}" alt="${escapeAttr(product.name)}" style="object-position:${escapeAttr(mainImage.position)}" />
            </button>
            ${
              images.length > 1
                ? `
                  <button class="gallery-nav prev" type="button" data-gallery-step="-1" aria-label="Предыдущее изображение">‹</button>
                  <button class="gallery-nav next" type="button" data-gallery-step="1" aria-label="Следующее изображение">›</button>`
                : ""
            }
          </div>
          ${
            images.length > 1
              ? `
                <div class="gallery-strip" aria-label="Изображения товара">
                  ${images
                    .map(
                      (image, index) => `
                        <button class="gallery-thumb" type="button" data-gallery-index="${index}" data-gallery-image="${escapeAttr(image.src)}" data-gallery-position="${escapeAttr(image.position)}" aria-label="Показать изображение ${index + 1}" aria-current="${index === 0 ? "true" : "false"}">
                          <img src="${escapeAttr(image.src)}" alt="" loading="lazy" />
                        </button>`
                    )
                    .join("")}
                </div>`
              : ""
          }
        </div>
        <div>
          <div class="product-meta">
            <span class="stock-chip ${stockClass(product)}">${escapeHTML(stockGroup(product))}</span>
            <span class="status-chip ${conditionClass(product)}">${escapeHTML(product.condition)}</span>
            <span class="status-chip">${escapeHTML(productTaxLabel(product))}</span>
          </div>
          <p>${escapeHTML(product.description)}</p>
          <div class="price-row">
            <span class="price">${formatPrice(product.price)}</span>
            <span class="vat-note">${product.status === "request" ? "условия уточняет менеджер" : "можно добавить в корзину"}</span>
          </div>
          <h3>Совместимость</h3>
          <div class="compat-list">${(product.compatibility || []).map((item) => `<span class="spec-chip">${escapeHTML(item)}</span>`).join("")}</div>
          <div class="button-row">
            <button class="primary-button" type="button" data-action="${detailPrimaryAction}" data-id="${escapeAttr(product.id)}">${detailPrimaryLabel}</button>
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

  function productImageList(product) {
    if (serverMode) {
      const images = Array.isArray(product.images) && product.images.length ? product.images : [product.image || heroImage];
      return images.map((item) => typeof item === "string" ? { src: item, position: product.imagePosition || "center" } : { src: item.src || heroImage, position: item.position || "center" });
    }
    const mappedPhoto = imageForSku(product.sku);
    const fallbackPosition = mappedPhoto?.position || product.imagePosition || product.thumbPosition || "center";
    const mappedImages = mappedPhoto?.gallery || (mappedPhoto?.src ? [mappedPhoto.src] : null);
    const rawImages = mappedImages || (Array.isArray(product.images) && product.images.length
      ? product.images
      : [product.image || heroImage]);
    return rawImages.map((item) => {
      if (typeof item === "string") return { src: item, position: fallbackPosition };
      return {
        src: item.src || heroImage,
        position: item.position || fallbackPosition,
      };
    });
  }

  function hasSpecificProductImage(product) {
    if (serverMode) return Boolean(product.image);
    return Boolean(imageForSku(product.sku)?.src || product.image);
  }

  function hasProductGallery(product) {
    if (serverMode) return Array.isArray(product.images) && product.images.length > 1;
    const mappedPhoto = imageForSku(product.sku);
    if (mappedPhoto?.gallery?.length) return mappedPhoto.gallery.length > 1;
    return Array.isArray(product.images) && product.images.length > 1;
  }

  function updateProductGallery(control) {
    const gallery = control.closest(".product-gallery");
    if (!gallery) return;
    const thumbs = [...gallery.querySelectorAll(".gallery-thumb")];
    if (!thumbs.length) return;

    const currentIndex = Math.max(0, thumbs.findIndex((thumb) => thumb.getAttribute("aria-current") === "true"));
    const targetIndex = control.dataset.galleryIndex !== undefined
      ? Number(control.dataset.galleryIndex)
      : (currentIndex + Number(control.dataset.galleryStep || 0) + thumbs.length) % thumbs.length;
    const target = thumbs[targetIndex];
    const mainImage = gallery.querySelector("[data-gallery-main]");
    if (!target || !mainImage) return;

    mainImage.src = target.dataset.galleryImage;
    mainImage.style.objectPosition = target.dataset.galleryPosition || "center";
    thumbs.forEach((thumb, index) => thumb.setAttribute("aria-current", String(index === targetIndex)));
  }

  function openProductImage(control) {
    const image = control.querySelector("img");
    if (!image) return;
    refs.productImagePreview.src = image.currentSrc || image.src;
    refs.productImagePreview.alt = image.alt;
    refs.productImageCaption.textContent = image.alt;
    openDialog(refs.productImageDialog);
  }

  async function openConsentDialog() {
    const fallbackText = refs.consentTemplate?.content?.textContent?.trim() || "";
    refs.consentDialogText.textContent = consentTextCache || fallbackText || "Загрузка текста...";
    openDialog(refs.consentDialog);
    refs.consentDialog.scrollTop = 0;
    refs.consentDialogText.closest(".dialog-body").scrollTop = 0;
    if (!consentTextCache) {
      try {
        const response = await fetch("/assets/consent-personal-data.txt", { cache: "no-store" });
        if (!response.ok) throw new Error("consent_load_failed");
        consentTextCache = (await response.text()).trim();
      } catch {
        consentTextCache = fallbackText || "Не удалось загрузить текст согласия. Попробуйте обновить страницу или обратитесь к менеджеру.";
      }
    }
    refs.consentDialogText.textContent = consentTextCache;
  }

  function renderLeadDialog(type, productId = null, items = []) {
    state.leadContext = { type, productId, items };
    const product = productId ? findProduct(productId) : null;
    refs.leadEyebrow.textContent = type === "question" ? "Вопрос менеджеру" : "Коммерческое предложение";
    refs.leadTitle.textContent = type === "question" ? "Задать вопрос" : "Запросить КП";
    refs.leadProductSummary.innerHTML = product
      ? `<strong>${escapeHTML(product.name)}</strong><p class="muted">${escapeHTML(product.category)} · ${escapeHTML(stockGroup(product))}</p>`
      : `<strong>Подбор по списку</strong><p class="muted">Менеджер получит комментарий и уточнит параметры.</p>`;
    refs.leadNextSteps.innerHTML = type === "question"
      ? `<strong>Ответим в течение 2 рабочих часов</strong><span>Менеджер проверит совместимость, наличие и подскажет следующий шаг.</span>`
      : `<strong>КП подготовим за 24 ч</strong><span>Отправим на email; если оставлен телефон, менеджер уточнит контакт для КП.</span>`;
    refs.leadForm.reset();
    refs.leadForm.dataset.startedAt = String(Date.now());
    prefillCustomerForm(refs.leadForm);
    syncClientTypeFields(refs.leadForm);
  }

  function renderAccount() {
    if (serverMode && !serverAccountReady) {
      refs.accountBody.innerHTML = `<p role="status">${escapeHTML(serverAccountError || "Подключение к кабинету…")}</p>`;
      return;
    }
    const current = sessionUser();
    if (current) profile = current;

    if (!current) {
      refs.accountBody.innerHTML = renderAuthPanel();
      syncClientTypeFields(refs.accountBody.querySelector("form"));
      return;
    }

    const activeTab = ["profile", "orders", "favorites", "communications"].includes(state.accountMode)
      ? state.accountMode
      : "profile";
    state.accountMode = activeTab;

    const panels = {
      profile: renderProfilePanel(current),
      orders: renderOrdersPanel(current),
      favorites: renderFavoritesPanel(),
      communications: renderCommunicationsPanel(current),
    };

    refs.accountBody.innerHTML = `
      <div class="account-hub">
        <div class="account-hero-card">
          <div>
            <p class="eyebrow">Рабочий центр закупки</p>
            <h3>${escapeHTML(current.company || current.name || "Клиент Белый Ветер")}</h3>
            <p>${escapeHTML(current.name)} · ${escapeHTML(current.phone || "телефон не указан")} · ${escapeHTML(current.email || "email не указан")}</p>
          </div>
          <div class="account-badges">
            <span class="account-badge">${escapeHTML(roleLabels[current.role] || "Пользователь")}</span>
            <span class="account-badge ${current.approval === "confirmed" ? "success" : "warning"}">${escapeHTML(approvalLabels[current.approval] || "На проверке")}</span>
          </div>
        </div>

        <div class="account-stats">
          <div><strong>${cart.reduce((sum, item) => sum + item.qty, 0)}</strong><span>товаров в корзине</span></div>
          <div><strong>${userOrders(current).length}</strong><span>заявок и КП</span></div>
          <div><strong>${favorites.size}</strong><span>избранных товаров</span></div>
        </div>

        <div class="account-tabs" role="tablist" aria-label="Разделы кабинета">
          ${accountTabButton("profile", "Профиль", activeTab)}
          ${accountTabButton("orders", "Заявки и КП", activeTab)}
          ${accountTabButton("favorites", "Избранное", activeTab)}
          ${accountTabButton("communications", "Связь", activeTab)}
        </div>

        ${panels[activeTab]}

        <div class="account-actions-footer">
          <button class="secondary-button compact" type="button" data-account="logout">Выйти</button>
          ${
            ["manager", "admin"].includes(current.role)
              ? `<button class="${hasManagerAccess() ? "secondary-button" : "primary-button"} compact" type="button" data-manager="${hasManagerAccess() ? "close" : "open"}">${hasManagerAccess() ? "Скрыть админку" : "Открыть админку"}</button>`
              : ""
          }
        </div>
      </div>`;
    syncClientTypeFields(refs.accountBody.querySelector("form"));
  }

  function renderAuthPanel() {
    if (state.pendingAuth) {
      return `
        <div class="account-auth">
          <div class="account-hero-card compact">
            <div>
              <p class="eyebrow">Подтверждение доступа</p>
              <h3>Введите код</h3>
              <p>В боевой версии код отправляется на телефон или email. В этом прототипе код показан ниже для проверки сценария.</p>
            </div>
            <span class="account-code">${escapeHTML(state.pendingAuth.code)}</span>
          </div>
          <form class="profile-form" id="accountCodeForm">
            <label>
              <span>Код подтверждения</span>
              <input class="input" name="code" inputmode="numeric" autocomplete="one-time-code" required />
            </label>
            ${antiSpamFields()}
            <div class="button-row">
              <button class="primary-button" type="submit">Войти в кабинет</button>
              <button class="secondary-button" type="button" data-account="auth-cancel">Назад</button>
            </div>
          </form>
        </div>`;
    }

    const isRegister = state.accountMode === "register";
    return `
      <div class="account-auth">
        <div class="account-hero-card compact">
          <div>
            <p class="eyebrow">Кабинет закупки</p>
            <h3>${isRegister ? "Регистрация клиента" : "Вход по телефону или email"}</h3>
            <p>${isRegister ? "Юрлица сначала попадают на проверку реквизитов, затем получают B2B-условия." : "После входа будут доступны заявки, КП, избранное, сохраненная корзина и повтор заказа."}</p>
          </div>
        </div>
        <div class="account-tabs two-tabs" role="tablist" aria-label="Вход или регистрация">
          <button class="account-tab" type="button" aria-selected="${!isRegister}" data-account-mode="login">Вход</button>
          <button class="account-tab" type="button" aria-selected="${isRegister}" data-account-mode="register">Регистрация</button>
        </div>
        <form class="profile-form" id="accountAuthForm" data-auth-mode="${isRegister ? "register" : "login"}">
          ${
            isRegister
              ? `
                <fieldset class="account-fieldset">
                  <legend>Тип клиента</legend>
                  <label class="radio-row"><input type="radio" name="clientType" value="person" checked /> <span>Физлицо</span></label>
                  <label class="radio-row"><input type="radio" name="clientType" value="legal" /> <span>Юрлицо</span></label>
                </fieldset>
                <p class="client-type-hint" data-client-hint></p>
                ${profileFormFields({}, { context: "register" })}
                <label>
                  <span>Пароль</span>
                  <input class="input" name="password" type="password" autocomplete="new-password" minlength="10" maxlength="256" required />
                  <small>Не менее 10 символов</small>
                </label>
                ${consentField("Я даю согласие на обработку персональных данных и принимаю Политику конфиденциальности.", "account-registration")}
              `
              : `
                <label>
                  <span>Телефон или email</span>
                  <input class="input" name="login" autocomplete="username" required />
                </label>
                <label>
                  <span>Пароль</span>
                  <input class="input" name="password" type="password" autocomplete="current-password" minlength="10" maxlength="256" required />
                </label>
              `
          }
          ${antiSpamFields()}
          <button class="primary-button" type="submit">${isRegister ? "Зарегистрироваться" : "Войти"}</button>
        </form>
      </div>`;
  }

  function accountTabButton(mode, label, activeTab) {
    return `<button class="account-tab" type="button" role="tab" aria-selected="${mode === activeTab}" data-account-mode="${escapeAttr(mode)}">${escapeHTML(label)}</button>`;
  }

  function renderProfilePanel(user) {
    const clientType = user.clientType === "legal" ? "legal" : "person";
    const clientTypeLabel = clientType === "legal" ? "Юрлицо" : "Физлицо";
    return `
      <section class="account-panel" aria-label="Профиль клиента">
        <form class="profile-form" id="profileForm">
          <div class="form-next-step">
            <strong>Реквизиты используются в заявках и КП</strong>
            <span>Для юрлица менеджер проверит ИНН/КПП и подтвердит доступ к B2B-условиям.</span>
          </div>
          <input type="hidden" name="clientType" value="${escapeAttr(clientType)}" />
          <div class="client-type-fixed">
            <span>Тип клиента</span>
            <strong>${escapeHTML(clientTypeLabel)}</strong>
            <p>Тип аккаунта фиксируется после регистрации. Если нужно изменить формат работы, менеджер создаст новый профиль.</p>
          </div>
          <p class="client-type-hint" data-client-hint></p>
          ${profileFormFields(user, { context: "profile" })}
          ${consentField("Даю согласие на обработку персональных данных и принимаю Политику конфиденциальности.", "account-profile", user.consentDetails)}
          ${user.consentDetails?.accepted ? `<p class="consent-meta">Согласие зафиксировано: ${escapeHTML(formatDate(user.consentDetails.acceptedAt))}. Версия политики: ${escapeHTML(user.consentDetails.policyVersion || PRIVACY_POLICY_VERSION)}.</p>` : ""}
          ${antiSpamFields()}
          <button class="primary-button" type="submit">Сохранить профиль</button>
        </form>
      </section>`;
  }

  function renderOrdersPanel(user) {
    const accountOrders = userOrders(user);
    return `
      <section class="account-panel" aria-label="История заявок">
        <div class="form-next-step">
          <strong>Здесь хранятся заявки, КП и повторы заказов</strong>
          <span>Статусы обновляет менеджер: от новой заявки до оплаты, отгрузки и завершения.</span>
        </div>
        <div class="orders-list">
          ${
            accountOrders.length
              ? accountOrders.map((order) => renderOrderCard(order)).join("")
              : `<div class="empty-state"><h3>История пока пустая</h3><p>Оформите корзину или запросите КП по товару, и заявка появится здесь.</p></div>`
          }
        </div>
        <p class="muted" data-order-sync role="status">Статусы обновлены</p>
      </section>`;
  }

  function renderFavoritesPanel() {
    const favoriteProducts = [...favorites].map(findProduct).filter(Boolean);
    return `
      <section class="account-panel" aria-label="Избранные товары">
        <div class="form-next-step">
          <strong>Отложенные комплектующие под рукой</strong>
          <span>Можно быстро перенести позицию в корзину и включить уведомления о наличии или цене.</span>
        </div>
        <div class="favorites-list rich-list">
          ${
            favoriteProducts.length
              ? favoriteProducts.map((product) => `
                <article class="favorite-line">
                  <div>
                    <h3>${escapeHTML(product.name)}</h3>
                    <p class="muted">${escapeHTML(stockGroup(product))} · ${formatPrice(product.price)}</p>
                    <p class="muted">Уведомления: наличие и изменение цены</p>
                  </div>
                  <div class="favorite-actions">
                    <button class="primary-button compact" type="button" data-favorite-add="${escapeAttr(product.id)}">В корзину</button>
                    <button class="secondary-button compact" type="button" data-action="details" data-id="${escapeAttr(product.id)}">Карточка</button>
                    <button class="secondary-button compact" type="button" data-favorite-remove="${escapeAttr(product.id)}">Убрать</button>
                  </div>
                </article>`).join("")
              : `<div class="empty-state"><h3>Избранного пока нет</h3><p>Нажимайте плюс на карточках каталога, чтобы сохранить позиции для закупки.</p></div>`
          }
        </div>
      </section>`;
  }

  function renderCommunicationsPanel(user) {
    return `
      <section class="account-panel" aria-label="Коммуникация по заявкам">
        <div class="communication-grid">
          <div class="profile-card">
            <span class="mini-label">Контакт менеджера</span>
            <strong>${escapeHTML(user.manager || "Менеджер будет назначен после заявки")}</strong>
            <p>Ответ по заявке: в течение 2 рабочих часов. КП отправим на email, наличие подтверждает менеджер.</p>
          </div>
          <div class="profile-card">
            <span class="mini-label">Уведомления</span>
            <strong>Email / Telegram / телефон</strong>
            <p>В MVP фиксируем предпочтения в профиле. Реальная рассылка подключается через серверные каналы.</p>
          </div>
        </div>
      </section>`;
  }

  function renderAdminSelect() {
    if (!hasManagerAccess()) return;
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

  function profileFormFields(user = {}, options = {}) {
    const clientType = user.clientType || "person";
    const context = options.context || "profile";
    const isRegister = context === "register";
    const isCheckout = context === "checkout";
    const personHidden = clientType === "legal" ? "hidden" : "";
    const legalHidden = clientType === "legal" ? "" : "hidden";
    const personDisabled = clientType === "legal" ? "disabled" : "";
    const legalDisabled = clientType === "legal" ? "" : "disabled";
    const addresses = escapeHTML((user.addresses || []).join("\n"));
    const personFields = isCheckout ? "" : isRegister
      ? `
        <p class="client-form-note">Адрес доставки можно добавить в профиле после входа.</p>`
      : `
        <label>
          <span>Адрес доставки</span>
          <textarea class="input textarea" name="addresses" rows="3" placeholder="Город, ПВЗ СДЕК или адрес курьерской доставки" ${personDisabled}>${addresses}</textarea>
        </label>`;
    const legalExtraFields = isRegister
      ? `
        <p class="client-form-note">КПП, реквизиты и адреса можно заполнить после входа. Юрлицо попадет на проверку менеджеру.</p>`
      : `
        <label>
          <span>КПП</span>
          <input class="input" name="kpp" value="${escapeAttr(user.kpp || "")}" inputmode="numeric" placeholder="Для ООО/АО; для ИП можно оставить пустым" ${legalDisabled} />
        </label>
        <label>
          <span>Реквизиты</span>
          <textarea class="input textarea" name="requisites" rows="3" placeholder="Расчетный счет, банк, БИК" ${legalDisabled}>${escapeHTML(user.requisites || "")}</textarea>
        </label>
        ${isCheckout ? "" : `
          <label>
            <span>Адреса доставки</span>
            <textarea class="input textarea" name="addresses" rows="3" placeholder="Каждый адрес с новой строки" ${legalDisabled}>${addresses}</textarea>
          </label>`}`;

    return `
      <label>
        <span>Имя / контактное лицо</span>
        <input class="input" name="name" value="${escapeAttr(user.name || "")}" required />
      </label>
      <div class="form-grid two-columns">
        <label>
          <span>Телефон</span>
          <input class="input" name="phone" value="${escapeAttr(user.phone || "")}" autocomplete="tel" placeholder="+7..." />
        </label>
        <label>
          <span>Email</span>
          <input class="input" name="email" type="email" value="${escapeAttr(user.email || "")}" autocomplete="email" placeholder="name@example.ru" />
        </label>
      </div>
      <p class="contact-rule-note">Укажите телефон или email. Второй контакт можно добавить позже.</p>
      ${personFields ? `
        <div class="client-type-fields" data-client-fields="person" ${personHidden}>
          ${personFields}
        </div>` : ""}
      <div class="client-type-fields" data-client-fields="legal" ${legalHidden}>
        <div class="form-grid two-columns">
          <label>
            <span>Компания</span>
            <input class="input" name="company" value="${escapeAttr(user.company || "")}" data-required-for="legal" ${legalDisabled} />
          </label>
          <label>
            <span>ИНН</span>
            <input class="input" name="inn" value="${escapeAttr(user.inn || "")}" inputmode="numeric" data-required-for="legal" ${legalDisabled} />
          </label>
        </div>
        ${legalExtraFields}
      </div>`;
  }

  function userOrders(user = profile) {
    if (serverMode) return user?.id ? orders.filter((order) => order.userId === user.id) : orders.filter((order) => !order.userId);
    if (!user?.id) return orders;
    return orders.filter((order) => order.userId === user.id || sameCustomer(order.customer, user) || !order.userId);
  }

  function renderOrderCard(order, options = {}) {
    const items = Array.isArray(order.items) ? order.items : [];
    const admin = options.admin === true;
    const itemLines = items.map((item) => {
      const meta = admin
        ? `${escapeHTML(item.sku)} · ${escapeHTML(item.qty || 1)} шт. · ${formatPrice(item.price)}`
        : `${escapeHTML(item.qty || 1)} шт. · ${formatPrice(item.price)}`;
      return `<p>${escapeHTML(item.name)} <span>${meta}</span></p>`;
    });
    return `
      <article class="order-line ${admin ? "admin-order-line" : ""}" data-order-id="${escapeAttr(order.id)}">
        <div class="order-line-main">
          <div>
            <h3>${escapeHTML(order.id)} · ${escapeHTML(order.kind || "Заявка")}</h3>
            <p class="muted">${formatDate(order.createdAt)} · ${plural(items.length, ["позиция", "позиции", "позиций"])} · ${orderAmountText(order)}</p>
            <p class="order-mini-meta">
              ${order.delivery ? `<span>${escapeHTML(order.delivery)}</span>` : ""}
              ${order.attachmentName ? `<span>Файл: ${escapeHTML(order.attachmentName)}</span>` : ""}
              ${order.manager ? `<span>Менеджер: ${escapeHTML(order.manager)}</span>` : ""}
            </p>
          </div>
          <span class="order-status-pill">${escapeHTML(order.status || "Новая")}</span>
        </div>
        <details class="order-details">
          <summary>Состав заказа</summary>
          <div class="order-items">
            ${
              items.length
                ? itemLines.join("")
                : `<p class="muted">Без товарных позиций.</p>`
            }
          </div>
          ${order.comment ? `<p class="muted">Комментарий: ${escapeHTML(order.comment)}</p>` : ""}
          ${order.history?.length ? `<h4>История статусов</h4>${order.history.map((entry) => `<p class="muted">${escapeHTML(formatDate(entry.at))} · ${escapeHTML(entry.to)}</p>`).join("")}` : ""}
        </details>
        <div class="order-actions">
          <button class="secondary-button compact" type="button" data-repeat="${escapeAttr(order.id)}">Повторить заказ</button>
          <button class="secondary-button compact" type="button" data-download-order="${escapeAttr(order.id)}">Скачать КП/счет</button>
        </div>
      </article>`;
  }

  function renderAdminOps() {
    if (!refs.adminOps || !hasManagerAccess()) return;
    const query = normalize(state.adminUserSearch);
    const visibleUsers = users.filter((user) => {
      if (!query) return true;
      return [user.name, user.phone, user.email, user.inn, user.company].some((value) => normalize(value).includes(query));
    });
    const pendingCount = users.filter((user) => user.approval === "pending").length;
    const openOrders = orders.filter((order) => !["Завершена", "Отменена"].includes(order.status)).length;

    refs.adminOps.innerHTML = `
      <div class="admin-dashboard">
        <div class="admin-kpis">
          <div><strong>${users.length}</strong><span>пользователей</span></div>
          <div><strong>${pendingCount}</strong><span>регистраций на проверке</span></div>
          <div><strong>${orders.length}</strong><span>заявок всего</span></div>
          <div><strong>${openOrders}</strong><span>в работе</span></div>
        </div>

        <section class="admin-panel-card">
          <div class="admin-panel-head">
            <div>
              <h3>Пользователи и модерация</h3>
              <p class="muted">Поиск по имени, телефону, email, ИНН и компании.</p>
            </div>
            <input class="input admin-search" id="adminUserSearch" value="${escapeAttr(state.adminUserSearch)}" placeholder="Найти клиента" />
          </div>
          <div class="admin-user-list">
            ${
              visibleUsers.map((user) => `
                <article class="admin-user-card ${user.blocked ? "is-blocked" : ""}">
                  <div>
                    <h4>${escapeHTML(user.name || "Без имени")}</h4>
                    <p>${escapeHTML(user.company || "Компания не указана")}</p>
                    <p class="product-sku">${escapeHTML(user.phone || "телефон не указан")} · ${escapeHTML(user.email || "email не указан")} · ИНН ${escapeHTML(user.inn || "не указан")}</p>
                  </div>
                  <div class="admin-controls">
                    <label>
                      <span>Проверка</span>
                      <select class="input select" data-admin-user-approval="${escapeAttr(user.id)}">
                        ${Object.entries(approvalLabels).map(([value, label]) => `<option value="${value}" ${user.approval === value ? "selected" : ""}>${escapeHTML(label)}</option>`).join("")}
                      </select>
                    </label>
                    <label>
                      <span>Роль</span>
                      <select class="input select" data-admin-user-role="${escapeAttr(user.id)}">
                        ${Object.entries(roleLabels).map(([value, label]) => `<option value="${value}" ${user.role === value ? "selected" : ""}>${escapeHTML(label)}</option>`).join("")}
                      </select>
                    </label>
                    <label>
                      <span>Менеджер</span>
                      <input class="input" data-admin-user-manager="${escapeAttr(user.id)}" value="${escapeAttr(user.manager || "")}" placeholder="Имя менеджера" />
                    </label>
                    <button class="secondary-button compact" type="button" data-admin-user-block="${escapeAttr(user.id)}">${user.blocked ? "Разблокировать" : "Заблокировать"}</button>
                  </div>
                </article>`).join("")
            }
          </div>
        </section>

        <section class="admin-panel-card">
          <div class="admin-panel-head">
            <div>
              <h3>Заявки и заказы</h3>
              <p class="muted">Смена статусов, назначение менеджера и внутренний комментарий команды.</p>
            </div>
          </div>
          <div class="admin-order-list">
            ${
              orders.length
                ? orders.map((order) => `
                  <article class="admin-order-card">
                    <div>
                      <h4>${escapeHTML(order.id)} · ${escapeHTML(order.kind || "Заявка")}</h4>
                      <p class="muted">${escapeHTML(order.customer?.name || "Клиент")} · ${escapeHTML(order.customer?.phone || order.customer?.email || "контакт не указан")} · ${plural((order.items || []).length, ["позиция", "позиции", "позиций"])}</p>
                    </div>
                    <div class="admin-controls order-admin-controls">
                      <label>
                        <span>Статус</span>
                        <select class="input select" data-admin-order-status="${escapeAttr(order.id)}">
                          ${orderStatuses.map((status) => `<option value="${status}" ${order.status === status ? "selected" : ""}>${escapeHTML(status)}</option>`).join("")}
                        </select>
                      </label>
                      <label>
                        <span>Менеджер</span>
                        <input class="input" data-admin-order-manager="${escapeAttr(order.id)}" value="${escapeAttr(order.manager || "")}" />
                      </label>
                      <label>
                        <span>Комментарий команды</span>
                        <input class="input" data-admin-order-note="${escapeAttr(order.id)}" value="${escapeAttr(order.teamNote || "")}" />
                      </label>
                    </div>
                  </article>`).join("")
                : `<p class="muted">Заявок пока нет.</p>`
            }
          </div>
        </section>
      </div>`;
  }

  function customerFields() {
    return `
      <fieldset class="account-fieldset">
        <legend>Тип клиента</legend>
        <label class="radio-row"><input type="radio" name="clientType" value="person" ${(profile?.clientType || "person") === "person" ? "checked" : ""} /> <span>Физлицо</span></label>
        <label class="radio-row"><input type="radio" name="clientType" value="legal" ${(profile?.clientType || "person") === "legal" ? "checked" : ""} /> <span>Юрлицо</span></label>
      </fieldset>
      <p class="client-type-hint" data-client-hint></p>
      ${profileFormFields(profile || {}, { context: "checkout", flexibleContact: true })}
      ${consentField("Даю согласие на обработку персональных данных и принимаю Политику конфиденциальности.", "checkout-form", profile?.consentDetails)}`;
  }

  function antiSpamFields() {
    return `<input type="text" name="website" tabindex="-1" autocomplete="off" class="visually-hidden" aria-hidden="true" />`;
  }

  function consentField(text = "Даю согласие на обработку персональных данных", source = "form", details = null) {
    const label = escapeHTML(text).replace(
      "Политику конфиденциальности",
      `<a href="#privacy">Политику конфиденциальности</a>`
    );
    const accepted = normalizeConsentDetails(details).accepted;
    return `
      <label class="consent-check">
        <input type="checkbox" name="consent" required data-consent-source="${escapeAttr(source)}" data-consent-version="${escapeAttr(PRIVACY_POLICY_VERSION)}" ${accepted ? "checked" : ""} />
        <span>${label}</span>
      </label>`;
  }

  function prefillCustomerForm(form) {
    if (!profile || !form) return;
    for (const key of ["name", "phone", "email", "company", "inn", "kpp", "requisites"]) {
      const field = form.elements[key];
      if (field) field.value = profile[key] || "";
    }
    if (form.elements.clientType) {
      const target = form.querySelector(`[name="clientType"][value="${escapeAttr(profile.clientType || "legal")}"]`);
      if (target) target.checked = true;
    }
    form.querySelectorAll('[name="addresses"]').forEach((field) => {
      field.value = (profile.addresses || []).join("\n");
    });
    syncClientTypeFields(form);
  }

  function collectCustomer(form) {
    const data = new FormData(form);
    const clientType = String(data.get("clientType") || profile?.clientType || "person").trim();
    const consentDetails = consentFromForm(form, profile?.consentDetails, "order-form");
    return {
      clientType,
      name: String(data.get("name") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      email: String(data.get("email") || "").trim(),
      company: clientType === "legal" ? String(data.get("company") || "").trim() : "",
      inn: clientType === "legal" ? String(data.get("inn") || "").trim() : "",
      kpp: clientType === "legal" ? String(data.get("kpp") || "").trim() : "",
      requisites: clientType === "legal" ? String(data.get("requisites") || "").trim() : "",
      ...(data.has("addresses") ? { addresses: splitLines(data.get("addresses")) } : {}),
      consent: consentDetails.accepted,
      consentDetails,
    };
  }

  function collectFullProfile(form, existing = {}) {
    const data = new FormData(form);
    const clientType = String(data.get("clientType") || existing.clientType || "person");
    const consentDetails = consentFromForm(
      form,
      existing.consentDetails,
      form.id === "accountAuthForm" ? "account-registration" : "account-profile"
    );
    return normalizeUserRecord({
      ...existing,
      clientType,
      name: String(data.get("name") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      email: String(data.get("email") || "").trim(),
      password: String(data.get("password") || existing.password || "").trim(),
      company: clientType === "legal" ? String(data.get("company") || "").trim() : "",
      inn: clientType === "legal" ? String(data.get("inn") || "").trim() : "",
      kpp: clientType === "legal" ? String(data.get("kpp") || "").trim() : "",
      requisites: clientType === "legal" ? String(data.get("requisites") || "").trim() : "",
      addresses: splitLines(data.get("addresses")),
      consent: consentDetails.accepted,
      consentDetails,
      role: existing.role || "user",
      approval: approvalForClientType(clientType, existing.approval),
      updatedAt: new Date().toISOString(),
    });
  }

  function handleAuthSubmit(form) {
    if (serverMode) {
      serverAuthSubmit(form);
      return;
    }
    if (!validateAntiSpam(form)) {
      showToast("Форма отклонена защитой от спама. Попробуйте еще раз.");
      return;
    }

    const mode = form.dataset.authMode;
    if (mode === "register") {
      if (!validateFlexibleContact(form)) return;
      if (!validateConsent(form)) return;
      if (!validateClientTypeFields(form)) return;
      const newUser = collectFullProfile(form);
      if (findUserByLogin(newUser.email) || findUserByLogin(newUser.phone)) {
        showToast("Такой пользователь уже есть. Войдите по телефону или email.");
        state.accountMode = "login";
        renderAccount();
        return;
      }
      state.pendingAuth = { mode: "register", code: generateCode(), user: newUser };
      renderAccount();
      showToast("Код подтверждения показан в кабинете");
      return;
    }

    const data = new FormData(form);
    const login = String(data.get("login") || "").trim();
    const password = String(data.get("password") || "").trim();
    const user = findUserByLogin(login);
    if (!user) {
      showToast("Пользователь не найден. Зарегистрируйтесь.");
      state.accountMode = "register";
      renderAccount();
      return;
    }
    if (user.blocked) {
      showToast("Пользователь заблокирован. Свяжитесь с менеджером.");
      return;
    }
    if (password && user.password && password !== user.password) {
      showToast("Пароль не подошел. Можно войти по одноразовому коду.");
      return;
    }
    state.pendingAuth = { mode: "login", code: generateCode(), userId: user.id };
    renderAccount();
    showToast("Код подтверждения показан в кабинете");
  }

  function confirmAuthCode(form) {
    if (!validateAntiSpam(form)) {
      showToast("Форма отклонена защитой от спама. Попробуйте еще раз.");
      return;
    }
    const code = String(new FormData(form).get("code") || "").trim();
    if (!state.pendingAuth || code !== state.pendingAuth.code) {
      showToast("Неверный код подтверждения");
      return;
    }

    const user = state.pendingAuth.mode === "register"
      ? state.pendingAuth.user
      : users.find((item) => item.id === state.pendingAuth.userId);
    if (!user) {
      showToast("Не удалось найти пользователя");
      state.pendingAuth = null;
      renderAccount();
      return;
    }

    loginUser(user);
    state.pendingAuth = null;
    state.accountMode = "profile";
    renderAll();
    renderAccount();
    showToast(user.approval === "pending" ? "Регистрация сохранена, юрлицо ожидает проверки" : "Вы вошли в кабинет");
  }

  function updateUserRecord(userId, patch) {
    const index = users.findIndex((user) => user.id === userId);
    if (index < 0) return;
    users[index] = normalizeUserRecord({ ...users[index], ...patch, updatedAt: new Date().toISOString() });
    saveUsers();
    if (profile?.id === userId) {
      profile = users[index];
      saveJSON(STORAGE.profile, profile);
      managerAccess = ["manager", "admin"].includes(profile.role);
      saveJSON(STORAGE.managerAccess, managerAccess);
      renderManagerAccess();
    }
  }

  function updateOrderRecord(orderId, patch) {
    const index = orders.findIndex((order) => order.id === orderId);
    if (index < 0) return;
    orders[index] = { ...orders[index], ...patch, updatedAt: new Date().toISOString() };
    saveJSON(STORAGE.orders, orders);
  }

  function downloadOrderDocument(orderId) {
    const order = orders.find((item) => item.id === orderId);
    if (!order) return;
    const showSku = hasManagerAccess();
    const lines = [
      "Белый Ветер",
      `КП/счет по заявке ${order.id}`,
      `Дата: ${formatDate(order.createdAt)}`,
      `Статус: ${order.status}`,
      `Клиент: ${order.customer?.name || ""}`,
      `Компания: ${order.customer?.company || ""}`,
      `ИНН: ${order.customer?.inn || ""}`,
      `Доставка: ${order.delivery || "не выбрана"}`,
      "",
      "Состав:",
      ...(order.items || []).map((item, index) => {
        const skuPart = showSku ? ` | ${item.sku}` : "";
        return `${index + 1}. ${item.name}${skuPart} | ${item.qty || 1} шт. | ${formatPrice(item.price)}`;
      }),
      "",
      `Итого: ${orderAmountText(order)}`,
      "Финальную цену, наличие и срок поставки подтверждает менеджер.",
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${order.id}-kp.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function validateAntiSpam(form) {
    const startedAt = Number(form.dataset.startedAt || Date.now() - 1000);
    const honey = String(new FormData(form).get("website") || "");
    return Date.now() - startedAt > 450 && honey.length === 0;
  }

  function validateConsent(form) {
    const consent = form.elements.consent;
    if (!consent) return true;
    const message = consent.checked ? "" : "Подтвердите согласие на обработку персональных данных";
    consent.setCustomValidity(message);
    if (message) {
      consent.reportValidity();
      showToast(message);
      return false;
    }
    return true;
  }

  function selectedClientType(form) {
    if (profile?.id && form?.id !== "accountAuthForm") return profile.clientType || "person";
    return String(new FormData(form).get("clientType") || profile?.clientType || "person");
  }

  function syncClientTypeFields(form) {
    if (!form) return;
    const clientType = selectedClientType(form);
    const locked = Boolean(profile?.id && form.id !== "accountAuthForm");
    form.querySelectorAll('[name="clientType"][type="radio"]').forEach((field) => {
      field.checked = field.value === clientType;
      field.disabled = locked;
      field.closest(".account-fieldset")?.classList.toggle("is-locked", locked);
    });
    form.querySelectorAll("[data-client-fields]").forEach((section) => {
      const active = section.dataset.clientFields === clientType;
      section.hidden = !active;
      section.querySelectorAll("input, select, textarea").forEach((field) => {
        field.disabled = !active;
        field.required = active && String(field.dataset.requiredFor || "").split(/\s+/).includes(clientType);
        field.setCustomValidity("");
      });
    });

    const hint = form.querySelector("[data-client-hint]");
    if (hint) {
      hint.textContent = clientType === "legal"
        ? "Для юрлица обязательны контактное лицо, телефон или email, компания и ИНН. После регистрации данные проверит менеджер."
        : "Для физлица достаточно имени, телефона или email и согласия на обработку персональных данных.";
    }
  }

  function validateClientTypeFields(form) {
    syncClientTypeFields(form);
    const clientType = selectedClientType(form);
    if (clientType !== "legal") return true;

    const company = form.querySelector('[data-client-fields="legal"] [name="company"]');
    const inn = form.querySelector('[data-client-fields="legal"] [name="inn"]');
    const innDigits = String(inn?.value || "").replace(/\D/g, "");
    const companyMessage = company?.value.trim() ? "" : "Укажите компанию для юрлица";
    const innMessage = innDigits.length === 10 || innDigits.length === 12
      ? ""
      : "ИНН должен содержать 10 или 12 цифр";

    if (company) company.setCustomValidity(companyMessage);
    if (inn) inn.setCustomValidity(innMessage);

    if (companyMessage) {
      company.reportValidity();
      showToast(companyMessage);
      return false;
    }
    if (innMessage) {
      inn.reportValidity();
      showToast(innMessage);
      return false;
    }
    return true;
  }

  function validateFlexibleContact(form) {
    const phone = form.elements.phone;
    const email = form.elements.email;
    if (!phone || !email) return true;
    phone.required = false;
    email.required = false;
    const hasContact = phone.value.trim().length > 0 || email.value.trim().length > 0;
    const message = hasContact ? "" : "Укажите телефон или email";
    phone.setCustomValidity(message);
    email.setCustomValidity(message);
    if (!hasContact) {
      phone.reportValidity();
      return false;
    }
    return true;
  }

  function clearFlexibleContactValidity(form) {
    const phone = form.elements.phone;
    const email = form.elements.email;
    phone?.setCustomValidity("");
    email?.setCustomValidity("");
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
    saveCart();
    renderCounters();
    trackGoal("add_to_cart", { sku: product.sku });
    showToast(`${product.name} добавлен в корзину`);
  }

  function updateCart(productId, action) {
    const item = cart.find((line) => line.id === productId);
    if (!item) return;
    if (action === "plus") item.qty += 1;
    if (action === "minus") item.qty -= 1;
    if (action === "remove" || item.qty <= 0) cart = cart.filter((line) => line.id !== productId);
    saveCart();
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
    return orderAmounts(cart.map((item) => ({ ...item, price: findProduct(item.id)?.price ?? null }))).total;
  }

  function orderAmounts(items) {
    const unpricedCount = items.filter((item) => item.price === null || item.price === undefined || item.price === "").length;
    const knownSubtotal = Math.round(items.reduce((sum, item) => sum + (Number(item.price) || 0) * item.qty, 0) * 100) / 100;
    const totalComplete = items.length > 0 && unpricedCount === 0;
    return { total: totalComplete ? knownSubtotal : null, knownSubtotal, unpricedCount, totalComplete };
  }

  function orderAmountText(order) {
    const items = order.items || [];
    const amounts = orderAmounts(items);
    if (amounts.totalComplete) return formatPrice(amounts.total);
    return items.some((item) => item.price !== null && item.price !== undefined && item.price !== "")
      ? `Сумма уточняется; известная часть: ${formatPrice(amounts.knownSubtotal)}` : "По запросу";
  }

  function buildOrder(kind, customer, items, comment = "", extras = {}) {
    const orderItems = items.map((item) => {
      const product = findProduct(item.id);
      return {
        id: item.id,
        sku: product?.sku || item.sku || item.id,
        name: product?.name || item.name || "Товар",
        qty: item.qty || 1,
        price: product ? product.price : item.price ?? null,
      };
    });
    return {
      id: `SSC-${String(Date.now()).slice(-8)}`,
      clientRequestId: [...crypto.getRandomValues(new Uint8Array(16))].map((value) => value.toString(16).padStart(2, "0")).join(""),
      kind,
      status: orderStatuses[0],
      createdAt: new Date().toISOString(),
      userId: profile?.id || "",
      customer,
      comment,
      delivery: extras.delivery || "",
      attachmentName: extras.attachmentName || "",
      manager: extras.manager || "",
      teamNote: "",
      comments: [],
      syncProfile: extras.syncProfile !== false,
      items: orderItems,
      ...orderAmounts(orderItems),
      notification: {
        email: "настроенная почта отдела продаж",
        telegram: "sales-team-chat",
        mode: "server-api",
      },
    };
  }

  function submitOrder(order) {
    orders.unshift(order);
    saveJSON(STORAGE.orders, orders);
    if (serverMode) return order;
    if (profile?.id && order.syncProfile !== false) {
      updateActiveUser(order.customer);
    } else {
      profile = { ...profile, ...order.customer };
      saveJSON(STORAGE.profile, profile);
    }
    trackGoal("lead_submit", { kind: order.kind, items: order.items.length });
    return order;
  }

  function updateStoredOrder(order) {
    const index = orders.findIndex((item) => item.id === order.id);
    if (index >= 0) orders[index] = order;
    saveJSON(STORAGE.orders, orders);
  }

  async function sendOrderNotification(order, form) {
    if (serverMode) {
      await serverReady;
      if (!serverAccountReady) throw new Error(serverAccountError);
      form.dataset.orderRequestId ||= order.clientRequestId;
      order.clientRequestId = form.dataset.orderRequestId;
      const result = await apiRequest("/api/lead", { order, antiSpam: { website: String(new FormData(form).get("website") || "") } });
      const localId = order.id;
      const index = orders.findIndex((item) => item.id === localId);
      Object.assign(order, result.order);
      if (index >= 0) orders[index] = order;
      delete form.dataset.orderRequestId;
      return result;
    }
    const formData = new FormData(form);
    const payload = {
      event: "new_lead",
      page: window.location.href,
      order,
      antiSpam: {
        website: String(formData.get("website") || ""),
        startedAt: Number(form.dataset.startedAt || 0),
      },
    };

    const response = await fetch("/api/lead", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    let result = null;
    try {
      result = await response.json();
    } catch {
      result = null;
    }

    if (!response.ok || !result?.ok) {
      throw new Error(result?.message || "Не удалось отправить заявку менеджеру.");
    }

    order.status = "В обработке";
    order.notification = {
      ...order.notification,
      mode: "server-api",
      deliveries: result.deliveries || [],
    };
    updateStoredOrder(order);
    trackGoal("lead_send_success", { kind: order.kind, items: order.items.length });
    return result;
  }

  async function submitLeadOrder(order, form) {
    const submitButton = form.querySelector('button[type="submit"]');
    setSubmitState(submitButton, true);
    showFormStatus(form, "sending", "Отправляем заявку менеджеру...");
    try {
      const result = await sendOrderNotification(order, form);
      showFormStatus(form, "success", "Заявка сохранена. Менеджер подтвердит наличие, цену с НДС и срок поставки.");
      showToast(`Заявка ${order.id} принята`);
      return { ok: true, result };
    } catch (error) {
      if (serverMode) {
        showFormStatus(form, "error", `${error?.message || "Нет связи с сервером."} Повторите отправку: повторная заявка не будет создана.`);
        showToast("Не удалось подтвердить приём заявки");
        return { ok: false, error };
      }
      order.status = "Сохранена локально, уведомление не отправлено";
      order.notification = {
        ...order.notification,
        mode: "server-api-error",
        error: error?.message || "Ошибка отправки",
      };
      updateStoredOrder(order);
      showFormStatus(form, "error", `${error?.message || "Отправка не прошла."} Заявка сохранена в истории.`);
      showToast(`Заявка ${order.id} сохранена, но не отправлена`);
      trackGoal("lead_send_error", { kind: order.kind });
      return { ok: false, error };
    } finally {
      setSubmitState(submitButton, false);
    }
  }

  function setSubmitState(button, busy) {
    if (!button) return;
    if (busy) {
      button.dataset.originalText = button.textContent;
      button.textContent = "Отправляем...";
    } else if (button.dataset.originalText) {
      button.textContent = button.dataset.originalText;
      delete button.dataset.originalText;
    }
    button.disabled = busy;
  }

  function showFormStatus(form, type, message) {
    let status = form.querySelector("[data-form-status]");
    if (!status) {
      status = document.createElement("p");
      status.dataset.formStatus = "";
      status.setAttribute("role", "status");
      status.setAttribute("aria-live", "polite");
      const submitButton = form.querySelector('button[type="submit"]');
      const anchor = submitButton?.closest(".form-actions") || submitButton;
      if (anchor?.parentElement === form) form.insertBefore(status, anchor);
      else form.append(status);
    }
    status.className = `form-status ${type}`;
    status.textContent = message;
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

  function eventElement(target) {
    return target instanceof Element ? target : target?.parentElement || null;
  }

  function closeDialogFromTrigger(trigger) {
    const dialog = trigger?.closest?.("dialog");
    if (dialog) closeDialog(dialog);
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
    const category = valueByAlias(row, ["category", "категория"]) || "Серверное оборудование";
    const priceRaw = valueByAlias(row, ["price", "цена", "цена с ндс"]).replace(/\s/g, "").replace(",", ".");
    const price = priceRaw === "" ? null : Number(priceRaw);
    const statusRaw = normalize(valueByAlias(row, ["status", "сценарий", "статус продажи"]));
    const stock = valueByAlias(row, ["stock", "наличие", "остаток"]) || "Под заказ";
    const lengthValue = valueByAlias(row, ["length", "длина", "дальность"]);
    const capacityValue = valueByAlias(row, ["capacity", "емкость", "объем"]);
    const compatibility = valueByAlias(row, ["compatibility", "совместимость"])
      .split(/[|,]/)
      .map((item) => item.trim())
      .filter(Boolean);
    return {
      id: slugify(sku),
      category,
      name: valueByAlias(row, ["name", "название", "товар"]) || sku,
      sku,
      brand: valueByAlias(row, ["brand", "бренд", "производитель"]) || "OEM",
      type: valueByAlias(row, ["type", "тип"]) || "Комплектующие",
      interface: valueByAlias(row, ["interface", "интерфейс"]) || "не указан",
      speed: valueByAlias(row, ["speed", "скорость"]) || "не указана",
      length: category === "Накопители" ? "" : lengthValue || "не указана",
      capacity: category === "Накопители" ? capacityValue || lengthValue || "не указана" : capacityValue,
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
        ...(category === "Накопители" ? { Емкость: capacityValue || lengthValue || "не указана" } : { Длина: lengthValue || "не указана" }),
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
    localStorage.setItem(STORAGE.seedVersion, CATALOG_SEED_VERSION);
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
      "category;name;sku;brand;type;interface;speed;length;capacity;connector;compatibility;condition;stock;price;vat;status;description",
      "Трансиверы;SFP28 25G SR 850 нм;SFP28-25G-SR;OEM;SFP28;LC Duplex;25G;100 м;;LC;Cisco|Mellanox|Arista;Новый;В наличии: 14 шт.;6900;с НДС;cart;Трансивер для коротких 25G-соединений внутри ЦОД",
      "Кабели;DAC QSFP28 100G 2 м;DAC-QSFP28-100G-2M;NVIDIA;DAC;QSFP28;100G;2 м;;QSFP28;Mellanox|NVIDIA;Новый;Под заказ: 3 дня;;с НДС;request;Пассивный кабель для 100G-подключений",
      "Накопители;SSD Samsung 980 500GB;SSD-980-500GB;Samsung;SSD;M.2 NVMe;SSD;;500 GB;M.2;Серверы|Рабочие станции;Новый;Под заказ: 2 дня;;с НДС;request;NVMe SSD для серверов и рабочих станций",
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
    renderFacets();
    renderProducts();
  });

  $("#heroSearchForm").addEventListener("submit", (event) => {
    event.preventDefault();
    state.search = refs.heroSearch.value;
    refs.catalogSearch.value = state.search;
    state.page = 1;
    renderFacets();
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
    const target = eventElement(event.target);
    if (!target) return;

    const closeButton = target.closest("[data-dialog-close]");
    if (closeButton) {
      event.preventDefault();
      closeDialogFromTrigger(closeButton);
      return;
    }

    const imageControl = target.closest("[data-image-preview]");
    if (imageControl) {
      openProductImage(imageControl);
      return;
    }

    const galleryControl = target.closest("[data-gallery-step], [data-gallery-index]");
    if (galleryControl) {
      updateProductGallery(galleryControl);
      return;
    }

    const actionButton = target.closest("[data-action]");
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

    const leadButton = target.closest("[data-lead]");
    if (leadButton) openLead(leadButton.dataset.lead);
  });

  function openCartDialog() {
    renderCart();
    openDialog(refs.cartDialog);
  }

  function openAccountDialog() {
    renderAccount();
    openDialog(refs.accountDialog);
    refreshServerOrders();
  }

  $("#cartButton").addEventListener("click", openCartDialog);
  $("#favoritesButton").addEventListener("click", openAccountDialog);
  $("#accountButton").addEventListener("click", openAccountDialog);
  refs.personalDataConsentButton?.addEventListener("click", openConsentDialog);

  document.querySelectorAll("[data-dialog-close]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      closeDialogFromTrigger(button);
    });
  });

  [
    refs.cartDialog,
    refs.productDialog,
    refs.productImageDialog,
    refs.consentDialog,
    refs.leadDialog,
    refs.accountDialog,
  ].forEach((dialog) => {
    dialog?.addEventListener("click", (event) => {
      if (event.target === dialog) closeDialog(dialog);
    });
  });

  refs.mobileMenuButton?.addEventListener("click", () => {
    setMobileMenu(refs.mobileMenuPanel?.hidden !== false);
  });

  refs.mobileMenuPanel?.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMobileMenu();
  });

  refs.mobileAccountButton?.addEventListener("click", () => {
    closeMobileMenu();
    openAccountDialog();
  });

  refs.mobileFavoritesButton?.addEventListener("click", () => {
    closeMobileMenu();
    openAccountDialog();
  });

  document.addEventListener("click", (event) => {
    if (refs.mobileMenuPanel?.hidden !== false) return;
    if (event.target.closest(".site-header")) return;
    closeMobileMenu();
  });

  refs.cartBody.addEventListener("click", (event) => {
    const button = event.target.closest("[data-cart]");
    if (!button) return;
    updateCart(button.dataset.id, button.dataset.cart);
  });

  refs.cartBody.addEventListener("input", (event) => {
    if (event.target?.name === "phone" || event.target?.name === "email") {
      clearFlexibleContactValidity(event.target.form);
    }
  });

  refs.cartBody.addEventListener("change", (event) => {
    if (event.target?.name === "clientType") {
      syncClientTypeFields(event.target.form);
    }
    if (event.target?.name === "consent") {
      event.target.setCustomValidity("");
    }
  });

  refs.cartBody.addEventListener("submit", async (event) => {
    if (event.target.id !== "checkoutForm") return;
    event.preventDefault();
    if (!validateFlexibleContact(event.target)) return;
    if (!validateConsent(event.target)) return;
    if (!validateClientTypeFields(event.target)) return;
    if (!validateAntiSpam(event.target)) {
      showToast("Форма отклонена защитой от спама. Попробуйте еще раз.");
      return;
    }
    const customer = collectCustomer(event.target);
    const data = new FormData(event.target);
    const comment = String(data.get("comment") || "").trim();
    const order = submitOrder(buildOrder("Заказ из корзины", customer, cart, comment));
    const delivery = await submitLeadOrder(order, event.target);
    if (delivery.ok) {
      cart = [];
      saveCart();
      renderCounters();
      renderCart();
    }
  });

  refs.leadForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!validateFlexibleContact(event.target)) return;
    if (!validateConsent(event.target)) return;
    if (!validateClientTypeFields(event.target)) return;
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
    const delivery = await submitLeadOrder(order, event.target);
    if (delivery.ok) event.target.reset();
  });

  refs.leadForm.elements.phone.addEventListener("input", () => clearFlexibleContactValidity(refs.leadForm));
  refs.leadForm.elements.email.addEventListener("input", () => clearFlexibleContactValidity(refs.leadForm));
  refs.leadForm.addEventListener("change", (event) => {
    if (event.target?.name === "clientType") {
      syncClientTypeFields(event.target.form);
    }
    if (event.target?.name === "consent") {
      event.target.setCustomValidity("");
    }
  });

  refs.accountBody.addEventListener("submit", async (event) => {
    if (!["profileForm", "accountAuthForm", "accountCodeForm"].includes(event.target.id)) return;
    event.preventDefault();

    if (event.target.id === "accountAuthForm") {
      handleAuthSubmit(event.target);
      return;
    }

    if (event.target.id === "accountCodeForm") {
      confirmAuthCode(event.target);
      return;
    }

    if (!validateConsent(event.target)) return;
    if (!validateFlexibleContact(event.target)) return;
    if (!validateClientTypeFields(event.target)) return;
    if (!validateAntiSpam(event.target)) {
      showToast("Форма отклонена защитой от спама. Попробуйте еще раз.");
      return;
    }
    if (serverMode) {
      const form = event.target;
      const button = form.querySelector('button[type="submit"]');
      setSubmitState(button, true);
      try {
        const result = await apiRequest("/api/profile", collectFullProfile(form, profile));
        applyServerUser(result.user);
      } catch (error) {
        showFormStatus(form, "error", error.message);
        return;
      } finally {
        setSubmitState(button, false);
      }
    } else updateActiveUser(collectFullProfile(event.target, profile));
    renderAll();
    renderAccount();
    showToast(profile.approval === "pending" ? "Профиль сохранен, юрлицо ожидает проверки" : "Профиль сохранен");
  });

  refs.accountBody.addEventListener("input", (event) => {
    if (event.target?.name === "phone" || event.target?.name === "email") {
      clearFlexibleContactValidity(event.target.form);
    }
  });

  refs.accountBody.addEventListener("change", (event) => {
    if (event.target?.name === "clientType") {
      syncClientTypeFields(event.target.form);
      return;
    }
    if (event.target?.name === "consent") {
      event.target.setCustomValidity("");
    }
  });

  refs.accountBody.addEventListener("click", async (event) => {
    const modeButton = event.target.closest("[data-account-mode]");
    if (modeButton) {
      state.accountMode = modeButton.dataset.accountMode;
      state.pendingAuth = null;
      renderAccount();
      if (state.accountMode === "orders") refreshServerOrders();
      return;
    }

    const accountButton = event.target.closest("[data-account]");
    if (accountButton?.dataset.account === "logout") {
      if (serverMode) {
        try {
          await apiRequest("/api/auth/logout", {});
          logoutUser();
          orders = [];
          serverAccountReady = false;
          serverReady = initializeServer();
          await serverReady;
        } catch {
          showToast("Не удалось выйти. Повторите попытку.");
          return;
        }
      }
      logoutUser();
      state.accountMode = "login";
      renderAll();
      renderAccount();
      showToast("Вы вышли из кабинета");
      return;
    }
    if (accountButton?.dataset.account === "auth-cancel") {
      state.pendingAuth = null;
      renderAccount();
      return;
    }

    const managerButton = event.target.closest("[data-manager]");
    if (managerButton?.dataset.manager === "open") {
      managerAccess = true;
      saveJSON(STORAGE.managerAccess, managerAccess);
      renderManagerAccess();
      renderAdminOps();
      renderAdminSelect();
      renderAccount();
      closeDialog(refs.accountDialog);
      document.querySelector("#admin").scrollIntoView({ behavior: "smooth", block: "start" });
      showToast("Админка открыта в кабинете менеджера");
    }
    if (managerButton?.dataset.manager === "close") {
      managerAccess = false;
      saveJSON(STORAGE.managerAccess, managerAccess);
      renderManagerAccess();
      renderAccount();
      showToast("Админка скрыта из публичного просмотра");
    }

    const favoriteAddButton = event.target.closest("[data-favorite-add]");
    if (favoriteAddButton) {
      addToCart(favoriteAddButton.dataset.favoriteAdd);
      renderAccount();
      return;
    }

    const favoriteRemoveButton = event.target.closest("[data-favorite-remove]");
    if (favoriteRemoveButton) {
      const id = favoriteRemoveButton.dataset.favoriteRemove;
      favorites.delete(id);
      saveJSON(STORAGE.favorites, [...favorites]);
      renderCounters();
      renderProducts();
      renderAccount();
      showToast("Товар убран из избранного");
      return;
    }

    const downloadButton = event.target.closest("[data-download-order]");
    if (downloadButton) {
      downloadOrderDocument(downloadButton.dataset.downloadOrder);
      return;
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

  refs.adminOps?.addEventListener("input", (event) => {
    if (event.target.id !== "adminUserSearch") return;
    state.adminUserSearch = event.target.value;
    renderAdminOps();
    const search = $("#adminUserSearch");
    search?.focus();
    search?.setSelectionRange(search.value.length, search.value.length);
  });

  refs.adminOps?.addEventListener("change", (event) => {
    const approval = event.target.closest("[data-admin-user-approval]");
    if (approval) {
      updateUserRecord(approval.dataset.adminUserApproval, { approval: approval.value });
      renderAll();
      showToast("Статус проверки клиента обновлен");
      return;
    }

    const role = event.target.closest("[data-admin-user-role]");
    if (role) {
      updateUserRecord(role.dataset.adminUserRole, { role: role.value });
      renderAll();
      showToast("Роль пользователя обновлена");
      return;
    }

    const manager = event.target.closest("[data-admin-user-manager]");
    if (manager) {
      updateUserRecord(manager.dataset.adminUserManager, { manager: manager.value.trim() });
      renderAll();
      showToast("Менеджер клиента обновлен");
      return;
    }

    const orderStatus = event.target.closest("[data-admin-order-status]");
    if (orderStatus) {
      updateOrderRecord(orderStatus.dataset.adminOrderStatus, { status: orderStatus.value });
      renderAll();
      showToast("Статус заявки обновлен");
      return;
    }

    const orderManager = event.target.closest("[data-admin-order-manager]");
    if (orderManager) {
      updateOrderRecord(orderManager.dataset.adminOrderManager, { manager: orderManager.value.trim() });
      renderAll();
      showToast("Менеджер заявки обновлен");
      return;
    }

    const orderNote = event.target.closest("[data-admin-order-note]");
    if (orderNote) {
      updateOrderRecord(orderNote.dataset.adminOrderNote, { teamNote: orderNote.value.trim() });
      renderAll();
      showToast("Внутренний комментарий сохранен");
    }
  });

  refs.adminOps?.addEventListener("click", (event) => {
    const blockButton = event.target.closest("[data-admin-user-block]");
    if (!blockButton) return;
    const user = users.find((item) => item.id === blockButton.dataset.adminUserBlock);
    if (!user) return;
    updateUserRecord(user.id, { blocked: !user.blocked });
    renderAll();
    showToast(user.blocked ? "Пользователь разблокирован" : "Пользователь заблокирован");
  });

  $("#loadSampleCsvButton").addEventListener("click", () => {
    if (!requireManagerAccess()) return;
    refs.csvText.value = sampleCsv();
  });

  refs.csvFile.addEventListener("change", async (event) => {
    if (!requireManagerAccess()) return;
    const file = event.target.files?.[0];
    if (!file) return;
    refs.csvText.value = await file.text();
  });

  $("#previewCsvButton").addEventListener("click", () => {
    if (!requireManagerAccess()) return;
    state.csvPreview = parseCsv(refs.csvText.value);
    renderAdminPreview();
    showToast(plural(state.csvPreview.length, ["строка распознана", "строки распознаны", "строк распознано"]));
  });

  $("#mergeCsvButton").addEventListener("click", () => {
    if (!requireManagerAccess()) return;
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
    if (!requireManagerAccess()) return;
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
    if (!requireManagerAccess()) return;
    const blob = new Blob([sampleCsv()], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "beliy-veter-catalog-sample.csv";
    link.click();
    URL.revokeObjectURL(url);
  });

  refs.adminProductSelect.addEventListener("change", (event) => {
    if (!hasManagerAccess()) return;
    fillAdminForm(event.target.value);
  });

  $("#quickEditForm").addEventListener("submit", (event) => {
    event.preventDefault();
    if (!requireManagerAccess()) return;
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
    if (!requireManagerAccess()) return;
    products = structuredClone(seedProducts);
    saveJSON(STORAGE.products, products);
    localStorage.setItem(STORAGE.seedVersion, CATALOG_SEED_VERSION);
    clearFilters();
    renderAll();
    showToast("Excel-каталог восстановлен");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (refs.productImageDialog.open) {
      event.preventDefault();
      closeDialog(refs.productImageDialog);
      return;
    }
    closeMobileMenu();
    for (const dialog of [refs.cartDialog, refs.productDialog, refs.consentDialog, refs.leadDialog, refs.accountDialog]) {
      if (dialog.open) closeDialog(dialog);
    }
  });

  renderAll();
  renderAdminPreview();
  serverReady = initializeServer();
  setInterval(() => {
    if (!document.hidden && refs.accountDialog.open) refreshServerOrders();
  }, 10000);
  window.addEventListener("focus", () => refreshServerOrders());
})();
