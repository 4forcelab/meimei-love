// Scroll reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 70);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Desktop sparkle parallax
if (window.innerWidth > 768) {
  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 18;
    const y = (e.clientY / window.innerHeight - 0.5) * 18;
    document.querySelectorAll('.sugar').forEach((s, i) => {
      const f = (i + 1) * 0.28;
      s.style.transform = `translate(${x * f}px, ${y * f}px)`;
    });
  });
}

// Ambient sugar
const chars = ['✦','✧','˚','⋆'];
const colors = ['var(--pink)','var(--tiff)','var(--pink-d)','var(--brown-l)'];
function sprinkle() {
  if (document.querySelectorAll('.ambient-sugar').length > 10) return;
  const s = document.createElement('span');
  s.className = 'ambient-sugar';
  s.textContent = chars[Math.floor(Math.random() * chars.length)];
  s.style.cssText = `position:fixed;left:${Math.random()*100}vw;top:${20+Math.random()*75}vh;color:${colors[Math.floor(Math.random()*colors.length)]};font-size:${0.55+Math.random()*0.75}rem;pointer-events:none;z-index:1;opacity:0;animation:ambient ${6+Math.random()*6}s ease-in-out forwards;`;
  document.body.appendChild(s);
  setTimeout(() => s.remove(), 13000);
}
const ambientStyle = document.createElement('style');
ambientStyle.textContent = '@keyframes ambient{0%{opacity:0;transform:translateY(0) scale(.8)}20%{opacity:.55}80%{opacity:.25}100%{opacity:0;transform:translateY(-48px) scale(1.15)}}';
document.head.appendChild(ambientStyle);
setInterval(sprinkle, 1300);

// Franchise CTA: self-switching + twitch
const rebelBtn = document.querySelector('.auto-rebel span');
const rebelWrap = document.querySelector('.auto-rebel');
if (rebelBtn && rebelWrap) {
  const rebelLines = ['看看合作', '不服來談', '一起煮火鍋？', '鍋美美缺分身', '你也想起舞嗎？'];
  let rebelIndex = 0;
  setInterval(() => {
    rebelIndex = (rebelIndex + 1) % rebelLines.length;
    rebelBtn.textContent = rebelLines[rebelIndex];
    rebelWrap.classList.add('is-twitching');
    setTimeout(() => rebelWrap.classList.remove('is-twitching'), 320);
  }, 1500);
  function randomTwitch() {
    rebelWrap.classList.add('is-twitching');
    setTimeout(() => rebelWrap.classList.remove('is-twitching'), 320);
    setTimeout(randomTwitch, 2400 + Math.random() * 5200);
  }
  setTimeout(randomTwitch, 1800 + Math.random() * 2500);
}

// True mobile gacha modal: clone the card, do not move the original card.
const gachaBackdrop = document.createElement('div');
gachaBackdrop.className = 'gacha-backdrop';
document.body.appendChild(gachaBackdrop);

const gachaModal = document.createElement('div');
gachaModal.className = 'gacha-modal';
document.body.appendChild(gachaModal);

function closeGacha() {
  gachaBackdrop.classList.remove('show');
  gachaModal.classList.remove('show');
  setTimeout(() => { gachaModal.innerHTML = ''; }, 220);
}

function openGacha(card) {
  const clone = card.cloneNode(true);
  clone.classList.remove('reveal', 'visible', 'is-expanded');
  clone.querySelectorAll('a').forEach(a => a.setAttribute('target', '_blank'));
  gachaModal.innerHTML = '';
  const sticker = document.createElement('span');
  sticker.className = 'gacha-modal-sticker';
  sticker.innerHTML = '<img src="images/meimei-sticker-02.png" alt="鍋美美抽卡驚訝">';
  const hint = document.createElement('div');
  hint.className = 'gacha-modal-hint';
  hint.textContent = '再點一次收回去';
  gachaModal.appendChild(sticker);
  gachaModal.appendChild(clone);
  gachaModal.appendChild(hint);
  requestAnimationFrame(() => {
    gachaBackdrop.classList.add('show');
    gachaModal.classList.add('show');
  });
}

