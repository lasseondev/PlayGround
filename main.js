import * as THREE from 'three';

const stage = document.querySelector('#stage');
const scoreEl = document.querySelector('#score');
const comboEl = document.querySelector('#combo');
const timerEl = document.querySelector('#timer');
const timerFill = document.querySelector('#timerFill');
const speedValue = document.querySelector('#speedValue');
const speedNeedle = document.querySelector('#speedNeedle');
const statusText = document.querySelector('#statusText');
const trickToast = document.querySelector('#trickToast');
const startScreen = document.querySelector('#startScreen');
const endScreen = document.querySelector('#endScreen');
const keys = new Set();
const clock = new THREE.Clock();
const scene = new THREE.Scene();
scene.background = new THREE.Color('#d68a5f');
scene.fog = new THREE.FogExp2('#d68a5f', 0.0085);

const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
const renderPixelRatio = Math.min(window.devicePixelRatio || 1, 0.9);
renderer.setPixelRatio(renderPixelRatio);
renderer.setSize(stage.clientWidth, stage.clientHeight);
renderer.shadowMap.enabled = false;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
stage.prepend(renderer.domElement);

const camera = new THREE.PerspectiveCamera(54, stage.clientWidth / stage.clientHeight, 0.1, 180);
camera.position.set(0, 5.5, 11);
const hemi = new THREE.HemisphereLight('#fff1dd', '#505057', 2.15);
scene.add(hemi);
const sun = new THREE.DirectionalLight('#fff1df', 3.2);
sun.position.set(-16, 24, 15);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
sun.shadow.camera.left = -34; sun.shadow.camera.right = 34; sun.shadow.camera.top = 34; sun.shadow.camera.bottom = -34;
sun.shadow.bias = -0.0004;
scene.add(sun);

const mat = (color, roughness = .82, metalness = 0) => new THREE.MeshStandardMaterial({ color, roughness, metalness });
const concrete = mat('#b8b2a7');
const darkConcrete = mat('#777b7b');
const edgePaint = mat('#d9ff43', .7);
const steel = mat('#707b7b', .3, .72);
const rust = mat('#c55d38');
const cream = mat('#e6d9c2');
const dark = mat('#202326');
const skyBlue = mat('#8bafae');
const park = new THREE.Group(); scene.add(park);

function box(parent, name, size, position, material, rotation = [0,0,0], cast = true) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.name = name; mesh.position.set(...position); mesh.rotation.set(...rotation);
  mesh.castShadow = cast; mesh.receiveShadow = true; parent.add(mesh); return mesh;
}
function cylinder(parent, radiusTop, radiusBottom, height, position, material, rotation = [0,0,0], segments=12) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments), material);
  mesh.position.set(...position); mesh.rotation.set(...rotation); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
}
function instancedBoxes(parent, name, size, positions, material) {
  const mesh = new THREE.InstancedMesh(new THREE.BoxGeometry(...size), material, positions.length);
  const transform = new THREE.Object3D();
  positions.forEach((position, index) => {
    transform.position.set(...position);
    transform.updateMatrix();
    mesh.setMatrixAt(index, transform.matrix);
  });
  mesh.name = name;
  mesh.instanceMatrix.needsUpdate = true;
  mesh.castShadow = false;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}
function ramp(name, x, z, width, length, rise, color = concrete, direction = 1) {
  const group = new THREE.Group(); group.name = name; group.position.set(x, 0, z); park.add(group);
  // Wedge rises toward its far end; a broad colored deck edge makes the riding surface legible.
  const d = direction * length;
  const vertices = new Float32Array([
    -width/2,0,0, width/2,0,0, -width/2,rise,d,
    width/2,0,0, width/2,rise,d, -width/2,rise,d,
    -width/2,0,0, -width/2,rise,d, width/2,0,0,
    width/2,0,0, -width/2,rise,d, width/2,rise,d
  ]);
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(vertices,3)); geo.computeVertexNormals();
  const surface = new THREE.Mesh(geo, color); surface.material.side = THREE.DoubleSide; surface.castShadow = true; surface.receiveShadow = true; group.add(surface);
  // Lip strip at the high end
  box(group, `${name}-lip`, [width,.12,.16], [0,rise,d], edgePaint, [0,0,0], false);
  return group;
}

