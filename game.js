import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const canvas=document.querySelector('#world'), renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.18;
const scene=new THREE.Scene();scene.background=new THREE.Color('#73838a');scene.fog=new THREE.FogExp2('#73838a',.0085);
const camera=new THREE.PerspectiveCamera(54,innerWidth/innerHeight,.1,240);
scene.add(new THREE.HemisphereLight('#a9c5d1','#313a34',2.05));
const moon=new THREE.DirectionalLight('#ffd8a1',2.5);moon.position.set(-32,50,24);moon.castShadow=true;moon.shadow.mapSize.set(1024,1024);moon.shadow.camera.left=-55;moon.shadow.camera.right=55;moon.shadow.camera.top=55;moon.shadow.camera.bottom=-55;scene.add(moon);
const fill=new THREE.PointLight('#5c91bd',110,95,2);fill.position.set(12,18,-22);scene.add(fill);
const mat=(color,rough=.8,metal=0)=>new THREE.MeshStandardMaterial({color,roughness:rough,metalness:metal});
const mats={road:mat('#242b2d'),sidewalk:mat('#5a615c'),concrete:mat('#7e8178'),white:mat('#d7d2c4'),yellow:mat('#d8ad4c'),glass:new THREE.MeshStandardMaterial({color:'#293e48',roughness:.2,metalness:.45}),skin:mat('#c78e68'),coat:mat('#303a38'),red:mat('#ce5140'),lime:mat('#d7ff53'),blue:mat('#526c7c'),dark:mat('#192022')};
const boxGeo=new THREE.BoxGeometry(1,1,1), sphereGeo=new THREE.SphereGeometry(1,12,8), cylGeo=new THREE.CylinderGeometry(.5,.5,1,12);
function cube(parent,x,y,z,sx,sy,sz,material){const m=new THREE.Mesh(boxGeo,material);m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
function cylinder(parent,x,y,z,r,h,material,segments=12){const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,segments),material);m.position.set(x,y,z);m.castShadow=true;parent.add(m);return m}
const world=new THREE.Group();scene.add(world);
cube(world,0,-.52,0,170,1,170,mat('#353e3b'));
// Street grid
for(let i=-3;i<=3;i++){
 const p=i*24;
 cube(world,p,-.015,0,9,.03,170,mats.road);cube(world,0,-.014,p,170,.03,9,mats.road);
 for(let t=-72;t<78;t+=12){cube(world,p,-.002,t,5,.018,.13,mats.yellow);cube(world,t,-.001,p,.13,.018,5,mats.yellow)}
}
// Block buildings with warm lit windows
const buildingMats=['#596c6a','#77756b','#475a63','#887767','#48534e','#8d8170'].map(c=>mat(c,.88));
function building(x,z,w,d,h,idx){
 const g=new THREE.Group();g.position.set(x,0,z);world.add(g);const bm=buildingMats[idx%buildingMats.length];
 cube(g,0,h/2,0,w,h,d,bm);cube(g,0,h+.25,0,w+.3,.5,d+.3,mat('#30383a'));
 const rows=Math.floor(h/3.2), cols=Math.max(2,Math.floor(w/2.7));
 for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
  const wx=(c-(cols-1)/2)*(w/(cols+1)), wy=2.1+r*3.1;
  if(wy>h-1)continue;
  const wm=new THREE.MeshStandardMaterial({color:Math.random()>.43?'#ffd18a':'#263d46',emissive:Math.random()>.43?'#d18b3b':'#000000',emissiveIntensity:.42,roughness:.45});
  cube(g,wx,wy,d/2+.015,.72,1.15,.06,wm);cube(g,wx,wy,-d/2-.015,.72,1.15,.06,wm);
  if(c<Math.floor(cols*.65)){cube(g,w/2+.015,wy,(c-(cols-1)/2)*(d/(cols+1)),.06,1.15,.72,wm);cube(g,-w/2-.015,wy,(c-(cols-1)/2)*(d/(cols+1)),.06,1.15,.72,wm)}
 }
 cube(g,0,.4,d/2+.05,w*.38,.7,.14,mat('#30383a'));
}
let bi=0;for(let gx=-2;gx<=2;gx++)for(let gz=-2;gz<=2;gz++){
 if(gx===0&&gz===-1)continue;
 const cx=gx*24,cz=gz*24;building(cx+(Math.random()-.5)*2,cz+(Math.random()-.5)*2,10+Math.random()*5,10+Math.random()*5,10+Math.random()*21,bi++);
}
// Special bank, crew alley, street furniture
function addBank(){const g=new THREE.Group();g.position.set(0,0,-21);world.add(g);cube(g,0,4,0,12,8,7,mat('#877e70'));cube(g,0,8.2,0,12.5,.5,7.5,mat('#4b5150'));cube(g,0,4,3.56,5.5,1,.16,mat('#353f40'));cube(g,0,2.1,3.58,2,3.6,.18,mat('#283338'));cube(g,0,6.35,3.58,1.7,.45,.2,mat('#d5b86b'));cube(g,0,6.35,3.72,.08,.08,.04,mats.dark);for(let x of [-4.6,-3.3,3.3,4.6])cube(g,x,4,3.58,.65,2.7,.12,mat('#b9aa89'));}
addBank();
function tree(x,z){const g=new THREE.Group();g.position.set(x,0,z);world.add(g);cylinder(g,0,1.1,0,.2,2.2,mat('#594a3e'));const crown=new THREE.Mesh(sphereGeo,mat('#344b41'));crown.position.y=2.7;crown.scale.set(1.05,1.2,1.05);crown.castShadow=true;g.add(crown)}
for(let x=-70;x<=70;x+=12)for(let z=-70;z<=70;z+=24)if(Math.random()>.38)tree(x+(Math.random()-.5)*2,z+5);
function streetlamp(x,z){const g=new THREE.Group();g.position.set(x,0,z);world.add(g);cylinder(g,0,3.2,0,.08,6.4,mat('#414a48'));cube(g,.55,6.35,0,1.2,.09,.1,mat('#414a48'));const bulb=new THREE.Mesh(new THREE.SphereGeometry(.18,8,6),new THREE.MeshBasicMaterial({color:'#ffd786'}));bulb.position.set(1.05,6.25,0);g.add(bulb);const l=new THREE.PointLight('#ffc977',11,10,2);l.position.set(1,5.8,0);g.add(l)}
for(const p of [[-8,0],[8,0],[-8,-24],[8,-24],[32,24],[32,48],[-32,24]])streetlamp(...p);
// Character models
function person(shirt,skin){const g=new THREE.Group();const torso=cube(g,0,1.15,0,.68,.9,.42,shirt);const head=new THREE.Mesh(sphereGeo,skin);head.position.y=1.9;head.scale.set(.32,.36,.31);head.castShadow=true;g.add(head);cube(g,-.2,.48,0,.22,.62,.25,mats.dark);cube(g,.2,.48,0,.22,.62,.25,mats.dark);cube(g,0,1.5,.235,.35,.12,.04,mat('#e0b15e'));g.userData={torso,head};return g}
const player=person(mat('#d7ff53'),mats.skin);player.position.set(1,0,24);world.add(player);
const nova=person(mat('#9e5451'),mat('#d69b74'));nova.position.set(-8,0,5);nova.rotation.y=.6;world.add(nova);
const ace=person(mat('#516e83'),mat('#9a694d'));ace.position.set(-5.4,0,5.5);ace.rotation.y=.7;world.add(ace);
// Player's getaway coupe
function car(color,police=false){const g=new THREE.Group();g.userData={speed:0,heading:Math.PI,police};cube(g,0,.65,0,2.05,.72,4.1,mat(color,.35,.3));cube(g,0,1.18,-.25,1.7,.65,2.0,mat(color,.28,.3));cube(g,0,1.22,-.18,1.52,.46,1.55,mats.glass);cube(g,0,1.32,-1.24,1.65,.12,.08,mat('#222829'));for(const x of [-.78,.78]){for(const z of [-1.34,1.35]){const w=cylinder(g,x,.45,z,.34,.2,mat('#121719'),14);w.rotation.z=Math.PI/2;const hub=cylinder(g,x*1.02,.45,z,.16,.22,mat('#818984'),12);hub.rotation.z=Math.PI/2}}
 for(const x of [-.68,.68])cube(g,x,.78,-2.07,.42,.18,.08,mat('#fff1bd'));cube(g,0,.74,2.07,1.25,.17,.08,mat('#e34a32'));
 if(police){cube(g,0,1.65,0,1.05,.16,.38,mat('#29353a'));cube(g,-.35,1.75,0,.32,.16,.3,mat('#4389ff'));cube(g,.35,1.75,0,.32,.16,.3,mat('#ff443f'))}
 g.castShadow=true;return g}
