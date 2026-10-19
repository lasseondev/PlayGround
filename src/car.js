import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { forwardOf } from './physics.js'

const TEAM_COLORS = {
  blue: { paint: 0x147bd1, accent: 0x5fdcff, light: 0x8defff, trail: 0x44c8ff },
  orange: { paint: 0xd45b08, accent: 0xffb15a, light: 0xffd9a8, trail: 0xff8a1f }
}

function makeWheel(x, z, colors, front, index) {
  const pivot = new THREE.Group()
  pivot.position.set(x, -0.47, z)
  const spin = new THREE.Group()
  pivot.add(spin)

  const tireMat = new THREE.MeshStandardMaterial({ color: 0x07090d, metalness: 0.18, roughness: 0.86 })
  const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.63, 0.63, 0.46, 20), tireMat)
  tire.rotation.z = Math.PI / 2
  tire.castShadow = true
  spin.add(tire)

  const rimMat = new THREE.MeshStandardMaterial({
    color: colors.paint,
    emissive: colors.paint,
    emissiveIntensity: 0.75,
    metalness: 0.85,
    roughness: 0.24
  })
  const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.49, 12), rimMat)
  rim.rotation.z = Math.PI / 2
  spin.add(rim)

  const hubMat = new THREE.MeshBasicMaterial({ color: 0xdff8ff })
  for (const side of [-1, 1]) {
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.51, 8), hubMat)
    hub.rotation.z = Math.PI / 2
    spin.add(hub)
    const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.78, 0.07), rimMat)
    spoke.position.x = side * 0.22
    spin.add(spoke)
  }

  const label = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.12, 0.7),
    new THREE.MeshBasicMaterial({ color: colors.accent })
  )
  label.position.set(0, 0.66, -0.05)
  pivot.add(label)

  pivot.userData.spin = spin
  pivot.userData.front = front
  pivot.userData.index = index
  return pivot
}