// Concrete pad and perimeter
box(park, 'park foundation', [76,.5,76], [0,-.3,0], darkConcrete);
box(park, 'riding surface', [70,.12,70], [0,-.025,0], concrete, [0,0,0], false);
// Painted court markings
const lineMat = new THREE.MeshBasicMaterial({ color: '#d9ff43', transparent:true, opacity:.5 });
for (const x of [-25,25]) { const line = new THREE.Mesh(new THREE.BoxGeometry(.045,.012,54), lineMat); line.position.set(x,.045,0); park.add(line); }
for (const z of [-25,25]) { const line = new THREE.Mesh(new THREE.BoxGeometry(54,.012,.045), lineMat); line.position.set(0,.045,z); park.add(line); }
// Quarter pipes and banks around a central flow line
ramp('north bank', 0,-24,24,8,2.4,cream,1);
ramp('south bank', 0,24,20,7,2.1,cream,-1);
ramp('west bank',-23,0,8,18,2.5,cream,1).rotation.y=Math.PI/2;
ramp('east bank',23,0,8,18,2.5,cream,-1).rotation.y=Math.PI/2;
// Central funbox with low decks and approaches
ramp('funbox approach',0,-7,7,6,1.05,rust,1);
box(park,'funbox deck',[7,1.05,5],[0,.52,1],rust);
box(park,'funbox coping',[7.2,.11,.14],[0,1.1,3.48],steel);
ramp('funbox exit',0,4.1,7,5.3,1.05,rust,-1);
// Pyramid banks, placed off the central line
ramp('left pyramid',-11,-2,7,7,1.55,skyBlue,1).rotation.y=Math.PI/2;
ramp('right pyramid',11,2,7,7,1.55,skyBlue,-1).rotation.y=-Math.PI/2;
// Grind rails and ledges
for (const x of [-5.4,5.4]) {
  box(park,'grind ledge',[.75,.56,13],[x,.28,-1],darkConcrete);
  box(park,'ledge coping',[.82,.08,13],[x,.6,-1],steel);
  for (const z of [-5,-1,3]) cylinder(park,.065,.065,.08,[x,.66,z],edgePaint,[Math.PI/2,0,0],8);
}
for (const x of [-2.4,2.4]) {
  cylinder(park,.065,.065,14,[x,.95,-10],steel,[Math.PI/2,0,0],12);
  for (const z of [-16,-10,-4]) box(park,'rail foot',[.12,.8,.12],[x,.4,z],steel);
}
// Manual pad / low box
box(park,'manual pad',[4,.42,3],[-13,.21,10],darkConcrete);
box(park,'manual pad paint',[4.06,.045,3.06],[-13,.44,10],edgePaint);

