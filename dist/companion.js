// Your selected companion stays mounted while the blog changes views.
const pets = {
  moo: {name:'Moo', image:'moo-gamer.png', alt:'Vaquita gamer con audífonos, frente a su computadora', lines:['¡Muuu! Modo gamer activado.','Un writeup más y descansamos.','Buena música, buenos hallazgos.','Aquí me quedo haciendo compañía.']},
  byte: {name:'Byte', image:'byte-htb.png', alt:'Byte con su camiseta de HTB', lines:['¡Guau! Voy contigo.','Una pista a la vez. Tú puedes.','No olvides guardar tus hallazgos.','Un pequeño descanso también ayuda.']}
};
let selected = 'moo', paused = false;
try { const saved=localStorage.getItem('rayx-companion');if(pets[saved])selected=saved;paused=localStorage.getItem('rayx-companion-paused')==='yes'; } catch {}
const companion = document.createElement('aside');
companion.className = 'byte-companion';
companion.setAttribute('aria-label', 'Byte, tu compañero de lectura');
companion.innerHTML = `<p class="byte-message" role="status" aria-live="polite"></p>
  <button class="byte-minimize" aria-label="Ocultar a Byte" title="Ocultar a Byte">−</button>
  <button class="byte-pet" aria-label="Saludar a Byte"><img src="byte-htb.png" width="1280" height="1280" alt="Byte con su camiseta de HTB"><span>BYTE</span></button>
  <div class="pet-controls"><button class="pet-switch" aria-label="Cambiar compañero">Cambiar</button><button class="pet-pause" aria-label="Pausar animación">Ⅱ</button></div>
  <button class="byte-restore" aria-label="Mostrar compañero">🐾 Compañía</button>`;
document.body.append(companion);
let count = 0, timer;
try { companion.classList.toggle('minimized', localStorage.getItem('rayx-byte-hidden') === 'yes'); } catch {}
function setHidden(hidden) {
  companion.classList.toggle('minimized', hidden);
  try { localStorage.setItem('rayx-byte-hidden', hidden ? 'yes' : 'no'); } catch {}
  companion.querySelector(hidden ? '.byte-restore' : '.byte-pet').focus();
}
function speak(message) {
  companion.querySelector('.byte-message').textContent = message;
  companion.classList.remove('byte-hop');
  void companion.offsetWidth;
  companion.classList.add('byte-hop');
  clearTimeout(timer);
  timer = setTimeout(() => { companion.querySelector('.byte-message').textContent = ''; }, 5000);
}
companion.querySelector('.byte-minimize').onclick = () => setHidden(true);
companion.querySelector('.byte-restore').onclick = () => setHidden(false);
function renderPet(){
  const pet=pets[selected],image=companion.querySelector('.byte-pet img');
  companion.dataset.pet=selected;companion.classList.toggle('pet-paused',paused);
  companion.setAttribute('aria-label',pet.name+', tu compañero de lectura');
  image.src=pet.image;image.alt=pet.alt;image.width=selected==='moo'?640:1280;image.height=image.width;
  companion.querySelector('.byte-pet').setAttribute('aria-label','Saludar a '+pet.name);
  companion.querySelector('.byte-pet span').textContent=pet.name.toUpperCase();
  companion.querySelector('.byte-minimize').setAttribute('aria-label','Ocultar a '+pet.name);
  companion.querySelector('.byte-minimize').title='Ocultar a '+pet.name;
  companion.querySelector('.byte-restore').textContent=(selected==='moo'?'🐮 ':'🐾 ')+pet.name;
  companion.querySelector('.byte-restore').setAttribute('aria-label','Mostrar a '+pet.name);
  companion.querySelector('.pet-switch').textContent=selected==='moo'?'Ver a Byte':'Ver a Moo';
  const pause=companion.querySelector('.pet-pause');pause.textContent=paused?'▶':'Ⅱ';pause.setAttribute('aria-label',paused?'Reanudar animación':'Pausar animación');pause.setAttribute('aria-pressed',String(paused));
  avoidDuplicate();
}
companion.querySelector('.pet-switch').onclick=()=>{selected=selected==='moo'?'byte':'moo';count=0;try{localStorage.setItem('rayx-companion',selected);}catch{}renderPet();speak(selected==='moo'?'¡Muuu! Me uno al equipo.':'¡Guau! Aquí sigo.');};
companion.querySelector('.pet-pause').onclick=()=>{paused=!paused;try{localStorage.setItem('rayx-companion-paused',paused?'yes':'no');}catch{}renderPet();};
companion.querySelector('.byte-pet').onclick = () => speak(pets[selected].lines[count++ % pets[selected].lines.length]);
function avoidDuplicate() {
  const hero = document.querySelector('#buddy');
  const rect = hero?.getBoundingClientRect();
  companion.classList.toggle('hero-visible', selected==='byte' && Boolean(rect && rect.bottom > 80 && rect.top < innerHeight - 100));
}
window.addEventListener('hashchange', () => {
  speak(location.hash.startsWith('#/editor') ? '¡Vamos a escribir algo gozu!' : location.hash.startsWith('#/post/') ? 'Me quedo contigo mientras lees.' : '¿Cuál exploramos ahora?');
  requestAnimationFrame(avoidDuplicate);
});
window.addEventListener('scroll', avoidDuplicate, {passive:true});
window.addEventListener('resize', avoidDuplicate);
new MutationObserver(avoidDuplicate).observe(document.querySelector('#app'), {childList:true});
renderPet();
