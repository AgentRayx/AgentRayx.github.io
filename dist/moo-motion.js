const root=document.documentElement;
let timer,manualUntil=0,routineIndex=0;
const routine=['idle','looking','walking','thinking','working','resting','looking','celebrating'];
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const labels={idle:'Moo tomando aire',looking:'Moo mirando alrededor',walking:'Moo caminando por el blog',thinking:'Moo pensando con su laptop',working:'Moo escribiendo con su laptop',resting:'Moo descansando',celebrating:'Moo saltando de alegría'};
const captions={idle:'MOO / TOMANDO AIRE',looking:'MOO / MIRANDO EL CAMPO',walking:'MOO / DE PASEO',thinking:'MOO / PENSANDO',working:'MOO / ESCRIBIENDO',resting:'MOO / DESCANSO CORTO',celebrating:'MOO / ¡SALTO!'};
export function setMooState(state='idle',duration=0){
 if(!labels[state])state='idle';clearTimeout(timer);root.dataset.mooState=state;
 document.querySelectorAll('.moo-sprite').forEach(el=>el.setAttribute('aria-label',labels[state]));
 document.querySelectorAll('.mascot-caption span,.rail-moo-status').forEach(el=>el.textContent=captions[state]);
 const field=document.querySelector('.hero-ground>span:first-child');if(field)field.textContent=captions[state];
 if(duration)timer=setTimeout(()=>setMooState(),duration);
}
function react(state,duration=6000){manualUntil=Date.now()+duration;setMooState(state,duration);}
function stopped(){return document.hidden||root.dataset.motion==='off'||!!document.querySelector('dialog[open]');}
function syncMotion(){root.classList.toggle('moo-stopped',stopped());}
setInterval(()=>{syncMotion();if(stopped()||Date.now()<manualUntil)return;setMooState(routine[routineIndex++%routine.length]);},3200);
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
 if(controls&&!controls.querySelector('.moo-jump-button')){
  const jump=document.createElement('button');jump.className='moo-jump-button';jump.type='button';jump.textContent='¡Salta!';jump.title='Ver a Moo saltar';jump.onclick=()=>react('celebrating',3200);controls.append(jump);
 }
 for(const target of document.querySelectorAll('#buddy,.byte-pet,.rail-moo')){
  if(target.querySelector('.moo-sprite'))continue;
  const sprite=document.createElement('span');sprite.className='moo-sprite';sprite.setAttribute('role','img');sprite.setAttribute('aria-label',labels[root.dataset.mooState]||labels.idle);target.append(sprite);
 }
 document.querySelectorAll('.mascot-caption span,.rail-moo-status').forEach(el=>el.textContent=captions[root.dataset.mooState]||captions.idle);
}
new MutationObserver(()=>{install();syncMotion();}).observe(document.body,{childList:true,subtree:true});install();setMooState('thinking',5000);
new MutationObserver(syncMotion).observe(root,{attributes:true,attributeFilter:['data-motion']});
window.addEventListener('moo-state',e=>react(e.detail?.state,e.detail?.duration||6000));
window.addEventListener('hashchange',()=>react(location.hash.startsWith('#/editor')?'thinking':'idle',4000));
document.addEventListener('input',e=>{if(e.target.id==='pat')return;if(e.target.id==='search')react('thinking');else if(e.target.matches('input,textarea'))react('working');});
document.addEventListener('click',e=>{if(e.target.closest('#buddy,.byte-pet,.rail-moo')&&root.dataset.motion!=='off')react('celebrating',2500);if(e.target.closest('.pet-pause'))syncMotion();});