// Park perimeter fencing and urban dressing
const fencePosts = [];
for (let i=0;i<23;i++) {
  const x=-29+i*2.6;
  fencePosts.push([x,1.2,-31],[x,1.2,31]);
}
for (const side of [-1,1]) for (let i=0;i<18;i++) fencePosts.push([side*31,1.2,-30+i*3.5]);
instancedBoxes(park,'fence posts',[.08,2.4,.08],fencePosts,steel);
for (const z of [-31,31]) { box(park,'fence rail',[60,.08,.08],[0,2.1,z],steel); box(park,'fence rail',[60,.07,.08],[0,1.1,z],steel); }
for (const x of [-31,31]) { box(park,'side fence rail',[.08,.08,62],[x,2.1,0],steel); box(park,'side fence rail',[.08,.07,62],[x,1.1,0],steel); }
// Palm-like silhouettes, spotlights and shipping containers beyond the riding area
const palms = [[-36,-22,1],[36,-10,.85],[-36,17,.75],[35,25,1.05]];
const palmFronds = [];
const palmMaterial = mat('#607565');
for (const [x,z,s] of palms) {
  cylinder(park,.27,.46,5*s,[x,2.5*s,z],rust,[0,0,-.08],8);
  for(let k=0;k<6;k++){
    const a=k*Math.PI/3;
    palmFronds.push({ position:[x+Math.cos(a)*1.1*s,4.5*s,z+Math.sin(a)*1.1*s], rotation:[0,-a,-.42], scale:[1,s,s] });
  }
}
const frondMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(.15,.12,3),palmMaterial,palmFronds.length);
const frondTransform = new THREE.Object3D();
palmFronds.forEach(({position,rotation,scale},index)=>{
  frondTransform.position.set(...position);
  frondTransform.rotation.set(...rotation);
  frondTransform.scale.set(...scale);
  frondTransform.updateMatrix();
  frondMesh.setMatrixAt(index,frondTransform.matrix);
});
frondMesh.name='palm fronds';
frondMesh.instanceMatrix.needsUpdate=true;
frondMesh.castShadow=false;
park.add(frondMesh);
box(park,'back shipping container',[10,3.2,3],[-23,1.6,-35],mat('#586568'));
box(park,'container stripe',[10.1,.12,3.04],[-23,2.45,-35],edgePaint,[0,0,0],false);
box(park,'side container',[8,2.7,3],[24,1.35,35],rust);
// Low stadium lamps
for (const x of [-27,27]) { box(park,'lamp post',[.18,7,.18],[x,3.5,-29],dark); box(park,'lamp head',[2,.12,.55],[x,7.05,-29],cream); }

// Skater and board
const rider = new THREE.Group(); scene.add(rider);
const board = new THREE.Group(); rider.add(board);
box(board,'deck',[.66,.12,1.95],[0,.19,0],mat('#242628',.4));
box(board,'deck graphic',[.38,.018,1.22],[0,.26,0],edgePaint);
for (const x of [-.38,.38]) {
  box(board,'truck',[.12,.1,.28],[x,.13,.48],steel);
  for (const z of [-.72,.72]) cylinder(board,.13,.13,.11,[x,.08,z],dark,[0,0,Math.PI/2],12);
}
const body = new THREE.Group(); rider.add(body);
const pants = mat('#303b43'); const shirt = mat('#e8e1d3'); const skin = mat('#bd8062'); const shoe = mat('#202124');
cylinder(body,.19,.24,.68,[0,.86,-.05],pants,[0,0,0],8);
const torso = new THREE.Mesh(new THREE.BoxGeometry(.48,.58,.34),shirt); torso.position.set(0,1.42,-.08); torso.rotation.x=-.08; torso.castShadow=true; body.add(torso);
const head = new THREE.Mesh(new THREE.SphereGeometry(.19,16,12),skin); head.position.set(0,1.85,-.13); head.castShadow=true; body.add(head);
const helmet = new THREE.Mesh(new THREE.SphereGeometry(.2,16,10,0,Math.PI*2,0,Math.PI*.56),mat('#d9ff43'));
helmet.position.set(0,1.92,-.13); helmet.castShadow=true; body.add(helmet);
// legs and shoes
for (const side of [-1,1]) {
  const leg = box(body,'leg',[.16,.5,.18],[side*.14,.49,0],pants,[side*.1,0,side*.08]);
  box(body,'shoe',[.23,.13,.36],[side*.15,.25,-.14],shoe);
  const arm = box(body,'arm',[.14,.55,.15],[side*.31,1.42,-.03],[shirt,shirt][0],[0,0,side*.24]);
  arm.rotation.z=side*.28;
}
// ground shadow disc
const shadow = new THREE.Mesh(new THREE.CircleGeometry(.82,24),new THREE.MeshBasicMaterial({color:'#242324',transparent:true,opacity:.18,depthWrite:false}));
shadow.rotation.x=-Math.PI/2; shadow.position.y=.045; scene.add(shadow);

