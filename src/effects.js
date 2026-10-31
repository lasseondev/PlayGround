import * as THREE from 'three';
import { makeSparkTexture, makeGlowTexture, rand } from './assets.js';

export class Effects {
  constructor(scene) {
    this.scene = scene;
    this.items = [];
    this.sparkTex = makeSparkTexture(64);
    this.glowTex = makeGlowTexture(128, 'rgba(255,245,215,1)', 'rgba(255,180,90,0)');
    this.tmp = new THREE.Vector3();
  }

  burst(position, { color = 0xffc46b, count = 24, speed = 5, size = 0.09, gravity = 8, life = 0.7, spread = 1, upward = 0.5, additive = true } = {}) {
    const positions = new Float32Array(count * 3);
    const velocities = [];
    for (let i = 0; i < count; i++) {
      positions[i * 3] = position.x;
      positions[i * 3 + 1] = position.y;
      positions[i * 3 + 2] = position.z;
      const dir = new THREE.Vector3(rand(-1, 1) * spread, rand(-0.2, 1) * spread + upward, rand(-1, 1) * spread).normalize();
      velocities.push(dir.multiplyScalar(rand(speed * 0.25, speed)));
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      map: this.sparkTex,
      color,
      size,
      transparent: true,
      opacity: 1,
      depthWrite: false,
      blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(geo, mat);
    points.frustumCulled = false;
    this.scene.add(points);
    this.items.push({ type: 'particles', obj: points, velocities, life, maxLife: life, gravity, drag: 0.96 });
  }

  dust(position, { count = 18, radius = 1.5, color = 0x9b9488 } = {}) {
    const positions = new Float32Array(count * 3);
    const velocities = [];
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = rand(0.1, radius);
      positions[i * 3] = position.x + Math.cos(a) * r;
      positions[i * 3 + 1] = position.y + rand(0, 0.3);
      positions[i * 3 + 2] = position.z + Math.sin(a) * r;
      velocities.push(new THREE.Vector3(Math.cos(a) * rand(0.4, 2), rand(0.2, 1.4), Math.sin(a) * rand(0.4, 2)));
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({ map: this.sparkTex, color, size: 0.16, transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.AdditiveBlending });
    const points = new THREE.Points(geo, mat);
    points.frustumCulled = false;
    this.scene.add(points);
    this.items.push({ type: 'particles', obj: points, velocities, life: 0.8, maxLife: 0.8, gravity: -0.4, drag: 0.94 });
  }

  slash(position, yaw, { radius = 2.2, arc = Math.PI * 0.95, color = 0xd8d2c0, life = 0.2, y = 1.2, tilt = 0.15, scale = 1 } = {}) {
    const geo = new THREE.RingGeometry(radius * 0.55, radius, 40, 1, -arc / 2, arc);
    const mat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(position.x, position.y + y, position.z);
    mesh.rotation.set(-Math.PI / 2 + tilt, yaw + Math.PI / 2, 0);
    mesh.scale.setScalar(scale * 0.75);
    this.scene.add(mesh);
    this.items.push({ type: 'slash', obj: mesh, life, maxLife: life, startScale: scale * 0.75, endScale: scale * 1.35 });
  }

  ring(position, { color = 0xc9a86a, radius = 4, life = 0.55, y = 0.08, width = 0.12, opacity = 0.8 } = {}) {
    const geo = new THREE.RingGeometry(0.94, 1, 64);
    const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(position.x, position.y + y, position.z);
    mesh.rotation.x = -Math.PI / 2;
    mesh.scale.setScalar(0.4);
    this.scene.add(mesh);
    this.items.push({ type: 'ring', obj: mesh, life, maxLife: life, radius });
  }

  flash(position, { color = 0xfff2cc, size = 1.2, life = 0.24, y = 0 } = {}) {
    const mat = new THREE.SpriteMaterial({ map: this.glowTex, color, transparent: true, opacity: 1, depthWrite: false, blending: THREE.AdditiveBlending });
    const sprite = new THREE.Sprite(mat);
    sprite.position.set(position.x, position.y + y, position.z);
    sprite.scale.setScalar(size);
    this.scene.add(sprite);
    this.items.push({ type: 'flash', obj: sprite, life, maxLife: life, size });
  }

  beam(from, to, { color = 0xffd27a, life = 0.28, width = 0.12 } = {}) {
    const dir = new THREE.Vector3().subVectors(to, from);
    const len = dir.length();
    const geo = new THREE.CylinderGeometry(width, width * 0.25, len, 6, 1, true);
    const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(from).addScaledVector(dir, 0.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    this.scene.add(mesh);
    this.items.push({ type: 'beam', obj: mesh, life, maxLife: life });
  }

  update(dt) {
    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i];
      item.life -= dt;
      const t = Math.max(0, item.life / item.maxLife);
      if (item.type === 'particles') {
        const pos = item.obj.geometry.attributes.position;
        const arr = pos.array;
        for (let p = 0; p < item.velocities.length; p++) {
          const v = item.velocities[p];
          v.y -= item.gravity * dt;
          v.multiplyScalar(Math.pow(item.drag, dt * 60));
          arr[p * 3] += v.x * dt;
          arr[p * 3 + 1] += v.y * dt;
          arr[p * 3 + 2] += v.z * dt;
        }
        pos.needsUpdate = true;
        item.obj.material.opacity = Math.min(1, t * 2.2);
      } else if (item.type === 'slash') {
        const p = 1 - t;
        item.obj.material.opacity = Math.sin(p * Math.PI) * 0.9;
        item.obj.scale.setScalar(item.startScale + (item.endScale - item.startScale) * p);
        item.obj.rotation.z = p * 0.5;
      } else if (item.type === 'ring') {
        const p = 1 - t;
        item.obj.scale.setScalar(0.4 + item.radius * p);
        item.obj.material.opacity = (1 - p) * 0.75;
      } else if (item.type === 'flash') {
        const p = 1 - t;
        item.obj.material.opacity = t;
        item.obj.scale.setScalar(item.size * (0.4 + p * 1.1));
      } else if (item.type === 'beam') {
        item.obj.material.opacity = t;
      }
      if (item.life <= 0) {
        this.scene.remove(item.obj);
        item.obj.geometry?.dispose();
        item.obj.material?.dispose();
        this.items.splice(i, 1);
      }
    }
  }
}
