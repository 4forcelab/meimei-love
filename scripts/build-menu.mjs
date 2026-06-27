import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const dataPath = path.join(root, "data", "menu-master.json");
const outputDir = path.join(root, "menu");
const outputPath = path.join(outputDir, "index.html");
const siteUrl = "https://love.4force.com.tw";

const master = JSON.parse(fs.readFileSync(dataPath, "utf8"));
const categories = master.categories || [];
const sourceItems = master.items || [];
const items = sourceItems.filter((item) => item.available !== false);

const sectionCopy = {
  signature: {
    eyebrow: "CLASSIC",
    tail: "經典就是經典，閉著眼睛點都不會錯。",
  },
  specialty: {
    eyebrow: "SPECIALTY",
    tail: "想換點口味的，這區很危險，每個都想點。",
  },
  sauerkraut: {
    eyebrow: "SAUERKRAUT",
    tail: "東北來的，酸得有道理。",
  },
  choice_saver: {
    eyebrow: "CAN'T DECIDE",
    tail: "選不出來？這區專門治你。",
  },
  veg_pot: {
    eyebrow: "VEGETARIAN",
    tail: "吃素也可以吃得很爽，這區整排都是。",
  },
  porridge: {
    eyebrow: "PORRIDGE",
    tail: "想喝粥的日子，鍋美美也有。",
  },
  side: {
    eyebrow: "COOL SIDES",
    tail: "天氣熱，配點涼的。",
  },
  addon: {
    eyebrow: "ADD-ONS",
    tail: "點鍋的時候再搭。",
  },
};

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const jsonScript = (value) => JSON.stringify(value).replaceAll("</", "<\\/");

const byCategory = new Map(categories.map((category) => [category.id, []]));
for (const item of items) {
  if (!byCategory.has(item.category)) byCategory.set(item.category, []);
  byCategory.get(item.category).push(item);
}

const schemaMenuItem = (item) => {
  const menuItem = {
    "@type": "MenuItem",
    name: item.display_name,
  };

  if (item.dietary?.vegetarian === true) {
    menuItem.suitableForDiet = "https://schema.org/VegetarianDiet";
  }

  return menuItem;
};

const menuSchema = {
  "@context": "https://schema.org",
  "@type": "Menu",
  "@id": `${siteUrl}/menu/#menu`,
  name: "鍋美美食豔室 菜單",
  inLanguage: "zh-TW",
  hasMenuSection: categories.map((category) => ({
    "@type": "MenuSection",
    name: category.display,
    hasMenuItem: (byCategory.get(category.id) || []).map(schemaMenuItem),
  })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "鍋美美食豔室",
      item: `${siteUrl}/`,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "菜單",
      item: `${siteUrl}/menu/`,
    },
  ],
};

const renderVegTag = (item) =>
  item.dietary?.vegetarian === true ? '<span class="m-veg">素 🌱</span>' : "";

const renderItem = (item) =>
  `      <li class="m-item">${escapeHtml(item.display_name)}${renderVegTag(item)}</li>`;

const renderSection = (category) => {
  const copy = sectionCopy[category.id] || { eyebrow: "MENU", tail: "" };
  const sectionItems = byCategory.get(category.id) || [];
  const gridClass = category.id === "addon" ? "m-grid m-grid-dense" : "m-grid";

  return `  <section class="m-section reveal" id="cat-${escapeHtml(category.id)}">
    <div class="m-head">
      <p class="eyebrow">${escapeHtml(copy.eyebrow)}</p>
      <h2>${escapeHtml(category.display)}</h2>
      <p class="m-tail">${escapeHtml(copy.tail)}</p>
    </div>
    <ul class="${gridClass}">
${sectionItems.map(renderItem).join("\n")}
    </ul>
    <div class="m-order-link"><a class="btn ghost" href="/#order">這區看到喜歡的 → 立即點餐</a></div>
  </section>`;
};

const html = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>菜單｜鍋美美食豔室・時尚外帶火鍋・屏東外送</title>
<meta name="description" content="鍋美美食豔室完整菜單：經典人氣鍋、特色風味鍋、東北酸白菜鍋、草食系暖鍋、粥品、消暑小菜與加點料。素食標記清楚。今天辛苦了，火鍋交給我。">
<meta name="keywords" content="鍋美美菜單,鍋美美火鍋菜單,屏東外帶火鍋菜單,素食火鍋,內埔火鍋外送,時尚外帶火鍋">
<meta name="author" content="鍋美美食豔室 · 萬合天宜有限公司">
<meta name="robots" content="index, follow">
<link rel="canonical" href="${siteUrl}/menu/">
<meta property="og:type" content="website">
<meta property="og:url" content="${siteUrl}/menu/">
<meta property="og:title" content="菜單｜鍋美美食豔室">
<meta property="og:description" content="鍋美美完整菜單。經典鍋、風味鍋、草食系、粥品、加點料，素食標記清楚。">
<meta property="og:image" content="${siteUrl}/images/og-image.jpeg">
<meta property="og:locale" content="zh_TW">
<meta property="og:site_name" content="鍋美美食豔室">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="菜單｜鍋美美食豔室">
<meta name="twitter:image" content="${siteUrl}/images/og-image.jpeg">

