import * as THREE from 'three';
const boxGeo=new THREE.BoxGeometry(1,1,1);
const mat=(color,roughness=.86,emissive=0)=>new THREE.MeshStandardMaterial({color,roughness,emissive:emissive?color:0,emissiveIntensity:emissive});
function cube(parent,x,y,z,sx,sy,sz,material){const m=new THREE.Mesh(boxGeo,material);m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
function seedRand(seed){return()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296}}
export function createWorld(scene){
 const rand=seedRand(81173), colliders=[];
 const ground=mat(0x26342e),road=mat(0x252c2e),side=mat(0x60645d),curb=mat(0x77796f),line=mat(0xb9b59f),dark=mat(0x202426),windowMat=new THREE.MeshStandardMaterial({color:0x9da88a,roughness:.48,emissive:0x627149,emissiveIntensity:.23}),roof=mat(0x505454);
 cube(scene,0,-.55,0,560,.7,560,ground);
 // A compact, regular downtown street grid with sidewalks, curbs, and broken lane lines.
 for(let n=-5;n<=5;n++){const q=n*48;
  cube(scene,q,.015,0,13,.08,520,road);cube(scene,0,.016,q,520,.08,13,road);
  cube(scene,q+8,.035,0,2,.12,520,side);cube(scene,q-8,.035,0,2,.12,520,side);
  cube(scene,0,.035,q+8,520,.12,2,side);cube(scene,0,.035,q-8,520,.12,2,side);
  cube(scene,q+6.85,.09,0,.22,.22,520,curb);cube(scene,q-6.85,.09,0,.22,.22,520,curb);
  cube(scene,0,.09,q+6.85,520,.22,.22,curb);cube(scene,0,.09,q-6.85,520,.22,.22,curb);
  for(let d=-240;d<240;d+=12){if(Math.abs((d+6)%48)<11)continue;
   cube(scene,q,.071,d, .13,.018,5.3,line);cube(scene,d,.072,q,5.3,.018,.13,line);
  }
  // Crosswalk bars at every intersection.
  for(let j=-5;j<=5;j++){const z=j*48;if(n>-5){for(let k=-3;k<=3;k++){cube(scene,q+Math.sign(0)*0,.075,z+k*1.35,0.8,.025,.62,line);cube(scene,z+k*1.35,.075,q, .62,.025,.8,line)}}}
 }
 const palettes=[0x5d6866,0x69716c,0x797267,0x53646a,0x70685d,0x555f5d,0x887e6b,0x5b6468,0x73766e];
 for(let ix=-5;ix<5;ix++)for(let iz=-5;iz<5;iz++){
  const cx=ix*48+24+(rand()-.5)*4,cz=iz*48+24+(rand()-.5)*4;
  if(Math.abs(cx)<18&&Math.abs(cz)<18)continue;
  const w=17+rand()*7,dep=17+rand()*7,h=12+rand()*47,building=new THREE.Group();building.position.set(cx,0,cz);scene.add(building);
  const body=mat(palettes[Math.floor(rand()*palettes.length)]),base=mat(0x424a47),band=mat(0x879087,.78);
  cube(building,0,h/2,0,w,h,dep,body);cube(building,0,.35,0,w+.3,.7,dep+.3,base);cube(building,0,h+.25,0,w+.6,.35,dep+.6,roof);
  // warm windows on the visible street-facing wall, stacked in tidy bands
  const cols=Math.floor(w/3.2),rows=Math.floor((h-3)/3.3);
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
   if(rand()<.13)continue;const wx=-w/2+1.6+c*(w-3.2)/Math.max(1,cols-1),wy=2.2+r*3.1;
   const lit=rand()<.22;const wm=lit?windowMat:mat(0x333e3e,.55);
   cube(building,wx,wy,dep/2+.012,1.05,1.4,.035,wm);
  }
  if(h>34){cube(building,0,h+.72,0,w*.35,.7,dep*.35,base);cube(building,w*.22,h+1.2,0,.8,.25,dep*.2,band)}
  colliders.push({x:cx,z:cz,hw:w/2+1.6,hz:dep/2+1.6});
 }
 // Scattered street lamps and small trees soften the block edges.
 const lampMetal=mat(0x343b37),lampGlow=new THREE.MeshStandardMaterial({color:0xffe6a8,emissive:0xffbd63,emissiveIntensity:1.4});
 for(let n=-4;n<=4;n++)for(let s of [-1,1]){
  for(let a=-4;a<=4;a+=2){const x=n*48+s*8.2,z=a*48+20;
   if(rand()<.45){cube(scene,x,2.4,z,.15,4.8,.15,lampMetal);cube(scene,x+.9,4.8,z,.15,.15,.15,lampMetal);cube(scene,x+1.45,4.72,z,.95,.16,.34,lampGlow)}
  }
  const x=n*48+s*9.6,z=(n%2?18:-18);
  if(rand()<.65){const trunk=mat(0x52463a),leaf=mat(0x334a3c);cube(scene,x,.9,z,.45,1.8,.45,trunk);const top=new THREE.Mesh(new THREE.IcosahedronGeometry(1.7,1),leaf);top.position.set(x,2.65,z);top.castShadow=true;scene.add(top)}
 }
 // taxi: deliberately chunky, bright and readable from the chase camera
 const taxi=new THREE.Group();scene.add(taxi);
 const yellow=mat(0xf1ba32),glass=new THREE.MeshStandardMaterial({color:0x263b3d,metalness:.22,roughness:.22}),rubber=mat(0x161b1b),chrome=mat(0xb8b9ac,.38),headlamp=new THREE.MeshStandardMaterial({color:0xfff0c4,emissive:0xffd77a,emissiveIntensity:1.8});
 cube(taxi,0,.82,0,2.25,.78,4.1,yellow);cube(taxi,0,1.49,-.12,1.75,.9,2.1,glass);cube(taxi,0,1.04,-.05,2.31,.24,2.15,yellow);
 cube(taxi,0,1.98,-.05,.75,.22,.55,yellow);cube(taxi,0,1.28,1.35,2.05,.19,1.1,yellow);
 for(const x of [-1,1])for(const z of [-1.25,1.25]){const tire=new THREE.Mesh(new THREE.CylinderGeometry(.42,.42,.3,16),rubber);tire.rotation.z=Math.PI/2;tire.position.set(x*1.13,.48,z);tire.castShadow=true;taxi.add(tire);const hub=new THREE.Mesh(new THREE.CylinderGeometry(.2,.2,.315,12),chrome);hub.rotation.z=Math.PI/2;hub.position.set(x*1.13,.48,z);taxi.add(hub)}
 for(const x of [-.7,.7]){cube(taxi,x,1.17,2.07,.42,.22,.06,headlamp);cube(taxi,x,1.1,-2.07,.35,.2,.06,mat(0xd94e36,.4,.7))}
 const wheels=[];taxi.userData.wheels=wheels;
 // modest roof sign with lit TAXI face
 cube(taxi,0,2.2,-.08,.88,.14,.42,mat(0x202724));cube(taxi,0,2.29,-.08,.62,.055,.27,headlamp);
 const plate=new THREE.Mesh(new THREE.PlaneGeometry(.48,.13),new THREE.MeshBasicMaterial({color:0x172017}));plate.position.set(0,2.31,.065);taxi.add(plate);
 const traffic=[];const carColors=[0xd66d4e,0x497e87,0xaaa79a,0x715f8f,0x55755e,0xc0a24d];
 for(let i=0;i<14;i++){
  const car=new THREE.Group();scene.add(car);const color=mat(carColors[i%carColors.length]);cube(car,0,.7,0,1.9,.65,3.55,color);cube(car,0,1.25,-.1,1.5,.58,1.7,glass);
  for(const x of [-1,1])for(const z of [-1,1]){const t=new THREE.Mesh(new THREE.CylinderGeometry(.32,.32,.24,12),rubber);t.rotation.z=Math.PI/2;t.position.set(x*.97,.4,z*1.08);car.add(t)}
  const axis=i%2?'z':'x',lineIndex=Math.floor(rand()*9-4)*48,direction=rand()<.5?1:-1;
  car.userData={axis,lineIndex,direction,speed:5+rand()*5,phase:rand()*460};traffic.push(car);
 }
 return {taxi,colliders,traffic};
}
