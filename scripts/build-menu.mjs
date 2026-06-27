import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const dataPath = path.join(root, "data", "menu-master.json");
const outputDir = path.join(root, "menu");
const outputPath = path.join(outputDir, "index.html");
const siteUrl = "https://love.4force.com.tw";

const master = JSON.parse(fs.readFileSync(dataPath, "utf8"));
const categories = master.categories || [];
const items = master.items || [];

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const jsonScript = (value) =>
  JSON.stringify(value, null, 2).replaceAll("</", "<\\/");

const byCategory = new Map(categories.map((category) => [category.id, []]));
for (const item of items) {
  if (!byCategory.has(item.category)) byCategory.set(item.category, []);
  byCategory.get(item.category).push(item);
}

const isAddon = (item) => item.category === "addon";
const mainItems = items.filter((item) => !isAddon(item));

const schemaMenuItem = (item) => {
  const menuItem = {
    "@type": "MenuItem",
    "@id": `${siteUrl}/menu/#item-${item.id}`,
    name: item.display_name,
  };

  if (item.alternate_names?.length) {
    menuItem.alternateName = item.alternate_names;
  }

  if (item.short_desc?.trim()) {
    menuItem.description = item.short_desc.trim();
  }

  if (item.dietary?.vegetarian === true) {
    menuItem.suitableForDiet = "https://schema.org/VegetarianDiet";
  }

  return menuItem;
};

const schemaSections = categories.map((category) => {
  const section = {
    "@type": "MenuSection",
    "@id": `${siteUrl}/menu/#section-${category.id}`,
    name: category.display,
    hasMenuItem: (byCategory.get(category.id) || []).map(schemaMenuItem),
  };

  if (category.id === "addon") {
    section.description = "全台統一 add-on 配料，作為火鍋主餐的加點搭配。";
  }

  return section;
});

const menuSchema = {
  "@context": "https://schema.org",
  "@type": "Menu",
  "@id": `${siteUrl}/menu/#menu`,
  name: "鍋美美食豔室全台統一菜單",
  url: `${siteUrl}/menu/`,
  inLanguage: "zh-TW",
  hasMenuItem: mainItems.map((item) => ({
    "@id": `${siteUrl}/menu/#item-${item.id}`,
  })),
  hasMenuSection: schemaSections,
};

const renderTags = (item) => {
  const tags = [];
  if (item.dietary?.vegetarian === true) {
    tags.push('<span class="menu-tag veg">素食（無肉含蛋）</span>');
  }
  if (item.available === false) {
    tags.push('<span class="menu-tag sold-out-tag">補貨中</span>');
  }
  return tags.length ? `<div class="menu-item-tags">${tags.join("")}</div>` : "";
};

const renderItem = (item) => {
  const classes = ["menu-item-card"];
  if (item.dietary?.vegetarian === true) classes.push("is-vegetarian");
  if (item.available === false) classes.push("sold-out");

  return `        <article class="${classes.join(" ")}" data-item-id="${escapeHtml(item.id)}">
          <div class="menu-item-name">
            <h3>${escapeHtml(item.display_name)}</h3>
          </div>
          ${renderTags(item)}
        </article>`;
};

const renderCategoryNav = () =>
  categories
    .map(
      (category) =>
        `<a href="#${escapeHtml(category.id)}">${escapeHtml(category.display)}</a>`,
    )
    .join("\n        ");

const renderSection = (category) => {
  const sectionItems = byCategory.get(category.id) || [];
  const addonNote =
    category.id === "addon"
      ? '<p class="menu-section-note">全台統一加點配料，和主餐分開看，點鍋時再搭配。</p>'
      : "";

  return `    <section id="${escapeHtml(category.id)}" class="menu-category-section reveal${category.id === "addon" ? " addon-section" : ""}">
      <div class="menu-section-title">
        <span>${escapeHtml(category.id === "addon" ? "ADD-ON" : "MENU")}</span>
        <h2>${escapeHtml(category.display)}</h2>
        <small>${sectionItems.length} 項</small>
      </div>
      ${addonNote}
      <div class="menu-item-grid">
${sectionItems.map(renderItem).join("\n")}
      </div>
    </section>`;
};

