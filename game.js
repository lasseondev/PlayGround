import * as THREE from 'three';

const mount = document.querySelector('#game');
const scene = new THREE.Scene();
scene.background = new THREE.Color('#17201c');
scene.fog = new THREE.FogExp2('#17201c', 0.015);
const camera = new THREE.PerspectiveCamera(76, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 1.65, 12);
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
mount.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight('#dcead8', '#313b35', 1.25));
const keyLight = new THREE.DirectionalLight('#fff0d6', 3.1);
keyLight.position.set(-7, 13, 6); keyLight.castShadow = true;
keyLight.shadow.mapSize.set(1024, 1024); keyLight.shadow.camera.left = -24; keyLight.shadow.camera.right = 24; keyLight.shadow.camera.top = 24; keyLight.shadow.camera.bottom = -24;
scene.add(keyLight);
const greenLight = new THREE.PointLight('#c8f169', 34, 18); greenLight.position.set(0, 5, -2); scene.add(greenLight);

const mats = {
  floor: new THREE.MeshStandardMaterial({ color: '#596159', roughness: .92 }),
  wall: new THREE.MeshStandardMaterial({ color: '#4b554e', roughness: .85 }),
  dark: new THREE.MeshStandardMaterial({ color: '#202a24', roughness: .84 }),
  trim: new THREE.MeshStandardMaterial({ color: '#889187', metalness: .42, roughness: .57 }),
  crate: new THREE.MeshStandardMaterial({ color: '#88795b', roughness: .88 }),
  lime: new THREE.MeshStandardMaterial({ color: '#c8f169', emissive: '#7fa93c', emissiveIntensity: .7 }),
  red: new THREE.MeshStandardMaterial({ color: '#d34f45', emissive: '#5d1712', emissiveIntensity: .45 }),
};
function box(x,y,z,sx,sy,sz,mat,shadow=true){const m=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),mat);m.position.set(x,y,z);m.castShadow=shadow;m.receiveShadow=true;scene.add(m);return m;}
// Dustline's compact bombsite: a rough concrete shell, service lanes and cover.
box(0,-.22,0,42,.4,42,mats.floor,false);
const grid = new THREE.GridHelper(40, 40, '#758177', '#68746b'); grid.position.y=-.005; grid.material.transparent=true; grid.material.opacity=.19; scene.add(grid);
// Outer shell
box(0,2,-20,42,4,.65,mats.wall); box(0,2,20,42,4,.65,mats.wall); box(-20,2,0,.65,4,40,mats.wall); box(20,2,0,.65,4,40,mats.wall);
// Upper wall trim
box(0,4.03,0,41,.16,.22,mats.trim); box(-19.98,4.03,0,.18,.16,39,mats.trim); box(19.98,4.03,0,.18,.16,39,mats.trim);
// Dividing structures keep sightlines tactical, with clear lanes around each side.
box(-7,1.55,-4, .45,3.1,17,mats.wall); box(7,1.55,3,.45,3.1,18,mats.wall);
box(0,1.5,-11,11,3,.42,mats.wall); box(0,1.5,10,9,3,.42,mats.wall);
// Door frames and industrial columns
for(const [x,z] of [[-12,-12],[12,-12],[-12,12],[12,12],[0,-17],[0,17]]){
  box(x,2,z,.65,4,.65,mats.dark); box(x,3.92,z,.9,.18,.9,mats.trim);
}
// Cover crates
for(const [x,z,s] of [[-13,-3,2.4],[-12,3,2.2],[12,-4,2.6],[13,5,2.3],[-3,5,2.4],[3,-5,2.2],[-3,-15,2],[4,14,2.3]]){
  box(x,.8,z,s,1.6,s,mats.crate);
  box(x,.52,z,s+.035,.06,s+.035,mats.trim,false);
  for(let i=-1;i<=1;i++) box(x+i*s*.28, .8,z,s*.045,1.42,.035,mats.dark,false);
}
// Overhead lamps and painted floor markers
for(const [x,z] of [[-14,0],[0,0],[14,0],[0,-15],[0,15]]){
  const lamp= new THREE.Mesh(new THREE.BoxGeometry(1.7,.1,.38),mats.lime); lamp.position.set(x,3.8,z); scene.add(lamp);
  const light=new THREE.PointLight('#d8ff9b',14,8); light.position.set(x,3.2,z); scene.add(light);
}
function floorMark(x,z,color,label){
  const p=new THREE.Mesh(new THREE.CircleGeometry(1.05,32),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.18,side:THREE.DoubleSide}));p.rotation.x=-Math.PI/2;p.position.set(x,.012,z);scene.add(p);
  const ring=new THREE.Mesh(new THREE.RingGeometry(.9,.96,32),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.62,side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.set(x,.025,z);scene.add(ring);
  const canvas=document.createElement('canvas');canvas.width=256;canvas.height=96;const ctx=canvas.getContext('2d');ctx.fillStyle='#e7eee6';ctx.font='bold 34px monospace';ctx.textAlign='center';ctx.fillText(label,128,56);const texture=new THREE.CanvasTexture(canvas);const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,transparent:true,depthTest:false}));sprite.position.set(x,2.7,z);sprite.scale.set(2.4,.9,1);scene.add(sprite);
}
const terminals=[
 {name:'COMMS UPLINK',x:-15,z:-10,done:false},
 {name:'POWER RELAY',x:15,z:-12,done:false},
 {name:'SITE CONSOLE',x:0,z:7,done:false},
];
for(const t of terminals){
  floorMark(t.x,t.z,'#c8f169',t.name.split(' ')[0]);
  box(t.x,1.05,t.z,.9,1.5,.55,mats.dark);
  box(t.x,1.32,t.z-.29,.68,.44,.06,mats.lime,false);
  box(t.x,1.82,t.z,.82,.08,.54,mats.trim,false);
}

