import test from 'node:test';
import assert from 'node:assert/strict';
import {coverUrl,coverImage,coverUpload,prepareCover} from '../dist/covers.js';
test('portadas locales válidas y protocolos peligrosos rechazados',()=>{
  assert.equal(coverUrl('uploads/abc-123.webp'),'uploads/abc-123.webp');
  for(const src of ['javascript:alert(1)','data:image/svg+xml;base64,YQ==','uploads/../../private.png','//evil.example/x.png',{}])assert.equal(coverUrl(src),'');
  assert.equal(coverUrl('https://example.com/cover.png'),'https://example.com/cover.png');
});
test('sin portada se conserva el diseño anterior y texto alternativo se escapa',()=>{
  assert.equal(coverImage({title:'Hola'}),'');
  const image=coverImage({title:'Hola',cover:'uploads/demo.webp',coverAlt:'" onload="x'});
  assert.match(image,/alt="&quot; onload=&quot;x"/);
});
test('portadas incorporadas se separan como archivos al publicar',()=>{
  assert.deepEqual(coverUpload('data:image/webp;base64,YQ==','test-id'),{path:'uploads/test-id.webp',content:'YQ=='});
  assert.equal(coverUpload('uploads/existing.webp','unused'),null);
  assert.equal(coverUpload('data:image/svg+xml;base64,YQ==','unused'),null);
});
test('archivos inválidos se rechazan antes de procesar imágenes',async()=>{
  await assert.rejects(prepareCover({type:'text/html',size:1}),/PNG/);
  await assert.rejects(prepareCover({type:'image/png',size:9*1024*1024}),/8 MB/);
});