const getaway=car('#bd4939');getaway.position.set(4,0,24);world.add(getaway);
const patrol=car('#272f34',true);patrol.visible=false;world.add(patrol);
// Objective beacon and world waypoint
const beacon=new THREE.Group();world.add(beacon);const ring=new THREE.Mesh(new THREE.TorusGeometry(1.25,.075,8,32),new THREE.MeshBasicMaterial({color:'#d7ff53'}));ring.rotation.x=Math.PI/2;beacon.add(ring);const beam=new THREE.Mesh(new THREE.CylinderGeometry(.025,.35,3.8,12,1,true),new THREE.MeshBasicMaterial({color:'#d7ff53',transparent:true,opacity:.22,depthWrite:false}));beam.position.y=2;beacon.add(beam);const beaconLight=new THREE.PointLight('#d7ff53',20,8);beaconLight.position.y=2;beacon.add(beaconLight);
const objectives=[new THREE.Vector3(-7,0,5),new THREE.Vector3(0,0,-16),new THREE.Vector3(36,0,36)];let phase=0,started=false,inCar=false,loot=0,heat=0,toastTimer=0,stealTime=0,lastTime=0;
const keys={};let audioOn=false;
const $=s=>document.querySelector(s), missionTitle=$('#mission-title'), missionCopy=$('#mission-copy'), missionFill=$('#progress-fill'), missionStep=$('#mission-step'), distLabel=$('#distance-label'), interaction=$('#interaction'), interactionText=$('#interaction-text');
function say(text){$('#toast').textContent=text;toastTimer=2.6}
function setPhase(n){phase=n;const titles=['GET THE CREW','HIT THE VAULT','LOSE THE HEAT'],copies=['Meet your people by the old freeway.','The front door is open. Grab the take.','Get the crew to the safehouse.'];missionTitle.textContent=titles[n]||'JOB COMPLETE';missionCopy.textContent=copies[n]||'';missionFill.style.width=['12%','53%','82%'][n]||'100%';missionStep.textContent=`STEP ${n+1} OF 3`;$('#crew-nova').classList.add('active');$('#crew-ace').classList.add('active');beacon.position.copy(objectives[n]);}
setPhase(0);
const cameraTarget=new THREE.Vector3(),camPos=new THREE.Vector3();
function dist(a,b){return Math.hypot(a.x-b.x,a.z-b.z)}
function playerPosition(){return inCar?getaway.position:player.position}
function updateInteraction(){const p=playerPosition(),dCrew=dist(p,objectives[0]),dBank=dist(p,objectives[1]),dCar=dist(p,getaway.position);let show=false,label='INTERACT';if(phase===0&&dCrew<3.6){show=true;label='MEET THE CREW'}else if(phase===1&&dBank<4.2&&!inCar){show=true;label='TAKE THE CASH'}else if(!inCar&&dCar<3.3){show=true;label='GET IN THE CAR'}else if(inCar&&phase<2){show=true;label='GET OUT'}if(show){interaction.classList.add('visible');interactionText.textContent=label}else interaction.classList.remove('visible');$('#distance-label').innerHTML='DISTANCE <b>'+Math.round(dist(p,objectives[phase]||objectives[2]))+' m</b>'}
function interact(){if(!started)return;const p=playerPosition();if(phase===0&&dist(p,objectives[0])<3.6){setPhase(1);say('CREW ASSEMBLED · THE VAULT IS NEXT');return}if(phase===1&&!inCar&&dist(p,objectives[1])<4.2){loot=48000;$('#cash-value').textContent='$ 48,000';$('#crew-cut').textContent='$ 16,000';setPhase(2);heat=2;$('#heat-label').textContent='ACTIVE';$('#heat-stars').children[0].classList.add('on');$('#heat-stars').children[1].classList.add('on');patrol.visible=true;patrol.position.set(-5,0,-15);say('VAULT CLEARED · MOVE TO THE SAFEHOUSE');stealTime=0;return}if(!inCar&&dist(p,getaway.position)<3.3){inCar=true;getaway.userData.speed=0;$('#vehicle-readout').classList.add('show');say('ALL RIGHT, LET’S MOVE');return}if(inCar){inCar=false;player.position.copy(getaway.position);player.position.x+=2;player.rotation.y=getaway.rotation.y;$('#vehicle-readout').classList.remove('show');say('ON FOOT');}}
function action(){if(phase===0&&dist(player.position,objectives[0])<3.6){interact();return}if(phase===1&&!inCar&&dist(player.position,objectives[1])<4.2){interact();return}if(!inCar&&dist(player.position,getaway.position)<3.3){interact();return}if(inCar)interact()}
window.addEventListener('keydown',e=>{keys[e.key.toLowerCase()]=true;if([' ','arrowup','arrowdown','arrowleft','arrowright'].includes(e.key.toLowerCase()))e.preventDefault();if(e.key.toLowerCase()==='e'&&!e.repeat)action();if(e.key==='?'||e.key.toLowerCase()==='h')$('#controls-hint').classList.toggle('open')});window.addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
document.querySelectorAll('[data-key]').forEach(btn=>{const k=btn.dataset.key;btn.addEventListener('pointerdown',e=>{e.preventDefault();keys[k]=true;if(k==='e')action()});for(const ev of ['pointerup','pointercancel','pointerleave'])btn.addEventListener(ev,()=>keys[k]=false)});
$('#start-button').addEventListener('click',()=>{started=true;$('#start-screen').classList.add('hidden');say('GO FIND YOUR PEOPLE');});$('#help-toggle').onclick=()=>$('#controls-hint').classList.toggle('open');$('#close-help').onclick=()=>$('#controls-hint').classList.remove('open');$('#sound-toggle').onclick=()=>{audioOn=!audioOn;$('#sound-toggle').style.color=audioOn?'#d7ff53':''};$('#play-again').onclick=()=>location.reload();
function update(dt,t){if(!started){camera.position.lerp(new THREE.Vector3(4,17,49),.025);camera.lookAt(0,2,10);drawMap();return}
 const p=playerPosition(),up=keys.w||keys.arrowup,down=keys.s||keys.arrowdown,left=keys.a||keys.arrowleft,right=keys.d||keys.arrowright;
 if(!inCar){let dx=(right?1:0)-(left?1:0),dz=(down?1:0)-(up?1:0),len=Math.hypot(dx,dz);if(len){dx/=len;dz/=len;const speed=keys.shift?8:4.7;player.position.x+=dx*speed*dt;player.position.z+=dz*speed*dt;player.rotation.y=Math.atan2(-dx,-dz);player.userData.torso.position.y=1.15+Math.sin(t*12)*.035;}else player.userData.torso.position.y=1.15;player.position.x=THREE.MathUtils.clamp(player.position.x,-78,78);player.position.z=THREE.MathUtils.clamp(player.position.z,-78,78);
 }else{const v=getaway.userData;const throttle=(up?1:0)-(down?1:0),steer=(right?1:0)-(left?1:0),max=18;v.speed+=throttle*13*dt;v.speed*=Math.pow(keys[' ']?.88:.985,dt*60);v.speed=THREE.MathUtils.clamp(v.speed,-7,max);getaway.rotation.y-=steer*(.6+Math.min(Math.abs(v.speed)/12,.7))*dt*Math.sign(v.speed||1);getaway.position.x-=Math.sin(getaway.rotation.y)*v.speed*dt;getaway.position.z-=Math.cos(getaway.rotation.y)*v.speed*dt;getaway.position.x=THREE.MathUtils.clamp(getaway.position.x,-82,82);getaway.position.z=THREE.MathUtils.clamp(getaway.position.z,-82,82);$('#speed-value').textContent=String(Math.round(Math.abs(v.speed)*5.5)).padStart(3,'0');}
 // Police pursuit and escalating heat
 if(phase===2){stealTime+=dt;if(stealTime>16&&heat<3){heat=3;$('#heat-label').textContent='PURSUIT';$('#heat-stars').children[2].classList.add('on');say('SIRENS CLOSING IN');}const cp=patrol.position,dx=p.x-cp.x,dz=p.z-cp.z,l=Math.hypot(dx,dz)||1;if(l>4){cp.x+=dx/l*dt*(heat===3?5.8:4.1);cp.z+=dz/l*dt*(heat===3?5.8:4.1);patrol.rotation.y=Math.atan2(-dx,-dz);patrol.userData.speed=6;}if(dist(p,objectives[2])<5&&inCar){$('#complete-summary').textContent=heat>=3?'A close call, but the whole crew made it.':'A clean getaway. Nobody left behind.';$('#complete-cash').textContent='$ 48,000';$('#mission-complete').classList.add('show');started=false;}}
 beacon.visible=phase<3;ring.scale.setScalar(1+Math.sin(t*3)*.13);beam.scale.y=1+Math.sin(t*3)*.08;
 const target=inCar?new THREE.Vector3(p.x,1.3,p.z):new THREE.Vector3(p.x,1.4,p.z);let behind=inCar?new THREE.Vector3(Math.sin(getaway.rotation.y)*8,5.2,Math.cos(getaway.rotation.y)*8):new THREE.Vector3(Math.sin(player.rotation.y)*7,4.2,Math.cos(player.rotation.y)*7);camPos.copy(target).add(behind);camera.position.lerp(camPos,1-Math.pow(.001,dt));cameraTarget.copy(target);cameraTarget.y+=.8;camera.lookAt(cameraTarget);
 updateInteraction();if(toastTimer>0){toastTimer-=dt;if(toastTimer<=0)$('#toast').textContent=''}drawMap();}