const state = { running:false, ended:false, time:120, runStartedAt:0, score:0, combo:0, comboText:[], comboMultiplier:1, airTime:0, vy:0, airborne:false, speed:0, vx:0, x:0, z:16, grind:false, grindTime:0, lastTrick:0, toastTimer:0, jumpBuffer:0, audio:null, soundOn:true, bailCooldown:0 };
const trickNames = { z:['KICKFLIP',250], x:['POP SHUVIT',200], c:['50-50 GRIND',350], q:['HEELFLIP',300], e:['360 SHUVIT',400] };
let toastTimeout = 0;
const formatScore = n => Math.floor(n).toString().padStart(6,'0').slice(-6);
function renderScore(){ scoreEl.textContent=formatScore(state.score); }
function flashTrick(name, points){ document.querySelector('#trickName').textContent=name; document.querySelector('#trickPoints').textContent=`+${Math.floor(points)}`; trickToast.classList.add('show'); clearTimeout(toastTimeout); toastTimeout=setTimeout(()=>trickToast.classList.remove('show'),1050); }
function beep(freq=520,duration=.08){ if(!state.soundOn||!state.audio) return; try{const o=state.audio.createOscillator(),g=state.audio.createGain();o.type='triangle';o.frequency.value=freq;g.gain.setValueAtTime(.055,state.audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,state.audio.currentTime+duration);o.connect(g);g.connect(state.audio.destination);o.start();o.stop(state.audio.currentTime+duration);}catch{} }
function startRun(){
  state.running=true;state.ended=false;state.time=120;state.runStartedAt=performance.now();state.score=0;state.combo=0;state.comboText=[];state.comboMultiplier=1;state.speed=0;state.vx=0;state.x=0;state.z=16;state.vy=0;state.airborne=false;state.grind=false;state.grindTime=0;state.airTime=0;
  rider.position.set(0,.02,16);rider.rotation.set(0,0,0);board.rotation.set(0,0,0);body.rotation.set(0,0,0);
  startScreen.classList.add('hidden');endScreen.classList.add('hidden');statusText.textContent='PUSH TO BUILD SPEED'; renderScore();
  if(!state.audio){try{state.audio=new (window.AudioContext||window.webkitAudioContext)();}catch{}}
}
function finishRun(){state.running=false;state.ended=true;document.querySelector('#finalScore').textContent=formatScore(state.score);endScreen.classList.remove('hidden');statusText.textContent='SESSION COMPLETE';}
function beginJump(){ if(!state.running||state.airborne||state.grind)return; if(state.speed<1.6)state.speed=1.6;state.airborne=true;state.vy=6.7+Math.min(state.speed*.1,1.2);state.airTime=0;state.grind=false;statusText.textContent='AIRBORNE';beep(350,.08); }
function doTrick(key){
  if(!state.running)return;
  if(key==='c'){
    const nearRail=Math.abs(Math.abs(state.x)-2.4)<.8 && state.z>-18&&state.z<-2;
    const nearLedge=Math.abs(Math.abs(state.x)-5.4)<.8 && state.z>-9&&state.z<8;
    if((nearRail||nearLedge)&&(state.airborne||state.speed>3)){
      state.grind=true;state.airborne=false;state.vy=0;state.grindTime=0;state.vy=0;state.combo++;state.comboText.push('50-50 GRIND');state.comboMultiplier=Math.min(8,state.comboMultiplier+1);flashTrick('50-50 GRIND',350*state.comboMultiplier);statusText.textContent='LOCKED IN';beep(620,.12);return;
    }
  }
  if(key==='c')return;
  if(!state.airborne){ if(key==='z'||key==='x'||key==='q'||key==='e')beginJump(); else return; }
  if(!state.airborne)return;
  const [name,base]=trickNames[key]||[]; if(!name)return;
  const rotation=key==='x'||key==='e'?Math.PI*2:Math.PI*2;
  board.userData.spin=(board.userData.spin||0)+rotation;
  body.rotation.z += key==='q'?-.35:(key==='z'?.32:0);
  const points=base*state.comboMultiplier;
  state.combo++;state.comboText.push(name);state.comboMultiplier=Math.min(8,state.comboMultiplier+1);state.score+=points;renderScore();
  comboEl.innerHTML=`${state.combo}× <span>${name}${state.combo>1?' COMBO':''}</span>`;
  flashTrick(name,points);beep(520+state.combo*55,.09);
}
function bail(){
  if(state.bailCooldown>0)return;
  state.bailCooldown=1.4;state.combo=0;state.comboText=[];state.comboMultiplier=1;state.grind=false;state.airborne=false;state.vy=0;state.speed*=.3;body.rotation.x=-.7;statusText.textContent='BAIL — GET BACK UP';comboEl.innerHTML='— <span>NO COMBO</span>';setTimeout(()=>{if(state.running){body.rotation.x=0;statusText.textContent='FIND YOUR LINE';}},650);
}
function land(){
  state.airborne=false;state.vy=0;rider.position.y=.02;board.rotation.set(0,0,0);board.userData.spin=0;body.rotation.z=0;body.rotation.x=0;shadow.material.opacity=.18;
  if(state.combo>0){const bonus=Math.floor(100*state.combo*state.comboMultiplier);state.score+=bonus;flashTrick(`${state.combo} TRICK LINE`,bonus);statusText.textContent='CLEAN LANDING';beep(760,.12);state.combo=0;state.comboText=[];state.comboMultiplier=1;comboEl.innerHTML='— <span>LINE BANKED</span>';renderScore();}
  else statusText.textContent='PUSH TO BUILD SPEED';
}

