const labels = {es:'Español', en:'English', pt:'Português', fr:'Français', de:'Deutsch', ja:'日本語', it:'Italiano'};
const maxExternalLength = 3900;
const withTimeout = (promise, ms) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(Error('translation-timeout')), ms);
  Promise.resolve(promise).then(
    value => { clearTimeout(timer); resolve(value); },
    error => { clearTimeout(timer); reject(error); },
  );
});

function readingNodes(root) {
  const blocks = root.querySelectorAll('.article h1, .article .prose, .article-contents ol');
  const nodes = [];
  for (const block of blocks) {
    const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (!node.textContent.trim() || node.parentElement?.closest('pre,code,script,style,button,select,.line-number')) continue;
      nodes.push({node, original:node.textContent});
    }
  }
  return nodes;
}

function externalParts(root) {
  const title = root.querySelector('.article h1')?.textContent || 'Nota';
  const prose = root.querySelector('.article .prose');
  const lines = [title];
  for (const child of prose?.children || []) {
    if (child.matches('pre')) continue;
    const copy = child.cloneNode(true);
    copy.querySelectorAll('pre,code').forEach(element => element.remove());
    const text = copy.textContent.trim();
    if (text) lines.push(text);
  }
  const parts = [];
  let chunk = '';
  for (const line of lines) {
    for (let cursor = 0; cursor < line.length; cursor += maxExternalLength) {
      const piece = line.slice(cursor, cursor + maxExternalLength);
      if (chunk && chunk.length + piece.length + 2 > maxExternalLength) {
        parts.push(chunk);
        chunk = '';
      }
      chunk += (chunk ? '\n\n' : '') + piece;
    }
  }
  if (chunk) parts.push(chunk);
  return parts;
}

export function setupArticleTranslation(root) {
  const language = root.querySelector('#translate-language');
  const button = root.querySelector('#translate-page');
  const status = root.querySelector('#translation-status');
  const fallback = root.querySelector('#translation-fallback');
  const part = root.querySelector('#translation-part');
  const external = root.querySelector('#translation-external');
  if (!language || !button || !status || !fallback || !part || !external) return;
  const nodes = readingNodes(root);
  const parts = externalParts(root);
  let request = 0;

  const restore = () => { for (const {node, original} of nodes) node.textContent = original; };
  const updateExternal = () => {
    const text = parts[Number(part.value)] || parts[0] || '';
    external.href = 'https://translate.google.com/?sl=es&tl=' + encodeURIComponent(language.value) + '&text=' + encodeURIComponent(text) + '&op=translate';
  };
  const showExternal = message => {
    status.textContent = message;
    fallback.hidden = false;
    part.innerHTML = parts.map((_, index) => `<option value="${index}">Parte ${index + 1} de ${parts.length}</option>`).join('');
    updateExternal();
  };
  part.addEventListener('change', updateExternal);
  language.addEventListener('change', () => {
    request++;
    restore();
    fallback.hidden = true;
    status.textContent = 'Elige «Traducir» para ver la lectura en ' + labels[language.value] + '.';
    button.disabled = false;
    button.textContent = 'Traducir aquí';
  });
  button.addEventListener('click', async () => {
    const current = ++request;
    const targetLanguage = language.value;
    restore();
    fallback.hidden = true;
    if (targetLanguage === 'es') {
      status.textContent = 'Lectura original restaurada.';
      return;
    }
    if (!('Translator' in self)) {
      showExternal('Este navegador no ofrece traducción dentro de la página. Abre cada parte en el idioma elegido.');
      return;
    }
    button.disabled = true;
    button.textContent = 'Traduciendo…';
    status.textContent = 'Preparando ' + labels[targetLanguage] + '… La primera vez el navegador puede descargar el idioma.';
    let translator;
    try {
      translator = await withTimeout(Translator.create({
        sourceLanguage:'es', targetLanguage,
        monitor(monitor) {
          monitor.addEventListener('downloadprogress', event => {
            if (current === request) status.textContent = 'Descargando idioma: ' + Math.round(event.loaded * 100) + '%';
          });
        },
      }), 30000);
      let done = 0;
      for (const item of nodes) {
        if (current !== request || !root.isConnected) return;
        item.node.textContent = await withTimeout(translator.translate(item.original), 12000);
        done++;
        if (done % 5 === 0) status.textContent = `Traduciendo ${done} de ${nodes.length} fragmentos…`;
      }
      status.textContent = 'Lectura traducida a ' + labels[targetLanguage] + '. Los comandos se conservan originales.';
    } catch {
      if (current === request) {
        restore();
        showExternal('La traducción integrada no está disponible para este idioma o equipo. Puedes abrirla por partes.');
      }
    } finally {
      translator?.destroy?.();
      if (current === request) {
        button.disabled = false;
        button.textContent = 'Traducir aquí';
      }
    }
  });
}
