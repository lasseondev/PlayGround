import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'

const geometryCache = new Map()

function geo(key, make) {
  if (!geometryCache.has(key)) geometryCache.set(key, make())
  return geometryCache.get(key)
}

function boxGeo(w, h, d) {
  return geo(`box:${w}:${h}:${d}`, () => new THREE.BoxGeometry(w, h, d))
}

function cylGeo(rt, rb, h, segments = 8) {
  return geo(`cyl:${rt}:${rb}:${h}:${segments}`, () => new THREE.CylinderGeometry(rt, rb, h, segments))
}

function sphereGeo(r, segments = 10) {
  return geo(`sph:${r}:${segments}`, () => new THREE.SphereGeometry(r, segments, Math.max(6, segments - 2)))
}

function coneGeo(r, h, segments = 8) {
  return geo(`cone:${r}:${h}:${segments}`, () => new THREE.ConeGeometry(r, h, segments))
}

function std(color, opts = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: opts.roughness ?? 0.72,
    metalness: opts.metalness ?? 0.18,
    flatShading: opts.flatShading ?? true,
    emissive: opts.emissive ?? '#000000',
    emissiveIntensity: opts.emissiveIntensity ?? 0,
    transparent: opts.transparent ?? false,
    opacity: opts.opacity ?? 1,
    side: opts.side ?? THREE.FrontSide
  })
}

function mesh(geometry, material, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(geometry, material)
  m.position.set(x, y, z)
  m.castShadow = true
  m.receiveShadow = true
  return m
}

function mark(group, unit) {
  group.traverse((child) => {
    child.userData.unit = unit
  })
}

function buildHumanoid(options = {}) {
  const {
    armor = '#a9a69b',
    armorDark = '#55565a',
    cloth = '#24455a',
    trim = '#c49a51',
    skin = '#c08b66',
    leather = '#3b2a1d',
    scale = 1,
    female = false
  } = options

  const root = new THREE.Group()
  const body = new THREE.Group()
  root.add(body)

  const matArmor = std(armor, { metalness: 0.58, roughness: 0.42 })
  const matArmorDark = std(armorDark, { metalness: 0.55, roughness: 0.5 })
  const matCloth = std(cloth, { roughness: 0.96, metalness: 0.02 })
  const matTrim = std(trim, { metalness: 0.76, roughness: 0.3, emissive: trim, emissiveIntensity: 0.12 })
  const matSkin = std(skin, { roughness: 0.85, metalness: 0 })
  const matLeather = std(leather, { roughness: 0.92, metalness: 0.03 })

  const hips = mesh(boxGeo(0.48, 0.27, 0.32), matLeather, 0, 0.92, 0)
  body.add(hips)

  const torso = mesh(boxGeo(0.6, 0.62, 0.34), matCloth, 0, 1.33, 0)
  body.add(torso)
  const chest = mesh(boxGeo(0.64, 0.44, 0.4), matArmor, 0, 1.4, 0.015)
  body.add(chest)
  const belt = mesh(boxGeo(0.56, 0.1, 0.36), matTrim, 0, 1.02, 0)
  body.add(belt)

  const shoulderL = mesh(boxGeo(0.28, 0.2, 0.38), matArmorDark, -0.38, 1.59, 0)
  body.add(shoulderL)
  const shoulderR = shoulderL.clone()
  shoulderR.position.x = 0.38
  body.add(shoulderR)

  const neck = mesh(cylGeo(0.1, 0.13, 0.15, 6), matSkin, 0, 1.71, 0)
  body.add(neck)
  const headGroup = new THREE.Group()
  headGroup.position.set(0, 1.87, 0)
  body.add(headGroup)
  const head = mesh(sphereGeo(female ? 0.19 : 0.2, 10), matSkin, 0, 0, 0)
  head.scale.set(female ? 0.92 : 1, 1.05, 0.95)
  headGroup.add(head)

  const armL = new THREE.Group()
  armL.position.set(-0.4, 1.54, 0)
  body.add(armL)
  const armR = new THREE.Group()
  armR.position.set(0.4, 1.54, 0)
  body.add(armR)

  const makeArm = (arm, side) => {
    const upper = mesh(boxGeo(0.18, 0.32, 0.2), matCloth, 0, -0.18, 0)
    arm.add(upper)
    const elbow = mesh(boxGeo(0.2, 0.13, 0.22), matArmorDark, 0, -0.36, 0)
    arm.add(elbow)
    const fore = mesh(boxGeo(0.16, 0.33, 0.18), matArmor, 0, -0.56, 0)
    arm.add(fore)
    const hand = mesh(sphereGeo(0.095, 8), matSkin, 0, -0.75, 0.02)
    arm.add(hand)
    const cuff = mesh(boxGeo(0.2, 0.09, 0.22), matTrim, 0, -0.44, 0)
    arm.add(cuff)
    if (side === 1) return { upper, fore, hand }
    return { upper, fore, hand }
  }
  const armPartsL = makeArm(armL, -1)
  const armPartsR = makeArm(armR, 1)

  const legL = new THREE.Group()
  legL.position.set(-0.17, 0.86, 0)
  root.add(legL)
  const legR = new THREE.Group()
  legR.position.set(0.17, 0.86, 0)
  root.add(legR)
  const makeLeg = (leg) => {
    const thigh = mesh(boxGeo(0.2, 0.42, 0.24), matCloth, 0, -0.21, 0)
    leg.add(thigh)
    const shin = mesh(boxGeo(0.18, 0.38, 0.2), matArmorDark, 0, -0.59, 0)
    leg.add(shin)
    const boot = mesh(boxGeo(0.22, 0.16, 0.35), matLeather, 0, -0.82, 0.06)
    leg.add(boot)
    const toe = mesh(boxGeo(0.2, 0.08, 0.12), matArmor, 0, -0.86, 0.22)
    leg.add(toe)
  }
  makeLeg(legL)
  makeLeg(legR)

  root.scale.setScalar(scale)

  return {
    root,
    body,
    headGroup,
    head,
    armL,
    armR,
    armPartsL,
    armPartsR,
    legL,
    legR,
    mats: { armor: matArmor, armorDark: matArmorDark, cloth: matCloth, trim: matTrim, skin: matSkin, leather: matLeather },
    scale
  }
}

