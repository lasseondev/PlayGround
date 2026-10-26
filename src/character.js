import * as THREE from 'three'

const box = (w, h, d, mat, x = 0, y = 0, z = 0) => {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)
  mesh.position.set(x, y, z)
  mesh.castShadow = true
  mesh.receiveShadow = true
  return mesh
}

function makeWeapon(palette) {
  const group = new THREE.Group()
  const metal = new THREE.MeshStandardMaterial({ color: 0x3c4652, roughness: 0.5, metalness: 0.55 })
  const dark = new THREE.MeshStandardMaterial({ color: 0x1d232b, roughness: 0.65, metalness: 0.3 })
  const accent = new THREE.MeshStandardMaterial({ color: palette.accent, roughness: 0.5, metalness: 0.3, emissive: palette.accent, emissiveIntensity: 0.12 })
  const body = box(0.12, 0.15, 0.72, metal, 0, 0, -0.16)
  group.add(body)
  const barrel = box(0.06, 0.06, 0.4, dark, 0, 0.02, -0.63)
  group.add(barrel)
  const stock = box(0.11, 0.13, 0.26, accent, 0, -0.02, 0.32)
  group.add(stock)
  const grip = box(0.07, 0.18, 0.1, dark, 0, -0.14, 0.03)
  group.add(grip)
  const mag = box(0.08, 0.24, 0.1, dark, 0, -0.17, -0.15)
  mag.rotation.x = -0.2
  group.add(mag)
  const sight = box(0.04, 0.07, 0.12, accent, 0, 0.12, -0.26)
  group.add(sight)
  const muzzle = new THREE.Object3D()
  muzzle.position.set(0, 0.02, -0.86)
  group.add(muzzle)
  group.userData.muzzle = muzzle
  return group
}

function makePickaxe(palette) {
  const group = new THREE.Group()
  const handleMat = new THREE.MeshStandardMaterial({ color: 0x8f6a43, roughness: 0.85 })
  const headMat = new THREE.MeshStandardMaterial({ color: 0xc7d6e2, roughness: 0.35, metalness: 0.7 })
  const handle = box(0.06, 0.06, 1.0, handleMat, 0, 0, 0)
  group.add(handle)
  const head = box(0.55, 0.08, 0.1, headMat, 0, 0.47, 0)
  group.add(head)
  const spike = box(0.1, 0.08, 0.16, headMat, -0.3, 0.47, 0)
  spike.rotation.z = 0.25
  group.add(spike)
  group.rotation.x = -0.4
  return group
}