const palette=[{name:'VEX',color:'#dc574e'},{name:'NOVA',color:'#56a9d8'},{name:'MOSS',color:'#b6c66a'},{name:'HEX',color:'#a883c5'},{name:'YOU',color:'#e4e6df'}];
function createAgent(color,name,x,z,isPlayer=false){
 const group=new THREE.Group();group.position.set(x,0,z);scene.add(group);
 const bodyMat=new THREE.MeshStandardMaterial({color,roughness:.55,metalness:.08});
 const body=new THREE.Mesh(new THREE.CapsuleGeometry(.43,.64,5,10),bodyMat);body.position.y=1.03;body.castShadow=true;body.receiveShadow=true;group.add(body);
 const visor=new THREE.Mesh(new THREE.BoxGeometry(.52,.3,.12),new THREE.MeshStandardMaterial({color:'#bce7e9',metalness:.55,roughness:.2,emissive:'#24606a',emissiveIntensity:.22}));visor.position.set(0,1.35,-.35);group.add(visor);
 const pack=new THREE.Mesh(new THREE.BoxGeometry(.28,.65,.25),new THREE.MeshStandardMaterial({color:'#27322c',roughness:.7}));pack.position.set(0,.98,.41);group.add(pack);
 const ring=new THREE.Mesh(new THREE.TorusGeometry(.44,.035,6,24),new THREE.MeshBasicMaterial({color:'#d7e3d8',transparent:true,opacity:.58}));ring.rotation.x=Math.PI/2;ring.position.y=.08;group.add(ring);
 let tag=null;
 if(!isPlayer){const c=document.createElement('canvas');c.width=256;c.height=64;const ctx=c.getContext('2d');ctx.fillStyle='rgba(9,14,11,.76)';ctx.fillRect(20,9,216,44);ctx.fillStyle='#f0f3ed';ctx.font='bold 24px monospace';ctx.textAlign='center';ctx.fillText(name,128,39);const tex=new THREE.CanvasTexture(c);tag=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,depthTest:false}));tag.position.y=2.35;tag.scale.set(1.9,.48,1);group.add(tag);}
 return {group,body,visor,tag,name,color,isPlayer,alive:true,isImpostor:false,home:new THREE.Vector3(x,0,z),phase:Math.random()*6.28,bodyMesh:null};
}
const player=createAgent('#e4e6df','YOU',0,12,true);
const agents=[player];
const starts=[[-15,12],[15,11],[-15,-14],[14,-14]];
for(let i=0;i<4;i++)agents.push(createAgent(palette[i].color,palette[i].name,...starts[i]));
const bodyMaterial=new THREE.MeshStandardMaterial({color:'#a7aaa0',roughness:.9});
function makeBody(agent){const body=new THREE.Mesh(new THREE.CapsuleGeometry(.36,.48,4,8),bodyMaterial);body.rotation.z=Math.PI/2;body.position.copy(agent.group.position);body.position.y=.43;body.castShadow=true;scene.add(body);agent.bodyMesh=body;agent.group.visible=false;}

