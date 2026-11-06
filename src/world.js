import * as THREE from '../vendor/three.module.js';
import { FIELD, COLORS } from './constants.js';
import { makeGlowTexture, makeShadowTexture, makeSprite } from './fx.js';

const steelMat = new THREE.MeshStandardMaterial({ color: 0x0b141d, roughness: 0.42, metalness: 0.72 });
const darkMat = new THREE.MeshStandardMaterial({ color: 0x050b12, roughness: 0.82, metalness: 0.25 });
const crowdMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9, metalness: 0.0 });

function neon(color, opacity = 1) {
  return new THREE.MeshBasicMaterial({ color, transparent: opacity < 1, opacity, toneMapped: false });
}

function box(parent, w, h, d, x, y, z, mat) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  parent.add(m);
  return m;
}

function makeFieldTexture(anisotropy = 1) {
  const W = 1536;
  const H = 1024;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const ctx = c.getContext('2d');

  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#081f24');
  bg.addColorStop(0.5, '#0a2a2b');
  bg.addColorStop(1, '#061a20');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // mown turf bands
  for (let i = 0; i < 14; i++) {
    if (i % 2 === 0) continue;
    ctx.fillStyle = 'rgba(35, 100, 92, 0.09)';
    ctx.fillRect((i * W) / 14, 0, W / 14, H);
  }
  // fine diagonal pitch texture
  ctx.strokeStyle = 'rgba(120, 240, 220, 0.025)';
  ctx.lineWidth = 1;
  for (let x = -H; x < W; x += 14) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + H, H);
    ctx.stroke();
  }
  // grain
  for (let i = 0; i < 5500; i++) {
    ctx.fillStyle = `rgba(190,255,240,${Math.random() * 0.035})`;
    ctx.fillRect(Math.random() * W, Math.random() * H, Math.random() * 2.5 + 0.5, Math.random() * 2.5 + 0.5);
  }

  const line = (fn) => {
    ctx.save();
    ctx.strokeStyle = 'rgba(180, 249, 255, 0.62)';
    ctx.fillStyle = 'rgba(180, 249, 255, 0.62)';
    ctx.lineWidth = 6;
    ctx.shadowColor = 'rgba(80, 230, 255, 0.85)';
    ctx.shadowBlur = 14;
    fn();
    ctx.restore();
  };

  const m = 26;
  line(() => {
    ctx.strokeRect(m, m, W - m * 2, H - m * 2);
    ctx.beginPath();
    ctx.moveTo(W / 2, m);
    ctx.lineTo(W / 2, H - m);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(W / 2, H / 2, (10 / 120) * W, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(W / 2, H / 2, 8, 0, Math.PI * 2);
    ctx.fill();
    // penalty boxes
    for (const side of [-1, 1]) {
      const edge = side === -1 ? m : W - m;
      const depth = (16 / 120) * W;
      const half = (20 / 80) * H;
      ctx.strokeRect(side === -1 ? edge : edge - depth, H / 2 - half, depth, half * 2);
      const smallDepth = (7 / 120) * W;
      const smallHalf = (12 / 80) * H;
      ctx.strokeRect(side === -1 ? edge : edge - smallDepth, H / 2 - smallHalf, smallDepth, smallHalf * 2);
      ctx.beginPath();
      ctx.arc(side === -1 ? edge : edge, H / 2, (9 / 80) * H, side === -1 ? -Math.PI / 2 : Math.PI / 2, side === -1 ? Math.PI / 2 : (Math.PI * 3) / 2);
      ctx.stroke();
    }
    // corner arcs
    for (const sx of [0, 1]) {
      for (const sy of [0, 1]) {
        ctx.beginPath();
        const cx = sx ? W - m : m;
        const cy = sy ? H - m : m;
        const a = Math.atan2(sy ? -1 : 1, sx ? -1 : 1);
        ctx.arc(cx, cy, 42, a - Math.PI / 2, a + Math.PI / 2);
        ctx.stroke();
      }
    }
  });

  // center crest
  ctx.save();
  ctx.translate(W / 2, H / 2);
  ctx.strokeStyle = 'rgba(120, 240, 255, 0.22)';
  ctx.lineWidth = 5;
  for (let k = 0; k < 3; k++) {
    const r = 62 + k * 20;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(120, 240, 255, 0.34)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, -92);
  ctx.lineTo(14, -72);
  ctx.lineTo(-10, -28);
  ctx.lineTo(8, -6);
  ctx.stroke();
  ctx.restore();

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = anisotropy;
  return tex;
}

