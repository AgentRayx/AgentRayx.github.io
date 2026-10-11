// A tiny garden follows a mouse; touch and reduced-motion visitors keep the native pointer.
const root=document.documentElement;
const fine=matchMedia('(pointer:fine)');
const reduced=matchMedia('(prefers-reduced-motion:reduce)');
const garden=document.createElement('span');
garden.className='garden-cursor';garden.setAttribute('aria-hidden','true');
garden.innerHTML='<i class="garden-stem"></i><i class="garden-leaf leaf-one"></i><i class="garden-leaf leaf-two"></i><i class="garden-leaf leaf-three"></i>';
document.body.append(garden);
let x=-100,y=-100,last=0,visible=false;
function enabled(){return fine.matches&&!reduced.matches&&root.dataset.motion!=='off';}
function refresh(){root.classList.toggle('garden-cursor-on',enabled());if(!enabled())garden.style.opacity='0';}
function plant(event){
 if(!enabled())return;
 x=event.clientX;y=event.clientY;
 garden.style.transform=`translate3d(${x+12}px,${y+14}px,0)`;
 if(!visible){garden.style.opacity='1';visible=true;}
 if(Date.now()-last<95)return;
 last=Date.now();
 const leaf=document.createElement('i');leaf.className='garden-trail';
 leaf.style.left=`${x-4+Math.random()*8}px`;leaf.style.top=`${y+Math.random()*5}px`;
 leaf.style.setProperty('--drift',`${Math.round((Math.random()-.5)*38)}px`);
 document.body.append(leaf);leaf.addEventListener('animationend',()=>leaf.remove(),{once:true});
}
document.addEventListener('pointermove',plant,{passive:true});
document.addEventListener('pointerleave',()=>{garden.style.opacity='0';visible=false;});
fine.addEventListener('change',refresh);reduced.addEventListener('change',refresh);
new MutationObserver(refresh).observe(root,{attributes:true,attributeFilter:['data-motion']});
refresh();