window.addEventListener('keydown',e=>{
  const key=e.key.toLowerCase(); if([' ','arrowup','arrowdown','arrowleft','arrowright'].includes(key))e.preventDefault(); keys.add(key);
  if(key===' '||key==='arrowup')beginJump();
  if(['z','x','c','q','e'].includes(key))doTrick(key);
});
window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
window.addEventListener('blur',()=>keys.clear());
document.querySelector('#startBtn').addEventListener('click',startRun);
document.querySelector('#restartBtn').addEventListener('click',startRun);
document.querySelector('#soundBtn').addEventListener('click',()=>{state.soundOn=!state.soundOn;document.querySelector('#soundLabel').textContent=state.soundOn?'SOUND ON':'SOUND OFF';document.querySelector('.sound-icon').textContent=state.soundOn?'♪':'×';if(state.soundOn)beep(600,.08);});
for(const button of document.querySelectorAll('.mobile-controls button')){
  const key=button.dataset.key;
  const down=e=>{e.preventDefault();keys.add(key);if(key==='space')beginJump();else if(['z','x','c'].includes(key))doTrick(key);};
  const up=e=>{e.preventDefault();keys.delete(key);};
  button.addEventListener('pointerdown',down);button.addEventListener('pointerup',up);button.addEventListener('pointercancel',up);button.addEventListener('pointerleave',up);
}