document.querySelectorAll('.store-card').forEach(card => {
  card.addEventListener('click', (e) => {
    if (e.target.closest('a')) return;
    e.preventDefault();
    if (gachaModal.classList.contains('show')) closeGacha();
    else openGacha(card);
  });
});
gachaBackdrop.addEventListener('click', closeGacha);
gachaModal.addEventListener('click', (e) => {
  if (!e.target.closest('a')) closeGacha();
});


// Hidden JoJo-ish logo easter egg: click logo 7 times
let logoClicks = 0;
const logo = document.querySelector('.nav-logo');
if (logo) {
  logo.addEventListener('click', () => {
    logoClicks += 1;
    if (logoClicks >= 7) {
      document.body.classList.toggle('logo-awaken');
      logoClicks = 0;
    }
  });
}


// v3.9: logo easter egg for JOJO / 覺醒鍋美美
(() => {
  const logo = document.querySelector('.nav-logo');
  if (!logo) return;
  let taps = 0;
  let timer = null;
  logo.addEventListener('click', (e) => {
    taps += 1;
    clearTimeout(timer);
    timer = setTimeout(() => { taps = 0; }, 1400);
    if (taps >= 7) {
      e.preventDefault();
      document.body.classList.toggle('jojo-mode');
      taps = 0;
    }
  });
})();


// 4F Claim-Verified modal
function openClaimModal(){
  const modal = document.getElementById('claimModal');
  if (!modal) return;
  modal.classList.add('active');
  modal.setAttribute('aria-hidden','false');
}
function closeClaimModal(){
  const modal = document.getElementById('claimModal');
  if (!modal) return;
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden','true');
}
window.openClaimModal = openClaimModal;
window.closeClaimModal = closeClaimModal;
window.addEventListener('click', (e) => {
  const modal = document.getElementById('claimModal');
  if (modal && e.target === modal) closeClaimModal();
});
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeClaimModal();
});
document.querySelectorAll('.claim-card').forEach(card => {
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openClaimModal();
    }
  });
});


