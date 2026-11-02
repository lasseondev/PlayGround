import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';

const $=s=>document.querySelector(s), canvas=$('#game');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.7)); renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace; renderer.toneMapping=THREE.ACESFilmicToneMapping;
const scene=new THREE.Scene(); scene.background=new THREE.Color(0x10191c); scene.fog=new THREE.Fog(0x10191c,32,82);
const camera=new THREE.PerspectiveCamera(82,innerWidth/innerHeight,.1,120); camera.rotation.order='YXZ';
const hemi=new THREE.HemisphereLight(0xb9d8db,0x211c1a,1.7); scene.add(hemi);
const sun=new THREE.DirectionalLight(0xffe6c6,2.4); sun.position.set(-12,24,8); sun.castShadow=true; sun.shadow.mapSize.set(1024,1024); scene.add(sun);
const redLamp=new THREE.PointLight(0xff3d27,65,28,2); redLamp.position.set(0,7,0); scene.add(redLamp);
const blueLamp=new THREE.PointLight(0x3da9c0,60,24,2); blueLamp.position.set(-21,6,-20); scene.add(blueLamp);
const mats={
 floor:new THREE.MeshStandardMaterial({color:0x333632,roughness:.88}), wall:new THREE.MeshStandardMaterial({color:0x45443f,roughness:.86}),
 dark:new THREE.MeshStandardMaterial({color:0x171b1b,metalness:.65,roughness:.38}), cover:new THREE.MeshStandardMaterial({color:0x4b4942,metalness:.28,roughness:.7}),
 red:new THREE.MeshStandardMaterial({color:0x9c2a20,emissive:0x681309,emissiveIntensity:1.2,metalness:.35,roughness:.38}), cyan:new THREE.MeshStandardMaterial({color:0x43b9c3,emissive:0x11666c,emissiveIntensity:1.5}),
 gold:new THREE.MeshStandardMaterial({color:0xffbd63,emissive:0xa64c12,emissiveIntensity:1.5})};
const arena=new THREE.Group(); scene.add(arena);
const obstacles=[];
function box(x,y,z,w,h,d,mat,collide=true){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;arena.add(m);if(collide)obstacles.push({x,z,w,d});return m}
function cylinder(x,y,z,r,h,mat,collide=true){const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,12),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;arena.add(m);if(collide)obstacles.push({x,z,w:r*2,d:r*2});return m}
const floor=new THREE.Mesh(new THREE.PlaneGeometry(72,72),mats.floor);floor.rotation.x=-Math.PI/2;floor.position.y=-.12;floor.receiveShadow=true;arena.add(floor);
const grid=new THREE.GridHelper(72,36,0x87806f,0x58564e);grid.position.y=-.105;grid.material.transparent=true;grid.material.opacity=.2;arena.add(grid);
// Industrial perimeter walls and illuminated warning bands.
box(0,4,-35,72,8,2,mats.wall,false);box(0,4,35,72,8,2,mats.wall,false);box(-35,4,0,2,8,72,mats.wall,false);box(35,4,0,2,8,72,mats.wall,false);
for(let i=-1;i<=1;i++){
 box(i*20,4.1,-33.85,1.25,8.2,.12,mats.dark,false);box(i*20,4.1,33.85,1.25,8.2,.12,mats.dark,false);
 box(-33.85,4.1,i*20,.12,8.2,1.25,mats.dark,false);box(33.85,4.1,i*20,.12,8.2,1.25,mats.dark,false);
}
// Central landmark and cover lanes.
cylinder(0,.35,0,4.2,.7,mats.dark,false);cylinder(0,1.1,0,2.55,1.5,mats.red,false);cylinder(0,2.25,0,1.2,.8,mats.gold,false);
for(let i=0;i<8;i++){const a=i*Math.PI/4;const x=Math.cos(a)*14,z=Math.sin(a)*14;box(x,1.25,z,2.2,2.5,2.2,mats.cover);box(x,2.58,z,2.25,.16,2.25,i%2?mats.cyan:mats.red,false)}
for(const x of [-25,-12,12,25])for(const z of [-25,25]){cylinder(x,3,z,1.25,6,mats.dark);const lamp=new THREE.Mesh(new THREE.CylinderGeometry(.8,.8,.12,16),mats.cyan);lamp.position.set(x,6.08,z);arena.add(lamp)}
for(const x of [-24,24])for(const z of [-12,0,12])box(x,1.4,z,3,2.8,3,mats.cover);
for(const z of [-22,22])for(const x of [-8,8])box(x,.8,z,4,1.6,2,mats.dark);
// A few overhead girders add height without blocking the fight.
for(const x of [-27,27])box(x,8.2,0,.7,.5,56,mats.dark,false);