const desiredCamera = new THREE.Vector3();
function update(dt){
  if(state.running){
    state.time=Math.max(0,120-(performance.now()-state.runStartedAt)/1000);const seconds=Math.ceil(state.time);timerEl.textContent=`${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;timerFill.style.width=`${(state.time/120)*100}%`;
    if(state.time<=0){finishRun();return;}
    state.bailCooldown=Math.max(0,state.bailCooldown-dt);
    const forward=keys.has('w')||keys.has('arrowup'),back=keys.has('s')||keys.has('arrowdown'),left=keys.has('a')||keys.has('arrowleft'),right=keys.has('d')||keys.has('arrowright');
    if(forward)state.speed=Math.min(12.5,state.speed+dt*4.4);else if(back)state.speed=Math.max(-3,state.speed-dt*6);else state.speed=Math.max(0,state.speed-dt*.42);
    const targetVx=(right?1:0)-(left?1:0);state.vx=THREE.MathUtils.damp(state.vx,targetVx*6.2,5,dt);
    if(state.grind){
      state.grindTime+=dt;state.speed=Math.max(4,state.speed);state.x=THREE.MathUtils.damp(state.x,Math.round(state.x/2.4)*2.4,12,dt);state.vy=0;rider.position.y=.32;
      if(state.grindTime>2.7||state.z<-18||state.z>5){state.grind=false;state.airborne=true;state.vy=3.5;state.airTime=0;statusText.textContent='POP OUT';}
      if(Math.floor(state.grindTime*2)!==Math.floor((state.grindTime-dt)*2)){state.score+=Math.floor(40*state.comboMultiplier);renderScore();}
    }
    state.x+=state.vx*dt;
    state.z-=state.speed*dt;
    if(Math.abs(state.x)>27){state.x=THREE.MathUtils.clamp(state.x,-27,27);state.vx*=-.2;state.speed*=.86;}
    if(state.z<-29){state.z=29;}
    if(state.z>29){state.z=-29;}
    if(state.airborne){state.airTime+=dt;state.vy-=17*dt;rider.position.y+=state.vy*dt;
      const spin=board.userData.spin||0;if(spin)board.rotation.x+=dt*12*(spin>0?1:-1);
      body.rotation.z=THREE.MathUtils.damp(body.rotation.z,0,2,dt);shadow.material.opacity=Math.max(.04,.18-rider.position.y*.055);
      if(rider.position.y<=.02&&state.vy<0){if(state.airTime<.23&&state.combo>0)bail();else land();}
      if(rider.position.y>5.5)bail();
    } else if(!state.grind){rider.position.y=THREE.MathUtils.damp(rider.position.y,.02,15,dt);board.rotation.x=THREE.MathUtils.damp(board.rotation.x,0,9,dt);body.rotation.z=THREE.MathUtils.damp(body.rotation.z,0,5,dt);}
    rider.position.x=state.x;rider.position.z=state.z;rider.rotation.y=THREE.MathUtils.damp(rider.rotation.y,-state.vx*.055,4,dt);
    shadow.position.set(state.x,.045,state.z);shadow.scale.setScalar(Math.max(.45,1-rider.position.y*.09));
    if(!state.airborne&&!state.grind&&state.combo>0&&state.speed<.8){state.combo=0;state.comboMultiplier=1;comboEl.innerHTML='— <span>NO COMBO</span>';}
    speedValue.textContent=Math.round(Math.abs(state.speed)*2.3);speedNeedle.style.left=`${Math.min(100,Math.abs(state.speed)/12.5*100)}%`;
    if(state.airborne)statusText.textContent='AIRBORNE';else if(state.grind)statusText.textContent='LOCKED IN';else if(state.speed>8)statusText.textContent='FULL SEND';else if(state.speed>1)statusText.textContent='BUILDING SPEED';
  } else {
    // Slow cinematic orbit while waiting between runs
    rider.position.y=.02+Math.sin(performance.now()*.001)*.025;
    rider.rotation.y=Math.sin(performance.now()*.00025)*.16;
  }
}
function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.035);update(dt);
  const followX=rider.position.x*.72;desiredCamera.set(followX,5.2+rider.position.y*.26,rider.position.z+9.5);
  camera.position.lerp(desiredCamera,1-Math.exp(-dt*3.2));
  camera.lookAt(rider.position.x*.55,1.15+rider.position.y*.42,rider.position.z-5.8);
  renderer.render(scene,camera);
}
window.addEventListener('resize',()=>{const w=stage.clientWidth,h=stage.clientHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h);renderer.setPixelRatio(renderPixelRatio);});
renderScore();animate();
