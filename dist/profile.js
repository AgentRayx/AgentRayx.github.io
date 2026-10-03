import {escape} from './markdown.js';
export const profileDefaults={enabled:false,name:'AgentRayx',headline:'',bio:'',avatar:'',location:'',certificatesEnabled:false,hobbiesEnabled:false,certificates:[],hobbies:[],links:[]};
export function safeLink(value){try{const u=new URL(value);return u.protocol==='https:'?u.href:'';}catch{return '';}}
export function cleanProfile(value={}){
 const p=value&&typeof value==='object'?value:{};
 const text=(v,n)=>typeof v==='string'?v.trim().slice(0,n):'';
 return {enabled:p.enabled===true,name:text(p.name,100)||'AgentRayx',headline:text(p.headline,180),bio:text(p.bio,5000),avatar:safeLink(p.avatar),location:text(p.location,100),certificatesEnabled:p.certificatesEnabled===true,hobbiesEnabled:p.hobbiesEnabled===true,
 certificates:(Array.isArray(p.certificates)?p.certificates:[]).slice(0,50).map(c=>({name:text(c?.name,160),issuer:text(c?.issuer,120),date:text(c?.date,30),url:safeLink(c?.url)})).filter(c=>c.name),
 hobbies:(Array.isArray(p.hobbies)?p.hobbies:[]).slice(0,30).map(h=>({name:text(h?.name,100),description:text(h?.description,500)})).filter(h=>h.name),
 links:(Array.isArray(p.links)?p.links:[]).slice(0,15).map(l=>({label:text(l?.label,60),url:safeLink(l?.url)})).filter(l=>l.label&&l.url)};
}
export function profileMarkup(value){const p=cleanProfile(value);if(!p.enabled)return '<section class="empty"><h1>Sobre mí</h1><p>Esta sección todavía no está publicada.</p><a href="#/">Volver al blog</a></section>';
 return `<article class="article profile"><p class="eyebrow">MÁS ALLÁ DE LOS WRITEUPS</p>${p.avatar?`<img class="profile-avatar" src="${escape(p.avatar)}" alt="Retrato de ${escape(p.name)}" referrerpolicy="no-referrer">`:''}<h1>${escape(p.name)}</h1><p class="lede">${escape(p.headline)}</p>${p.location?`<p class="hint">${escape(p.location)}</p>`:''}<div class="prose"><p style="white-space:pre-line">${escape(p.bio)}</p></div><div class="actions">${p.links.map(l=>`<a class="btn secondary" href="${escape(l.url)}" target="_blank" rel="noopener noreferrer">${escape(l.label)} ↗</a>`).join('')}</div>${p.certificatesEnabled?`<section><h2>Certificados</h2><div class="profile-grid">${p.certificates.map(c=>`<div class="profile-item"><h3>${escape(c.name)}</h3><p class="hint">${escape(c.issuer)} · ${escape(c.date)}</p>${c.url?`<a href="${escape(c.url)}" target="_blank" rel="noopener noreferrer">Ver credencial ↗</a>`:''}</div>`).join('')||'<p class="hint">Próximamente.</p>'}</div></section>`:''}${p.hobbiesEnabled?`<section><h2>Fuera del teclado</h2><div class="profile-grid">${p.hobbies.map(h=>`<div class="profile-item"><h3>${escape(h.name)}</h3><p>${escape(h.description)}</p></div>`).join('')||'<p class="hint">Próximamente.</p>'}</div></section>`:''}</article>`;
}
