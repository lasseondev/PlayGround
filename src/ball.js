import * as THREE from 'three'
import { makeBallTexture, makeGlowTexture } from './textures.js'

export class ParticleField {
  constructor(scene, texture, max = 260) {
    this.items = []
    for (let i = 0; i < max; i++) {
      const material = new THREE.SpriteMaterial({
        map: texture,
        color: 0xffffff,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false
      })
      const sprite = new THREE.Sprite(material)
      sprite.visible = false
      sprite.scale.setScalar(1)
      scene.add(sprite)
      this.items.push({
        sprite,
        vx: 0,
        vy: 0,
        vz: 0,
        life: 0,
        maxLife: 1,
        size: 1,
        gravity: 0,
        drag: 0,
        active: false
      })
    }
    this.cursor = 0
  }

  emit(x, y, z, color, {
    count = 6,
    speed = 4,
    size = 1,
    life = 0.5,
    gravity = 0,
    drag = 2,
    spread = 1,
    direction = null
  } = {}) {
    for (let n = 0; n < count; n++) {
      const item = this.items[this.cursor]
      this.cursor = (this.cursor + 1) % this.items.length
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      let vx = Math.sin(phi) * Math.cos(theta) * spread
      let vy = Math.cos(phi) * spread
      let vz = Math.sin(phi) * Math.sin(theta) * spread
      if (direction) {
        vx = direction.x + vx * 0.4
        vy = direction.y + vy * 0.4
        vz = direction.z + vz * 0.4
      }
      const s = speed * (0.55 + Math.random() * 0.9)
      item.vx = vx * s
      item.vy = vy * s
      item.vz = vz * s
      item.life = life * (0.65 + Math.random() * 0.7)
      item.maxLife = item.life
      item.size = size * (0.6 + Math.random() * 0.8)
      item.gravity = gravity
      item.drag = drag
      item.active = true
      item.sprite.visible = true
      item.sprite.position.set(x, y, z)
      item.sprite.material.color.set(color)
      item.sprite.material.opacity = 1
      item.sprite.scale.setScalar(item.size)
    }
  }

  update(dt) {
    for (const item of this.items) {
      if (!item.active) continue
      item.life -= dt
      if (item.life <= 0) {
        item.active = false
        item.sprite.visible = false
        continue
      }
      item.vy -= item.gravity * dt
      const drag = Math.exp(-item.drag * dt)
      item.vx *= drag
      item.vy *= drag
      item.vz *= drag
      const pos = item.sprite.position
      pos.x += item.vx * dt
      pos.y += item.vy * dt
      pos.z += item.vz * dt
      if (pos.y < 0.12) {
        pos.y = 0.12
        item.vy *= -0.25
      }
      const t = item.life / item.maxLife
      item.sprite.material.opacity = Math.min(1, t * 1.8) * 0.9
      item.sprite.scale.setScalar(item.size * (0.65 + (1 - t) * 0.7))
    }
  }

  clear() {
    for (const item of this.items) {
      item.active = false
      item.life = 0
      item.sprite.visible = false
    }
  }
}

export function createBallVisual(scene, particles) {
  const group = new THREE.Group()
  scene.add(group)

  const texture = makeBallTexture()
  const ballMat = new THREE.MeshStandardMaterial({
    map: texture,
    emissiveMap: texture,
    emissive: 0x9feaff,
    emissiveIntensity: 0.4,
    metalness: 0.42,
    roughness: 0.2,
    envMapIntensity: 1.1
  })
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(2.2, 40, 28), ballMat)
  mesh.castShadow = true
  mesh.receiveShadow = true
  group.add(mesh)

  const wire = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2.28, 2),
    new THREE.MeshBasicMaterial({
      color: 0x5de4ff,
      wireframe: true,
      transparent: true,
      opacity: 0.09,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
  )
  group.add(wire)

  const glowTexture = makeGlowTexture()
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTexture,
    color: 0x57d6ff,
    transparent: true,
    opacity: 0.16,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  }))
  glow.scale.set(6.6, 6.6, 1)
  group.add(glow)

  const halo = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTexture,
    color: 0xffa24d,
    transparent: true,
    opacity: 0.05,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  }))
  halo.scale.set(9.5, 9.5, 1)
  group.add(halo)

  const light = new THREE.PointLight(0x5fd8ff, 9, 10, 2)
  group.add(light)

  let trailTimer = 0
  let spinX = 0
  let spinZ = 0

  return {
    group,
    mesh,
    glow,
    halo,
    light,
    update(ball, dt) {
      group.position.set(ball.x, ball.y, ball.z)
      const speed = Math.hypot(ball.vx, ball.vy, ball.vz)
      spinX += (ball.vz / 2.2) * dt * 0.65
      spinZ -= (ball.vx / 2.2) * dt * 0.65
      mesh.rotation.x = spinX
      mesh.rotation.z = spinZ
      wire.rotation.y += dt * 0.3
      wire.rotation.x = spinX * 0.5

      const pulse = 1 + Math.sin(performance.now() * 0.004) * 0.04
      glow.scale.setScalar((6.4 + speed * 0.045) * pulse)
      halo.scale.setScalar((9.2 + speed * 0.08) * pulse)
      halo.material.opacity = 0.05 + Math.min(0.17, speed * 0.005)
      light.intensity = 8 + Math.min(18, speed * 0.45)

      trailTimer += dt
      const interval = speed > 25 ? 0.012 : 0.03
      if (speed > 11 && trailTimer > interval) {
        trailTimer = 0
        const color = speed > 30 ? 0xbff4ff : 0x47c6ff
        particles.emit(ball.x, ball.y - 0.2, ball.z, color, {
          count: speed > 30 ? 2 : 1,
          speed: 1.4,
          size: Math.min(3.6, 1.1 + speed * 0.055),
          life: 0.55,
          gravity: -1.2,
          drag: 2.4,
          spread: 0.7
        })
      }
    }
  }
}