function makeGroundTexture() {
  const S = 512;
  const c = document.createElement('canvas');
  c.width = c.height = S;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#040a10';
  ctx.fillRect(0, 0, S, S);
  ctx.strokeStyle = 'rgba(67, 190, 220, 0.10)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= S; i += 32) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, S);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(S, i);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(8, 6);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeNetTexture() {
  const S = 128;
  const c = document.createElement('canvas');
  c.width = c.height = S;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, S, S);
  ctx.strokeStyle = 'rgba(190, 246, 255, 0.75)';
  ctx.lineWidth = 1.6;
  for (let i = 0; i <= S; i += 16) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, S);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(S, i);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeAdTexture(words, accent) {
  const W = 512;
  const H = 128;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#06121a';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = accent;
  ctx.globalAlpha = 0.18;
  for (let i = -2; i < 8; i++) {
    ctx.save();
    ctx.translate(i * 90, 0);
    ctx.rotate(-0.35);
    ctx.fillRect(0, -40, 32, 220);
    ctx.restore();
  }
  ctx.globalAlpha = 1;
  ctx.strokeStyle = accent;
  ctx.lineWidth = 4;
  ctx.strokeRect(3, 3, W - 6, H - 6);
  ctx.fillStyle = '#e9fdff';
  ctx.font = '900 54px Orbitron, Arial Black, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = accent;
  ctx.shadowBlur = 18;
  ctx.fillText(words, W / 2, H / 2 + 3);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeScoreboardCanvas() {
  const c = document.createElement('canvas');
  c.width = 640;
  c.height = 200;
  return c;
}

export function createArena(scene, renderer) {
  const anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  scene.fog = new THREE.FogExp2(0x040b14, 0.0019);

  // ---- Sky ----
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    vertexShader: `varying vec3 vPos; void main(){ vPos = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `
      varying vec3 vPos;
      void main(){
        float h = normalize(vPos).y;
        vec3 bottom = vec3(0.035, 0.10, 0.14);
        vec3 top = vec3(0.006, 0.012, 0.032);
        vec3 col = mix(bottom, top, smoothstep(-0.02, 0.62, h));
        float horizon = pow(max(0.0, 1.0 - abs(h + 0.03)), 7.0);
        col += vec3(0.015, 0.10, 0.13) * horizon;
        gl_FragColor = vec4(col, 1.0);
      }`,
  });
  const sky = new THREE.Mesh(new THREE.SphereGeometry(340, 32, 16), skyMat);
  sky.renderOrder = -10;
  scene.add(sky);

  const starGeo = new THREE.BufferGeometry();
  const starPos = [];
  for (let i = 0; i < 520; i++) {
    const a = Math.random() * Math.PI * 2;
    const h = 0.12 + Math.random() * 0.85;
    const r = 300;
    starPos.push(Math.cos(a) * Math.cos(h) * r * 0.9, Math.sin(h) * r, Math.sin(a) * Math.cos(h) * r * 0.9);
  }
  starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPos, 3));
  const stars = new THREE.Points(
    starGeo,
    new THREE.PointsMaterial({ color: 0x9de9ff, size: 1.2, transparent: true, opacity: 0.65, fog: false, depthWrite: false })
  );
  scene.add(stars);

  // ---- Lights ----
  scene.add(new THREE.HemisphereLight(0x9eeeff, 0x071016, 1.65));
  const key = new THREE.DirectionalLight(0xd8f9ff, 2.2);
  key.position.set(45, 80, 25);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x2bc8ff, 1.15);
  rim.position.set(-60, 35, -40);
  scene.add(rim);
  const fill = new THREE.PointLight(0xff8a28, 55, 100, 1.5);
  fill.position.set(55, 12, 0);
  scene.add(fill);
  const fillB = new THREE.PointLight(0x28c9ff, 55, 100, 1.5);
  fillB.position.set(-55, 12, 0);
  scene.add(fillB);

  // ---- Ground ----
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(360, 280),
    new THREE.MeshStandardMaterial({
      map: makeGroundTexture(),
      color: 0x3b5261,
      roughness: 0.72,
      metalness: 0.35,
    })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.08;
  scene.add(ground);

  // ---- Pitch ----
  const pitch = new THREE.Mesh(
    new THREE.PlaneGeometry(FIELD.halfX * 2, FIELD.halfZ * 2),
    new THREE.MeshStandardMaterial({
      map: makeFieldTexture(anisotropy),
      roughness: 0.74,
      metalness: 0.12,
      emissive: 0x0d3840,
      emissiveIntensity: 0.18,
    })
  );
  pitch.rotation.x = -Math.PI / 2;
  pitch.position.y = 0.01;
  scene.add(pitch);

  // Field rim / boundary glow
  const lineMat = neon(0x8cefff, 0.72);
  box(scene, FIELD.halfX * 2 + 1.2, 0.1, 0.26, 0, 0.1, -FIELD.halfZ, lineMat);
  box(scene, FIELD.halfX * 2 + 1.2, 0.1, 0.26, 0, 0.1, FIELD.halfZ, lineMat);
  box(scene, 0.26, 0.1, FIELD.halfZ * 2 + 1.2, -FIELD.halfX, 0.1, 0, lineMat);
  box(scene, 0.26, 0.1, FIELD.halfZ * 2 + 1.2, FIELD.halfX, 0.1, 0, lineMat);
  box(scene, 0.24, 0.1, FIELD.halfZ * 2, 0, 0.1, 0, lineMat);

  const circle = new THREE.Mesh(
    new THREE.TorusGeometry(10, 0.14, 6, 80),
    neon(0x87f0ff, 0.55)
  );
  circle.rotation.x = -Math.PI / 2;
  circle.position.y = 0.1;
  scene.add(circle);
  const circle2 = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.17, 6, 32), neon(0xb9fbff, 0.9));
  circle2.rotation.x = -Math.PI / 2;
  circle2.position.y = 0.11;
  scene.add(circle2);

  // penalty box outlines
  const boxMat = neon(0x6ee9ff, 0.32);
  for (const side of [-1, 1]) {
    const x = side * FIELD.halfX;
    for (const z of [-20, 20]) {
      box(scene, 16, 0.08, 0.18, x - side * 8, 0.09, z, boxMat);
    }
    box(scene, 0.18, 0.08, 40, x - side * 16, 0.09, 0, boxMat);
  }

  // ---- Stands ----
  const standGroup = new THREE.Group();
  scene.add(standGroup);
  const tierMat = new THREE.MeshStandardMaterial({ color: 0x071018, roughness: 0.72, metalness: 0.5 });
  const tierTop = new THREE.MeshStandardMaterial({ color: 0x101c26, roughness: 0.8, metalness: 0.35 });
  const crowdGeo = new THREE.BoxGeometry(0.52, 0.92, 0.52);
  const crowd = new THREE.InstancedMesh(crowdGeo, crowdMat, 1450);
  crowd.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  const dummy = new THREE.Object3D();
  const palette = [0x2ad7ff, 0xff8126, 0xd9fbff, 0x8d6bff, 0xffd166, 0x5b7fb5, 0x174b5e, 0x74391f];
  const color = new THREE.Color();
  let ci = 0;

  for (let side = 0; side < 4; side++) {
    const alongZ = side < 2;
    const sign = side % 2 === 0 ? -1 : 1;
    for (let row = 0; row < 5; row++) {
      const dist = (alongZ ? 44 : 64) + row * 3.7;
      const y = 1.0 + row * 2.05;
      if (alongZ) {
        box(standGroup, 162, 2.05, 3.9, 0, y, sign * dist, row === 0 ? tierTop : tierMat);
        if (row === 0) {
          box(standGroup, 162, 0.12, 0.22, 0, 2.12, sign * (dist - 1.96), neon(sign < 0 ? 0x32d8ff : 0x2ad7ff, 0.55));
        }
      } else {
        box(standGroup, 3.9, 2.05, 120, sign * dist, y, 0, row === 0 ? tierTop : tierMat);
        if (row === 0) {
          box(standGroup, 0.22, 0.12, 120, sign * (dist - 1.96), 2.12, 0, neon(sign < 0 ? 0x32d8ff : 0xff8126, 0.6));
        }
      }
      const count = 58;
      for (let i = 0; i < count && ci < crowd.count; i++) {
        const jitter = (Math.random() - 0.5) * 3.2;
        const along = alongZ ? (Math.random() - 0.5) * 150 : (Math.random() - 0.5) * 108;
        dummy.position.set(
          alongZ ? along : sign * (dist + jitter * 0.4),
          y + 1.48,
          alongZ ? sign * (dist + jitter * 0.4) : along
        );
        const s = 0.75 + Math.random() * 0.7;
        dummy.scale.set(s, 0.8 + Math.random() * 0.5, s);
        dummy.rotation.y = Math.random() * Math.PI;
        dummy.updateMatrix();
        crowd.setMatrixAt(ci, dummy.matrix);
        color.setHex(palette[(Math.random() * palette.length) | 0]);
        if (Math.random() < 0.36) color.multiplyScalar(0.45);
        crowd.setColorAt(ci, color);
        ci++;
      }
    }
  }
  crowd.instanceMatrix.needsUpdate = true;
  if (crowd.instanceColor) crowd.instanceColor.needsUpdate = true;
  standGroup.add(crowd);

  // lower facade band around pitch
  const facadeMat = new THREE.MeshStandardMaterial({ color: 0x08131c, roughness: 0.5, metalness: 0.65 });
  box(standGroup, 172, 3.4, 2.0, 0, 1.7, -47, facadeMat);
  box(standGroup, 172, 3.4, 2.0, 0, 1.7, 47, facadeMat);
  box(standGroup, 2.0, 3.4, 124, -67, 1.7, 0, facadeMat);
  box(standGroup, 2.0, 3.4, 124, 67, 1.7, 0, facadeMat);

  // ---- Wall glass ----
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x6bd7e8,
    transparent: true,
    opacity: 0.075,
    roughness: 0.1,
    metalness: 0.55,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const glassMatWarm = new THREE.MeshStandardMaterial({
    color: 0xffad76,
    transparent: true,
    opacity: 0.07,
    roughness: 0.1,
    metalness: 0.55,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

  const addGlassPanel = (w, h, d, x, y, z, mat) => {
    const panel = box(scene, w, h, d, x, y, z, mat);
    panel.renderOrder = 2;
    return panel;
  };

  // side walls (long sides)
  for (const side of [-1, 1]) {
    addGlassPanel(120, 11.5, 0.3, 0, 7.0, side * FIELD.halfZ, glassMat);
    // barrier + rails
    const barrier = new THREE.MeshStandardMaterial({ color: 0x0a1a23, roughness: 0.4, metalness: 0.6 });
    box(scene, 120.4, 1.15, 0.7, 0, 0.58, side * FIELD.halfZ, barrier);
    box(scene, 120.4, 0.12, 0.9, 0, 1.18, side * FIELD.halfZ, neon(0x56e7ff, 0.85));
    box(scene, 120.4, 0.2, 0.8, 0, 12.95, side * FIELD.halfZ, neon(0x2acfff, 0.9));
    for (let i = -5; i <= 5; i++) {
      box(scene, 0.22, 11.6, 0.42, i * 10.9, 7.0, side * FIELD.halfZ, steelMat);
    }
    // ad boards
    for (let k = 0; k < 3; k++) {
      const words = ['OMG // ARENA', 'FULL BOOST', 'NEON LEAGUE'][k];
      const tex = makeAdTexture(words, k === 1 ? '#ff7a18' : '#28d7ff');
      const ad = new THREE.Mesh(
        new THREE.PlaneGeometry(11.5, 2.9),
        new THREE.MeshBasicMaterial({ map: tex, toneMapped: false })
      );
      ad.position.set((k - 1) * 24, 4.7, side * (FIELD.halfZ - 0.2));
      if (side > 0) ad.rotation.y = Math.PI;
      scene.add(ad);
    }
  }

  // end walls
  for (const side of [-1, 1]) {
    const wallX = side * FIELD.halfX;
    const col = side < 0 ? COLORS.blue : COLORS.orange;
    const glass = side < 0 ? glassMat : glassMatWarm;
    // segments either side of goal mouth
    for (const zs of [-1, 1]) {
      addGlassPanel(0.3, 11.5, 28, wallX, 7.0, zs * 26, glass);
      box(scene, 0.7, 1.15, 28.3, wallX, 0.58, zs * 26, steelMat);
      box(scene, 0.9, 0.12, 28.3, wallX, 1.18, zs * 26, neon(col, 0.8));
      for (let i = 0; i < 4; i++) {
        box(scene, 0.42, 11.6, 0.22, wallX, 7.0, zs * (14 + i * 7.2), steelMat);
      }
    }
    // header above goal
    addGlassPanel(0.3, 4, 24, wallX, 11, 0, glass);
    box(scene, 0.8, 0.22, 24.4, wallX, 12.95, 0, neon(col, 0.92));
    box(scene, 0.8, 1.15, 24.4, wallX, 0.58, 0, new THREE.MeshStandardMaterial({ color: 0x0a1a23, roughness: 0.4, metalness: 0.6 }));

    // goal frame
    const goalMat = new THREE.MeshStandardMaterial({
      color: col,
      emissive: col,
      emissiveIntensity: 1.8,
      roughness: 0.32,
      metalness: 0.45,
      toneMapped: false,
    });
    for (const zs of [-1, 1]) {
      box(scene, 0.75, FIELD.goalHeight, 0.75, wallX, FIELD.goalHeight / 2, zs * FIELD.goalHalfZ, goalMat);
    }
    box(scene, 0.8, 0.65, FIELD.goalHalfZ * 2 + 0.6, wallX, FIELD.goalHeight, 0, goalMat);
    box(scene, 0.55, 0.2, FIELD.goalHalfZ * 2, wallX, 0.12, 0, neon(col, 0.85));

    // goal interior tint + net
    const gx = wallX + side * FIELD.goalDepth / 2;
    const tint = new THREE.Mesh(
      new THREE.PlaneGeometry(FIELD.goalDepth, FIELD.goalHalfZ * 2),
      new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    tint.rotation.x = -Math.PI / 2;
    tint.position.set(gx, 0.05, 0);
    scene.add(tint);

    const netTex = makeNetTexture();
    netTex.repeat.set(6, 2.4);
    const netMat = new THREE.MeshBasicMaterial({
      map: netTex,
      transparent: true,
      opacity: 0.52,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const back = new THREE.Mesh(new THREE.PlaneGeometry(FIELD.goalHalfZ * 2, FIELD.goalHeight), netMat);
    back.rotation.y = side < 0 ? Math.PI / 2 : -Math.PI / 2;
    back.position.set(wallX + side * FIELD.goalDepth, FIELD.goalHeight / 2, 0);
    scene.add(back);
    for (const zs of [-1, 1]) {
      const net = new THREE.Mesh(new THREE.PlaneGeometry(FIELD.goalDepth, FIELD.goalHeight), netMat);
      net.position.set(gx, FIELD.goalHeight / 2, zs * FIELD.goalHalfZ);
      scene.add(net);
    }
    const top = new THREE.Mesh(new THREE.PlaneGeometry(FIELD.goalDepth, FIELD.goalHalfZ * 2), netMat);
    top.rotation.x = -Math.PI / 2;
    top.position.set(gx, FIELD.goalHeight, 0);
    scene.add(top);

    // goal glow light + haze plane
    const glow = new THREE.PointLight(col, 42, 42, 1.7);
    glow.position.set(wallX - side * 2.5, 5.5, 0);
    scene.add(glow);
    const hazeTex = makeGlowTexture(side < 0 ? 'rgba(80,220,255,0.9)' : 'rgba(255,150,70,0.9)', 'rgba(0,0,0,0)');
    const haze = makeSprite(hazeTex, col, 15, 0.25);
    haze.position.set(wallX + side * 1.5, 4.2, 0);
    scene.add(haze);
    goalGlows.push({ light: glow, haze });

    // scoreboard above goal
    const canvas = makeScoreboardCanvas();
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    const board = new THREE.Mesh(
      new THREE.PlaneGeometry(19, 6),
      new THREE.MeshBasicMaterial({ map: tex, toneMapped: false })
    );
    board.position.set(wallX + side * 3.5, 17.4, 0);
    board.rotation.y = side < 0 ? Math.PI / 2 : -Math.PI / 2;
    scene.add(board);
    box(scene, 20, 0.35, 0.4, wallX + side * 4.4, 14.25, 0, neon(col, 0.55));
    box(scene, 0.4, 0.35, 6.5, wallX + side * 4.4, 17.4, 0, steelMat);
    scoreboards.push({ canvas, tex });
  }

  // ---- Floodlight towers ----
  const panelMat = new THREE.MeshBasicMaterial({ color: 0xfff6dc, toneMapped: false });
  const glowTex = makeGlowTexture('rgba(255,250,225,0.95)', 'rgba(255,220,150,0.1)');
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      const g = new THREE.Group();
      g.position.set(sx * 78, 0, sz * 57);
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.9, 34, 8), steelMat);
      pole.position.y = 17;
      g.add(pole);
      const arm = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 7), steelMat);
      arm.position.set(0, 31.5, -sz * 2);
      g.add(arm);
      const panel = new THREE.Mesh(new THREE.BoxGeometry(7.5, 4.2, 0.6), panelMat);
      panel.position.set(0, 32.5, -sz * 4.2);
      panel.rotation.x = sz * -0.18;
      g.add(panel);
      const frame = new THREE.Mesh(new THREE.BoxGeometry(8.2, 5.0, 0.3), steelMat);
      frame.position.set(0, 32.5, -sz * 4.45);
      frame.rotation.x = sz * -0.18;
      g.add(frame);
      const spr = makeSprite(glowTex, 0xfff2cf, 23, 0.8);
      spr.position.set(0, 32.5, -sz * 4.9);
      g.add(spr);
      scene.add(g);
    }
  }

  // ---- Ambient dust ----
  const dustGeo = new THREE.BufferGeometry();
  const dustPos = [];
  for (let i = 0; i < 280; i++) {
    dustPos.push((Math.random() - 0.5) * 130, Math.random() * 24 + 1, (Math.random() - 0.5) * 90);
  }
  dustGeo.setAttribute('position', new THREE.Float32BufferAttribute(dustPos, 3));
  const dust = new THREE.Points(
    dustGeo,
    new THREE.PointsMaterial({ color: 0x8fefff, size: 0.18, transparent: true, opacity: 0.4, depthWrite: false })
  );
  scene.add(dust);

  // ---- Boost pads ----
  const padGroup = new THREE.Group();
  scene.add(padGroup);
  const boltTex = makeBoltTexture();
  const pads = [];
  const padDefs = [
    { x: -40, z: -28, big: true },
    { x: 40, z: -28, big: true },
    { x: -40, z: 28, big: true },
    { x: 40, z: 28, big: true },
    { x: 0, z: -34, big: false },
    { x: 0, z: 34, big: false },
    { x: -16, z: 0, big: false },
    { x: 16, z: 0, big: false },
  ];
  for (const def of padDefs) {
    const group = new THREE.Group();
    group.position.set(def.x, 0.06, def.z);
    const radius = def.big ? 2.4 : 1.65;
    const color = def.big ? 0xffb545 : 0x5ce8ff;
    const base = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 0.12, 6), darkMat);
    group.add(base);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(radius * 0.78, 0.13, 6, 36), neon(color, 0.92));
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.14;
    group.add(ring);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(radius * 0.88, 0.04, 4, 36), neon(color, 0.5));
    ring2.rotation.x = -Math.PI / 2;
    ring2.position.y = 0.15;
    group.add(ring2);
    const bolt = new THREE.Mesh(
      new THREE.PlaneGeometry(radius * 1.15, radius * 1.15),
      new THREE.MeshBasicMaterial({
        map: boltTex,
        color,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      })
    );
    bolt.rotation.x = -Math.PI / 2;
    bolt.position.y = 0.2;
    group.add(bolt);
    const glow = makeSprite(makeGlowTexture(def.big ? 'rgba(255,190,90,0.9)' : 'rgba(90,235,255,0.9)', 'rgba(0,0,0,0)'), color, radius * 3.2, 0.45);
    glow.position.y = 0.5;
    group.add(glow);
    padGroup.add(group);
    pads.push({
      ...def,
      group,
      ring,
      ring2,
      bolt,
      glow,
      color,
      radius,
      amount: def.big ? 100 : 12,
      respawn: def.big ? 16 : 8,
      active: true,
      timer: 0,
      phase: Math.random() * Math.PI * 2,
    });
  }

  function drawScoreboard(board, blue, orange) {
    const ctx = board.canvas.getContext('2d');
    const W = board.canvas.width;
    const H = board.canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#030a10';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(36,215,255,0.16)';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(240, 0);
    ctx.lineTo(180, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgba(255,122,24,0.18)';
    ctx.beginPath();
    ctx.moveTo(W, 0);
    ctx.lineTo(W - 240, 0);
    ctx.lineTo(W - 180, H);
    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(150,245,255,0.6)';
    ctx.lineWidth = 5;
    ctx.strokeRect(3, 3, W - 6, H - 6);
    ctx.textBaseline = 'middle';
    ctx.font = '900 88px Orbitron, Arial Black, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#2fd9ff';
    ctx.shadowColor = '#2fd9ff';
    ctx.shadowBlur = 20;
    ctx.fillText(String(blue), 116, 105);
    ctx.fillStyle = '#ff8a32';
    ctx.shadowColor = '#ff8a32';
    ctx.fillText(String(orange), W - 116, 105);
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(210,248,255,0.55)';
    ctx.font = '700 29px Rajdhani, Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('BLUE', 36, 42);
    ctx.textAlign = 'right';
    ctx.fillText('ORANGE', W - 36, 42);
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(220,250,255,0.7)';
    ctx.font = '700 24px Rajdhani, Arial, sans-serif';
    ctx.fillText('NEON ARENA  //  1V1', W / 2, 40);
    ctx.fillStyle = 'rgba(220,250,255,0.16)';
    ctx.fillRect(W / 2 - 1.5, 18, 3, H - 36);
    board.tex.needsUpdate = true;
  }

  const scoreboards = [];
  const goalGlows = [];
  function setScore(blue, orange) {
    for (const b of scoreboards) drawScoreboard(b, blue, orange);
  }
  setScore(0, 0);
  document.fonts?.ready.then(() => setScore(0, 0));

  function update(dt, elapsed) {
    for (const pad of pads) {
      pad.phase += dt;
      if (!pad.active) {
        pad.timer -= dt;
        if (pad.timer <= 0) {
          pad.active = true;
          pad.group.visible = true;
          pad.group.scale.setScalar(0.2);
        }
        continue;
      }
      const pulse = 1 + Math.sin(pad.phase * 3.2) * 0.045;
      pad.ring.scale.setScalar(pulse);
      pad.ring.rotation.z += dt * (pad.big ? 0.6 : 0.9);
      pad.ring2.rotation.z -= dt * 0.7;
      pad.bolt.material.opacity = 0.65 + Math.sin(pad.phase * 4.5) * 0.25;
      pad.glow.material.opacity = 0.28 + Math.sin(pad.phase * 2.8) * 0.1;
      if (pad.group.scale.x < 1) pad.group.scale.setScalar(Math.min(1, pad.group.scale.x + dt * 4));
    }
    for (let i = 0; i < goalGlows.length; i++) {
      const g = goalGlows[i];
      g.haze.material.opacity = 0.2 + Math.sin(elapsed * 1.7 + i * 2) * 0.06;
      g.light.intensity = 38 + Math.sin(elapsed * 2.3 + i) * 6;
    }
    dust.rotation.y = elapsed * 0.006;
  }

  return { pads, setScore, update, goalGlows, scoreboards };
}

function makeBoltTexture() {
  const S = 128;
  const c = document.createElement('canvas');
  c.width = c.height = S;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, S, S);
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#bff8ff';
  ctx.shadowBlur = 16;
  ctx.beginPath();
  ctx.moveTo(76, 12);
  ctx.lineTo(40, 70);
  ctx.lineTo(62, 70);
  ctx.lineTo(48, 116);
  ctx.lineTo(92, 52);
  ctx.lineTo(66, 52);
  ctx.lineTo(84, 12);
  ctx.closePath();
  ctx.fill();
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
