const observer=new IntersectionObserver((entries)=>{entries.forEach((entry,i)=>{if(entry.isIntersecting){setTimeout(()=>entry.target.classList.add('visible'),i*70)}})},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

if(window.innerWidth>768){
  document.addEventListener('mousemove',(e)=>{
    const x=(e.clientX/window.innerWidth-.5)*18;
    const y=(e.clientY/window.innerHeight-.5)*18;
    document.querySelectorAll('.sugar').forEach((s,i)=>{const f=(i+1)*.28;s.style.transform=`translate(${x*f}px, ${y*f}px)`;});
  });
}

const chars=['✦','✧','˚','⋆'];
const colors=['var(--pink)','var(--tiff)','var(--pink-d)','var(--brown-l)'];
function sprinkle(){
  if(document.querySelectorAll('.ambient-sugar').length>10)return;
  const s=document.createElement('span');
  s.className='ambient-sugar';
  s.textContent=chars[Math.floor(Math.random()*chars.length)];
  s.style.cssText=`position:fixed;left:${Math.random()*100}vw;top:${20+Math.random()*75}vh;color:${colors[Math.floor(Math.random()*colors.length)]};font-size:${.55+Math.random()*.75}rem;pointer-events:none;z-index:1;opacity:0;animation:ambient ${6+Math.random()*6}s ease-in-out forwards;`;
  document.body.appendChild(s);
  setTimeout(()=>s.remove(),13000);
}
const style=document.createElement('style');
style.textContent='@keyframes ambient{0%{opacity:0;transform:translateY(0) scale(.8)}20%{opacity:.55}80%{opacity:.25}100%{opacity:0;transform:translateY(-48px) scale(1.15)}}';
document.head.appendChild(style);
setInterval(sprinkle,1300);

// Franchise CTA: mobile-friendly self-switching button with occasional twitch
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
  function randomTwitch(){
    rebelWrap.classList.add('is-twitching');
    setTimeout(() => rebelWrap.classList.remove('is-twitching'), 320);
    setTimeout(randomTwitch, 2400 + Math.random() * 5200);
  }
  setTimeout(randomTwitch, 1800 + Math.random() * 2500);
}