const state={running:false,role:'crew',yaw:0,pitch:0,keys:new Set(),time:105,health:100,tasks:0,cooldown:0,meeting:false,ended:false,reportable:null,interactTarget:null,moveX:0,moveZ:0,lastToast:0};
const $=s=>document.querySelector(s);
const tasksBox=$('#tasks');
function showToast(text,danger=false){const el=$('#toast');el.textContent=text;el.classList.toggle('danger',danger);el.classList.add('show');state.lastToast=performance.now();}
function updateTaskUI(){
 if(state.role==='crew'){
  $('#missionType').textContent='CREW OBJECTIVE';$('#missionTitle').textContent='Complete the mission';
  tasksBox.innerHTML=terminals.map((t,i)=>`<div class="task ${t.done?'done':''} ${!t.done&&i===terminals.findIndex(x=>!x.done)?'active-task':''}"><span class="check"></span><span>${t.name}</span></div>`).join('')+`<div class="task ${state.reportable?'active-task':''}"><span class="check"></span><span>Find the impostor</span></div>`;
 }else{
  $('#missionType').textContent='IMPOSTOR OBJECTIVE';$('#missionTitle').textContent='Blend in. Take them out.';
  tasksBox.innerHTML='<div class="task active-task"><span class="check"></span><span>Eliminate the crew</span></div><div class="task"><span class="check"></span><span>Stay out of sight</span></div><div class="task"><span class="check"></span><span>Sabotage the objective</span></div>';
 }
 $('#roleName').textContent=state.role==='crew'?'CREWMATE':'IMPOSTOR';$('#roleName').style.color=state.role==='crew'?'#c8f169':'#ff7169';
}
function setupRole(){state.role=Math.random()<.28?'impostor':'crew';const botImpostor=agents.filter(a=>!a.isPlayer)[Math.floor(Math.random()*4)];agents.forEach(a=>a.isImpostor=false);if(state.role==='impostor')botImpostor.isImpostor=false;else botImpostor.isImpostor=true;updateTaskUI();}
function updateAlive(){const alive=agents.filter(a=>a.alive).length;$('#aliveText').textContent=`${alive} / 5`;$('#pips').innerHTML=agents.map(a=>`<span class="pip ${a.alive?'':'dead'}"></span>`).join('');}
function getFront(){const d=new THREE.Vector3(-Math.sin(state.yaw),0,-Math.cos(state.yaw));return d;}
function cameraUpdate(){camera.position.set(player.group.position.x,1.65,player.group.position.z);camera.rotation.order='YXZ';camera.rotation.y=state.yaw;camera.rotation.x=state.pitch;}
function distanceTo(a,b){return Math.hypot(a.x-b.x,a.z-b.z);}
function nearestInteraction(){let best=null,dist=2.7;
 if(state.role==='crew'){
  for(const t of terminals){if(t.done)continue;const d=distanceTo(player.group.position,t);if(d<dist){dist=d;best={kind:'task',target:t,label:`${t.name} · HOLD POSITION`};}}
  const body=agents.find(a=>!a.alive&&a.bodyMesh&&distanceTo(player.group.position,a.bodyMesh.position)<2.8);if(body){best={kind:'report',target:body,label:`REPORT ${body.name.toUpperCase()}`};}
 }else{
  const target=agents.find(a=>!a.isPlayer&&a.alive&&distanceTo(player.group.position,a.group.position)<2.35);if(target&&state.cooldown<=0)best={kind:'kill',target,label:`ELIMINATE ${target.name}`};
  const term=terminals.find(t=>distanceTo(player.group.position,t)<2.3);if(term)best={kind:'sabotage',target:term,label:'SABOTAGE SITE'};
 }
 state.interactTarget=best;const hint=$('#interact');if(best){hint.querySelector('span').textContent=best.label;hint.classList.add('show');}else hint.classList.remove('show');
}
function interact(){if(!state.running||state.meeting||state.ended)return;const action=state.interactTarget;if(!action)return;
 if(action.kind==='task'){
  action.target.done=true;state.tasks++;updateTaskUI();showToast(`${action.target.name} VERIFIED  ·  ${state.tasks}/3 OBJECTIVES COMPLETE`);
  if(state.tasks>=3){endRound(state.role==='crew','All three site objectives were verified. The crew completed their mission.');}
 }else if(action.kind==='kill'){
  makeBody(action.target);state.cooldown=17;showToast(`TARGET DOWN  ·  ${action.target.name} ELIMINATED`,true);updateAlive();
  const remaining=agents.filter(a=>a.alive&&!a.isImpostor).length;if(remaining<=1)endRound(true,'The crew is out. Dustline belongs to you.');
 }else if(action.kind==='sabotage'){
  state.time=Math.max(0,state.time-12);showToast('SITE SABOTAGED  ·  ROUND CLOCK -12 SEC',true);
 }else if(action.kind==='report'){
  callMeeting(action.target);
 }
 nearestInteraction();
}
function callMeeting(body){if(state.meeting||state.ended)return;state.meeting=true;state.running=false;$('#meetingText').textContent=`${body.name} was found at Dustline. Who is acting suspicious?`;
 const list=$('#voteList');list.innerHTML='';agents.filter(a=>a.alive&&!a.isPlayer).forEach((a,i)=>{const b=document.createElement('button');b.className='vote-btn';b.innerHTML=`<span class="agent-swatch" style="background:${a.color}"></span>${a.name}<span style="margin-left:auto;color:#879188">${i+1}</span>`;b.onclick=()=>castVote(a);list.appendChild(b);});
 $('#meeting').classList.add('show');if(document.pointerLockElement)document.exitPointerLock();}