export function createCharacter(palette, { isPlayer = false } = {}) {
  const group = new THREE.Group()
  const root = new THREE.Group()
  group.add(root)
  const mats = {
    jacket: new THREE.MeshStandardMaterial({ color: palette.jacket, roughness: 0.82 }),
    jacketDark: new THREE.MeshStandardMaterial({ color: palette.jacketDark ?? palette.jacket, roughness: 0.86 }),
    pants: new THREE.MeshStandardMaterial({ color: palette.pants, roughness: 0.9 }),
    skin: new THREE.MeshStandardMaterial({ color: palette.skin, roughness: 0.86 }),
    accent: new THREE.MeshStandardMaterial({ color: palette.accent, roughness: 0.55, metalness: 0.2, emissive: palette.accent, emissiveIntensity: 0.08 }),
    hat: new THREE.MeshStandardMaterial({ color: palette.hat ?? palette.accent, roughness: 0.78 }),
    visor: new THREE.MeshStandardMaterial({ color: palette.visor ?? 0x101820, roughness: 0.2, metalness: 0.7 }),
    pack: new THREE.MeshStandardMaterial({ color: palette.pack ?? 0x3a4858, roughness: 0.8 }),
    boot: new THREE.MeshStandardMaterial({ color: 0x252b33, roughness: 0.9 })
  }
  const hips = box(0.5, 0.22, 0.34, mats.pants, 0, 0.9, 0)
  root.add(hips)
  const torso = box(0.62, 0.62, 0.38, mats.jacket, 0, 1.28, 0)
  root.add(torso)
  const vest = box(0.44, 0.46, 0.42, mats.jacketDark, 0, 1.27, 0.01)
  root.add(vest)
  const chest = box(0.3, 0.3, 0.03, mats.accent, 0, 1.3, -0.21)
  root.add(chest)
  const collar = box(0.5, 0.12, 0.4, mats.accent, 0, 1.61, 0)
  root.add(collar)
  const headGroup = new THREE.Group()
  headGroup.position.set(0, 1.72, 0)
  const head = box(0.42, 0.42, 0.42, mats.skin, 0, 0.04, 0)
  headGroup.add(head)
  const hat = box(0.47, 0.14, 0.47, mats.hat, 0, 0.3, 0.01)
  headGroup.add(hat)
  const brim = box(0.47, 0.05, 0.23, mats.hat, 0, 0.23, -0.25)
  headGroup.add(brim)
  const visor = box(0.32, 0.14, 0.06, mats.visor, 0, 0.08, -0.215)
  headGroup.add(visor)
  root.add(headGroup)
  const pack = box(0.42, 0.5, 0.22, mats.pack, 0, 1.3, 0.3)
  root.add(pack)
  const packPocket = box(0.28, 0.2, 0.08, mats.accent, 0, 1.24, 0.44)
  root.add(packPocket)

  const makeLeg = side => {
    const pivot = new THREE.Group()
    pivot.position.set(0.15 * side, 0.88, 0)
    const upper = box(0.21, 0.4, 0.25, mats.pants, 0, -0.2, 0)
    pivot.add(upper)
    const lower = box(0.18, 0.34, 0.22, mats.pants, 0, -0.55, 0.01)
    pivot.add(lower)
    const boot = box(0.22, 0.17, 0.32, mats.boot, 0, -0.76, -0.04)
    pivot.add(boot)
    root.add(pivot)
    return pivot
  }
  const leftLeg = makeLeg(1)
  const rightLeg = makeLeg(-1)

  const makeArm = side => {
    const pivot = new THREE.Group()
    pivot.position.set(0.39 * side, 1.5, 0)
    const shoulder = box(0.18, 0.22, 0.22, mats.jacket, 0, -0.06, 0)
    pivot.add(shoulder)
    const arm = box(0.15, 0.42, 0.18, mats.jacketDark, 0, -0.33, 0)
    pivot.add(arm)
    const hand = box(0.16, 0.16, 0.18, mats.skin, 0, -0.56, 0)
    pivot.add(hand)
    root.add(pivot)
    return pivot
  }
  const leftArm = makeArm(1)
  const rightArm = makeArm(-1)

  const weapon = makeWeapon(palette)
  weapon.position.set(0.46, 1.47, -0.56)
  weapon.rotation.y = -0.18
  root.add(weapon)
  const pickaxe = makePickaxe(palette)
  pickaxe.position.set(-0.05, 1.28, 0.45)
  pickaxe.visible = false
  root.add(pickaxe)

  if (isPlayer) {
    const glow = new THREE.Mesh(
      new THREE.RingGeometry(0.48, 0.58, 24),
      new THREE.MeshBasicMaterial({ color: 0x5be7ff, transparent: true, opacity: 0.28, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending })
    )
    glow.rotation.x = -Math.PI / 2
    glow.position.y = 0.02
    group.add(glow)
    group.userData.glow = glow
  }

  return {
    group, root, torso, headGroup, leftLeg, rightLeg, leftArm, rightArm,
    weapon, pickaxe, muzzle: weapon.userData.muzzle, mats, isPlayer,
    walkPhase: Math.random() * 8, time: 0, attackTimer: 0, hurtTimer: 0, dead: false
  }
}

