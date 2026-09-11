import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';

const canvas=document.querySelector('#space');
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(52,innerWidth/innerHeight,.1,100);
camera.position.set(0,0,9);
const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.setSize(innerWidth,innerHeight);

const group=new THREE.Group(); scene.add(group);
const coreGeo=new THREE.IcosahedronGeometry(2.25,3);
const coreMat=new THREE.MeshBasicMaterial({color:0x78f2ff,wireframe:true,transparent:true,opacity:.08});
const core=new THREE.Mesh(coreGeo,coreMat); group.add(core);
const auraGeo=new THREE.SphereGeometry(2.65,32,32);
const auraMat=new THREE.MeshBasicMaterial({color:0x9b78ff,transparent:true,opacity:.018,wireframe:true});
const aura=new THREE.Mesh(auraGeo,auraMat); group.add(aura);

const starCount=1150; const pos=new Float32Array(starCount*3);
for(let i=0;i<starCount;i++){const r=9+Math.random()*11, t=Math.random()*Math.PI*2, p=Math.acos(2*Math.random()-1);pos[i*3]=r*Math.sin(p)*Math.cos(t);pos[i*3+1]=r*Math.cos(p);pos[i*3+2]=r*Math.sin(p)*Math.sin(t)}
const starGeo=new THREE.BufferGeometry();starGeo.setAttribute('position',new THREE.BufferAttribute(pos,3));
const starMat=new THREE.PointsMaterial({color:0x9bb8ff,size:.018,transparent:true,opacity:.5});
const stars=new THREE.Points(starGeo,starMat);scene.add(stars);

const rings=[];
for(let i=0;i<3;i++){const g=new THREE.TorusGeometry(2.7+i*.38,.006+i*.002,8,180);const m=new THREE.MeshBasicMaterial({color:i%2?0x9b78ff:0x78f2ff,transparent:true,opacity:.12});const r=new THREE.Mesh(g,m);r.rotation.set(.9+i*.35,.2+i*.5,.2);group.add(r);rings.push(r)}

let mx=0,my=0,tx=0,ty=0;
addEventListener('pointermove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5;});
function animate(){requestAnimationFrame(animate);tx += (mx-tx)*.025;ty += (my-ty)*.025;group.rotation.y += .00045;group.rotation.x += .00022;group.rotation.y += tx*.003;group.rotation.x += ty*.0015;core.rotation.x += .0006;core.rotation.y += .0008;aura.rotation.y -= .0002;rings.forEach((r,i)=>{r.rotation.z += .0007*(i+1)});stars.rotation.y += .00008;renderer.render(scene,camera)}animate();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});

const glow=document.querySelector('#cursorGlow');
addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'});

const pre=document.querySelector('#preloader'); setTimeout(()=>pre.classList.add('hide'),1050);
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

document.querySelectorAll('[data-tilt]').forEach(card=>{card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(900px) rotateX(${(-y*5).toFixed(2)}deg) rotateY(${(x*6).toFixed(2)}deg) translateY(-2px)`});card.addEventListener('pointerleave',()=>card.style.transform='')});

const overlay=document.querySelector('#command'); const input=document.querySelector('#terminalInput'); const out=document.querySelector('#terminalOutput');
function openCmd(){overlay.classList.add('open');overlay.setAttribute('aria-hidden','false');setTimeout(()=>input.focus(),50)}
function closeCmd(){overlay.classList.remove('open');overlay.setAttribute('aria-hidden','true')}
document.querySelector('#cmdOpen').addEventListener('click',openCmd);document.querySelector('#cmdClose').addEventListener('click',closeCmd);overlay.addEventListener('click',e=>{if(e.target===overlay)closeCmd()});addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openCmd()}if(e.key==='Escape')closeCmd()});
const responses={help:['about — who I am','projects — selected work','stack — technical stack','contact — ways to reach me','resume — open PDF','clear — clear terminal'],about:['Computer Engineer focused on full-stack development, AI/ML and intelligent systems.','Mumbai, India · GPA 8.6'],projects:['01 MCP Server / AI Tool Integration Platform','02 AI Driven Unified Investment Guidance Platform','03 Agricultural Loan Recommender','04 Virtual Meet Summarizer','05 Zerodha Trading Platform Clone','06 Airbnb Web Replica'],stack:['Frontend: React.js · Next.js · TypeScript · HTML5 · CSS3','Backend: Node.js · FastAPI · REST APIs','AI/ML: Python · TensorFlow · Scikit-learn · Pandas · NumPy','Data: PostgreSQL · MySQL · Power BI · Tableau · Excel','Tools: Git · GitHub · Prisma · Supabase · Vercel'],contact:['Email: shaikfazal004@gmail.com','LinkedIn: linkedin.com/in/fazal-shaikh-555404195','GitHub: github.com/Fazal7867','Phone: +91 99678 26317']};
function runCommand(cmd){cmd=cmd.trim().toLowerCase();if(!cmd)return;if(cmd==='clear'){out.innerHTML='';return}if(cmd==='resume'){window.open('assets/Fazal-Shaikh-Resume.pdf','_blank','noopener');printCmd(cmd,['Opening resume…']);return}const lines=responses[cmd]||['Command not found. Type "help".'];printCmd(cmd,lines)}
function printCmd(cmd,lines){const wrap=document.createElement('div');wrap.innerHTML=`<div><span class="prompt">fazal@os</span>:~$ ${cmd}</div>`+lines.map(x=>`<div style="padding-left:18px;color:#8f9099">${x}</div>`).join('');out.appendChild(wrap);out.scrollTop=out.scrollHeight}
document.querySelector('#terminalForm').addEventListener('submit',e=>{e.preventDefault();runCommand(input.value);input.value=''});document.querySelectorAll('[data-cmd]').forEach(b=>b.addEventListener('click',()=>{runCommand(b.dataset.cmd);input.focus()}));