<script type="application/ld+json">
${jsonScript(menuSchema)}
</script>
<script type="application/ld+json">
${jsonScript(breadcrumbSchema)}
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

<style>
/* ===== /menu/ 菜單頁專屬樣式 =====
   注意：hero 沿用主站 .hero/.melt-bg/.sugar class（特效定義在 style.css）。
   下方只補目錄版型（m-* 系列），不重複定義主站已有的視覺。 */
:root{
  --m-cream:#FBF4E9; --m-cream2:#F6E8D6; --m-brown:#7B553A;
  --m-ink:#4A3826; --m-ink-soft:#8A7359; --m-gold:#C9923E; --m-veg:#5E8B4C;
  --m-line:rgba(123,85,58,.14);
}
.menu-wrap{background:var(--m-cream);color:var(--m-ink);font-family:'Noto Sans TC',sans-serif;}

/* hero：縮短高度、收掉超大留白。文字置中，沿用 melt-bg 背景與 .sugar 星星 */
.menu-hero{min-height:auto;padding:128px 6vw 64px;text-align:center;position:relative;overflow:hidden;isolation:isolate;}
.menu-hero.melt-bg::before{z-index:0;inset:6% -7% auto auto;width:min(42vw,520px);height:min(48vh,430px);opacity:.62;pointer-events:none;}
.menu-hero > :not(.sugar){position:relative;z-index:2;}
.menu-hero .sugar{z-index:3;}
.menu-hero .eyebrow{color:var(--m-gold);letter-spacing:.28em;font-size:.78rem;font-weight:700;}
.menu-hero h1{font-family:'Zen Maru Gothic',sans-serif;font-weight:900;font-size:clamp(2rem,5.5vw,3.4rem);line-height:1.25;margin:.5em 0 .35em;color:var(--m-brown);}
.menu-hero p.lead{font-size:1.05rem;color:var(--m-ink-soft);max-width:30em;margin:0 auto;line-height:1.85;}
.menu-hero .note{margin-top:1.4em;font-size:.86rem;color:var(--m-ink-soft);opacity:.85;}

.m-section{max-width:1080px;margin:0 auto;padding:50px 6vw;border-bottom:1px solid var(--m-line);position:relative;isolation:isolate;overflow:hidden;}
.m-section::before{content:"";position:absolute;inset:0 calc(50% - 50vw);z-index:0;pointer-events:none;}
.m-section::after{position:absolute;z-index:0;pointer-events:none;font-family:var(--round);font-weight:900;font-size:1.1rem;opacity:.28;animation:sparkle 4.8s ease-in-out infinite;}
.m-section > *{position:relative;z-index:1;}
.m-section:nth-of-type(odd)::before{background:radial-gradient(ellipse at 16% 18%,rgba(253,221,232,.22),transparent 34%),linear-gradient(180deg,rgba(255,245,240,.82),rgba(255,249,244,.9) 18%,rgba(255,245,240,.86) 82%,rgba(255,250,248,.78));}
.m-section:nth-of-type(even)::before{background:radial-gradient(ellipse at 82% 16%,rgba(255,250,248,.62),transparent 38%),linear-gradient(180deg,rgba(255,245,240,.78),rgba(214,239,236,.58) 18%,rgba(214,239,236,.44) 82%,rgba(255,245,240,.74));}
.m-section:nth-of-type(odd)::after{content:"⋆";right:calc(50% - 45vw);top:18%;color:var(--pink-d);}
.m-section:nth-of-type(even)::after{content:"✦";left:calc(50% - 44vw);bottom:18%;color:var(--tiff-d);animation-delay:.7s;}
.m-head{margin-bottom:1.7em;}
.m-head .eyebrow{color:var(--m-gold);letter-spacing:.24em;font-size:.74rem;font-weight:700;}
.m-head h2{font-family:'Zen Maru Gothic',sans-serif;font-weight:900;font-size:clamp(1.5rem,3.6vw,2.1rem);color:var(--m-brown);margin:.25em 0 .15em;}
.m-tail{color:var(--m-ink-soft);font-size:.96rem;}

.m-grid{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px;}
.m-grid-dense{grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:9px;}
.m-item{background:#fff;border:1px solid var(--m-line);border-radius:14px;padding:15px 17px;font-size:1.02rem;font-weight:500;color:var(--m-ink);display:flex;align-items:center;justify-content:space-between;gap:8px;transition:.18s ease;}
.m-grid-dense .m-item{padding:12px 14px;font-size:.96rem;border-radius:11px;}
.m-item:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(123,85,58,.1);border-color:rgba(201,146,62,.4);}
.m-veg{flex:none;font-size:.72rem;font-weight:700;color:var(--m-veg);background:rgba(94,139,76,.12);border-radius:999px;padding:3px 9px;white-space:nowrap;}