const player={pos:new THREE.Vector3(0,1.7,28),yaw:Math.PI,pitch:0,vy:0,health:100,ammo:30,score:0,alive:true,onGround:true};
camera.position.copy(player.pos); scene.add(camera);
const gun=new THREE.Group();camera.add(gun);gun.position.set(.32,-.3,-.56);
const gunBody=new THREE.Mesh(new THREE.BoxGeometry(.2,.19,.52),mats.dark);gunBody.position.set(0,0,-.02);gun.add(gunBody);
const barrel=new THREE.Mesh(new THREE.CylinderGeometry(.052,.065,.38,10),mats.red);barrel.rotation.x=Math.PI/2;barrel.position.set(0,.025,-.36);gun.add(barrel);
const sight=new THREE.Mesh(new THREE.BoxGeometry(.05,.07,.08),mats.gold);sight.position.set(0,.13,-.08);gun.add(sight);
const muzzle=new THREE.PointLight(0xff8a3d,0,5,2);muzzle.position.set(0,.025,-.59);gun.add(muzzle);
const sparks=[]; const bots=[]; const shots=[]; const keys={};
const botMat=new THREE.MeshStandardMaterial({color:0xc13e32,metalness:.35,roughness:.42,emissive:0x3a0905});
function spawnBot(bot){
 let x,z;do{x=THREE.MathUtils.randFloat(-27,27);z=THREE.MathUtils.randFloat(-27,27)}while(Math.hypot(x-player.pos.x,z-player.pos.z)<13);
 bot.group.position.set(x,0,z);bot.health=100;bot.fire=THREE.MathUtils.randFloat(.7,1.8);bot.alive=true;bot.group.visible=true;bot.hitFlash=0;
}
function makeBot(i){
 const g=new THREE.Group();
 const torso=new THREE.Mesh(new THREE.BoxGeometry(.85,1.05,.5),botMat);torso.position.y=1.25;torso.castShadow=true;g.add(torso);
 const head=new THREE.Mesh(new THREE.SphereGeometry(.38,12,10),new THREE.MeshStandardMaterial({color:0xb79877,roughness:.7}));head.position.y=2.05;head.castShadow=true;g.add(head);
 const visor=new THREE.Mesh(new THREE.BoxGeometry(.58,.14,.12),new THREE.MeshBasicMaterial({color:i%2?0x54f0e2:0xff5746}));visor.position.set(0,2.08,-.32);g.add(visor);
 const armMat=new THREE.MeshStandardMaterial({color:0x292d2a,metalness:.55,roughness:.5});
 for(const side of [-1,1]){const limb=new THREE.Mesh(new THREE.BoxGeometry(.24,.8,.27),armMat);limb.position.set(side*.58,1.27,-.02);limb.rotation.z=side*-.12;g.add(limb);const leg=new THREE.Mesh(new THREE.BoxGeometry(.32,.68,.34),armMat);leg.position.set(side*.23,.37,0);g.add(leg)}
 const gunMesh=new THREE.Mesh(new THREE.BoxGeometry(.16,.18,.65),mats.dark);gunMesh.position.set(0,1.25,-.48);g.add(gunMesh);
 scene.add(g);const b={group:g,health:100,alive:true,fire:1,phase:Math.random()*6,flash:0};spawnBot(b);bots.push(b);
}
for(let i=0;i<6;i++)makeBot(i);
function addShot(start,end,color=0xff643f){const geo=new THREE.BufferGeometry().setFromPoints([start.clone(),end.clone()]);const line=new THREE.Line(geo,new THREE.LineBasicMaterial({color,transparent:true,opacity:.9}));scene.add(line);shots.push({line,life:.09})}
function effect(pos,color=0xffb458){const mesh=new THREE.Mesh(new THREE.SphereGeometry(.13,8,6),new THREE.MeshBasicMaterial({color}));mesh.position.copy(pos);scene.add(mesh);sparks.push({mesh,life:.22})}
let running=false,paused=false,remaining=180,last=performance.now(),fireCooldown=0,reloadTimer=0,damageFlash=0,toastTimer=0,walk=0;
function updateHud(){ $('#health').textContent=Math.max(0,Math.ceil(player.health));$('#healthfill').style.width=Math.max(0,player.health)+'%';$('#ammo').textContent=player.ammo;$('#fragcount').textContent=String(player.score).padStart(2,'0');$('#timer').textContent=`${String(Math.floor(remaining/60)).padStart(2,'0')}:${String(Math.max(0,Math.floor(remaining%60))).padStart(2,'0')}`; }
function showToast(text){const t=$('#toast');t.textContent=text;t.classList.add('show');toastTimer=1.1}
function setOverlay(title,sub,button){const card=$('.card');card.querySelector('.eyebrow').textContent=sub;card.querySelector('h1').innerHTML=title;$('#play').textContent=button;$('#overlay').classList.remove('hidden')}
function begin(){if(!running){running=true;paused=false;remaining=180;player.score=0;player.health=100;player.ammo=30;player.alive=true;player.pos.set(0,1.7,28);player.yaw=Math.PI;player.pitch=0;bots.forEach(spawnBot);updateHud()}$('#overlay').classList.add('hidden');canvas.requestPointerLock?.();$('#hud').classList.add('live')}
$('#play').addEventListener('click',begin);
addEventListener('keydown',e=>{keys[e.code]=true;if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();if(e.code==='KeyR'&&running&&player.ammo<30&&reloadTimer<=0){reloadTimer=1.15;showToast('RELOADING')}});
addEventListener('keyup',e=>keys[e.code]=false);
document.addEventListener('mousemove',e=>{if(document.pointerLockElement===canvas&&running&&!paused){player.yaw-=e.movementX*.0022;player.pitch-=e.movementY*.0022;player.pitch=THREE.MathUtils.clamp(player.pitch,-1.35,1.35)}});
document.addEventListener('pointerlockchange',()=>{if(running&&!document.pointerLockElement){paused=true;$('#hud').classList.remove('live');setOverlay('MATCH<span>PAUSED</span>','TAKE A BREATHER, SOLDIER','RESUME MATCH ↗')}});