export function createCarVisual(scene, team, isPlayer = false) {
  const colors = TEAM_COLORS[team]
  const group = new THREE.Group()
  const tilt = new THREE.Group()
  group.add(tilt)
  scene.add(group)

  const paintMat = new THREE.MeshPhysicalMaterial({
    color: colors.paint,
    metalness: 0.52,
    roughness: 0.24,
    clearcoat: 1,
    clearcoatRoughness: 0.16,
    envMapIntensity: 1.25
  })
  const paintDark = new THREE.MeshStandardMaterial({
    color: colors.paint,
    metalness: 0.7,
    roughness: 0.34,
    emissive: colors.paint,
    emissiveIntensity: 0.2
  })
  const carbonMat = new THREE.MeshStandardMaterial({ color: 0x0c1118, metalness: 0.75, roughness: 0.42 })
  const accentMat = new THREE.MeshStandardMaterial({
    color: colors.accent,
    emissive: colors.accent,
    emissiveIntensity: 2.4,
    metalness: 0.35,
    roughness: 0.28
  })
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x071521,
    metalness: 0.9,
    roughness: 0.06,
    clearcoat: 1,
    transparent: true,
    opacity: 0.92
  })
  const headMat = new THREE.MeshBasicMaterial({ color: 0xe9fbff, toneMapped: false })
  const tailMat = new THREE.MeshBasicMaterial({ color: 0xff3524, toneMapped: false })

  const body = new THREE.Mesh(new RoundedBoxGeometry(2.34, 0.94, 4.32, 4, 0.28), paintMat)
  body.position.y = 0.11
  body.castShadow = true
  body.receiveShadow = true
  tilt.add(body)

  const nose = new THREE.Mesh(new RoundedBoxGeometry(2.05, 0.34, 1.55, 3, 0.16), paintMat)
  nose.position.set(0, 0.42, 1.28)
  nose.castShadow = true
  tilt.add(nose)

  const cabin = new THREE.Mesh(new RoundedBoxGeometry(1.85, 0.66, 1.92, 4, 0.24), glassMat)
  cabin.position.set(0, 0.65, -0.24)
  cabin.castShadow = true
  tilt.add(cabin)

  const roof = new THREE.Mesh(new RoundedBoxGeometry(1.62, 0.12, 1.45, 3, 0.06), paintDark)
  roof.position.set(0, 0.99, -0.28)
  tilt.add(roof)

  const deck = new THREE.Mesh(new RoundedBoxGeometry(1.88, 0.3, 1.28, 3, 0.1), paintMat)
  deck.position.set(0, 0.52, -1.3)
  deck.castShadow = true
  tilt.add(deck)

  const deckVent = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.045, 0.62), carbonMat)
  deckVent.position.set(0, 0.68, -1.42)
  tilt.add(deckVent)

  const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.035, 3.4), accentMat)
  stripe.position.set(0, 0.596, 0.22)
  tilt.add(stripe)

  for (const side of [-1, 1]) {
    const skirt = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.22, 3.55), carbonMat)
    skirt.position.set(side * 1.14, -0.29, 0.02)
    tilt.add(skirt)
    const sideGlow = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.055, 2.7), accentMat)
    sideGlow.position.set(side * 1.21, -0.22, 0.05)
    tilt.add(sideGlow)
  }

  const splitter = new THREE.Mesh(new THREE.BoxGeometry(2.46, 0.1, 0.42), carbonMat)
  splitter.position.set(0, -0.34, 2.08)
  tilt.add(splitter)

  const rearBumper = new THREE.Mesh(new THREE.BoxGeometry(2.38, 0.24, 0.36), carbonMat)
  rearBumper.position.set(0, -0.2, -2.06)
  tilt.add(rearBumper)

  const wing = new THREE.Mesh(new THREE.BoxGeometry(2.62, 0.1, 0.52), carbonMat)
  wing.position.set(0, 0.87, -2.02)
  wing.castShadow = true
  tilt.add(wing)
  const wingGlow = new THREE.Mesh(new THREE.BoxGeometry(2.44, 0.03, 0.08), accentMat)
  wingGlow.position.set(0, 0.935, -2.06)
  tilt.add(wingGlow)
  for (const side of [-1, 1]) {
    const support = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.5, 0.16), carbonMat)
    support.position.set(side * 0.84, 0.62, -1.95)
    tilt.add(support)
  }

  for (const side of [-1, 1]) {
    const endplate = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.28, 0.56), carbonMat)
    endplate.position.set(side * 1.28, 0.87, -2.02)
    tilt.add(endplate)
  }

  for (const side of [-1, 1]) {
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.15, 0.09), headMat)
    head.position.set(side * 0.63, 0.25, 2.15)
    tilt.add(head)
    const tail = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.11, 0.07), tailMat)
    tail.position.set(side * 0.68, 0.18, -2.2)
    tilt.add(tail)

    const exhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.16, 0.38, 10), carbonMat)
    exhaust.rotation.x = Math.PI / 2
    exhaust.position.set(side * 0.5, -0.02, -2.16)
    tilt.add(exhaust)
  }

  const beatPlate = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.08, 0.04), accentMat)
  beatPlate.position.set(0, 0.24, -2.22)
  tilt.add(beatPlate)

  const wheels = [
    makeWheel(-1.26, 1.62, colors, true, 0),
    makeWheel(1.26, 1.62, colors, true, 1),
    makeWheel(-1.26, -1.62, colors, false, 2),
    makeWheel(1.26, -1.62, colors, false, 3)
  ]
  for (const wheel of wheels) tilt.add(wheel)

  const underglow = new THREE.Mesh(
    new THREE.PlaneGeometry(3.1, 5.2),
    new THREE.MeshBasicMaterial({
      color: colors.trail,
      transparent: true,
      opacity: isPlayer ? 0.2 : 0.14,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
  )
  underglow.rotation.x = -Math.PI / 2
  underglow.position.y = -1.0
  group.add(underglow)

  const flameMat = new THREE.MeshBasicMaterial({
    color: colors.trail,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    toneMapped: false
  })
  const flameGeo = new THREE.ConeGeometry(0.19, 1.6, 9, 1, true)
  const flames = []
  for (const side of [-1, 1]) {
    const flame = new THREE.Mesh(flameGeo, flameMat.clone())
    flame.rotation.x = -Math.PI / 2
    flame.position.set(side * 0.5, -0.02, -2.45)
    flame.visible = false
    tilt.add(flame)
    flames.push(flame)

    const glow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: createGlowSprite(),
      color: colors.trail,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    }))
    glow.scale.set(1.5, 1.5, 1)
    glow.position.set(side * 0.5, -0.02, -2.55)
    glow.visible = false
    tilt.add(glow)
    flames.push(glow)
  }

  const indicator = null

  let spinAngle = 0
  return {
    group,
    tilt,
    wheels,
    flames,
    underglow,
    indicator,
    spinAngle: 0,
    colors,
    update(car, input, dt) {
      group.position.set(car.x, car.y, car.z)
      group.rotation.y = car.yaw

      const forward = forwardOf(car.yaw)
      const vf = car.vx * forward.x + car.vz * forward.z
      spinAngle += (vf / 0.63) * dt
      for (const wheel of wheels) {
        wheel.userData.spin.rotation.x = spinAngle
        if (wheel.userData.front) {
          const target = -(input?.steer || 0) * 0.42
          wheel.rotation.y += (target - wheel.rotation.y) * Math.min(1, dt * 12)
        }
      }

      let pitch = 0
      let roll = 0
      if (!car.onGround) {
        pitch = Math.max(-0.32, Math.min(0.32, -car.vy * 0.012))
        roll = -(input?.steer || 0) * 0.09
      } else {
        pitch = (input?.throttle || 0) * -0.012
      }
      if (car.flip > 0) {
        const t = 1 - car.flip / 0.62
        pitch += Math.sin(t * Math.PI) * (car.flipDir ? 0.5 : 0.9)
        roll += Math.sin(t * Math.PI) * (car.flipDir || 0) * 0.6
      }
      tilt.rotation.x += (pitch - tilt.rotation.x) * Math.min(1, dt * 10)
      tilt.rotation.z += (roll - tilt.rotation.z) * Math.min(1, dt * 10)

      underglow.material.opacity = car.onGround ? (isPlayer ? 0.2 : 0.14) : 0.04
      underglow.scale.setScalar(1 + Math.sin(performance.now() * 0.006) * 0.035)

      for (let i = 0; i < flames.length; i++) {
        const flame = flames[i]
        flame.visible = car.boosting
        if (car.boosting) {
          const flicker = 0.72 + Math.random() * 0.55
          if (i < 2) {
            flame.scale.set(0.9 + Math.random() * 0.28, flicker * 1.1, 0.9 + Math.random() * 0.28)
            flame.position.z = -2.35 - flicker * 0.28
            flame.material.opacity = 0.55 + Math.random() * 0.35
          } else {
            flame.scale.setScalar(1.3 + flicker * 0.65)
            flame.material.opacity = 0.35 + Math.random() * 0.3
          }
        }
      }

    }
  }
}

let cachedGlow = null
function createGlowSprite() {
  if (cachedGlow) return cachedGlow
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.32, 'rgba(200,245,255,0.7)')
  grad.addColorStop(1, 'rgba(120,220,255,0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)
  cachedGlow = new THREE.CanvasTexture(canvas)
  cachedGlow.colorSpace = THREE.SRGBColorSpace
  return cachedGlow
}
