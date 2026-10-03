const root=document.documentElement;
let timer;
const labels={idle:'Moo descansando con Red Moo',thinking:'Moo pensando con su laptop',working:'Moo trabajando en su laptop',celebrating:'Moo celebrando'};
export function setMooState(state='idle',duration=0){
 if(!labels[state])state='idle';clearTimeout(timer);root.dataset.mooState=state;
 document.querySelectorAll('.moo-sprite').forEach(el=>el.setAttribute('aria-label',labels[state]));
 if(duration)timer=setTimeout(()=>setMooState(),duration);
}
function install(){
 for(const target of document.querySelectorAll('#buddy,.byte-pet')){
  if(target.querySelector('.moo-sprite'))continue;
  const sprite=document.createElement('span');sprite.className='moo-sprite';sprite.setAttribute('role','img');sprite.setAttribute('aria-label',labels[root.dataset.mooState]||labels.idle);target.append(sprite);
 }
}
new MutationObserver(install).observe(document.body,{childList:true,subtree:true});install();setMooState();
window.addEventListener('moo-state',e=>setMooState(e.detail?.state,e.detail?.duration));
window.addEventListener('hashchange',()=>setMooState(location.hash.startsWith('#/editor')?'thinking':'idle',2500));
document.addEventListener('input',e=>{if(e.target.id==='pat')return;if(e.target.id==='search')setMooState('thinking',1300);else if(e.target.matches('input,textarea'))setMooState('working',2000);});
document.addEventListener('click',e=>{if(e.target.closest('#buddy,.byte-pet'))setMooState('celebrating',2000);});