function addHelmet(rig, style) {
  const { headGroup, mats } = rig
  if (style === 'footman') {
    const cap = mesh(cylGeo(0.16, 0.22, 0.26, 8), mats.armor, 0, 0.16, 0)
    headGroup.add(cap)
    const dome = mesh(sphereGeo(0.2, 8), mats.armor, 0, 0.24, 0)
    dome.scale.y = 0.62
    headGroup.add(dome)
    const nose = mesh(boxGeo(0.05, 0.18, 0.04), mats.armor, 0, 0.05, 0.19)
    headGroup.add(nose)
    const crest = mesh(boxGeo(0.05, 0.22, 0.38), mats.trim, 0, 0.33, -0.02)
    headGroup.add(crest)
  } else if (style === 'archer') {
    const hood = mesh(coneGeo(0.27, 0.36, 7), mats.cloth, 0, 0.17, -0.02)
    headGroup.add(hood)
    const brow = mesh(boxGeo(0.3, 0.08, 0.3), mats.leather, 0, 0.1, 0.03)
    headGroup.add(brow)
    const scarf = mesh(boxGeo(0.32, 0.16, 0.28), mats.cloth, 0, -0.05, 0.04)
    headGroup.add(scarf)
  } else if (style === 'knight') {
    const helm = mesh(boxGeo(0.36, 0.38, 0.36), mats.armor, 0, 0.1, 0)
    headGroup.add(helm)
    const top = mesh(cylGeo(0.04, 0.17, 0.2, 6), mats.armor, 0, 0.34, 0)
    headGroup.add(top)
    const slit = mesh(boxGeo(0.27, 0.05, 0.02), std('#121317', { roughness: 1 }), 0, 0.13, 0.19)
    headGroup.add(slit)
    const plume = mesh(coneGeo(0.06, 0.5, 5), mats.trim, 0, 0.4, -0.1)
    plume.rotation.x = 0.5
    headGroup.add(plume)
  } else if (style === 'cleric') {
    const hood = mesh(coneGeo(0.29, 0.42, 8), mats.cloth, 0, 0.16, -0.02)
    headGroup.add(hood)
    const band = mesh(cylGeo(0.19, 0.19, 0.05, 8), mats.trim, 0, 0.1, 0)
    headGroup.add(band)
    const emblem = mesh(boxGeo(0.05, 0.15, 0.03), mats.trim, 0, 0.17, 0.18)
    headGroup.add(emblem)
    const emblem2 = mesh(boxGeo(0.13, 0.05, 0.03), mats.trim, 0, 0.19, 0.18)
    headGroup.add(emblem2)
  } else if (style === 'paladin') {
    const helm = mesh(cylGeo(0.17, 0.21, 0.3, 8), mats.armor, 0, 0.18, 0)
    headGroup.add(helm)
    const face = mesh(boxGeo(0.27, 0.15, 0.06), mats.armor, 0, 0.02, 0.16)
    headGroup.add(face)
    const slit = mesh(boxGeo(0.18, 0.03, 0.02), std('#11141a', { roughness: 1 }), 0, 0.06, 0.2)
    headGroup.add(slit)
    const crest = mesh(boxGeo(0.05, 0.26, 0.5), mats.trim, 0, 0.38, -0.02)
    headGroup.add(crest)
    for (const side of [-1, 1]) {
      const wing = mesh(boxGeo(0.3, 0.1, 0.34), mats.trim, side * 0.28, 0.2, -0.04)
      wing.rotation.z = side * -0.4
      headGroup.add(wing)
    }
  } else if (style === 'mage') {
    const hood = mesh(coneGeo(0.3, 0.46, 8), mats.cloth, 0, 0.18, -0.02)
    headGroup.add(hood)
    const band = mesh(cylGeo(0.2, 0.2, 0.06, 8), mats.trim, 0, 0.08, 0)
    headGroup.add(band)
    const jewel = mesh(new THREE.OctahedronGeometry(0.055, 0), std('#8ef4ff', { emissive: '#5edcff', emissiveIntensity: 2.4, roughness: 0.2 }), 0, 0.09, 0.2)
    headGroup.add(jewel)
  } else if (style === 'skeleton') {
    const skull = mesh(sphereGeo(0.19, 8), std('#c3bba7', { roughness: 0.95, metalness: 0 }), 0, 0.04, 0.01)
    skull.scale.set(1, 1.05, 1.05)
    headGroup.add(skull)
    const jaw = mesh(boxGeo(0.19, 0.09, 0.18), std('#b6ad98', { roughness: 1 }), 0, -0.11, 0.04)
    headGroup.add(jaw)
    const eyeMat = std('#1b2a16', { emissive: '#78ff6d', emissiveIntensity: 2.8, roughness: 0.4 })
    for (const side of [-1, 1]) {
      const eye = mesh(new THREE.SphereGeometry(0.034, 6, 5), eyeMat, side * 0.07, 0.05, 0.17)
      headGroup.add(eye)
    }
    const rusty = mesh(boxGeo(0.4, 0.15, 0.38), std('#4c3a2d', { metalness: 0.5, roughness: 0.7 }), 0, 0.18, 0)
    headGroup.add(rusty)
  } else if (style === 'ghoul') {
    const skull = mesh(sphereGeo(0.21, 8), std('#8d8b73', { roughness: 0.92 }), 0, 0.04, 0.02)
    skull.scale.set(1, 0.95, 1.1)
    headGroup.add(skull)
    const jaw = mesh(boxGeo(0.22, 0.1, 0.2), std('#77745f', { roughness: 1 }), 0, -0.1, 0.12)
    headGroup.add(jaw)
    for (const side of [-1, 1]) {
      const eye = mesh(new THREE.SphereGeometry(0.033, 6, 5), std('#3a0b08', { emissive: '#ff4f35', emissiveIntensity: 3.2 }), side * 0.075, 0.06, 0.18)
      headGroup.add(eye)
      const horn = mesh(coneGeo(0.035, 0.18, 4), std('#5b5547', { roughness: 1 }), side * 0.12, 0.21, -0.02)
      horn.rotation.z = side * -0.35
      headGroup.add(horn)
    }
  } else if (style === 'wraith') {
    const hood = mesh(coneGeo(0.32, 0.56, 7), std('#1d1b2d', { roughness: 1, emissive: '#4b2b7a', emissiveIntensity: 0.3 }), 0, 0.2, 0)
    headGroup.add(hood)
    const voidFace = mesh(sphereGeo(0.17, 8), std('#07060c', { roughness: 1 }), 0, 0.02, 0.1)
    headGroup.add(voidFace)
    for (const side of [-1, 1]) {
      const eye = mesh(new THREE.SphereGeometry(0.035, 6, 5), std('#1c3a36', { emissive: '#57ffe3', emissiveIntensity: 3.5 }), side * 0.065, 0.04, 0.22)
      headGroup.add(eye)
    }
  } else if (style === 'brute') {
    const skull = mesh(sphereGeo(0.3, 8), std('#766d5b', { roughness: 0.95 }), 0, 0.05, 0.02)
    headGroup.add(skull)
    const jaw = mesh(boxGeo(0.34, 0.15, 0.3), std('#685f4f', { roughness: 1 }), 0, -0.14, 0.1)
    headGroup.add(jaw)
    for (const side of [-1, 1]) {
      const horn = mesh(coneGeo(0.08, 0.44, 5), std('#b2a487', { roughness: 0.9 }), side * 0.24, 0.26, -0.02)
      horn.rotation.z = side * -0.55
      headGroup.add(horn)
      const eye = mesh(new THREE.SphereGeometry(0.045, 6, 5), std('#2b1008', { emissive: '#ff5b2b', emissiveIntensity: 3.4 }), side * 0.11, 0.06, 0.25)
      headGroup.add(eye)
    }
  } else if (style === 'boss') {
    const helm = mesh(cylGeo(0.2, 0.26, 0.36, 8), mats.armor, 0, 0.18, 0)
    headGroup.add(helm)
    const crown = mesh(cylGeo(0.24, 0.22, 0.13, 8), mats.trim, 0, 0.4, 0)
    headGroup.add(crown)
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2
      const spike = mesh(coneGeo(0.045, 0.2, 4), mats.trim, Math.cos(a) * 0.2, 0.52, Math.sin(a) * 0.2)
      headGroup.add(spike)
    }
    const visor = mesh(boxGeo(0.3, 0.1, 0.05), std('#0b0707', { roughness: 1 }), 0, 0.08, 0.21)
    headGroup.add(visor)
    for (const side of [-1, 1]) {
      const eye = mesh(new THREE.SphereGeometry(0.035, 6, 5), std('#3b0b0b', { emissive: '#ff3b22', emissiveIntensity: 4 }), side * 0.07, 0.08, 0.25)
      headGroup.add(eye)
    }
  }
}

