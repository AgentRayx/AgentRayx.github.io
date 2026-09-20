import {escape, safeUrl} from './markdown.js';

export function coverUrl(value) {
  if (typeof value !== 'string') return '';
  if (/^(?:uploads|assets)\/[a-z0-9_-]+\.(?:png|jpe?g|webp|gif)$/i.test(value)) return value;
  return safeUrl(value, true);
}

export function coverImage(post, className = 'article-cover') {
  const src = coverUrl(post.cover);
  return src ? `<img class="${className}" src="${escape(src)}" alt="${escape(post.coverAlt || `Portada de ${post.title || 'la entrada'}`)}" loading="lazy">` : '';
}

export function coverFields(post) {
  return `<fieldset class="cover-field"><legend>Portada del writeup</legend>
    <div class="cover-picker">
      <div class="cover-thumbnail">${coverImage(post, 'cover-thumb-image') || '<span aria-hidden="true">▧</span><span>Tu writeup, de un vistazo</span>'}</div>
      <div class="cover-controls"><p>Elige una imagen que lo identifique en el archivo.</p>
        <div class="actions"><button type="button" class="btn secondary" id="choose-cover">${coverUrl(post.cover) ? 'Cambiar portada' : '+ Subir portada'}</button>${coverUrl(post.cover) ? '<button type="button" class="btn secondary" id="remove-cover">Quitar</button>' : ''}</div>
        <p class="hint">PNG, JPG o WebP · hasta 8 MB. Se optimiza automáticamente.</p>
        <label for="cover-alt">Descripción de la imagen</label><input id="cover-alt" maxlength="180" value="${escape(post.coverAlt || '')}" placeholder="Ej.: pantalla de la máquina resuelta">
      </div>
    </div><input type="file" id="cover-file" accept="image/png,image/jpeg,image/webp" hidden>
  </fieldset>`;
}

export async function prepareCover(file) {
  if (!['image/png','image/jpeg','image/webp'].includes(file.type)) throw Error('Elige una imagen PNG, JPG o WebP.');
  if (file.size > 8 * 1024 * 1024) throw Error('La portada debe pesar menos de 8 MB.');
  const bitmap = await createImageBitmap(file).catch(() => { throw Error('No se pudo leer esa imagen. Prueba con otro archivo.'); });
  try {
    if (bitmap.width * bitmap.height > 60000000) throw Error('La imagen tiene demasiada resolución. Elige una versión más pequeña.');
    const ratio = Math.min(1, 1280 / bitmap.width, 960 / bitmap.height);
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * ratio));
    canvas.height = Math.max(1, Math.round(bitmap.height * ratio));
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    let output = canvas.toDataURL('image/webp', .82);
    if (output.length > 400000) output = canvas.toDataURL('image/webp', .6);
    if (output.length > 650000) throw Error('La imagen sigue siendo muy pesada. Elige una versión más pequeña.');
    return output;
  } finally { bitmap.close(); }
}

export function coverUpload(cover, id) {
  if (!cover) return null;
  const match = /^data:image\/(webp|png|jpeg);base64,([a-z0-9+/=]+)$/i.exec(cover);
  if (!match) return null;
  return { path: `uploads/${id}.${match[1].toLowerCase() === 'jpeg' ? 'jpg' : match[1].toLowerCase()}`, content: match[2] };
}
