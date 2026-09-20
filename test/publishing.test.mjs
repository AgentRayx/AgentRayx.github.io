import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {escape,markdown} from '../dist/markdown.js';
import {coverUrl,coverImage,coverFields,prepareCover,coverUpload} from '../dist/covers.js';
import {randomUUID} from 'node:crypto';
const source=(await readFile(new URL('../dist/app.js',import.meta.url),'utf8')).replace(/^import .*;\r?\n/gm,'').replace(/start\(\);\s*$/,'');
const post={id:'one',title:'Primera nota',excerpt:'Descripción',tag:'Notas',date:'2026-09-19',body:'Hola'};
async function scenario(remote,base=post,status=200){
 const writes=[],saved={},nodes=new Map(),errors=[];
 const context={escape,markdown,coverUrl,coverImage,coverFields,prepareCover,coverUpload,crypto:{randomUUID},console,URL,TextDecoder,TextEncoder,Uint8Array,Date,Intl,JSON,Set,Map,atob,btoa,setTimeout:()=>1,clearTimeout:()=>{},location:{hash:'#/'},window:{addEventListener(){}},localStorage:{getItem:()=>null,setItem:(k,v)=>saved[k]=v},document:{querySelector(s){if(s==='#title')return null;if(!nodes.has(s))nodes.set(s,{textContent:'',style:{},disabled:false});return nodes.get(s);}},fetch:async(url,options)=>{if(options.method==='PUT'){writes.push(JSON.parse(options.body));return {ok:status===200,status,json:async()=>({})};}return {ok:true,json:async()=>({sha:'sha-before',encoding:'base64',content:Buffer.from(JSON.stringify(remote)).toString('base64')})};}};
 vm.createContext(context);
 await vm.runInContext(source+`\ntoken='test-token';connection={repo:'AgentRayx/test',branch:'main'};current=${JSON.stringify({...post,title:'Nota actualizada',base:base?JSON.stringify(base):null})};drafts=[current];publish();`,context);
 return {writes,saved,toast:nodes.get('#toast')?.textContent};
}
test('publicar conserva otras entradas y la apariencia remota',async()=>{const another={...post,id:'two',title:'Otra nota'},site={name:'Rayx',accent:'#c2f970'},result=await scenario({posts:[post,another],site});assert.equal(result.writes.length,1);const body=JSON.parse(Buffer.from(result.writes[0].content,'base64').toString('utf8'));assert.deepEqual(body.site,site);assert.equal(body.posts[0].title,'Nota actualizada');assert.deepEqual(body.posts[1],another);assert.equal(result.writes[0].sha,'sha-before');assert.ok(!JSON.stringify(result.saved).includes('test-token'));});
test('un conflicto remoto impide sobrescribir y conserva el borrador',async()=>{const result=await scenario({posts:[{...post,body:'Cambio de otro dispositivo'}]});assert.equal(result.writes.length,0);assert.match(result.toast,/cambió en GitHub/);});
test('un fallo de GitHub no se comunica como publicación exitosa',async()=>{const result=await scenario({posts:[post]},post,403);assert.equal(result.writes.length,1);assert.match(result.toast,/no permite/);assert.ok(!result.saved['rayx-drafts-v1']);});