function addCape(rig, color, long = false) {
  const mat = std(color, { roughness: 0.98, metalness: 0.02, side: THREE.DoubleSide })
  const cape = new THREE.Group()
  cape.position.set(0, 1.58, -0.2)
  rig.body.add(cape)
  const panel = mesh(new THREE.PlaneGeometry(long ? 0.86 : 0.68, long ? 1.55 : 1.0, 1, 4), mat, 0, long ? -0.78 : -0.52, 0)
  panel.castShadow = true
  cape.add(panel)
  const clasp = mesh(boxGeo(0.3, 0.08, 0.06), rig.mats.trim, 0, 0.02, 0.06)
  rig.body.add(clasp)
  rig.cape = cape
  rig.capePanel = panel
  return cape
}

function addSword(rig, opts = {}) {
  const { blade = '#c9cbd0', length = 1.05, glow = null, emissive = null } = opts
  const group = new THREE.Group()
  group.position.set(0, -0.78, 0.03)
  rig.armR.add(group)
  const bladeMat = std(blade, {
    metalness: 0.9,
    roughness: 0.22,
    emissive: emissive || '#000000',
    emissiveIntensity: glow ? 1.6 : 0.12
  })
  const gripMat = std('#3c2417', { roughness: 0.85 })
  const trimMat = rig.mats.trim
  const bladeMesh = mesh(boxGeo(0.09, length, 0.16), bladeMat, 0, -length / 2, 0)
  group.add(bladeMesh)
  const tip = mesh(coneGeo(0.08, 0.24, 4), bladeMat, 0, -length - 0.1, 0)
  tip.rotation.x = Math.PI
  tip.rotation.y = Math.PI / 4
  group.add(tip)
  const guard = mesh(boxGeo(0.42, 0.08, 0.14), trimMat, 0, 0.03, 0)
  group.add(guard)
  const grip = mesh(cylGeo(0.035, 0.045, 0.25, 6), gripMat, 0, 0.18, 0)
  group.add(grip)
  const pommel = mesh(sphereGeo(0.07, 6), trimMat, 0, 0.32, 0)
  group.add(pommel)
  rig.weapon = group
  rig.weaponBlade = bladeMesh
  rig.weaponMat = bladeMat
  if (glow) {
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: emissive || '#ffd77d', transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false }))
    sprite.position.set(0, -length * 0.55, 0)
    sprite.scale.set(1.5, 1.5, 1)
    group.add(sprite)
    rig.weaponGlow = sprite
  }
  return group
}

function addAxe(rig, glow) {
  const group = new THREE.Group()
  group.position.set(0, -0.78, 0.02)
  rig.armR.add(group)
  const handle = mesh(cylGeo(0.05, 0.06, 1.7, 6), std('#3a281c', { roughness: 0.9 }), 0, 0.1, 0)
  group.add(handle)
  const bladeMat = std('#5d5c58', { metalness: 0.8, roughness: 0.38, emissive: '#32140a', emissiveIntensity: 0.4 })
  const head = mesh(boxGeo(0.72, 0.42, 0.09), bladeMat, 0.2, 0.85, 0)
  head.rotation.z = -0.2
  group.add(head)
  const spike = mesh(coneGeo(0.1, 0.42, 4), bladeMat, -0.2, 0.88, 0)
  spike.rotation.z = Math.PI / 2
  group.add(spike)
  rig.weapon = group
  rig.weaponMat = bladeMat
  if (glow) {
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: '#ff7d42', transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }))
    sprite.position.set(0.2, 0.85, 0)
    sprite.scale.set(1.8, 1.8, 1)
    group.add(sprite)
    rig.weaponGlow = sprite
  }
}