export function animateCharacter(rig, dt, { speed = 0, aiming = false, airborne = false, buildMode = false, dead = false } = {}) {
  rig.time += dt
  rig.attackTimer = Math.max(0, rig.attackTimer - dt)
  rig.hurtTimer = Math.max(0, rig.hurtTimer - dt)
  const amount = Math.min(1, speed / 6.5)
  rig.walkPhase += dt * (3.5 + speed * 1.35)
  const swing = Math.sin(rig.walkPhase) * 0.72 * amount
  const swing2 = Math.cos(rig.walkPhase) * 0.72 * amount
  if (dead) {
    rig.root.rotation.z = THREE.MathUtils.damp(rig.root.rotation.z, 1.45, 5, dt)
    rig.root.position.y = THREE.MathUtils.damp(rig.root.position.y, 0.22, 5, dt)
    rig.leftArm.rotation.x = THREE.MathUtils.damp(rig.leftArm.rotation.x, 0.2, 5, dt)
    rig.rightArm.rotation.x = THREE.MathUtils.damp(rig.rightArm.rotation.x, 0.1, 5, dt)
    return
  }
  if (airborne) {
    rig.leftLeg.rotation.x = 0.35 + Math.sin(rig.time * 4) * 0.08
    rig.rightLeg.rotation.x = -0.3
    rig.leftArm.rotation.x = -0.35
    rig.rightArm.rotation.x = -0.35
    rig.root.position.y = 0
    return
  }
  rig.leftLeg.rotation.x = swing
  rig.rightLeg.rotation.x = -swing
  const bob = amount * Math.abs(Math.sin(rig.walkPhase * 2)) * 0.035
  rig.root.position.y = bob
  if (aiming) {
    rig.leftArm.rotation.x = -1.42
    rig.rightArm.rotation.x = -1.24
    rig.leftArm.rotation.z = -0.15
    rig.rightArm.rotation.z = 0.22
    rig.weapon.position.set(0.42, 1.5, -0.64)
    rig.weapon.rotation.set(0, -0.1, 0)
  } else if (buildMode) {
    rig.leftArm.rotation.x = 0.2 + swing2 * 0.2
    rig.rightArm.rotation.x = 0.2 - swing2 * 0.2
    rig.leftArm.rotation.z = 0
    rig.rightArm.rotation.z = 0
    rig.weapon.visible = false
    rig.pickaxe.visible = true
    rig.pickaxe.position.set(0.3, 1.15, -0.2)
    rig.pickaxe.rotation.set(-1.4, 0, 0.2)
    rig.root.rotation.y = 0
    return
  } else {
    rig.leftArm.rotation.x = -0.1 + swing2 * 0.55
    rig.rightArm.rotation.x = -0.1 - swing2 * 0.55
    rig.leftArm.rotation.z = 0
    rig.rightArm.rotation.z = 0
    rig.weapon.position.set(0.46, 1.47, -0.56 + Math.sin(rig.walkPhase) * 0.01)
    rig.weapon.rotation.set(0.12, -0.18, 0)
  }
  if (rig.attackTimer > 0) {
    const t = rig.attackTimer / 0.16
    rig.weapon.position.z += Math.sin(t * Math.PI) * 0.12
    rig.rightArm.rotation.x -= Math.sin(t * Math.PI) * 0.22
  }
}

export function setCharacterWeapon(rig, weaponId) {
  const melee = weaponId === 'pickaxe'
  rig.weapon.visible = !melee
  rig.pickaxe.visible = melee
  if (melee) {
    rig.pickaxe.position.set(0.32, 1.04, -0.35)
    rig.pickaxe.rotation.set(0.5, 0.1, -0.5)
  } else {
    rig.weapon.position.set(0.46, 1.47, -0.56)
    rig.weapon.rotation.set(0.12, -0.18, 0)
  }
}

export const PLAYER_PALETTE = {
  jacket: 0x2f80d8,
  jacketDark: 0x1f5da6,
  pants: 0x2b3550,
  skin: 0xd3a077,
  accent: 0xffd447,
  hat: 0xf2c441,
  visor: 0x14283d,
  pack: 0x244f80
}

export function randomBotPalette(rng) {
  const jacket = new THREE.Color().setHSL(rng.range(0, 1), rng.range(0.35, 0.65), rng.range(0.36, 0.55))
  const accent = new THREE.Color().setHSL(rng.range(0, 1), rng.range(0.55, 0.85), rng.range(0.55, 0.7))
  const dark = jacket.clone().offsetHSL(0, 0.03, -0.12)
  return {
    jacket: jacket.getHex(),
    jacketDark: dark.getHex(),
    pants: new THREE.Color().setHSL(rng.range(0, 1), 0.25, 0.24).getHex(),
    skin: new THREE.Color().setHSL(rng.range(0.04, 0.1), rng.range(0.3, 0.55), rng.range(0.52, 0.74)).getHex(),
    accent: accent.getHex(),
    hat: accent.getHex(),
    visor: 0x0e1722,
    pack: dark.getHex()
  }
}