.m-order-link{margin-top:1.8em;}
.menu-wrap .btn.ghost{display:inline-block;border:1.5px solid var(--m-brown);color:var(--m-brown);background:transparent;padding:11px 22px;border-radius:999px;font-weight:700;font-size:.95rem;text-decoration:none;transition:.18s;}
.menu-wrap .btn.ghost:hover{background:var(--m-brown);color:#fff;}

.veg-statement{max-width:760px;margin:0 auto;padding:46px 6vw 10px;color:var(--m-ink-soft);font-size:.9rem;line-height:1.85;}
.veg-statement h3{font-family:'Zen Maru Gothic',sans-serif;color:var(--m-brown);font-size:1.05rem;margin-bottom:.6em;font-weight:700;}
.veg-statement .veg-tag{color:var(--m-veg);font-weight:700;}

.menu-wrap .nav-links a.active{color:var(--m-gold);font-weight:700;}
.menu-back{display:inline-block;margin:24px 6vw 0;color:var(--m-ink-soft);text-decoration:none;font-size:.92rem;}
.menu-back:hover{color:var(--m-brown);}
@media(max-width:600px){
  .menu-hero{padding:104px 6vw 46px;}
  .menu-hero.melt-bg::before{top:14%;right:-26%;width:88vw;height:36vh;opacity:.48;}
  .m-section{padding:40px 5vw;}
  .m-section::after{font-size:.9rem;opacity:.2;}
}
</style>
</head>
<body class="menu-wrap">

<nav class="nav">
  <a class="nav-logo" href="/">鍋美美<span>食豔室</span></a>
  <div class="nav-links">
    <a href="/#order">立即點餐</a>
    <a href="/menu/" class="active">看菜單</a>
    <a href="/#mood">鍋美美是誰</a>
    <a href="/#franchise">一起開店</a>
  </div>
</nav>

<header class="menu-hero melt-bg">
  <p class="eyebrow">MEI MEI HOT POT · MENU</p>
  <h1>先看看有什麼鍋，<br>再決定今天要被哪一鍋拯救。</h1>
  <p class="lead">經典鍋、風味鍋、草食系、粥品、加點料，慢慢看。<br>選好了再去最近的店點，鍋美美處理。</p>
  <p class="note">標 <span style="color:#5E8B4C;font-weight:700;">素 🌱</span> 的是素食品項 · 點餐請至各店外送平台</p>
  <span class="sugar s1">✦</span><span class="sugar s2">✧</span><span class="sugar s3">⋆</span><span class="sugar s4">✦</span>
</header>

${categories.map(renderSection).join("\n\n")}

<a class="menu-back" href="/#order">← 回首頁，直接點餐</a>

<section class="veg-statement reveal">
  <h3>關於素食，鍋美美想老實說</h3>
  <p>標示 <span class="veg-tag">素 🌱</span> 的品項為<strong>鍋邊素（無肉）</strong>，可能含蛋。鍋美美煮素鍋時會盡力把鍋具、湯底分開處理，但我們是葷素共用的廚房，<strong>不做純素、五辛全淨或宗教潔淨等級的認證保證</strong>。</p>
  <p>我們只承諾守得住的事：標素的，就是無肉。其餘的細節（含蛋、五辛、鍋具分離程度），我們誠實告訴你，讓你依自己的標準自己決定。做得乾淨是我們的本分，但本分不等於認證——這點我們不裝。</p>
</section>

<footer>
  <strong>鍋美美食豔室</strong>
  <span>MEI MEI HOT POT · 時尚外帶火鍋</span>
  <span>品牌母公司：<a class="footer-link" href="https://www.4force.com.tw" target="_blank" rel="noopener">萬合天宜有限公司 · 4force lab</a></span>
  <span class="footer-editorial">Not luxury. Just very serious about hotpot.</span>
  <small>© 2026 鍋美美食豔室 All Rights Reserved</small>
</footer>

<script src="../js/main.js"></script>
<script>
(function(){
  try {
    console.log('%c鍋美美食豔室｜MENU', 'background:#7B553A;color:#fff;padding:8px 14px;border-radius:999px;font-size:14px;font-weight:bold;');
    console.log('\\n你連菜單頁都要打開 DevTools？\\n\\n餓的話前面有得點 👉 https://love.4force.com.tw/#order\\n\\n想加盟的話：0900-489-893\\n母公司：https://www.4force.com.tw\\n\\n4force lab × 鍋美美食豔室');
  } catch(e) {}
  // reveal fallback：若 main.js 的 IntersectionObserver 未涵蓋本頁元素，確保內容可見
  setTimeout(function(){
    document.querySelectorAll('.reveal').forEach(function(el){
      if(getComputedStyle(el).opacity==='0'){el.style.opacity=1;el.style.transform='none';}
    });
  }, 600);
})();
</script>

</body>
</html>
`;

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputPath, html);

const hiddenItems = sourceItems.filter((item) => item.available === false);

console.log(
  JSON.stringify(
    {
      output: path.relative(root, outputPath),
      categories: categories.length,
      sourceItems: sourceItems.length,
      renderedItems: items.length,
      hiddenItems: hiddenItems.map((item) => item.display_name),
    },
    null,
    2,
  ),
);
