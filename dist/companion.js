// Byte stays mounted while the blog changes views.
const companion = document.createElement('aside');
companion.className = 'byte-companion';
companion.setAttribute('aria-label', 'Byte, tu compañero de lectura');
companion.innerHTML = `<p class="byte-message" role="status" aria-live="polite"></p>
  <button class="byte-minimize" aria-label="Ocultar a Byte" title="Ocultar a Byte">−</button>
  <button class="byte-pet" aria-label="Saludar a Byte"><img src="byte-htb.png" width="1280" height="1280" alt="Byte con su camiseta de HTB"><span>BYTE</span></button>
  <button class="byte-restore" aria-label="Mostrar a Byte">🐾 Byte</button>`;
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
companion.querySelector('.byte-pet').onclick = () => speak([
  '¡Guau! Voy contigo.', 'Una pista a la vez. Tú puedes.',
  'No olvides guardar tus hallazgos.', 'Un pequeño descanso también ayuda.'
][count++ % 4]);
function avoidDuplicate() {
  const hero = document.querySelector('#buddy');
  const rect = hero?.getBoundingClientRect();
  companion.classList.toggle('hero-visible', Boolean(rect && rect.bottom > 80 && rect.top < innerHeight - 100));
}
window.addEventListener('hashchange', () => {
  speak(location.hash.startsWith('#/editor') ? '¡Vamos a escribir algo gozu!' : location.hash.startsWith('#/post/') ? 'Me quedo contigo mientras lees.' : '¿Cuál exploramos ahora?');
  requestAnimationFrame(avoidDuplicate);
});
window.addEventListener('scroll', avoidDuplicate, {passive:true});
window.addEventListener('resize', avoidDuplicate);
new MutationObserver(avoidDuplicate).observe(document.querySelector('#app'), {childList:true});
avoidDuplicate();