function castVote(target){$('#meeting').classList.remove('show');state.meeting=false;const correct=state.role==='crew'?target.isImpostor:!target.isImpostor;makeBody(target);updateAlive();showToast(correct?`${target.name} WAS THE IMPOSTOR`:`${target.name} WAS NOT THE IMPOSTOR`,!correct);if(correct&&state.role==='crew')endRound(true,'The squad voted out the impostor. The site is secure.');else if(state.role==='impostor'&&correct)endRound(true,'The squad voted out a crewmate. You control the site.');else{state.running=true;state.time=Math.max(0,state.time-12);if(!isTouch)renderer.domElement.requestPointerLock?.();}}
$('#skipVote').onclick=()=>{ $('#meeting').classList.remove('show');state.meeting=false;state.running=true;state.time=Math.max(0,state.time-12);if(!isTouch)renderer.domElement.requestPointerLock?.();showToast('VOTE SKIPPED  ·  KEEP MOVING');};
function endRound(won,copy){if(state.ended)return;state.ended=true;state.running=false;if(document.pointerLockElement)document.exitPointerLock();const actualWin=state.role==='crew'?won:won;$('#resultKicker').textContent=actualWin?'MISSION SUCCESS':'ROUND LOST';$('#resultKicker').style.color=actualWin?'#c8f169':'#ff7169';$('#resultTitle').innerHTML=actualWin?(state.role==='impostor'?'SITE<br>OVERRUN.':'SITE<br>SECURED.'):'SQUAD<br>WIPED.';$('#resultCopy').textContent=copy;$('#result').classList.add('show');}

const isTouch=('ontouchstart'in window)||navigator.maxTouchPoints>0;
function startGame(){
 $('#intro').classList.add('hidden');$('#hud').classList.add('active');state.running=true;state.ended=false;state.time=105;state.health=100;state.tasks=0;state.cooldown=0;player.group.position.set(10,0,12);state.yaw=0;state.pitch=0;terminals.forEach(t=>t.done=false);agents.forEach((a,i)=>{a.alive=true;a.group.visible=true;if(a.bodyMesh){scene.remove(a.bodyMesh);a.bodyMesh=null;}if(i>0){a.group.position.set(starts[i-1][0],0,starts[i-1][1]);}});player.group.visible=false;setupRole();updateAlive();
 if(!isTouch)renderer.domElement.requestPointerLock?.();else createTouchControls();
}
$('#startBtn').addEventListener('click',startGame);$('#restartBtn').addEventListener('click',()=>{$('#result').classList.remove('show');$('#hud').classList.remove('active');$('#intro').classList.remove('hidden');startGame();});
$('#intro').addEventListener('click',e=>{if(e.target===$('#intro'))startGame();});