function addBow(rig, glow) {
  const group = new THREE.Group()
  group.position.set(-0.02, -0.7, 0.06)
  rig.armL.add(group)
  const bowMat = std('#5a3a1f', { roughness: 0.82 })
  const limb = mesh(new THREE.TorusGeometry(0.62, 0.035, 4, 20, Math.PI * 1.15), bowMat, 0, 0, 0)
  limb.rotation.z = Math.PI / 2
  limb.rotation.y = Math.PI / 2
  group.add(limb)
  const stringMat = new THREE.LineBasicMaterial({ color: '#d9d1bc', transparent: true, opacity: 0.75 })
  const stringGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -0.61, 0), new THREE.Vector3(0, 0, -0.1), new THREE.Vector3(0, 0.61, 0)])
  const string = new THREE.Line(stringGeo, stringMat)
  group.add(string)
  rig.weapon = group

  const quiver = mesh(cylGeo(0.08, 0.07, 0.5, 6), std('#3b2a1b', { roughness: 0.9 }), 0.22, 1.28, -0.24)
  quiver.rotation.x = 0.35
  rig.body.add(quiver)
  for (let i = 0; i < 3; i++) {
    const arrow = mesh(cylGeo(0.008, 0.008, 0.42, 4), std('#8b7455', { roughness: 0.9 }), 0.2 + i * 0.03, 1.54, -0.3)
    arrow.rotation.x = 0.35
    rig.body.add(arrow)
  }
}

function addStaff(rig, glow, color = '#7cecff', crystalColor = '#bff9ff') {
  const group = new THREE.Group()
  group.position.set(0, -0.75, 0.04)
  rig.armR.add(group)
  const shaft = mesh(cylGeo(0.035, 0.05, 1.9, 6), std('#4a3523', { roughness: 0.85 }), 0, 0.58, 0)
  group.add(shaft)
  const orbMat = std(color, { emissive: crystalColor, emissiveIntensity: 2.8, roughness: 0.15, metalness: 0.1 })
  const orb = mesh(new THREE.IcosahedronGeometry(0.13, 0), orbMat, 0, 1.56, 0)
  group.add(orb)
  const ring = mesh(new THREE.TorusGeometry(0.22, 0.022, 4, 16), rig.mats.trim, 0, 1.56, 0)
  ring.rotation.x = Math.PI / 2
  group.add(ring)
  const ring2 = ring.clone()
  ring2.rotation.set(0, 0, Math.PI / 2)
  ring2.rotation.y = Math.PI / 2
  group.add(ring2)
  rig.weapon = group
  rig.weaponMat = orbMat
  rig.staffOrb = orb
  if (glow) {
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending, depthWrite: false }))
    sprite.position.set(0, 1.56, 0)
    sprite.scale.set(2.2, 2.2, 1)
    group.add(sprite)
    rig.weaponGlow = sprite
  }
}

function addShield(rig, color = '#24455a', trim = '#c49a51') {
  const group = new THREE.Group()
  group.position.set(-0.02, -0.58, 0.12)
  group.rotation.y = -0.22
  rig.armL.add(group)
  const field = mesh(new THREE.CylinderGeometry(0.34, 0.38, 0.09, 8), std(color, { metalness: 0.4, roughness: 0.55 }), 0, 0, 0)
  field.rotation.x = Math.PI / 2
  field.scale.y = 1.28
  group.add(field)
  const rim = mesh(new THREE.TorusGeometry(0.36, 0.025, 4, 18), std(trim, { metalness: 0.8, roughness: 0.3 }), 0, 0, 0.06)
  group.add(rim)
  const boss = mesh(sphereGeo(0.08, 8), std(trim, { metalness: 0.85, roughness: 0.28 }), 0, 0, 0.11)
  boss.scale.z = 0.5
  group.add(boss)
  rig.shield = group
}

function addRobe(rig, color, trim) {
  const robeMat = std(color, { roughness: 0.98, metalness: 0.03 })
  const robe = mesh(cylGeo(0.28, 0.62, 1.0, 8), robeMat, 0, 0.5, 0)
  rig.root.add(robe)
  const hem = mesh(cylGeo(0.63, 0.64, 0.08, 8), std(trim, { metalness: 0.5, roughness: 0.5 }), 0, 0.02, 0)
  rig.root.add(hem)
  const under = mesh(cylGeo(0.25, 0.5, 0.55, 8), robeMat, 0, 0.78, 0)
  rig.root.add(under)
  rig.robe = robe
  rig.legL.visible = false
  rig.legR.visible = false
}

function addHorns(rig, color = '#b4a68a') {
  for (const side of [-1, 1]) {
    const horn = mesh(coneGeo(0.07, 0.38, 5), std(color, { roughness: 0.9 }), side * 0.28, 1.72, 0)
    horn.rotation.z = side * -0.6
    rig.body.add(horn)
  }
}

function addHeroAura(rig, color) {
  const ringMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false })
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.75, 0.92, 32), ringMat)
  ring.rotation.x = -Math.PI / 2
  ring.position.y = 0.03
  rig.root.add(ring)
  rig.aura = ring
  rig.auraMat = ringMat
}