const map=$('#minimap'),ctx=map.getContext('2d');
function drawMap(){const w=map.width,h=map.height,s=w/160;ctx.clearRect(0,0,w,h);ctx.fillStyle='#283230';ctx.fillRect(0,0,w,h);ctx.fillStyle='#38413e';for(let i=-3;i<=3;i++){const q=(80+i*24)*s;ctx.fillRect(q-4.5*s,0,9*s,h);ctx.fillRect(0,q-4.5*s,w,9*s)}ctx.fillStyle='#657067';for(const gx of [-48,-24,0,24,48])for(const gz of [-48,-24,0,24,48]){if(gx===0&&gz===-24)continue;const x=(80+gx)*s,z=(80+gz)*s;ctx.fillRect(x-5*s,z-5*s,10*s,10*s)}const p=playerPosition(),goal=objectives[phase]||objectives[2],mx=(80+p.x)*s,my=(80+p.z)*s,gx=(80+goal.x)*s,gy=(80+goal.z)*s;ctx.strokeStyle='#ff7147';ctx.setLineDash([3,3]);ctx.beginPath();ctx.moveTo(mx,my);ctx.lineTo(gx,gy);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle='#ff7147';ctx.beginPath();ctx.arc(gx,gy,3.8,0,Math.PI*2);ctx.fill();ctx.fillStyle='#d7ff53';ctx.beginPath();ctx.arc(mx,my,4.2,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#f4ffe4';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(mx,my);const yaw=inCar?getaway.rotation.y:player.rotation.y;ctx.lineTo(mx-Math.sin(yaw)*8,my-Math.cos(yaw)*8);ctx.stroke();ctx.fillStyle='#ffffff';ctx.globalAlpha=.16;ctx.beginPath();ctx.arc(mx,my,8,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;}
let prev=performance.now();function frame(now){const dt=Math.min((now-prev)/1000,.04);prev=now;update(dt,now/1000);renderer.render(scene,camera);requestAnimationFrame(frame)}
function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));$('#touch-controls').classList.toggle('show',matchMedia('(pointer:coarse)').matches||innerWidth<700)}
window.addEventListener('resize',resize);resize();requestAnimationFrame(frame);