let touchControlsCreated=false;
function createTouchControls(){if(touchControlsCreated)return;touchControlsCreated=true;const style=document.createElement('style');style.textContent='.touch-pad{position:fixed;z-index:6;left:20px;bottom:90px;width:124px;height:124px;border-radius:50%;border:1px solid #ffffff3b;background:#10181388;pointer-events:auto;touch-action:none}.touch-knob{position:absolute;width:44px;height:44px;left:39px;top:39px;border-radius:50%;background:#c8f1699c;border:1px solid #e4ffb9}.touch-action{position:fixed;z-index:6;right:28px;bottom:90px;width:64px;height:64px;border-radius:50%;border:1px solid #c8f169;background:#182119dd;color:#c8f169;font:700 11px DM Mono;pointer-events:auto;touch-action:none}';document.head.appendChild(style);const pad=document.createElement('div');pad.className='touch-pad';pad.innerHTML='<div class="touch-knob"></div>';document.body.appendChild(pad);const knob=pad.firstChild;pad.addEventListener('pointerdown',e=>{pad.setPointerCapture(e.pointerId);});pad.addEventListener('pointermove',e=>{if(!pad.hasPointerCapture(e.pointerId))return;const r=pad.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),m=Math.min(35,Math.hypot(dx,dy)),a=Math.atan2(dy,dx);knob.style.transform=`translate(${Math.cos(a)*m}px,${Math.sin(a)*m}px)`;state.moveX=Math.cos(a)*Math.min(1,Math.hypot(dx,dy)/35);state.moveZ=Math.sin(a)*Math.min(1,Math.hypot(dx,dy)/35);});const reset=()=>{knob.style.transform='';state.moveX=0;state.moveZ=0};pad.addEventListener('pointerup',reset);pad.addEventListener('pointercancel',reset);const act=document.createElement('button');act.className='touch-action';act.textContent='USE';act.addEventListener('pointerdown',e=>{e.preventDefault();interact();});document.body.appendChild(act);}

renderer.domElement.addEventListener('click',()=>{if(state.running&&!isTouch&&!state.meeting&&!state.ended&&!document.pointerLockElement)renderer.domElement.requestPointerLock?.();});
document.addEventListener('mousemove',e=>{if(!state.running||!document.pointerLockElement)return;state.yaw-=e.movementX*.0022;state.pitch-=e.movementY*.0018;state.pitch=THREE.MathUtils.clamp(state.pitch,-1.2,1.2);});
let touchLook=null;renderer.domElement.addEventListener('pointerdown',e=>{if(isTouch&&state.running&&e.pointerType==='touch')touchLook={x:e.clientX,y:e.clientY,id:e.pointerId};});renderer.domElement.addEventListener('pointermove',e=>{if(!touchLook||e.pointerId!==touchLook.id)return;state.yaw-=(e.clientX-touchLook.x)*.006;state.pitch=THREE.MathUtils.clamp(state.pitch-(e.clientY-touchLook.y)*.004,-1.15,1.15);touchLook={x:e.clientX,y:e.clientY,id:e.pointerId};});renderer.domElement.addEventListener('pointerup',()=>touchLook=null);
document.addEventListener('keydown',e=>{state.keys.add(e.code);if(e.code==='KeyE'||e.code==='Space'){e.preventDefault();interact();}if(e.code==='Escape'&&state.running){state.running=false;showToast('ROUND PAUSED  ·  CLICK TO RESUME');}});
document.addEventListener('keyup',e=>state.keys.delete(e.code));document.addEventListener('pointerlockchange',()=>{if(document.pointerLockElement&&state.running)state.running=true;});

