import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';

const scene=new THREE.Scene();scene.background=new THREE.Color(0x101a22);scene.fog=new THREE.FogExp2(0x101a22,.0048);
const camera=new THREE.PerspectiveCamera(56,innerWidth/innerHeight,.1,700);
const renderer=new THREE.WebGLRenderer({canvas:document.querySelector('#game'),antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
scene.add(new THREE.HemisphereLight(0xb5d5ef,0x26303a,2.1));const moon=new THREE.DirectionalLight(0x9ab8ff,2.3);moon.position.set(-80,120,40);moon.castShadow=true;moon.shadow.mapSize.set(1024,1024);moon.shadow.camera.left=-115;moon.shadow.camera.right=115;moon.shadow.camera.top=115;moon.shadow.camera.bottom=-115;scene.add(moon);
const mat=(color,roughness=.8,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
const asphalt=mat(0x252d32),sidewalk=mat(0x55585a),concrete=mat(0x3e484b),black=mat(0x101419,.38),glass=mat(0x172b37,.24,.25),yellow=mat(0xd0a833),white=mat(0xdfe7e7),neon=mat(0xd8ff3e,.25,.2);
const cubeGeo=new THREE.BoxGeometry(1,1,1),cylGeo=new THREE.CylinderGeometry(.5,.5,1,12),sphereGeo=new THREE.SphereGeometry(1,12,8);
function box(parent,x,y,z,sx,sy,sz,material){const o=new THREE.Mesh(cubeGeo,material);o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=sy>1;o.receiveShadow=true;parent.add(o);return o}
function cylinder(parent,x,y,z,r,h,material){const o=new THREE.Mesh(cylGeo,material);o.position.set(x,y,z);o.scale.set(r*2,h,r*2);o.castShadow=true;parent.add(o);return o}
// Asphalt city grid with lane dashes, curbs, pocket parks and neon-lit architecture.
box(scene,0,-.8,0,410,1,410,mat(0x202c2e));
const roadLine=mat(0x85827a),lampMat=mat(0xffd68c,.3);const wc=document.createElement('canvas');wc.width=128;wc.height=256;const wx=wc.getContext('2d');wx.fillStyle='#26323a';wx.fillRect(0,0,128,256);for(let yy=5;yy<256;yy+=19)for(let xx=5;xx<128;xx+=16){const lit=Math.random()>.43;wx.fillStyle=lit?(Math.random()>.5?'#b8a47a':'#5c99a2'):'#18272f';wx.fillRect(xx,yy,8,11)}const wt=new THREE.CanvasTexture(wc);wt.colorSpace=THREE.SRGBColorSpace;const wall= new THREE.MeshStandardMaterial({color:0xffffff,map:wt,emissive:0x53646b,emissiveMap:wt,emissiveIntensity:.3,roughness:.88});const roof=mat(0x283237);const buildingMats=[0x39464d,0x4c4845,0x35434b,0x53504a,0x343b48,0x51534f].map(c=>new THREE.MeshStandardMaterial({color:c,map:wt,emissive:0x35444a,emissiveMap:wt,emissiveIntensity:.26,roughness:.9}));
for(let i=-3;i<=3;i++){
 const p=i*58;box(scene,p,-.22,0,14,.22,400,asphalt);box(scene,0,-.22,p,400,.22,14,asphalt);
 for(let t=-190;t<195;t+=12){box(scene,p,-.095,t, .14,.025,5,roadLine);box(scene,t,-.095,p,5,.025,.14,roadLine)}
 // sidewalks trace either side of each boulevard
 for(const s of [-1,1]){box(scene,p+s*8.15,-.06,0,2,.25,400,sidewalk);box(scene,0,-.06,p+s*8.15,400,.25,2,sidewalk)}
}
const buildings=[];
for(let gx=-3;gx<3;gx++)for(let gz=-3;gz<3;gz++){
 const cx=(gx+.5)*58,cz=(gz+.5)*58;
 // plazas and varied-height city blocks, with emissive window bands
 box(scene,cx,-.12,cz,43,.18,43,concrete);
 for(let j=0;j<3;j++)for(let k=0;k<3;k++){
  const x=cx+(j-1)*13+(Math.random()-.5)*2,z=cz+(k-1)*13+(Math.random()-.5)*2;
  if(Math.abs(x)<20&&Math.abs(z)<20&&j===1&&k===1)continue;
  const w=8+Math.random()*3,d=8+Math.random()*3,h=12+Math.random()*42+(Math.random()<.14?25:0),b=new THREE.Group();b.position.set(x,0,z);scene.add(b);
  const facade=buildingMats[Math.floor(Math.random()*buildingMats.length)];const shell=new THREE.Mesh(cubeGeo,[wall,wall,roof,roof,facade,facade]);shell.position.y=h/2;shell.scale.set(w,h,d);shell.receiveShadow=true;b.add(shell);
  box(b,0,h+.25,0,w*.93,.5,d*.93,roof).castShadow=false;
  buildings.push({x,z,w,d});
 }
 // street trees & glowing street lamps
 for(let n=0;n<3;n++){
  const side=n%2?1:-1,tx=cx+side*19,tz=cz-13+n*13;cylinder(scene,tx,1.5,tz,.25,3,mat(0x5d4937));const crown=new THREE.Mesh(sphereGeo,mat(0x315747));crown.position.set(tx,4,tz);crown.scale.set(2.2,2.8,2.2);scene.add(crown);
 }
}
// Far skyline silhouettes.
for(let i=0;i<38;i++){const x=(Math.random()-.5)*390,z=(Math.random()-.5)*390;if(Math.abs(x)<180&&Math.abs(z)<180)continue;const h=22+Math.random()*45;box(scene,x,h/2,z,12+Math.random()*12,h,12+Math.random()*12,mat(0x263139))}
// Night signage, storefront details, lamps illuminating the avenues.
for(let x=-174;x<=174;x+=29)for(let z=-174;z<=174;z+=29){if(Math.abs(x%58)<1||Math.abs(z%58)<1){cylinder(scene,x,3,z,.075,6,mat(0x454c50));box(scene,x,5.9,z,.8,.15,.8,lampMat);if(x%116===0&&z%116===0){const glow=new THREE.PointLight(0xffc971,5,18,2);glow.position.set(x,5.7,z);scene.add(glow)}}}
// Simple detailed arcade car built around a forward-facing +Z chassis.
function makeCar(color,police=false){const root=new THREE.Group();const bodyMat=mat(color,.32,.28);box(root,0,.72,0,2.1,.75,4.1,bodyMat);box(root,0,1.28,-.15,1.65,.72,2.05,glass);box(root,0,1.1,1.35,1.82,.22,1.15,bodyMat);box(root,0,1.1,-1.45,1.82,.22,1.1,bodyMat);
 for(const x of [-1.04,1.04])for(const z of [-1.33,1.33]){const tire=cylinder(root,x,.43,z,.38,.27,black);tire.rotation.z=Math.PI/2;const hub=cylinder(root,x*1.08,.43,z,.17,.29,mat(0x9ba5a5,.3,.7));hub.rotation.z=Math.PI/2}
 for(const x of [-.68,.68]){const head=new THREE.Mesh(cubeGeo,new THREE.MeshBasicMaterial({color:0xfff1c1}));head.position.set(x,.85,2.06);head.scale.set(.34,.18,.04);root.add(head);const lamp=new THREE.SpotLight(0xffe6ba,20,36,.36,.5,1.6);lamp.position.set(x,.93,2.1);lamp.target.position.set(x,.1,14);root.add(lamp,lamp.target)}
 box(root,-.72,.8,-2.05,.42,.18,.08,mat(0xff4452));box(root,.72,.8,-2.05,.42,.18,.08,mat(0xff4452));
 if(police){box(root,0,1.7,-.12,.8,.16,.35,white);const l=new THREE.Mesh(cubeGeo,new THREE.MeshBasicMaterial({color:0x38aaff}));l.position.set(-.23,1.85,-.12);l.scale.set(.3,.18,.3);root.add(l);const r=l.clone();r.material=new THREE.MeshBasicMaterial({color:0xff334a});r.position.x=.23;root.add(r);root.userData.siren=[l,r]}
 root.traverse(o=>{if(o.isMesh)o.castShadow=true});return root}
const player=makeCar(0xc63250);scene.add(player);player.position.set(-6,.08,144);let yaw=Math.PI,speed=0,cash=0,heat=0;player.rotation.y=yaw;const cops=[];
const drops=[{x:0,z:58,taken:false},{x:58,z:-58,taken:false},{x:-58,z:-116,taken:false}];
function marker(x,z){const g=new THREE.Group();g.position.set(x,0,z);const ring=new THREE.Mesh(new THREE.TorusGeometry(2.4,.15,8,32),neon);ring.rotation.x=Math.PI/2;ring.position.y=.2;g.add(ring);const beam=new THREE.Mesh(new THREE.CylinderGeometry(.1,.45,8,12,1,true),new THREE.MeshBasicMaterial({color:0xd8ff3e,transparent:true,opacity:.22,side:THREE.DoubleSide}));beam.position.y=4;g.add(beam);const gem=new THREE.Mesh(new THREE.OctahedronGeometry(.65),neon);gem.position.y=1.7;g.add(gem);scene.add(g);return g}
drops.forEach(d=>d.marker=marker(d.x,d.z));let extraction=null,gameStarted=false,escaped=false,toastTimer=0;
function toast(msg){const el=document.querySelector('#toast');el.textContent=msg;el.classList.add('show');toastTimer=2.2}
function spawnCop(){const g=makeCar(0xdde1df,true);let a=Math.random()*Math.PI*2;g.position.set(player.position.x+Math.sin(a)*44,.08,player.position.z+Math.cos(a)*44);g.rotation.y=a+Math.PI;scene.add(g);cops.push({mesh:g,speed:0})}
const keys={};addEventListener('keydown',e=>{keys[e.key.toLowerCase()]=true;if([' ','arrowup','arrowdown','arrowleft','arrowright'].includes(e.key.toLowerCase()))e.preventDefault();if(e.key.toLowerCase()==='r')resetCar()});addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
document.querySelectorAll('.mobile-controls button').forEach(b=>{const k=b.dataset.key;b.addEventListener('pointerdown',e=>{e.preventDefault();keys[k]=true});['pointerup','pointercancel','pointerleave'].forEach(ev=>b.addEventListener(ev,()=>keys[k]=false))});
function resetCar(){player.position.set(-6,.08,144);speed=0;yaw=Math.PI;player.rotation.y=yaw;toast('BACK ON THE STREET')}
document.querySelector('#start').onclick=()=>{gameStarted=true;document.querySelector('#intro').classList.add('hidden');spawnCop();toast('JOB STARTED // TAKE THE CASH')};

const clock=new THREE.Clock();let elapsed=0,spawnClock=0;
function target(){return extraction||drops.find(d=>!d.taken)}
function isBlocked(x,z){if(Math.abs(x)>197||Math.abs(z)>197)return true;for(const b of buildings)if(Math.abs(x-b.x)<b.w/2+1&&Math.abs(z-b.z)<b.d/2+1)return true;return false}
function updateGame(dt){elapsed+=dt;
 if(gameStarted&&!escaped){const accel=(keys.w||keys.arrowup?1:0)-(keys.s||keys.arrowdown?1:0);const steer=(keys.a||keys.arrowleft?1:0)-(keys.d||keys.arrowright?1:0);const boost=keys.shift?1.5:1;
  speed+=accel*(keys.shift?30:20)*dt;speed*=Math.pow(keys[' ']?.91:.985,dt*60);speed=Math.max(-12,Math.min(keys.shift?48:34,speed));if(Math.abs(speed)<.15)speed=0;
  yaw+=steer*dt*(.85+Math.min(Math.abs(speed)/22,1.3))*(speed<0?-1:1);
  const nx=player.position.x+Math.sin(yaw)*speed*boost*dt,nz=player.position.z+Math.cos(yaw)*speed*boost*dt;
  if(!isBlocked(nx,nz)){player.position.x=nx;player.position.z=nz}else{speed*=-.28}
  player.rotation.y=yaw;
  const completed=drops.filter(d=>d.taken).length;
  for(const d of drops)if(!d.taken){d.marker.rotation.y+=dt*1.1;d.marker.children[2].rotation.y+=dt*1.7;if(player.position.distanceTo(new THREE.Vector3(d.x,player.position.y,d.z))<5){d.taken=true;scene.remove(d.marker);cash+=Math.floor(950+Math.random()*800);heat=Math.min(5,heat+1.15);document.querySelector('#cash').textContent='$ '+cash.toLocaleString();toast('CASH SECURED  //  HEAT IS UP');if(drops.every(x=>x.taken)){extraction={x:-116,z:0};extraction.marker=marker(extraction.x,extraction.z);document.querySelector('#objectiveText').textContent='Reach the extraction garage';toast('ALL BAGS SECURED // GET TO THE GARAGE')}}}
  const targetNow=target();if(targetNow){document.querySelector('#progress').textContent=extraction?'GARAGE':`${completed} / 3`;document.querySelector('#arrow').style.display=targetNow?'block':'none';}
  // Sirens get closer as the wanted level rises. Cops pursue with a little steering lag.
  const desired=Math.max(1,Math.min(5,Math.ceil(heat)));if(desired>0&&cops.length<Math.min(desired,4)){spawnClock+=dt;if(spawnClock>Math.max(3,8-heat)){spawnCop();spawnClock=0}}
  for(const cop of cops){const m=cop.mesh,dx=player.position.x-m.position.x,dz=player.position.z-m.position.z,dist=Math.hypot(dx,dz);const aim=Math.atan2(dx,dz);let turn=((aim-m.rotation.y+Math.PI*3)%(Math.PI*2))-Math.PI;m.rotation.y+=Math.max(-2.2*dt,Math.min(2.2*dt,turn));cop.speed=Math.min(heat>0?24:0,cop.speed+dt*9);m.position.x+=Math.sin(m.rotation.y)*cop.speed*dt;m.position.z+=Math.cos(m.rotation.y)*cop.speed*dt;m.userData.siren.forEach((l,i)=>l.material.color.setHex(Math.sin(elapsed*10+i*Math.PI)>0?0x42aaff:0xff334a));if(dist<4.2&&speed<10){speed*=.5;heat=Math.min(5,heat+.15)}}
  const nearest=cops.reduce((v,c)=>Math.min(v,player.position.distanceTo(c.mesh.position)),999);if(heat>0&&nearest>65)heat=Math.max(0,heat-dt*.075);if(heat>0&&nearest<55)heat=Math.min(5,heat+dt*.008);
  const stars=Math.min(5,Math.ceil(heat));document.querySelector('#stars').innerHTML=Array.from({length:5},(_,i)=>`<span class="${i<stars?'on':''}">${i<stars?'★':'☆'}</span>`).join('');document.querySelector('#alert').classList.toggle('show',stars>0);document.querySelector('#gear').textContent=`${speed<-.5?'R':'D'} / ${keys.shift?'NITRO':'STREET'}`;
  if(extraction&&Math.hypot(player.position.x-extraction.x,player.position.z-extraction.z)<8&&heat<.45){escaped=true;heat=0;document.querySelector('#objectiveText').textContent='Job complete — clean getaway';document.querySelector('#progress').textContent='DONE';toast('CLEAN GETAWAY  //  $'+cash.toLocaleString());document.querySelector('#arrow').style.display='none'}
 }
 document.querySelector('#speed').textContent=String(Math.round(Math.abs(speed)*3.1)).padStart(3,'0');
}
const camOffset=new THREE.Vector3(0,7.5,-15);const lookOffset=new THREE.Vector3(0,1,7);
function updateCamera(dt){const behind=camOffset.clone().applyAxisAngle(new THREE.Vector3(0,1,0),yaw);const desired=player.position.clone().add(behind);camera.position.lerp(desired,1-Math.pow(.001,dt));const look=player.position.clone().add(lookOffset.clone().applyAxisAngle(new THREE.Vector3(0,1,0),yaw));camera.lookAt(look)}
function drawMap(){const c=document.querySelector('#map'),ctx=c.getContext('2d'),w=c.width,h=c.height;ctx.clearRect(0,0,w,h);ctx.fillStyle='#0a1419';ctx.fillRect(0,0,w,h);const scale=.32;ctx.fillStyle='#283238';for(let i=-3;i<=3;i++){let p=w/2+i*58*scale;ctx.fillRect(p-3,0,6,h);ctx.fillRect(0,p-3,w,6)}ctx.strokeStyle='#465257';ctx.lineWidth=1;for(let i=-3;i<=3;i++){let p=w/2+i*58*scale;ctx.beginPath();ctx.moveTo(p,0);ctx.lineTo(p,h);ctx.moveTo(0,p);ctx.lineTo(w,p);ctx.stroke()}
 for(const d of drops)if(!d.taken){ctx.fillStyle='#d8ff3e';ctx.beginPath();ctx.arc(w/2+d.x*scale,h/2+d.z*scale,3.3,0,Math.PI*2);ctx.fill()}
 if(extraction){ctx.fillStyle='#d8ff3e';ctx.fillRect(w/2+extraction.x*scale-3,h/2+extraction.z*scale-3,7,7)}for(const cp of cops){ctx.fillStyle='#ff425a';ctx.beginPath();ctx.arc(w/2+cp.mesh.position.x*scale,h/2+cp.mesh.position.z*scale,3.2,0,Math.PI*2);ctx.fill()}
 const px=w/2+player.position.x*scale,pz=h/2+player.position.z*scale;ctx.save();ctx.translate(px,pz);ctx.rotate(-yaw);ctx.fillStyle='#fff';ctx.beginPath();ctx.moveTo(0,-6);ctx.lineTo(4,5);ctx.lineTo(0,3);ctx.lineTo(-4,5);ctx.closePath();ctx.fill();ctx.restore()}
function frame(){requestAnimationFrame(frame);const dt=Math.min(.04,clock.getDelta());updateGame(dt);updateCamera(dt);drawMap();renderer.render(scene,camera)}frame();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