// Gacha-style flavour bubble popup. Shared by /menu/ item cards and the homepage
// marquee chips, so clicking a flavour opens the same card in place (no page jump).
(() => {
  const inlineEl = document.getElementById('menu-bubble-data');
  const marquee = document.querySelector('.menu-marquee');
  if (!inlineEl && !marquee) return; // nothing on this page wants bubbles

  // Reuse the menu page's containers, or create them on the homepage.
  let backdrop = document.getElementById('bubbleBackdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'bubbleBackdrop';
    backdrop.className = 'bubble-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.appendChild(backdrop);
  }
  let modal = document.getElementById('bubbleModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'bubbleModal';
    modal.className = 'bubble-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-hidden', 'true');
    document.body.appendChild(modal);
  }

  const STICKERS = [
    '/images/meimei-sticker-02-nobg.png',
    '/images/meimei-sticker-04-nobg.png',
    '/images/meimei-sticker-06-nobg.png',
    '/images/meimei-sticker-07-nobg.png',
  ];
  const esc = (s) => String(s == null ? '' : s)
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

  let clearTimer = null;
  function closeBubble() {
    backdrop.classList.remove('show');
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    clearTimer = setTimeout(() => { modal.innerHTML = ''; }, 240);
  }

  function openBubble(d, idx) {
    if (!d) return;
    if (clearTimer) { clearTimeout(clearTimer); clearTimer = null; } // don't let a pending close wipe us
    const tags = (d.tags || []).map(t => `<span class="bubble-tag">${esc(t)}</span>`).join('');
    const diet = [];
    if (d.veg) diet.push('素 🌱');
    if (d.egg) diet.push('含蛋');
    if (d.shrimp) diet.push('含蝦');
    const dietLine = diet.length ? `<p class="bubble-diet">${diet.join('・')}</p>` : '';
    const inc = Array.isArray(d.included) && d.included.length
      ? `<p class="bubble-included"><b>${esc(d.includedLabel || '鍋物均含')}</b>${d.included.map(esc).join('・')}</p>`
      : '';
    const note = d.note ? `<p class="bubble-note">${esc(d.note)}</p>` : '';
    const sticker = STICKERS[idx % STICKERS.length];
    modal.innerHTML =
      `<span class="bubble-sticker"><img src="${sticker}" alt="鍋美美"></span>` +
      `<div class="bubble-card">` +
        `<span class="bubble-shine" aria-hidden="true"></span>` +
        `<div class="bubble-kicker">MEI MEI 說</div>` +
        `<h3 class="bubble-name">${esc(d.name)}</h3>` +
        (tags ? `<div class="bubble-tags">${tags}</div>` : '') +
        `<p class="bubble-text">${esc(d.bubble)}</p>` +
        inc +
        dietLine +
        note +
        `<a class="bubble-cta" href="/#order">想吃這鍋 → 去點餐</a>` +
      `</div>` +
      `<div class="bubble-hint">點旁邊收回去</div>`;
    modal.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(() => {
      backdrop.classList.add('show');
      modal.classList.add('show');
    });
  }

  // /menu/ item cards — data embedded inline, keyed by id.
  if (inlineEl) {
    let INLINE = {};
    try { INLINE = JSON.parse(inlineEl.textContent || '{}'); } catch (e) { INLINE = {}; }
    Array.from(document.querySelectorAll('.m-item.has-bubble')).forEach((card, i) => {
      const handler = (e) => {
        if (e.target.closest('a')) return;
        e.preventDefault();
        if (modal.classList.contains('show')) closeBubble();
        else openBubble(INLINE[card.dataset.id], i);
      };
      card.addEventListener('click', handler);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') handler(e);
      });
    });
  }

  // Homepage marquee chips — fetch the shared payload, match chip text to a dish.
  if (marquee) {
    fetch('/data/menu-bubble.json').then((r) => r.json()).then((DATA) => {
      const byName = {};
      Object.values(DATA).forEach((d) => { byName[d.name] = d; });
      marquee.querySelectorAll('.mq-chip').forEach((chip, i) => {
        const raw = chip.childNodes[0] ? chip.childNodes[0].textContent : chip.textContent;
        const name = raw.replace(/🌱/g, '').trim();
        const d = byName[name];
        if (!d) return;
        chip.classList.add('mq-clickable');
        chip.addEventListener('click', (e) => {
          e.preventDefault();
          if (modal.classList.contains('show')) closeBubble();
          else openBubble(d, i);
        });
      });
    }).catch(() => {});
  }

  backdrop.addEventListener('click', closeBubble);
  modal.addEventListener('click', (e) => { if (!e.target.closest('a')) closeBubble(); });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeBubble(); });
})();


// Homepage menu marquee: give each chip a mood (排隊排到生氣的一排鍋), then
// duplicate each set so the -50% translate loops seamlessly (clone carries the moods).
(() => {
  // Signature dishes get a fixed, on-theme emoji; everyone else is a grumpy
  // queue (random from the impatient pool). Matched by substring of the name.
  const FIXED = [
    ['麻辣鍋', '🔥'], ['壽喜', '😌'], ['南瓜', '🎃'], ['牛奶鍋', '🥛'], ['椰奶', '🥥'],
    ['番茄', '🍅'], ['霸總', '💪'], ['火鍋料我都要', '🤩'], ['咖哩', '🍛'], ['黃金', '✨'],
    ['韓式泡菜', '🌶️'],
  ];
  const POOL = ['💢', '😤', '😠', '😒', '🥱', '😮‍💨', '🙄', '🫠', '😣', '😑', '⏳', '😖', '💢', '😤'];
  const moodFor = (name) => {
    for (const [k, e] of FIXED) if (name.includes(k)) return e;
    return POOL[Math.floor(Math.random() * POOL.length)];
  };
  document.querySelectorAll('.menu-marquee .marquee-set .mq-chip').forEach((chip) => {
    const mood = document.createElement('span');
    mood.className = 'mq-mood';
    mood.setAttribute('aria-hidden', 'true');
    mood.textContent = moodFor(chip.textContent.trim());
    chip.appendChild(mood);
  });
  document.querySelectorAll('.menu-marquee .marquee-track').forEach((track) => {
    const set = track.querySelector('.marquee-set');
    if (!set) return;
    const clone = set.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });
})();
