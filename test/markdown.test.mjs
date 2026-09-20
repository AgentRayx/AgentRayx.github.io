import test from 'node:test';
import assert from 'node:assert/strict';
import {markdown,safeUrl} from '../dist/markdown.js';
test('HTML y código se escapan',()=>{const html=markdown('<script>alert(1)</script>\n\n```html\n<img src=x onerror=alert(1)>\n```');assert.ok(!html.includes('<script>'));assert.ok(!html.includes('<img'));assert.match(html,/&lt;script&gt;/);assert.match(html,/<pre><code>/);});
test('enlaces inseguros rechazados y atributos escapados',()=>{assert.equal(safeUrl('javascript:alert(1)'),'');assert.equal(safeUrl('data:text/html,test'),'');assert.equal(safeUrl('data:image/svg+xml;base64,PHN2Zz4=',true),'');const html=markdown('[clic](javascript:alert)\n\n![" onerror="alert](https://example.com/a.png)');assert.ok(!html.includes('href="javascript:'));assert.match(html,/alt="&quot; onerror=&quot;alert"/);});
test('formato editorial',()=>{const html=markdown('## Hola\n\n**fuerte** y *suave* con `código`\n\n- uno\n- dos\n\n> cita\n\n[web](https://example.com)');for(const tag of ['h2','strong','em','code','ul','li','blockquote','a'])assert.match(html,new RegExp('<'+tag+'[ >]'));});
test('imágenes incorporadas y código incompleto',()=>{assert.match(markdown('![captura](data:image/png;base64,YQ==)'),/src="data:image\/png;base64,YQ=="/);assert.equal(markdown('```\n<texto>'),'<pre><code>&lt;texto&gt;</code></pre>');});