const html = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>鍋美美菜單｜全台統一火鍋目錄</title>
<meta name="description" content="鍋美美食豔室全台統一菜單目錄。經典人氣鍋、特色風味鍋、草食系暖鍋、粥湯與加點料，一次看清楚。">
<meta name="robots" content="index, follow">
<link rel="canonical" href="${siteUrl}/menu/">
<meta property="og:type" content="website">
<meta property="og:url" content="${siteUrl}/menu/">
<meta property="og:title" content="鍋美美菜單｜全台統一火鍋目錄">
<meta property="og:description" content="想吃什麼鍋，先來這裡看一眼。鍋美美全台共用菜單目錄。">
<meta property="og:image" content="${siteUrl}/images/og-image.jpeg">
<meta property="og:locale" content="zh_TW">
<meta property="og:site_name" content="鍋美美食豔室">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="鍋美美菜單｜全台統一火鍋目錄">
<meta name="twitter:description" content="經典人氣鍋、特色風味鍋、草食系暖鍋、粥湯與加點料。">
<meta name="twitter:image" content="${siteUrl}/images/og-image.jpeg">
<script type="application/ld+json">
${jsonScript(menuSchema)}
</script>
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-9BXZX8ENMZ"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-9BXZX8ENMZ');
</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;500;700;900&family=Kaisei+Opti:wght@400;700&family=Noto+Sans+TC:wght@300;400;500;700;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../css/style.css">
</head>
<body class="menu-page">
<nav class="nav">
  <a class="nav-logo" href="../#hero">鍋美美<span>食豔室</span></a>
  <div class="nav-links">
    <a href="../#order">立即點餐</a>
    <a href="#menu">看菜單</a>
    <a href="../#franchise">一起開店</a>
  </div>
</nav>
<a class="mobile-order" href="../#order">今天辛苦了，點一鍋</a>

<section class="hero menu-hero melt-bg">
  <div class="hero-copy reveal">
    <p class="eyebrow">MEI MEI HOT POT · MENU</p>
    <h1>鍋美美菜單。<br><span>今天想吃哪一鍋？</span></h1>
    <p class="hero-lead">全台共用的火鍋目錄。先看鍋、再選店，剩下的交給鍋美美。</p>
    <div class="hero-actions">
      <a class="btn primary" href="#menu">看完整菜單</a>
      <a class="btn ghost" href="../#order">回首頁點餐</a>
    </div>
    <div class="proof-strip">
      <span>♨ 經典鍋、特色鍋、粥湯一次看</span>
      <span>🥬 素食（無肉含蛋）清楚標記</span>
      <span>🍥 加點料獨立整理，不跟主餐混在一起</span>
    </div>
  </div>
  <div class="hero-art reveal">
    <div class="cream-orbit"></div>
    <img src="../images/hero-pot.png" alt="鍋美美火鍋菜單">
  </div>
  <span class="sugar s1">✦</span><span class="sugar s2">✧</span><span class="sugar s3">⋆</span><span class="sugar s4">✦</span>
</section>

<main id="menu" class="menu-catalog section-white">
  <div class="section-head reveal">
    <p class="eyebrow">MENU CATALOG</p>
    <h2>先不要想太多，<br>先把想吃的圈起來。</h2>
    <p>這裡是總部統一菜單目錄；實際點餐請回到最近的店。</p>
  </div>
  <div class="menu-category-nav reveal" aria-label="菜單分類">
        ${renderCategoryNav()}
  </div>
  <div class="menu-category-stack">
${categories.map(renderSection).join("\n")}
  </div>
</main>

<footer>
  <strong>鍋美美食豔室</strong>
  <span>MEI MEI HOT POT · 時尚外帶火鍋</span>
  <span>品牌母公司：<a class="footer-link" href="https://www.4force.com.tw" target="_blank" rel="noopener">萬合天宜有限公司 · 4force lab</a></span>
  <span class="footer-editorial">Not luxury. Just very serious about hotpot.</span>
  <small>© 2026 鍋美美食豔室 All Rights Reserved</small>
</footer>
<script src="../js/main.js"></script>
</body>
</html>
`;

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputPath, html);

console.log(
  JSON.stringify(
    {
      output: path.relative(root, outputPath),
      categories: categories.length,
      items: items.length,
      topLevelMenuItems: mainItems.length,
      addonItems: items.length - mainItems.length,
    },
    null,
    2,
  ),
);