function addSkeletonBody(rig) {
  const bone = std('#c7bda7', { roughness: 0.92, metalness: 0 })
  const boneDark = std('#988f7d', { roughness: 0.95 })
  const rust = std('#4a3a2a', { roughness: 0.72, metalness: 0.55 })
  rig.root.traverse((child) => {
    if (child.isMesh && child.material && child.material.color) {
      child.visible = false
    }
  })
  rig.body.children.forEach((c) => { c.visible = false })
  rig.legL.children.forEach((c) => { c.visible = false })
  rig.legR.children.forEach((c) => { c.visible = false })

  const spine = mesh(cylGeo(0.04, 0.06, 0.7, 5), bone, 0, 1.33, 0)
  rig.body.add(spine)
  for (let i = 0; i < 4; i++) {
    const rib = mesh(new THREE.TorusGeometry(0.19 + i * 0.008, 0.026, 4, 12, Math.PI * 0.92), bone, 0, 1.18 + i * 0.13, 0)
    rib.rotation.x = Math.PI / 2
    rib.rotation.z = -Math.PI * 0.46
    rig.body.add(rib)
  }
  const pelvis = mesh(boxGeo(0.34, 0.13, 0.22), boneDark, 0, 0.98, 0)
  rig.body.add(pelvis)
  const skull = mesh(sphereGeo(0.17, 8), bone, 0, 1.85, 0.02)
  skull.scale.set(1, 1.02, 1.08)
  rig.body.add(skull)
  const jaw = mesh(boxGeo(0.18, 0.1, 0.16), boneDark, 0, 1.71, 0.06)
  rig.body.add(jaw)
  const eyeMat = std('#0c130b', { emissive: '#74ff62', emissiveIntensity: 3 })
  for (const side of [-1, 1]) {
    const eye = mesh(new THREE.SphereGeometry(0.034, 6, 5), eyeMat, side * 0.065, 1.88, 0.15)
    rig.body.add(eye)
  }

  for (const side of [-1, 1]) {
    const shoulder = mesh(sphereGeo(0.11, 6), rust, side * 0.34, 1.55, 0)
    rig.body.add(shoulder)
    const upper = mesh(cylGeo(0.045, 0.055, 0.32, 5), bone, side * 0.4, 1.4, 0)
    upper.rotation.z = side * 0.18
    rig.body.add(upper)
    const fore = mesh(cylGeo(0.04, 0.05, 0.32, 5), bone, side * 0.44, 1.1, 0.04)
    fore.rotation.z = side * 0.12
    rig.body.add(fore)
    const leg = mesh(cylGeo(0.05, 0.065, 0.42, 5), bone, side * 0.15, 0.6, 0)
    rig.body.add(leg)
    const shin = mesh(cylGeo(0.04, 0.05, 0.38, 5), bone, side * 0.15, 0.22, 0.03)
    rig.body.add(shin)
    const foot = mesh(boxGeo(0.16, 0.07, 0.24), boneDark, side * 0.15, 0.03, 0.07)
    rig.body.add(foot)
  }

  const sword = new THREE.Group()
  sword.position.set(0.44, 1.02, 0.06)
  sword.rotation.z = -0.18
  rig.body.add(sword)
  const blade = mesh(boxGeo(0.055, 0.82, 0.11), rust, 0, 0.4, 0)
  sword.add(blade)
  const guard = mesh(boxGeo(0.28, 0.05, 0.08), rust, 0, 0.02, 0)
  sword.add(guard)
  rig.weapon = sword
  rig.weaponMat = rust

  const shield = mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.06, 7), rust, -0.46, 1.08, 0.1)
  shield.rotation.x = Math.PI / 2
  shield.rotation.z = 0.2
  rig.body.add(shield)
}

function addWraithBody(rig) {
  rig.root.traverse((child) => {
    if (child.isMesh && child.material && child.material.color) child.visible = false
  })
  rig.body.children.forEach((c) => { c.visible = false })
  rig.legL.visible = false
  rig.legR.visible = false
  const robeMat = std('#211c33', { roughness: 1, flatShading: true, emissive: '#3d2166', emissiveIntensity: 0.35 })
  const robe = mesh(cylGeo(0.12, 0.55, 1.65, 7), robeMat, 0, 1.0, 0)
  rig.body.add(robe)
  const shoulders = mesh(cylGeo(0.4, 0.55, 0.45, 7), robeMat, 0, 1.76, 0)
  rig.body.add(shoulders)
  const hood = mesh(coneGeo(0.31, 0.62, 7), robeMat, 0, 2.12, -0.02)
  rig.body.add(hood)
  const voidFace = mesh(sphereGeo(0.17, 8), std('#05040a', { roughness: 1 }), 0, 1.95, 0.14)
  rig.body.add(voidFace)
  for (const side of [-1, 1]) {
    const eye = mesh(new THREE.SphereGeometry(0.034, 6, 5), std('#122b28', { emissive: '#53ffe1', emissiveIntensity: 4 }), side * 0.065, 1.97, 0.25)
    rig.body.add(eye)
    const arm = mesh(cylGeo(0.035, 0.055, 0.7, 5), robeMat, side * 0.36, 1.5, 0.16)
    arm.rotation.z = side * 0.25
    arm.rotation.x = -0.4
    rig.body.add(arm)
    const claw = mesh(coneGeo(0.05, 0.18, 4), std('#b7b0a0', { roughness: 0.8 }), side * 0.47, 1.11, 0.4)
    claw.rotation.x = Math.PI
    rig.body.add(claw)
  }
  const glowRing = new THREE.Mesh(new THREE.RingGeometry(0.35, 0.62, 20), new THREE.MeshBasicMaterial({ color: '#7a4fd6', transparent: true, opacity: 0.28, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false }))
  glowRing.rotation.x = -Math.PI / 2
  glowRing.position.y = 0.16
  rig.root.add(glowRing)
  rig.robe = robe
  rig.weapon = null
  rig.wraithRing = glowRing
}

function addGhoulBody(rig) {
  const skinMat = std('#88856d', { roughness: 0.94, metalness: 0 })
  rig.mats.armor.color.set('#6d6757')
  rig.mats.armor.roughness = 0.9
  rig.mats.cloth.color.set('#3b332b')
  rig.headGroup.scale.set(1.16, 1.08, 1.16)
  rig.body.rotation.x = 0.2
  rig.body.position.z = 0.08
  for (const side of [-1, 1]) {
    const claw = mesh(coneGeo(0.05, 0.36, 4), skinMat, side * 0.48, 0.76, 0.16)
    claw.rotation.x = Math.PI * 0.92
    claw.rotation.z = side * 0.2
    rig.body.add(claw)
  }
  rig.headGroup.scale.set(1.2, 1.1, 1.18)
  rig.armL.scale.set(1.12, 1.15, 1.12)
  rig.armR.scale.set(1.12, 1.15, 1.12)
}

