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
      const f = (i + 1) * 0.4;
      s.style.transform = `translate(${x*f}px, ${y*f}px)`;
    });
  });
}