function collision(x,z,r=.48){
  if(Math.abs(x)>31-r||Math.abs(z)>31-r)return true;
  for(const o of obstacles){const dx=Math.max(Math.abs(x-o.x)-o.w/2,0),dz=Math.max(Math.abs(z-o.z)-o.d/2,0);if(dx*dx+dz*dz<r*r)return true}
  return false;
}
const raycaster=new THREE.Raycaster();raycaster.far=90;
function fire(){
  if(!running||paused||!player.alive||fireCooldown>0||reloadTimer>0)return;
  if(player.ammo<=0){showToast('PRESS R TO RELOAD');fireCooldown=.18;return}
  player.ammo--;fireCooldown=.23;muzzle.intensity=8;gun.position.z=-.49;
  setTimeout(()=>{muzzle.intensity=0;gun.position.z=-.56},65);
  camera.updateMatrixWorld();raycaster.setFromCamera(new THREE.Vector2(0,0),camera);
  const targets=[];for(const b of bots)if(b.alive)b.group.traverse(o=>{if(o.isMesh)targets.push(o)});
  const hits=raycaster.intersectObjects([...arena.children,...targets],false);
  const hit=hits[0],end=hit?hit.point:raycaster.ray.origin.clone().addScaledVector(raycaster.ray.direction,70);
  addShot(raycaster.ray.origin,end,0xffd090);
  if(hit){let node=hit.object,found=null;while(node){found=bots.find(b=>b.alive&&b.group===node);if(found)break;node=node.parent}
    if(found){found.health-=hit.object.geometry.type==='SphereGeometry'?65:42;effect(hit.point,0xff5b37);const marker=$('#hitmarker');marker.classList.add('show');setTimeout(()=>marker.classList.remove('show'),100);if(found.health<=0){found.alive=false;found.group.visible=false;player.score++;showToast('ELIMINATED');setTimeout(()=>spawnBot(found),1300)}}
  }
  updateHud();
}
addEventListener('mousedown',e=>{if(e.button===0&&document.pointerLockElement===canvas)fire()});
function damage(amount){
  if(!player.alive)return;player.health-=amount;damageFlash=Math.max(damageFlash,.16);
  if(player.health<=0){player.health=0;player.alive=false;showToast('YOU GOT FRAGGED');setTimeout(()=>{player.health=100;player.alive=true;player.pos.set(0,1.7,28);player.vy=0;updateHud()},1800)}
  updateHud();
}
function update(dt,time){
  if(!running||paused)return;
  remaining-=dt;
  if(remaining<=0){remaining=0;running=false;document.exitPointerLock?.();$('#hud').classList.remove('live');setOverlay('MATCH<span>OVER</span>','FINAL FRAG COUNT: '+String(player.score).padStart(2,'0'),'PLAY AGAIN ↗');updateHud();return}
  fireCooldown=Math.max(0,fireCooldown-dt);
  if(reloadTimer>0){reloadTimer-=dt;if(reloadTimer<=0){player.ammo=30;updateHud()}}
  if(toastTimer>0){toastTimer-=dt;if(toastTimer<=0)$('#toast').classList.remove('show')}
  const forward=new THREE.Vector3(-Math.sin(player.yaw),0,-Math.cos(player.yaw));
  const right=new THREE.Vector3(Math.cos(player.yaw),0,-Math.sin(player.yaw));
  let move=new THREE.Vector3();
  if(keys.KeyW||keys.ArrowUp)move.add(forward);if(keys.KeyS||keys.ArrowDown)move.sub(forward);
  if(keys.KeyD||keys.ArrowRight)move.add(right);if(keys.KeyA||keys.ArrowLeft)move.sub(right);
  if(move.lengthSq())move.normalize();
  const speed=(keys.ShiftLeft?10:7.6)*dt,nx=player.pos.x+move.x*speed,nz=player.pos.z+move.z*speed;
  if(!collision(nx,player.pos.z))player.pos.x=nx;if(!collision(player.pos.x,nz))player.pos.z=nz;
  if(player.onGround&&keys.Space){player.vy=7.6;player.onGround=false}
  player.vy-=19*dt;player.pos.y+=player.vy*dt;
  if(player.pos.y<1.7){player.pos.y=1.7;player.vy=0;player.onGround=true}
  walk+=move.length()*dt*10;camera.position.copy(player.pos);camera.rotation.set(player.pitch,player.yaw,0,'YXZ');
  gun.position.y=-.3+Math.sin(walk)*.012*move.length();
  for(const b of bots){
    if(!b.alive)continue;
    const p=b.group.position,dx=player.pos.x-p.x,dz=player.pos.z-p.z,dist=Math.hypot(dx,dz);
    b.group.rotation.y=Math.atan2(-dx,-dz);b.phase+=dt*8;
    if(player.alive&&dist>5){const step=Math.min(2.5*dt,dist-4),tx=p.x+dx/dist*step,tz=p.z+dz/dist*step;if(!collision(tx,p.z,.55))p.x=tx;if(!collision(p.x,tz,.55))p.z=tz}
    b.group.position.y=Math.abs(Math.sin(b.phase))*.04;b.fire-=dt;
    if(player.alive&&dist<30&&b.fire<=0){
      b.fire=THREE.MathUtils.randFloat(.8,1.5);
      const origin=p.clone().add(new THREE.Vector3(0,1.55,0)),aim=player.pos.clone().add(new THREE.Vector3(0,-.12,0));
      const dir=aim.clone().sub(origin).normalize(),accuracy=Math.max(.12,.72-dist*.015),target=origin.clone().addScaledVector(dir,Math.min(dist,26));
      target.x+=(Math.random()-.5)*(1-accuracy)*dist*.45;target.y+=(Math.random()-.5)*(1-accuracy)*dist*.25;target.z+=(Math.random()-.5)*(1-accuracy)*dist*.45;
      addShot(origin,target,0xff4035);if(Math.random()<accuracy*.43&&dist<24)damage(THREE.MathUtils.randFloat(7,13));
    }
  }
  for(let i=shots.length-1;i>=0;i--){shots[i].life-=dt;if(shots[i].life<=0){scene.remove(shots[i].line);shots[i].line.geometry.dispose();shots[i].line.material.dispose();shots.splice(i,1)}}
  for(let i=sparks.length-1;i>=0;i--){sparks[i].life-=dt;sparks[i].mesh.scale.multiplyScalar(1+dt*5);if(sparks[i].life<=0){scene.remove(sparks[i].mesh);sparks[i].mesh.geometry.dispose();sparks[i].mesh.material.dispose();sparks.splice(i,1)}}
  redLamp.intensity=62+Math.sin(time*2.7)*12;blueLamp.intensity=55+Math.sin(time*2)*8;updateHud();
}
function frame(now){requestAnimationFrame(frame);const dt=Math.min((now-last)/1000,.04);last=now;update(dt,now/1000);renderer.render(scene,camera)}
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.7))});
updateHud();requestAnimationFrame(frame);