function createBar(width, height, team, hero) {
  const group = new THREE.Group()
  const bgMat = new THREE.MeshBasicMaterial({ color: '#090b10', transparent: true, opacity: 0.72, depthTest: false, depthWrite: false })
  const bg = new THREE.Mesh(new THREE.PlaneGeometry(width + 0.08, 0.17), bgMat)
  bg.renderOrder = 20
  group.add(bg)
  const border = new THREE.Mesh(new THREE.PlaneGeometry(width + 0.16, 0.24), new THREE.MeshBasicMaterial({ color: hero ? '#d8b56e' : '#3a3b40', transparent: true, opacity: hero ? 0.85 : 0.7, depthTest: false, depthWrite: false }))
  border.position.z = -0.002
  border.renderOrder = 19
  group.add(border)
  const fillMat = new THREE.MeshBasicMaterial({
    color: team === 'player' ? (hero ? '#bde878' : '#8fc25a') : (hero ? '#ff7c5c' : '#d75745'),
    transparent: true,
    opacity: 0.95,
    depthTest: false,
    depthWrite: false
  })
  const fill = new THREE.Mesh(new THREE.PlaneGeometry(width, 0.1), fillMat)
  fill.position.z = 0.004
  fill.renderOrder = 21
  group.add(fill)
  group.userData = { width, height, fill, bg, border, hero }
  group.visible = false
  return group
}

function createSelectionRing(radius, color = '#ffe2a0') {
  const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false })
  const ring = new THREE.Mesh(new THREE.RingGeometry(radius * 1.02, radius * 1.22, 36), mat)
  ring.rotation.x = -Math.PI / 2
  ring.position.y = 0.035
  ring.visible = false
  ring.renderOrder = 5
  return ring
}

function finalize(rig, type, team, opts = {}) {
  const root = rig.root
  const scale = rig.scale || 1
  const height = opts.height ?? 2.3 * scale
  const radius = opts.radius ?? 0.6 * scale
  const width = (opts.hero ? 2.3 : 1.28) / scale
  rig.body.userData.baseY = rig.body.position.y
  const bar = createBar(width, 0.14, team, opts.hero)
  bar.position.y = (height + 0.35) / scale
  root.add(bar)
  const ring = createSelectionRing((radius * (opts.hero ? 1.35 : 1)) / scale, opts.hero ? '#ffe6a8' : '#ffe2a0')
  root.add(ring)
  if (opts.hero) {
    const halo = new THREE.Mesh(new THREE.RingGeometry((radius * 1.6) / scale, (radius * 2.15) / scale, 36), new THREE.MeshBasicMaterial({ color: opts.aura || '#e8bd6e', transparent: true, opacity: 0.14, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false }))
    halo.rotation.x = -Math.PI / 2
    halo.position.y = 0.02
    root.add(halo)
    rig.halo = halo
  }
  return {
    group: root,
    rig,
    bar,
    selectionRing: ring,
    height,
    radius,
    type,
    team,
    baseBodyY: rig.body.position.y
  }
}

function makeAelric(glow) {
  const rig = buildHumanoid({
    armor: '#c6b06b',
    armorDark: '#6c5a31',
    cloth: '#1c3f63',
    trim: '#f0cf84',
    skin: '#c58d63',
    scale: 1.14
  })
  addHelmet(rig, 'paladin')
  addCape(rig, '#153f67', true)
  addSword(rig, { blade: '#ffe3a1', length: 1.25, glow, emissive: '#ffb84d' })
  addShield(rig, '#1b3c61', '#e5c77e')
  addHeroAura(rig, '#f0c26a')
  rig.body.position.y = 0.04
  return finalize(rig, 'aelric', 'player', { hero: true, height: 2.9, radius: 0.82, aura: '#e8bd6e' })
}

function makeYsolde(glow) {
  const rig = buildHumanoid({
    armor: '#4c6f8c',
    armorDark: '#2d4256',
    cloth: '#173a55',
    trim: '#8ad8dd',
    skin: '#d3a485',
    scale: 1.08,
    female: true
  })
  addHelmet(rig, 'mage')
  addRobe(rig, '#173a55', '#8ad8dd')
  addCape(rig, '#0d2c46', true)
  addStaff(rig, glow, '#70e9ff', '#c9fbff')
  addHeroAura(rig, '#6bdcf0')
  rig.body.position.y = 0.05
  return finalize(rig, 'ysolde', 'player', { hero: true, height: 2.85, radius: 0.78, aura: '#6bdcf0' })
}

function makeFootman(glow) {
  const rig = buildHumanoid({ armor: '#a4a296', armorDark: '#54565b', cloth: '#23445a', trim: '#c3a05f', skin: '#bd8861' })
  addHelmet(rig, 'footman')
  addSword(rig, { blade: '#c4c6cb', length: 0.95 })
  addShield(rig, '#23445a', '#c3a05f')
  return finalize(rig, 'footman', 'player', { height: 2.25, radius: 0.58 })
}

function makeArcher(glow) {
  const rig = buildHumanoid({ armor: '#83745c', armorDark: '#4b4439', cloth: '#3a4d39', trim: '#b2955c', skin: '#c08e66' })
  addHelmet(rig, 'archer')
  addBow(rig, glow)
  return finalize(rig, 'archer', 'player', { height: 2.2, radius: 0.55 })
}

function makeKnight(glow) {
  const rig = buildHumanoid({ armor: '#b8b7ac', armorDark: '#5a5e64', cloth: '#203f57', trim: '#d5b268', skin: '#bd8861', scale: 1.03 })
  addHelmet(rig, 'knight')
  addCape(rig, '#1c3b56', false)
  addSword(rig, { blade: '#d3d6da', length: 1.15 })
  addShield(rig, '#1e3b57', '#d5b268')
  return finalize(rig, 'knight', 'player', { height: 2.45, radius: 0.66 })
}

function makeCleric(glow) {
  const rig = buildHumanoid({ armor: '#9ba8a2', armorDark: '#4e5b58', cloth: '#d8d1bb', trim: '#c8a45c', skin: '#c79a75' })
  addHelmet(rig, 'cleric')
  addRobe(rig, '#d8d1bb', '#c8a45c')
  addStaff(rig, glow, '#ffecad', '#fff7d4')
  return finalize(rig, 'cleric', 'player', { height: 2.35, radius: 0.56 })
}