// Bots follow plausible patrol routes; the impostor quietly closes distance and attacks only at close range.
const patrols=[[-15,12],[-15,-10],[0,-2],[15,-12],[14,7],[0,14]];
function updateBots(dt){for(const a of agents){if(a.isPlayer||!a.alive)continue;a.phase+=dt*(a.isImpostor?1.2:.7);let target;
 if(a.isImpostor&&state.role==='crew'&&player.alive){target=player.group.position;const d=distanceTo(a.group.position,target);if(d<1.38){state.health-=dt*28;if(state.health<=0){state.health=0;player.alive=false;makeBody(player);updateAlive();endRound(false,'Your cover is blown. The impostor took you out.');}}}
 else {const ix=Math.floor((a.phase*.12+a.name.length)%patrols.length);target={x:patrols[ix][0],z:patrols[ix][1]};}
 if(target){const dx=target.x-a.group.position.x,dz=target.z-a.group.position.z,d=Math.hypot(dx,dz);if(d>.8){const pace=a.isImpostor&&state.role==='crew'?1.1:.6;a.group.position.x+=dx/d*pace*dt;a.group.position.z+=dz/d*pace*dt;a.group.rotation.y=Math.atan2(dx,dz);}}
 }}
function updatePlayer(dt){if(!state.running||state.meeting||state.ended)return;
 const forward=(state.keys.has('KeyW')||state.keys.has('ArrowUp')?-1:0)+(state.keys.has('KeyS')||state.keys.has('ArrowDown')?1:0)-state.moveZ;
 const strafe=(state.keys.has('KeyD')||state.keys.has('ArrowRight')?1:0)-(state.keys.has('KeyA')||state.keys.has('ArrowLeft')?1:0)+state.moveX;
 const speed=(state.keys.has('ShiftLeft')||state.keys.has('ShiftRight')?5.4:3.5);const l=Math.hypot(forward,strafe)||1;
 const dx=(Math.sin(state.yaw)*forward+Math.cos(state.yaw)*strafe)/l*speed*dt;const dz=(Math.cos(state.yaw)*forward-Math.sin(state.yaw)*strafe)/l*speed*dt;
 player.group.position.x=THREE.MathUtils.clamp(player.group.position.x+dx,-18.7,18.7);player.group.position.z=THREE.MathUtils.clamp(player.group.position.z+dz,-18.7,18.7);
 // simple collision against major dividing walls and crates
 const p=player.group.position;const obstacles=[[-7,-4,.6,8.5],[7,3,.6,9],[0,-11,5.5,.8],[0,10,4.5,.8],[-13,-3,1.4,1.4],[-12,3,1.3,1.3],[12,-4,1.5,1.5],[13,5,1.35,1.35],[-3,5,1.4,1.4],[3,-5,1.3,1.3]];
 for(const [x,z,hx,hz] of obstacles){if(Math.abs(p.x-x)<hx+.45&&Math.abs(p.z-z)<hz+.45){p.x-=dx;p.z-=dz;break;}}
 cameraUpdate();state.cooldown=Math.max(0,state.cooldown-dt);nearestInteraction();
 if(state.role==='crew'&&state.time%1<dt&&Math.random()<.028)showToast('SQUAD COMMS: STAY TOGETHER',true);
}
function fmtTime(t){const s=Math.max(0,Math.ceil(t));return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;}
function updateHud(dt){if(state.running&&!state.meeting&&!state.ended){state.time-=dt;if(state.time<=0){state.time=0;endRound(state.role==='impostor','Round timer expired. The site was lost.');}$('#clock').textContent=fmtTime(state.time);$('#roundSub').textContent=state.role==='impostor'?'ELIMINATE THE CREW':'SECURE THE SITE';}
 $('#healthNum').textContent=Math.round(state.health);$('#healthBar').style.width=`${state.health}%`;$('#healthBar').style.background=state.health<35?'#ff5e55':'#c8f169';if(performance.now()-state.lastToast>2300)$('#toast').classList.remove('show');
 const mapDot=$('#mapDot');mapDot.style.left=`${50+(player.group.position.x/40)*80}%`;mapDot.style.top=`${50+(player.group.position.z/40)*80}%`;mapDot.classList.toggle('enemy',state.role==='impostor');}
let prev=performance.now();function animate(now){requestAnimationFrame(animate);const dt=Math.min(.05,(now-prev)/1000);prev=now;updatePlayer(dt);updateBots(dt);updateHud(dt);renderer.render(scene,camera);}requestAnimationFrame(animate);
window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));});
