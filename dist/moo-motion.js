const root=document.documentElement;
let timer,manualUntil=0,routineIndex=0;
const routine=['idle','thinking','working','thinking','celebrating','idle'];
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const labels={idle:'Moo descansando con Red Moo',thinking:'Moo pensando con su laptop',working:'Moo trabajando en su laptop',celebrating:'Moo celebrando'};
export function setMooState(state='idle',duration=0){
 if(!labels[state])state='idle';clearTimeout(timer);root.dataset.mooState=state;
 document.querySelectorAll('.moo-sprite').forEach(el=>el.setAttribute('aria-label',labels[state]));
 if(duration)timer=setTimeout(()=>setMooState(),duration);
}
function react(state,duration=6000){manualUntil=Date.now()+duration;setMooState(state,duration);}
function stopped(){return document.hidden||root.dataset.motion==='off'||document.querySelector('.byte-companion')?.classList.contains('pet-paused')||!!document.querySelector('dialog[open]');}
function syncMotion(){root.classList.toggle('moo-stopped',stopped());}
setInterval(()=>{syncMotion();if(stopped()||Date.now()<manualUntil)return;setMooState(routine[routineIndex++%routine.length]);},6500);
document.addEventListener('visibilitychange',syncMotion);
reduced.addEventListener('change',syncMotion);
function install(){
 const controls=document.querySelector('.pet-controls');
 if(controls&&!controls.querySelector('.moo-movement')){
  const button=document.createElement('button');button.className='moo-movement';button.type='button';
  const update=()=>{const enabled=root.classList.contains('moo-motion-enabled');button.textContent=enabled?'Paseo activado':'Activar paseo';button.setAttribute('aria-pressed',String(enabled));button.title='Permitir el paseo de Moo, incluso con movimiento reducido';};
  try{const saved=localStorage.getItem('moo-allow-motion');root.classList.toggle('moo-motion-enabled',saved===null?!reduced.matches:saved==='yes');}catch{root.classList.toggle('moo-motion-enabled',!reduced.matches);}
  button.onclick=()=>{root.classList.toggle('moo-motion-enabled');try{localStorage.setItem('moo-allow-motion',root.classList.contains('moo-motion-enabled')?'yes':'no');}catch{}update();};update();controls.append(button);
 }
 for(const target of document.querySelectorAll('#buddy,.byte-pet')){
  if(target.querySelector('.moo-sprite'))continue;
  const sprite=document.createElement('span');sprite.className='moo-sprite';sprite.setAttribute('role','img');sprite.setAttribute('aria-label',labels[root.dataset.mooState]||labels.idle);target.append(sprite);
 }
}
new MutationObserver(()=>{install();syncMotion();}).observe(document.body,{childList:true,subtree:true});install();setMooState('thinking',5000);
new MutationObserver(syncMotion).observe(root,{attributes:true,attributeFilter:['data-motion']});
window.addEventListener('moo-state',e=>react(e.detail?.state,e.detail?.duration||6000));
window.addEventListener('hashchange',()=>react(location.hash.startsWith('#/editor')?'thinking':'idle',4000));
document.addEventListener('input',e=>{if(e.target.id==='pat')return;if(e.target.id==='search')react('thinking');else if(e.target.matches('input,textarea'))react('working');});
let greeting=0;
document.addEventListener('click',e=>{if(e.target.closest('#buddy,.byte-pet'))react(['thinking','working','celebrating','idle'][greeting++%4],7000);if(e.target.closest('.pet-pause'))syncMotion();});