function makeSkeleton(glow) {
  const rig = buildHumanoid({ armor: '#7e7666', armorDark: '#4a4439', cloth: '#352a24', trim: '#6a5b3d', skin: '#bdb39f' })
  addSkeletonBody(rig)
  return finalize(rig, 'skeleton', 'enemy', { height: 2.1, radius: 0.55 })
}

function makeGhoul(glow) {
  const rig = buildHumanoid({ armor: '#6b6253', armorDark: '#423b30', cloth: '#3e332a', trim: '#5e4a30', skin: '#8d8a73', scale: 1.04 })
  addHelmet(rig, 'ghoul')
  addGhoulBody(rig)
  return finalize(rig, 'ghoul', 'enemy', { height: 2.05, radius: 0.58 })
}

function makeWraith(glow) {
  const rig = buildHumanoid({ armor: '#4b3b60', armorDark: '#2c2238', cloth: '#211c33', trim: '#6e4fa8', skin: '#9388a6' })
  addWraithBody(rig)
  rig.body.position.y = 0.22
  return finalize(rig, 'wraith', 'enemy', { height: 2.45, radius: 0.57 })
}

function makeBrute(glow) {
  const rig = buildHumanoid({ armor: '#5e5344', armorDark: '#3b332a', cloth: '#4b2e22', trim: '#8d6a3f', skin: '#7d6f59', scale: 1.38 })
  addHelmet(rig, 'brute')
  addAxe(rig, glow)
  addHorns(rig, '#b0a38a')
  rig.body.scale.set(1.08, 1.02, 1.08)
  rig.armL.scale.set(1.18, 1.2, 1.18)
  rig.armR.scale.set(1.18, 1.2, 1.18)
  return finalize(rig, 'brute', 'enemy', { hero: true, height: 3.25, radius: 1.08, aura: '#d84e2c' })
}

function makeBoss(glow) {
  const rig = buildHumanoid({ armor: '#3b3439', armorDark: '#201b20', cloth: '#2a1418', trim: '#b4773f', skin: '#6f5a4a', scale: 1.62 })
  addHelmet(rig, 'boss')
  addCape(rig, '#3a0f17', true)
  addSword(rig, { blade: '#ff7b42', length: 1.65, glow, emissive: '#ff4b1a' })
  addHorns(rig, '#9b7a54')
  rig.body.scale.set(1.04, 1.02, 1.04)
  rig.armL.scale.set(1.15, 1.25, 1.15)
  rig.armR.scale.set(1.15, 1.25, 1.15)
  return finalize(rig, 'boss', 'enemy', { hero: true, height: 4.1, radius: 1.55, aura: '#e04427' })
}

const builders = {
  aelric: makeAelric,
  ysolde: makeYsolde,
  footman: makeFootman,
  archer: makeArcher,
  knight: makeKnight,
  cleric: makeCleric,
  skeleton: makeSkeleton,
  ghoul: makeGhoul,
  wraith: makeWraith,
  brute: makeBrute,
  boss: makeBoss
}


function mergeOpaqueMeshes(group, stopGroups = [], tint = null) {
  if (!group || !group.visible) return
  group.updateWorldMatrix(true, true)
  const inverse = new THREE.Matrix4().copy(group.matrixWorld).invert()
  const stop = new Set(stopGroups.filter(Boolean))
  const meshes = []
  const visit = (node) => {
    if (!node.visible || stop.has(node)) return
    if (node.isMesh) {
      if (node.material && !node.material.transparent && node.material.blending === THREE.NormalBlending && node.geometry) {
        meshes.push(node)
      }
      return
    }
    for (const child of node.children) visit(child)
  }
  for (const child of group.children) visit(child)
  if (meshes.length < 2) return

  const geometries = []
  for (const source of meshes) {
    const geometry = source.geometry.clone()
    geometry.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inverse, source.matrixWorld))
    const flat = geometry.index ? geometry.toNonIndexed() : geometry
    if (flat !== geometry) geometry.dispose()
    for (const name of Object.keys(flat.attributes)) {
      if (name !== 'position' && name !== 'normal') flat.deleteAttribute(name)
    }
    if (!flat.getAttribute('normal')) flat.computeVertexNormals()
    const count = flat.getAttribute('position').count
    const colors = new Float32Array(count * 3)
    const color = source.material.color || new THREE.Color('#ffffff')
    const emissive = source.material.emissive
    const glow = emissive ? Math.min(1, (source.material.emissiveIntensity || 0) * 0.45) : 0
    const r = Math.min(1, (color.r + (emissive ? emissive.r * glow : 0)) * (tint ? tint[0] : 1))
    const g = Math.min(1, (color.g + (emissive ? emissive.g * glow : 0)) * (tint ? tint[1] : 1))
    const b = Math.min(1, (color.b + (emissive ? emissive.b * glow : 0)) * (tint ? tint[2] : 1))
    for (let i = 0; i < count; i++) {
      colors[i * 3] = r
      colors[i * 3 + 1] = g
      colors[i * 3 + 2] = b
    }
    flat.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometries.push(flat)
  }
  if (geometries.length < 2) {
    for (const geometry of geometries) geometry.dispose()
    return
  }
  const merged = mergeGeometries(geometries, false)
  for (const geometry of geometries) geometry.dispose()
  if (!merged) return
  const material = new THREE.MeshLambertMaterial({
    vertexColors: true,
    flatShading: true,
    side: THREE.DoubleSide
  })
  const mesh = new THREE.Mesh(merged, material)
  mesh.castShadow = false
  mesh.receiveShadow = false
  for (const source of meshes) source.parent?.remove(source)
  group.add(mesh)
}

function optimizeUnitGeometry(visual, team) {
  const rig = visual?.rig
  if (!rig) return
  const tint = team === 'player' ? [1.18, 1.04, 0.8] : [0.7, 0.62, 1]
  mergeOpaqueMeshes(rig.body, [rig.armL, rig.armR], tint)
  mergeOpaqueMeshes(rig.armL, [], tint)
  mergeOpaqueMeshes(rig.armR, [], tint)
  mergeOpaqueMeshes(rig.legL, [], tint)
  mergeOpaqueMeshes(rig.legR, [], tint)
}

