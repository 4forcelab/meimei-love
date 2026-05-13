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
