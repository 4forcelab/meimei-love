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
    if (window.innerWidth > 600) return;
    e.preventDefault();
    if (gachaModal.classList.contains('show')) closeGacha();
    else openGacha(card);
  });
});
gachaBackdrop.addEventListener('click', closeGacha);
gachaModal.addEventListener('click', (e) => {
  if (!e.target.closest('a')) closeGacha();
});
window.addEventListener('resize', () => { if (window.innerWidth > 600) closeGacha(); });

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