export function createUnitModel(type, team, glow) {
  const builder = builders[type]
  if (!builder) throw new Error(`Unknown unit model: ${type}`)
  const visual = builder(glow)
  optimizeUnitGeometry(visual, team)
  visual.group.userData.unit = null
  return visual
}

export function attachUnit(visual, unit) {
  visual.group.userData.unit = unit
  mark(visual.group, unit)
}

export function animateUnit(unit, dt, time, camera) {
  const visual = unit.visual
  const rig = visual.rig
  if (!rig) return
  const moving = unit.moving && !unit.dead
  unit.animTime = (unit.animTime || 0) + dt * (moving ? 8.4 : 1.5)
  const phase = unit.animTime + (unit.animOffset || 0)
  const swing = moving ? Math.sin(phase) * 0.62 : Math.sin(time * 1.5 + (unit.animOffset || 0)) * 0.035
  const swingOpp = moving ? Math.sin(phase + Math.PI) * 0.62 : -swing

  if (rig.legL && rig.legL.visible) rig.legL.rotation.x = swing
  if (rig.legR && rig.legR.visible) rig.legR.rotation.x = swingOpp

  const idleBreath = Math.sin(time * 1.7 + (unit.animOffset || 0)) * 0.012
  rig.body.position.y = (rig.body.userData.baseY ?? rig.body.position.y) + idleBreath + (moving ? Math.abs(Math.sin(phase)) * 0.045 : 0)

  unit.attackAnim = Math.max(0, (unit.attackAnim || 0) - dt)
  const attackT = unit.attackAnim > 0 ? 1 - unit.attackAnim / 0.36 : -1
  const attackSwing = attackT >= 0 ? Math.sin(Math.max(0, Math.min(1, attackT)) * Math.PI) : 0

  const isRanged = unit.type === 'archer' || unit.type === 'wraith' || unit.type === 'ysolde' || unit.type === 'cleric'
  if (rig.armR) {
    if (unit.type === 'aelric' || unit.type === 'knight' || unit.type === 'footman' || unit.type === 'skeleton' || unit.type === 'ghoul' || unit.type === 'brute' || unit.type === 'boss') {
      rig.armR.rotation.x = swingOpp * 0.5 - attackSwing * 2.1
      rig.armR.rotation.z = attackSwing * 0.35
    } else {
      rig.armR.rotation.x = -0.2 - attackSwing * 0.55
    }
  }
  if (rig.armL) {
    if (unit.type === 'archer') {
      rig.armL.rotation.x = -1.05 - attackSwing * 0.2
      rig.armL.rotation.z = 0.2
      if (rig.armR) rig.armR.rotation.x = -0.85 + attackSwing * 0.45
    } else if (unit.type === 'ysolde' || unit.type === 'cleric') {
      rig.armL.rotation.x = swing * 0.18
      rig.armL.rotation.z = -0.16
    } else {
      rig.armL.rotation.x = swing * 0.4
    }
  }

  if (rig.cape) {
    rig.cape.rotation.x = 0.08 + (moving ? 0.3 : 0.02) + Math.sin(time * 2.8 + (unit.animOffset || 0)) * 0.06
    rig.cape.rotation.z = Math.sin(time * 1.9 + (unit.animOffset || 0)) * 0.03
  }

  if (rig.robe) {
    rig.robe.rotation.z = Math.sin(time * 1.4 + (unit.animOffset || 0)) * 0.015
  }

  if (unit.type === 'wraith') {
    rig.body.position.y = 0.28 + Math.sin(time * 1.8 + (unit.animOffset || 0)) * 0.1
    if (rig.wraithRing) rig.wraithRing.rotation.z = time * 0.4
  }

  if (rig.weaponGlow) {
    const pulse = 0.72 + Math.sin(time * 3 + (unit.animOffset || 0)) * 0.16
    rig.weaponGlow.material.opacity = pulse
    rig.weaponGlow.scale.setScalar((unit.type === 'boss' ? 2.3 : 1.6) + Math.sin(time * 2.4) * 0.2)
  }
  if (rig.weaponMat && rig.weaponMat.emissiveIntensity > 0.5) {
    rig.weaponMat.emissiveIntensity = 1.5 + Math.sin(time * 2.4 + (unit.animOffset || 0)) * 0.35
  }
  if (rig.aura) {
    rig.aura.rotation.z = time * 0.32
    rig.auraMat.opacity = 0.24 + Math.sin(time * 2 + (unit.animOffset || 0)) * 0.1
  }
  if (rig.halo) {
    rig.halo.rotation.z = -time * 0.18
    rig.halo.material.opacity = 0.1 + Math.sin(time * 1.6) * 0.04
  }

  if (visual.bar) {
    const ratio = Math.max(0, unit.hp / unit.maxHp)
    const width = visual.bar.userData.width
    const fill = visual.bar.userData.fill
    fill.scale.x = ratio
    fill.position.x = -width / 2 + (width * ratio) / 2
    const show = ratio < 0.999 || visual.bar.userData.hero
    visual.bar.visible = show && !unit.dead
    visual.bar.quaternion.copy(camera.quaternion)
  }
  if (visual.selectionRing) {
    visual.selectionRing.visible = unit.selected && !unit.dead
    visual.selectionRing.rotation.z = time * 0.5
    visual.selectionRing.material.opacity = 0.65 + Math.sin(time * 4) * 0.2
  }
}

export function setUnitOpacity(visual, opacity) {
  visual.group.traverse((child) => {
    if (child.isMesh && child.material) {
      if (Array.isArray(child.material)) {
        for (const m of child.material) {
          if (m.transparent === false) {
            m.transparent = true
            m.needsUpdate = true
          }
          m.opacity = opacity
        }
      } else {
        if (child.material.transparent === false) {
          child.material.transparent = true
          child.material.needsUpdate = true
        }
        child.material.opacity = opacity
      }
    }
  })
  visual.bar.visible = false
  visual.selectionRing.visible = false
}
