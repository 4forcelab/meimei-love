// Scroll reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Sparkle parallax (desktop only)
if (window.innerWidth > 768) {
  document.addEventListener('mousemove', (e) => {
    const sparkles = document.querySelectorAll('.sparkle');
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    sparkles.forEach((s, i) => {
      const f = (i + 1) * 0.35;
      s.style.transform = `translate(${x*f}px, ${y*f}px)`;
    });
  });
}

// Floating ambient sparkles (lightweight, CSS-driven)
const SPARKLE_CHARS = ['✦','✧','·','˚','⋆'];
const SPARKLE_COLORS = ['var(--pink)','var(--tiff)','var(--pink-d)','var(--brown-l)'];
function createAmbientSparkle() {
  const s = document.createElement('span');
  s.className = 'sparkle-global';
  s.textContent = SPARKLE_CHARS[Math.floor(Math.random() * SPARKLE_CHARS.length)];
  s.style.color = SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)];
  s.style.left = Math.random() * 100 + 'vw';
  s.style.top = (20 + Math.random() * 70) + 'vh';
  s.style.animationDelay = Math.random() * 4 + 's';
  s.style.animationDuration = (6 + Math.random() * 6) + 's';
  s.style.fontSize = (0.6 + Math.random() * 0.8) + 'rem';
  document.body.appendChild(s);
  // Remove after animation to keep DOM clean
  setTimeout(() => s.remove(), 14000);
}
// Spawn one every 1.5s, max 8 at a time
let sparkleCount = 0;
const sparkleInterval = setInterval(() => {
  if (document.querySelectorAll('.sparkle-global').length < 8) {
    createAmbientSparkle();
  }
}, 1500);
