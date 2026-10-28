import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import {
  floorTextures, carpetTexture, concreteTexture, tileWallTexture, signTexture, posterTexture,
  bloodTexture, glowTexture, hazardTexture, directoryTexture, mulberry32
} from './textures.js'

const _v = new THREE.Vector3()

export class Mall {
  constructor(game) {
    this.game = game
    this.group = new THREE.Group()
    this.group.name = 'mall'
    this.colliders = []
    this.impactMeshes = []
    this.spawnPoints = []
    this.flickers = []
    this.banners = []
    this.glowSprites = []
    this.rnd = mulberry32(20241)
    this.build()
  }

  build() {
    this.createMaterials()
    this.createFloors()
    this.createShell()
    this.createColumns()
    this.createStorefronts()
    this.createUpperLevel()
    this.createCinema()
    this.createEscalators()
    this.createEntrance()
    this.createAtrium()
    this.createProps()
    this.createBarricades()
    this.createLighting()
    this.createSigns()
    this.createBanners()
    this.createDust()
    this.createSpawnPoints()
  }

  createMaterials() {
    const { map, rough } = floorTextures()
    this.mats = {
      floor: new THREE.MeshStandardMaterial({ map, roughnessMap: rough, roughness: 0.62, metalness: 0.12, envMapIntensity: 1.35, color: 0xb8bec8 }),
      carpet: new THREE.MeshStandardMaterial({ map: carpetTexture(), roughness: 0.96, metalness: 0, color: 0xb0a8a2 }),
      concrete: new THREE.MeshStandardMaterial({ map: concreteTexture([2, 1]), roughness: 0.9, metalness: 0.03, color: 0x9fa3a8 }),
      tileWall: new THREE.MeshStandardMaterial({ map: tileWallTexture([3, 2]), roughness: 0.55, metalness: 0.1, color: 0xb9c0c4, envMapIntensity: 0.8 }),
      ceiling: new THREE.MeshStandardMaterial({ color: 0x181d23, roughness: 0.94, metalness: 0.08 }),
      darkMetal: new THREE.MeshStandardMaterial({ color: 0x1b2026, roughness: 0.42, metalness: 0.75, envMapIntensity: 1.1 }),
      steel: new THREE.MeshStandardMaterial({ color: 0x585f66, roughness: 0.3, metalness: 0.85, envMapIntensity: 1.2 }),
      brass: new THREE.MeshStandardMaterial({ color: 0x9a7642, roughness: 0.32, metalness: 0.9, envMapIntensity: 1.3 }),
      black: new THREE.MeshStandardMaterial({ color: 0x0c0e11, roughness: 0.5, metalness: 0.4 }),
      glass: new THREE.MeshPhysicalMaterial({ color: 0xa8d8dd, roughness: 0.06, metalness: 0.1, transparent: true, opacity: 0.14, envMapIntensity: 2.2, side: THREE.DoubleSide, depthWrite: false }),
      glassDark: new THREE.MeshPhysicalMaterial({ color: 0x6c8b90, roughness: 0.08, metalness: 0.2, transparent: true, opacity: 0.24, envMapIntensity: 1.8, side: THREE.DoubleSide, depthWrite: false }),
      wood: new THREE.MeshStandardMaterial({ color: 0x4a2f20, roughness: 0.68, metalness: 0.05 }),
      darkWood: new THREE.MeshStandardMaterial({ color: 0x2a1a12, roughness: 0.7, metalness: 0.03 }),
      leaf: new THREE.MeshStandardMaterial({ color: 0x274b32, roughness: 0.85, metalness: 0 }),
      leafLight: new THREE.MeshStandardMaterial({ color: 0x3c6b43, roughness: 0.8, metalness: 0 }),
      fabric: new THREE.MeshStandardMaterial({ color: 0x6b2b2b, roughness: 0.95, metalness: 0 }),
      fabricDark: new THREE.MeshStandardMaterial({ color: 0x24262c, roughness: 0.96, metalness: 0 }),
      storeWarm: new THREE.MeshStandardMaterial({ color: 0x6a5340, roughness: 0.85, metalness: 0.05 }),
      white: new THREE.MeshStandardMaterial({ color: 0xd9d6ce, roughness: 0.65, metalness: 0.02 }),
      redPlastic: new THREE.MeshStandardMaterial({ color: 0x9e1f1c, roughness: 0.4, metalness: 0.1 }),
      mannequin: new THREE.MeshStandardMaterial({ color: 0xcfc8bb, roughness: 0.55, metalness: 0.02 }),
      hazard: new THREE.MeshStandardMaterial({ map: hazardTexture(), roughness: 0.8, metalness: 0.1 }),
      glowWarm: new THREE.MeshBasicMaterial({ color: 0xffe0ac, toneMapped: false }),
      glowCool: new THREE.MeshBasicMaterial({ color: 0xc9eaff, toneMapped: false }),
      glowRed: new THREE.MeshBasicMaterial({ color: 0xff2f24, toneMapped: false }),
      glowTeal: new THREE.MeshBasicMaterial({ color: 0x62ffe9, toneMapped: false }),
      glowMagenta: new THREE.MeshBasicMaterial({ color: 0xff3c9a, toneMapped: false }),
      glowAmber: new THREE.MeshBasicMaterial({ color: 0xffb347, toneMapped: false }),
      glowGreen: new THREE.MeshBasicMaterial({ color: 0x77ff8a, toneMapped: false })
    }
    this.mats.floor.map.needsUpdate = true
    this.bloodMats = [0, 1, 2, 3].map(i => new THREE.MeshBasicMaterial({
      map: bloodTexture(i + 1), transparent: true, opacity: 0.82, depthWrite: false,
      polygonOffset: true, polygonOffsetFactor: -2, color: 0x8d4141
    }))
    this.glowTex = glowTexture()
  }

  createFloors() {
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(46, 94), this.mats.floor)
    floor.rotation.x = -Math.PI / 2
    floor.receiveShadow = true
    floor.userData.impact = 'floor'
    this.group.add(floor)

    const carpet = new THREE.Mesh(new THREE.PlaneGeometry(7.2, 78), this.mats.carpet)
    carpet.rotation.x = -Math.PI / 2
    carpet.position.set(0, 0.012, -4)
    carpet.receiveShadow = true
    this.group.add(carpet)

    const runnerL = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 60), this.mats.carpet)
    runnerL.rotation.x = -Math.PI / 2; runnerL.position.set(-10.5, 0.01, 0)
    const runnerR = runnerL.clone(); runnerR.position.x = 10.5
    this.group.add(runnerL, runnerR)

    const medallion = new THREE.Mesh(new THREE.RingGeometry(3.4, 5.2, 64), new THREE.MeshStandardMaterial({ color: 0x232933, roughness: 0.35, metalness: 0.8, envMapIntensity: 1.2 }))
    medallion.rotation.x = -Math.PI / 2; medallion.position.set(0, 0.018, 2); this.group.add(medallion)
    const medallion2 = new THREE.Mesh(new THREE.RingGeometry(5.3, 5.55, 64), this.mats.brass)
    medallion2.rotation.x = -Math.PI / 2; medallion2.position.set(0, 0.019, 2); this.group.add(medallion2)

    const bloodPositions = [
      [4.2, 7.7, 0.2, 3.1], [-6.5, 3.2, 1.3, 2.6], [9.5, -8.4, 2.4, 4.2], [-2.3, -17, 0.7, 3.4],
      [7.8, 21, 4.8, 5.1], [-11.2, 14, 2.2, 3], [1.2, 31, 5.4, 2.9], [12, -27, 1.1, 4.4],
      [-8, -34, 0.4, 3.6], [14, 4, 3.8, 2.2], [-14.5, -8, 2.7, 3.4]
    ]
    bloodPositions.forEach(([x, z, r, s], i) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(s, s), this.bloodMats[i % this.bloodMats.length])
      m.rotation.x = -Math.PI / 2; m.rotation.z = r; m.position.set(x, 0.024, z)
      this.group.add(m)
    })
  }

  createShell() {
    const wallH = 5.4
    const add = (w, h, d, mat, x, y, z, collide = true, cast = false) => {
      const mesh = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 2, 0.02), mat)
      mesh.position.set(x, y, z)
      mesh.castShadow = cast; mesh.receiveShadow = true
      mesh.userData.impact = true
      this.group.add(mesh)
      if (collide) this.addCollider(x, z, w, d)
      return mesh
    }

    add(46, 0.4, 94, this.mats.ceiling, 0, 14.2, 0, false)
    add(46, wallH, 0.5, this.mats.tileWall, 0, wallH / 2, -46.8, true)
    add(46, wallH, 0.5, this.mats.tileWall, 0, wallH / 2, 46.8, true)
    add(0.5, wallH, 94, this.mats.tileWall, -22.8, wallH / 2, 0, true)
    add(0.5, wallH, 94, this.mats.tileWall, 22.8, wallH / 2, 0, true)

    const corniceMat = this.mats.darkMetal
    for (const z of [-46.2, 46.2]) {
      const c = new THREE.Mesh(new THREE.BoxGeometry(46, 0.36, 0.5), corniceMat)
      c.position.set(0, 5.3, z); this.group.add(c)
    }

    // ceiling beams
    for (let z = -44; z <= 44; z += 8) {
      const beam = new THREE.Mesh(new RoundedBoxGeometry(30, 0.55, 0.5, 2, 0.04), this.mats.darkMetal)
      beam.position.set(0, 13.5, z); beam.receiveShadow = true; this.group.add(beam)
    }
    for (let x = -18; x <= 18; x += 6) {
      const beam = new THREE.Mesh(new RoundedBoxGeometry(0.4, 0.5, 92, 2, 0.04), this.mats.darkMetal)
      beam.position.set(x, 13.5, 0); this.group.add(beam)
    }

    // side walls with lower and upper store bands handled by storefronts
    this.createSkylight()
  }

  createSkylight() {
    const glassMat = new THREE.MeshBasicMaterial({ color: 0x6f9dc4, transparent: true, opacity: 0.1, side: THREE.DoubleSide, depthWrite: false })
    const sky = new THREE.Mesh(new THREE.PlaneGeometry(20, 40), glassMat)
    sky.rotation.x = Math.PI / 2; sky.position.set(0, 14.05, 0); this.group.add(sky)

    const frameMat = this.mats.darkMetal
    for (let z = -20; z <= 20; z += 5) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(20, 0.12, 0.22), frameMat)
      bar.position.set(0, 14, z); this.group.add(bar)
    }
    for (let x = -10; x <= 10; x += 5) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.12, 40), frameMat)
      bar.position.set(x, 14, 0); this.group.add(bar)
    }
    const moon = new THREE.Mesh(new THREE.CircleGeometry(1.6, 32), new THREE.MeshBasicMaterial({ color: 0xdceaff, toneMapped: false }))
    moon.rotation.x = Math.PI / 2; moon.position.set(4.8, 14.01, -5); this.group.add(moon)
    const moonGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.glowTex, color: 0x9dc4ff, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }))
    moonGlow.scale.set(9, 9, 1); moonGlow.position.set(4.8, 13.9, -5); this.group.add(moonGlow)

    const shaftMat = new THREE.ShaderMaterial({
      uniforms: { uColor: { value: new THREE.Color(0x9ec7ff) }, uOpacity: { value: 0.15 } },
      vertexShader: `varying vec2 vUv; varying vec3 vN; varying vec3 vWorld;
        void main(){ vUv = uv; vN = normalize(normalMatrix * normal);
          vec4 wp = modelMatrix * vec4(position, 1.0); vWorld = wp.xyz;
          gl_Position = projectionMatrix * viewMatrix * wp; }`,
      fragmentShader: `varying vec2 vUv; varying vec3 vN; varying vec3 vWorld; uniform vec3 uColor; uniform float uOpacity;
        void main(){ vec3 viewDir = normalize(cameraPosition - vWorld);
          float facing = abs(dot(normalize(vN), viewDir));
          float soft = smoothstep(0.02, 0.55, facing);
          float fade = smoothstep(0.0, 0.55, vUv.y) * (1.0 - smoothstep(0.75, 1.0, vUv.y));
          float a = soft * fade * uOpacity;
          gl_FragColor = vec4(uColor, a); }`,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.BackSide
    })
    for (const [x, z, r] of [[4.8, -5, 7.5], [-5, 9, 6], [7, 15, 5]]) {
      const shaft = new THREE.Mesh(new THREE.ConeGeometry(r, 13.8, 32, 1, true), shaftMat.clone())
      shaft.material.uniforms.uOpacity.value = 0.075
      shaft.position.set(x, 7.1, z); shaft.renderOrder = 4
      this.group.add(shaft)
    }
    this.moonlightShafts = true
  }

  createColumns() {
    const zs = [-40, -28, -16, -4, 8, 20, 32, 42]
    for (const side of [-1, 1]) {
      for (const z of zs) {
        const x = side * 13.6
        const col = new THREE.Mesh(new RoundedBoxGeometry(1.05, 14, 1.05, 3, 0.03), this.mats.concrete)
        col.position.set(x, 7, z); col.castShadow = false; col.receiveShadow = true
        col.userData.impact = true; this.group.add(col)
        const trim = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.18, 1.3), this.mats.brass)
        trim.position.set(x, 3.5, z); this.group.add(trim)
        const trim2 = trim.clone(); trim2.position.y = 9.2; this.group.add(trim2)
        const strip = new THREE.Mesh(new THREE.BoxGeometry(0.045, 4, 0.045), side > 0 ? this.mats.glowTeal : this.mats.glowCool)
        strip.position.set(x - side * 0.54, 6.4, z + 0.4); this.group.add(strip)
        this.addCollider(x, z, 1.05, 1.05)
        if (z === 20 || z === -28) {
          const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 8), this.mats.glowRed)
          lamp.position.set(x, 4.4, z + 0.56); this.group.add(lamp)
          const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.glowTex, color: 0xff3226, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false }))
          glow.scale.set(1.1, 1.1, 1); glow.position.copy(lamp.position); this.group.add(glow)
          this.flickers.push({ mesh: lamp, light: null, glow, base: 0.7, speed: 5 + this.rnd() * 6, phase: this.rnd() * 10 })
        }
      }
    }
  }

  createStorefronts() {
    const stores = [
      { side: -1, z: -40, name: 'VANITY', color: '#ff7fb2', style: 'fashion' },
      { side: -1, z: -26, name: 'TOYBOX', color: '#ffcf4d', style: 'toys' },
      { side: -1, z: -12, name: 'PHARMACY', color: '#71ff9a', style: 'pharmacy' },
      { side: -1, z: 6, name: 'URBAN', color: '#8fd0ff', style: 'fashion' },
      { side: -1, z: 20, name: 'JEWEL BOX', color: '#ffe6a0', style: 'jewel' },
      { side: -1, z: 34, name: 'CAFÉ NOIR', color: '#ff9c62', style: 'cafe' },
      { side: 1, z: -40, name: 'SPORTSWORLD', color: '#8dff6b', style: 'sports' },
      { side: 1, z: -26, name: 'GAME OVER', color: '#ff4fd2', style: 'arcade' },
      { side: 1, z: -12, name: 'FOOD COURT', color: '#5fffe3', style: 'food' },
      { side: 1, z: 6, name: 'TEChNOIR', color: '#7ea7ff', style: 'tech' },
      { side: 1, z: 20, name: 'CINEMA 8', color: '#ffb347', style: 'cinema' },
      { side: 1, z: 34, name: 'SHOE DEPT.', color: '#ffd16e', style: 'shoes' }
    ]
    for (const s of stores) this.createStorefront(s)
  }

  createStorefront(store) {
    const { side, z, name, color, style } = store
    const x = side * 18
    const w = 11.4, h = 5.4
    const back = side * 24.4

    // dark recessed interior
    const interior = new THREE.Mesh(new THREE.BoxGeometry(12.6, 5.2, w), new THREE.MeshStandardMaterial({ color: 0x12151a, roughness: 0.9, metalness: 0.05 }))
    interior.position.set(side * 21.2, 2.6, z)
    this.group.add(interior)
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(w, 5.2), new THREE.MeshStandardMaterial({ color: 0x1d222a, roughness: 0.85 }))
    backWall.position.set(back, 2.6, z)
    backWall.rotation.y = side > 0 ? -Math.PI / 2 : Math.PI / 2
    this.group.add(backWall)

    // frame bands
    const bandTop = new THREE.Mesh(new RoundedBoxGeometry(0.5, 1.45, w, 2, 0.02), new THREE.MeshStandardMaterial({ color: 0x15181e, roughness: 0.5, metalness: 0.5 }))
    bandTop.position.set(x, 4.68, z); this.group.add(bandTop)
    const bandBottom = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.34, w), this.mats.darkMetal)
    bandBottom.position.set(x, 0.17, z); this.group.add(bandBottom)
    for (const zz of [z - w / 2, z + w / 2]) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.6, 5.2, 0.34), this.mats.darkMetal)
      post.position.set(x, 2.6, zz); this.group.add(post)
    }
    // glass storefront in two panes with a door gap
    for (const off of [-2.9, 2.9]) {
      const glass = new THREE.Mesh(new THREE.PlaneGeometry(4.9, 3.9), this.mats.glass)
      glass.rotation.y = side > 0 ? -Math.PI / 2 : Math.PI / 2
      glass.position.set(x - side * 0.04, 2.15, z + off)
      glass.userData.impact = false
      this.group.add(glass)
    }
    const doorFrame = new THREE.Group()
    for (const [dx, dz, sw, sd] of [[0, -0.7, 0.06, 0.1], [0, 0.7, 0.06, 0.1], [0, 0, 0.08, 0.06]]) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(sw, 3.9, sd), this.mats.steel)
      bar.position.set(x, 2.15, z + dz); doorFrame.add(bar)
    }
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.9, 0.06), this.mats.brass)
    handle.position.set(x - side * 0.08, 1.5, z + 0.48); doorFrame.add(handle)
    this.group.add(doorFrame)

    this.addStoreSign(name, color, side, z, 4.68)
    this.addInterior(style, side, z, color)
    this.addCollider(x, z, 1.4, w)

    // interior light strip
    const strip = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, w - 1.6), new THREE.MeshBasicMaterial({ color: 0xffe2b0, toneMapped: false }))
    strip.position.set(side * 22.6, 5.05, z)
    this.group.add(strip)

    // grime / handprints on glass
    if (this.rnd() > 0.45) {
      const hand = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 1.2), this.bloodMats[this.rnd() > .5 ? 1 : 3])
      hand.rotation.y = side > 0 ? -Math.PI / 2 : Math.PI / 2
      hand.position.set(x - side * 0.07, 1.8, z + (this.rnd() - .5) * 6)
      this.group.add(hand)
    }
  }

  addStoreSign(name, color, side, z, y) {
    const tex = signTexture(name, { color, fontSize: name.length > 9 ? 86 : 104, letterSpacing: 5, background: 'rgba(8,10,14,0.96)' })
    const mat = new THREE.MeshBasicMaterial({ map: tex, toneMapped: false })
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(6.6, 1.32), mat)
    sign.rotation.y = side > 0 ? -Math.PI / 2 : Math.PI / 2
    sign.position.set(side * 17.66, y, z)
    this.group.add(sign)
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.glowTex, color: new THREE.Color(color), transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending, depthWrite: false }))
    glow.scale.set(7, 2.6, 1)
    glow.position.set(side * 17.4, y, z)
    this.group.add(glow)
    this.glowSprites.push(glow)
  }

  addInterior(style, side, z, color) {
    const x = side * 21
    const mat = (c, r = 0.8, m = 0.05) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m })
    if (style === 'arcade') {
      for (let i = 0; i < 5; i++) {
        const cab = new THREE.Group()
        const body = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.85, 0.8), mat(0x16171c, 0.5, 0.4))
        body.position.y = 0.93; cab.add(body)
        const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.78, 0.58), new THREE.MeshBasicMaterial({ color: i % 2 ? 0xff3ca6 : 0x48f0e0, toneMapped: false }))
        screen.position.set(0, 1.28, -0.41); screen.rotation.y = Math.PI; cab.add(screen)
        const marquee = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.24), new THREE.MeshBasicMaterial({ color: i % 2 ? 0xffd05a : 0x5ab6ff, toneMapped: false }))
        marquee.position.set(0, 1.93, -0.41); marquee.rotation.y = Math.PI; cab.add(marquee)
        cab.position.set(x + side * (i % 2) * 0.4, 0, z - 3.8 + i * 1.9)
        cab.rotation.y = side > 0 ? -0.12 : 0.12
        this.group.add(cab)
      }
      const light = new THREE.PointLight(0xff3ca6, 55, 12, 2)
      light.position.set(side * 20.6, 3, z); this.group.add(light)
      this.flickers.push({ light, base: 55, speed: 9, phase: 2 })
    } else if (style === 'food') {
      for (let i = 0; i < 4; i++) {
        const table = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.06, 16), mat(0x9a8062, 0.45, 0.2))
        table.position.set(x + side * (i % 2) * 0.8, 0.75, z - 3.4 + i * 2.1); this.group.add(table)
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.75, 8), this.mats.steel)
        leg.position.set(table.position.x, 0.37, table.position.z); this.group.add(leg)
        for (const a of [0, Math.PI]) {
          const seat = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 0.5), this.mats.redPlastic)
          seat.position.set(table.position.x + Math.cos(a + (side > 0 ? 0 : Math.PI)) * 0.85, 0.48, table.position.z + Math.sin(a) * 0.85)
          this.group.add(seat)
        }
      }
      const light = new THREE.PointLight(0x5fffe3, 45, 11, 2)
      light.position.set(side * 20.4, 3.1, z); this.group.add(light)
    } else if (style === 'cinema') {
      const screen = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 2.2), new THREE.MeshBasicMaterial({ color: 0x9db7ff, toneMapped: false, transparent: true, opacity: 0.5 }))
      screen.rotation.y = side > 0 ? -Math.PI / 2 : Math.PI / 2
      screen.position.set(side * 23.8, 3.1, z); this.group.add(screen)
      const light = new THREE.PointLight(0x8aa6ff, 45, 12, 2)
      light.position.set(side * 20.4, 3, z); this.group.add(light)
      this.flickers.push({ light, base: 45, speed: 13, phase: 5 })
    } else if (style === 'fashion') {
      for (let i = 0; i < 3; i++) {
        const man = this.makeMannequin(side > 0 ? 0x2a2e36 : 0x6d4a3c)
        man.position.set(x + side * 0.5, 0, z - 2.8 + i * 2.6)
        man.rotation.y = side > 0 ? -0.4 : 0.4
        this.group.add(man)
      }
      const rack = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 3.4, 8), this.mats.steel)
      rack.rotation.z = Math.PI / 2; rack.rotation.y = Math.PI / 2
      rack.position.set(x - side * 1.4, 1.85, z + 2.2); this.group.add(rack)
    } else if (style === 'sports') {
      for (let i = 0; i < 4; i++) {
        const b = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.08, 0.5), mat(0x24282e, 0.7))
        b.position.set(x, 0.4 + i * 0.55, z - 2.5 + i * 1.6); this.group.add(b)
        const ball = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 8), mat(i % 2 ? 0xd56a2a : 0xcfc7b0, 0.6))
        ball.position.set(x - side * 0.5, 0.75 + i * 0.55, z - 2.5 + i * 1.6); this.group.add(ball)
      }
    } else if (style === 'pharmacy') {
      for (let i = 0; i < 3; i++) {
        const shelf = new THREE.Mesh(new THREE.BoxGeometry(0.6, 2.3, 2.4), mat(0xcfcabe, 0.7))
        shelf.position.set(x + side * 1.1, 1.15, z - 2.4 + i * 2.4); this.group.add(shelf)
      }
      const cross = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 1.5), new THREE.MeshBasicMaterial({ color: 0x5cff7c, toneMapped: false }))
      cross.rotation.y = side > 0 ? -Math.PI / 2 : Math.PI / 2
      cross.position.set(side * 23.9, 3.5, z); this.group.add(cross)
    } else if (style === 'toys') {
      for (let i = 0; i < 6; i++) {
        const box = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), mat([0xe23b32, 0x2f7de2, 0xf0c33c, 0x2fae63][i % 4], 0.6))
        box.position.set(x + (this.rnd() - .5) * 2, 0.4 + (i % 2) * 0.6, z - 3.4 + i * 1.2)
        box.rotation.set(this.rnd(), this.rnd() * 3, this.rnd())
        this.group.add(box)
      }
    } else if (style === 'jewel') {
      const caseMat = new THREE.MeshStandardMaterial({ color: 0x2a2118, roughness: 0.25, metalness: 0.7, envMapIntensity: 1.4 })
      for (let i = 0; i < 3; i++) {
        const c = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.9, 1.5), caseMat)
        c.position.set(x, 0.45, z - 1.8 + i * 1.8); this.group.add(c)
        const glow = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.05, 1.3), this.mats.glowWarm)
        glow.position.set(x - side * 0.42, 0.9, z - 1.8 + i * 1.8); this.group.add(glow)
      }
    } else if (style === 'tech') {
      for (let i = 0; i < 5; i++) {
        const tv = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.9, 1.5), this.mats.black)
        tv.position.set(x, 2 + (i % 2) * 0.9, z - 3 + i * 1.5); this.group.add(tv)
        const scr = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 0.72), new THREE.MeshBasicMaterial({ color: i % 2 ? 0x4f8dff : 0x50e8d0, toneMapped: false, transparent: true, opacity: 0.75 }))
        scr.rotation.y = side > 0 ? -Math.PI / 2 : Math.PI / 2
        scr.position.set(x - side * 0.08, 2 + (i % 2) * 0.9, z - 3 + i * 1.5); this.group.add(scr)
      }
    } else if (style === 'shoes') {
      for (let i = 0; i < 5; i++) {
        const b = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.1, 0.4), mat(0x2b2a2c, 0.7))
        b.position.set(x, 0.4 + i * 0.4, z + 1); this.group.add(b)
      }
    } else if (style === 'cafe') {
      const counter = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.1, 4), mat(0x4a3224, 0.5))
      counter.position.set(x, 0.55, z + 1); this.group.add(counter)
      for (let i = 0; i < 3; i++) {
        const stool = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.3, 0.08, 12), this.mats.redPlastic)
        stool.position.set(x - side * 1.1, 0.62, z - 1 + i * 1.2); this.group.add(stool)
      }
      const light = new THREE.PointLight(0xff9c62, 38, 11, 2)
      light.position.set(side * 20.2, 3, z); this.group.add(light)
    }
  }

  makeMannequin(color) {
    const g = new THREE.Group()
    const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.05 })
    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 0.55, 4, 8), mat); torso.position.y = 1.18; g.add(torso)
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 10), this.mats.mannequin); head.position.y = 1.68; g.add(head)
    const legs = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.07, 0.85, 8), mat); legs.position.y = 0.45; g.add(legs)
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 0.05, 12), this.mats.darkMetal); base.position.y = 0.03; g.add(base)
    g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true } })
    return g
  }

  createUpperLevel() {
    const slabMat = this.mats.concrete
    for (const side of [-1, 1]) {
      const slab = new THREE.Mesh(new RoundedBoxGeometry(8.6, 0.42, 92, 2, 0.03), slabMat)
      slab.position.set(side * 18.1, 5.45, 0); slab.receiveShadow = true; this.group.add(slab)
      const fascia = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.7, 92), this.mats.darkMetal)
      fascia.position.set(side * 13.8, 5.2, 0); this.group.add(fascia)

      // glass railing
      const railGlass = new THREE.Mesh(new THREE.PlaneGeometry(92, 1.05), this.mats.glass)
      railGlass.rotation.y = Math.PI / 2; railGlass.position.set(side * 13.9, 6.15, 0); this.group.add(railGlass)
      const railTop = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.09, 92), this.mats.steel)
      railTop.position.set(side * 13.9, 6.7, 0); this.group.add(railTop)
      for (let z = -45; z <= 45; z += 3) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.1, 0.05), this.mats.steel)
        post.position.set(side * 13.9, 6.15, z); this.group.add(post)
      }
      this.addCollider(side * 13.9, 0, 0.3, 92)

      // upper storefront band facades (visual only)
      for (let i = 0; i < 6; i++) {
        const z = -38 + i * 15
        const facade = new THREE.Mesh(new RoundedBoxGeometry(0.5, 4.6, 12.4, 2, 0.02), new THREE.MeshStandardMaterial({ color: i % 2 ? 0x1a1f26 : 0x20252d, roughness: 0.7, metalness: 0.2 }))
        facade.position.set(side * 18.2, 8.1, z); this.group.add(facade)
        const glass = new THREE.Mesh(new THREE.PlaneGeometry(11.6, 3.2), this.mats.glassDark)
        glass.rotation.y = side > 0 ? -Math.PI / 2 : Math.PI / 2
        glass.position.set(side * 17.92, 8.2, z); this.group.add(glass)
        const sign = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 0.8), new THREE.MeshBasicMaterial({
          map: signTexture(['OBSIDIAN', 'LUMEN', 'NORTHFACE', 'PULSE', 'AURUM', 'VERTIGO'][i], { color: ['#cfd8e0', '#80e8ff', '#ffd37a', '#ff6aa8', '#e9d18a', '#a0b4ff'][i], fontSize: 82, letterSpacing: 6 }), toneMapped: false
        }))
        sign.rotation.y = side > 0 ? -Math.PI / 2 : Math.PI / 2
        sign.position.set(side * 17.9, 10.2, z); this.group.add(sign)
        const strip = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 11.4), new THREE.MeshBasicMaterial({ color: 0xffe3b3, toneMapped: false }))
        strip.position.set(side * 17.8, 6.55, z); this.group.add(strip)
      }
      const upperWall = new THREE.Mesh(new THREE.BoxGeometry(0.5, 8.6, 92), this.mats.tileWall)
      upperWall.position.set(side * 22.8, 9.7, 0); this.group.add(upperWall)

      // end caps upper
      const cap = new THREE.Mesh(new THREE.BoxGeometry(9, 8.6, 0.5), this.mats.tileWall)
      cap.position.set(side * 18.1, 9.7, -46.1); this.group.add(cap)
      const cap2 = cap.clone(); cap2.position.z = 46.1; this.group.add(cap2)
    }
    const upperCeiling = new THREE.Mesh(new THREE.BoxGeometry(46, 0.3, 94), this.mats.ceiling)
    upperCeiling.position.set(0, 14.1, 0); this.group.add(upperCeiling)
  }

  createCinema() {
    const z = -46.1
    const wall = new THREE.Mesh(new THREE.BoxGeometry(28, 13, 0.5), new THREE.MeshStandardMaterial({ color: 0x14181e, roughness: 0.8 }))
    wall.position.set(0, 6.5, z); wall.receiveShadow = true; this.group.add(wall)

    // entrance recess
    const recess = new THREE.Mesh(new THREE.BoxGeometry(13, 6.2, 0.8), this.mats.black)
    recess.position.set(0, 3.1, z + 0.4); this.group.add(recess)
    const curtainMat = new THREE.MeshStandardMaterial({ color: 0x571418, roughness: 0.95, side: THREE.DoubleSide })
    for (const x of [-5.6, 5.6]) {
      const curtain = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 5.4), curtainMat)
      curtain.position.set(x, 2.8, z + 0.85); this.group.add(curtain)
    }
    const doors = new THREE.Mesh(new THREE.PlaneGeometry(7.6, 4.2), this.mats.glassDark)
    doors.position.set(0, 2.4, z + 0.86); this.group.add(doors)
    for (const x of [-3.8, 0, 3.8]) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.1, 4.4, 0.12), this.mats.steel)
      bar.position.set(x, 2.4, z + 0.9); this.group.add(bar)
    }

    const marqueeTex = signTexture('CINEMA 8', { color: '#ffbe5c', fontSize: 132, letterSpacing: 8, sub: 'NOW SHOWING · DAWN OF THE DEAD', background: 'rgba(10,8,8,0.98)' })
    const marquee = new THREE.Mesh(new THREE.PlaneGeometry(15, 3.75), new THREE.MeshBasicMaterial({ map: marqueeTex, toneMapped: false }))
    marquee.position.set(0, 8.9, z + 0.32); this.group.add(marquee)
    const marqueeGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.glowTex, color: 0xffb347, transparent: true, opacity: 0.34, blending: THREE.AdditiveBlending, depthWrite: false }))
    marqueeGlow.scale.set(18, 6, 1); marqueeGlow.position.set(0, 8.9, z + 0.9); this.group.add(marqueeGlow)
    const cinemaLight = new THREE.PointLight(0xffb347, 150, 28, 2)
    cinemaLight.position.set(0, 8.4, z + 3.2); this.group.add(cinemaLight)
    this.flickers.push({ light: cinemaLight, base: 150, speed: 2.2, phase: 1 })

    // poster frames
    for (let i = 0; i < 3; i++) {
      for (const side of [-1, 1]) {
        const frame = new THREE.Mesh(new THREE.BoxGeometry(2.15, 3.1, 0.16), this.mats.darkMetal)
        frame.position.set(side * (8.8 + i * 2.5), 5.2, z + 0.35); this.group.add(frame)
        const poster = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 2.85), new THREE.MeshBasicMaterial({ map: posterTexture((i + (side > 0 ? 2 : 0)) % 4), toneMapped: false }))
        poster.position.set(side * (8.8 + i * 2.5), 5.2, z + 0.45); this.group.add(poster)
      }
    }
    // ticket booth + ropes
    const booth = new THREE.Mesh(new RoundedBoxGeometry(3, 2.4, 1.6, 2, 0.04), this.mats.darkWood)
    booth.position.set(9.5, 1.2, z + 2.4); this.group.add(booth)
    this.addCollider(9.5, z + 2.4, 3, 1.6)
    const boothTop = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.2, 1.9), this.mats.brass)
    boothTop.position.set(9.5, 2.5, z + 2.4); this.group.add(boothTop)
    for (const side of [-1, 1]) {
      for (let i = 0; i < 4; i++) {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.95, 8), this.mats.brass)
        post.position.set(side * (3 + i * 2.6), 0.5, z + 4.2); this.group.add(post)
      }
      const rope = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 7.8, 8), new THREE.MeshStandardMaterial({ color: 0x7a1520, roughness: 0.9 }))
      rope.rotation.z = Math.PI / 2; rope.position.set(side * (6.9), 0.92, z + 4.2); this.group.add(rope)
    }
  }

  createEntrance() {
    const z = 46.1
    const glassMat = this.mats.glassDark
    const wall = new THREE.Mesh(new THREE.BoxGeometry(30, 12, 0.5), new THREE.MeshStandardMaterial({ color: 0x151a20, roughness: 0.8 }))
    wall.position.set(0, 6, z); wall.receiveShadow = true; this.group.add(wall)
    const door = new THREE.Mesh(new THREE.PlaneGeometry(12, 6), glassMat)
    door.rotation.y = Math.PI; door.position.set(0, 3, z - 0.32); this.group.add(door)
    for (const x of [-6, -2, 2, 6]) {
      const frame = new THREE.Mesh(new THREE.BoxGeometry(0.18, 6.2, 0.3), this.mats.steel)
      frame.position.set(x, 3.1, z - 0.4); this.group.add(frame)
    }
    const beam = new THREE.Mesh(new THREE.BoxGeometry(13, 0.24, 0.4), this.mats.steel)
    beam.position.set(0, 6.1, z - 0.4); this.group.add(beam)

    // boards across the doors
    for (let i = 0; i < 4; i++) {
      const board = new THREE.Mesh(new THREE.BoxGeometry(14 - i * 0.6, 0.34, 0.09), this.mats.darkWood)
      board.position.set(0, 1.1 + i * 1.15, z - 0.52); board.rotation.z = (i % 2 ? 1 : -1) * 0.035
      this.group.add(board)
    }
    const tapeMat = new THREE.MeshBasicMaterial({ color: 0xe6c322, transparent: true, opacity: 0.92, side: THREE.DoubleSide })
    for (let i = 0; i < 2; i++) {
      const tape = new THREE.Mesh(new THREE.PlaneGeometry(15, 0.16), tapeMat)
      tape.position.set(0, 2.2 + i * 1.4, z - 0.58); tape.rotation.z = 0.12 - i * 0.2
      tape.material = tapeMat.clone()
      this.group.add(tape)
    }
    const exit = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.9), new THREE.MeshBasicMaterial({ map: signTexture('EXIT', { color: '#ff3a30', fontSize: 150, letterSpacing: 10, background: 'rgba(10,4,4,0.96)' }), toneMapped: false }))
    exit.position.set(0, 7.4, z - 0.3); exit.rotation.y = Math.PI; this.group.add(exit)
    const exitGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.glowTex, color: 0xff2f24, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending, depthWrite: false }))
    exitGlow.scale.set(4, 2.4, 1); exitGlow.position.set(0, 7.4, z - 0.5); this.group.add(exitGlow)

    const banner = new THREE.Mesh(new THREE.PlaneGeometry(11, 2.4), new THREE.MeshBasicMaterial({ map: signTexture('SHOP UNTIL YOU DROP', { color: '#efe9df', fontSize: 82, letterSpacing: 4, background: 'rgba(12,10,10,0.96)' }), toneMapped: false }))
    banner.position.set(0, 9.4, z - 0.3); banner.rotation.y = Math.PI; this.group.add(banner)
  }

  createAtrium() {
    // dry fountain
    const stone = new THREE.MeshStandardMaterial({ color: 0x2f343b, roughness: 0.6, metalness: 0.15 })
    const base = new THREE.Mesh(new THREE.CylinderGeometry(3.7, 3.9, 0.55, 48), stone)
    base.position.set(0, 0.28, 2); base.receiveShadow = true; base.castShadow = true; base.userData.impact = true; this.group.add(base)
    this.addCollider(0, 2, 7.6, 7.6)
    const inner = new THREE.Mesh(new THREE.CylinderGeometry(3.1, 3.3, 0.5, 48), new THREE.MeshStandardMaterial({ color: 0x1e2228, roughness: 0.35, metalness: 0.4 }))
    inner.position.set(0, 0.42, 2); this.group.add(inner)
    const water = new THREE.Mesh(new THREE.CircleGeometry(3.05, 48), new THREE.MeshStandardMaterial({ color: 0x0a1114, roughness: 0.06, metalness: 0.85, envMapIntensity: 2 }))
    water.rotation.x = -Math.PI / 2; water.position.set(0, 0.58, 2); this.group.add(water)
    const center = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.2, 1.4, 24), stone)
    center.position.set(0, 1.25, 2); center.userData.impact = true; this.group.add(center)
    for (let i = 0; i < 3; i++) {
      const tier = new THREE.Mesh(new THREE.CylinderGeometry(1.6 - i * 0.4, 1.7 - i * 0.4, 0.2, 24), stone)
      tier.position.set(0, 0.9 + i * 0.5, 2); this.group.add(tier)
    }
    const statue = this.makeMannequin(0x2c333b)
    statue.scale.set(1.3, 1.3, 1.3); statue.position.set(0, 2.1, 2); this.group.add(statue)
    const fountainLight = new THREE.PointLight(0x77b7d6, 70, 16, 2)
    fountainLight.position.set(0, 3.5, 2); this.group.add(fountainLight)

    // planter boxes
    const planterPositions = [[-10.5, -20], [10.5, -5], [-10.5, 26], [10.5, 30], [-10.5, 2], [10.5, -35]]
    for (const [x, z] of planterPositions) this.createPlanter(x, z)

    // benches
    for (const [x, z, ry] of [[-9, 12, 0], [9, 14, Math.PI], [-9.5, -10, 0], [9.5, -18, Math.PI], [-8, 36, Math.PI / 2], [8, -38, -Math.PI / 2]]) {
      this.createBench(x, z, ry)
    }

    // kiosks
    this.createKiosk(-7.4, 22, 0xff8a3c)
    this.createKiosk(8.2, 10, 0x54d6ff)
    this.createKiosk(-6.8, -26, 0xd0d4da)

    // directory stand
    const dir = new THREE.Mesh(new THREE.BoxGeometry(0.16, 2.6, 1.5), this.mats.darkMetal)
    dir.position.set(10.8, 1.3, 1); this.group.add(dir)
    const dirScreen = new THREE.Mesh(new THREE.PlaneGeometry(1.35, 2.2), new THREE.MeshBasicMaterial({ map: directoryTexture(), toneMapped: false }))
    dirScreen.rotation.y = -Math.PI / 2; dirScreen.position.set(10.7, 1.45, 1); this.group.add(dirScreen)
    this.addCollider(10.8, 1, 0.5, 1.5)

    // shopping carts
    for (const [x, z, ry] of [[-4.2, 28, 0.5], [6.3, -14, -1.2], [11, 27, 2.2]]) {
      this.createCart(x, z, ry)
    }
  }

  createPlanter(x, z) {
    const pot = new THREE.Mesh(new RoundedBoxGeometry(2.5, 0.9, 2.5, 2, 0.05), this.mats.concrete)
    pot.position.set(x, 0.45, z); pot.castShadow = true; pot.receiveShadow = true; pot.userData.impact = true
    this.group.add(pot)
    const soil = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.08, 2.2), new THREE.MeshStandardMaterial({ color: 0x1b140e, roughness: 1 }))
    soil.position.set(x, 0.92, z); this.group.add(soil)
    const rnd = this.rnd
    for (let i = 0; i < 7; i++) {
      const h = 1.1 + rnd() * 1.8
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.06, h, 5), this.mats.darkWood)
      trunk.position.set(x + (rnd() - .5) * 1.1, 0.9 + h / 2, z + (rnd() - .5) * 1.1)
      trunk.rotation.z = (rnd() - .5) * 0.35; trunk.rotation.x = (rnd() - .5) * 0.35
      this.group.add(trunk)
      for (let j = 0; j < 3; j++) {
        const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.35 + rnd() * 0.3, 0.7 + rnd() * 0.6, 6), rnd() > .5 ? this.mats.leaf : this.mats.leafLight)
        leaf.position.set(trunk.position.x + (rnd() - .5) * .5, 0.9 + h * (0.6 + rnd() * .4), trunk.position.z + (rnd() - .5) * .5)
        leaf.rotation.set(rnd(), rnd(), rnd()); leaf.castShadow = true
        this.group.add(leaf)
      }
    }
    this.addCollider(x, z, 2.5, 2.5)
  }

  createBench(x, z, ry) {
    const g = new THREE.Group()
    const seat = new THREE.Mesh(new RoundedBoxGeometry(3.2, 0.16, 0.9, 2, 0.04), this.mats.wood)
    seat.position.y = 0.55; seat.castShadow = true; g.add(seat)
    const back = new THREE.Mesh(new RoundedBoxGeometry(3.2, 0.75, 0.14, 2, 0.04), this.mats.wood)
    back.position.set(0, 0.95, 0.4); back.rotation.x = -0.12; g.add(back)
    for (const dx of [-1.25, 1.25]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.55, 0.72), this.mats.darkMetal)
      leg.position.set(dx, 0.28, 0); g.add(leg)
    }
    g.position.set(x, 0, z); g.rotation.y = ry
    g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; o.userData.impact = true } })
    this.group.add(g)
    this.addCollider(x, z, Math.abs(Math.cos(ry)) * 3.2 + Math.abs(Math.sin(ry)) * 0.9, Math.abs(Math.sin(ry)) * 3.2 + Math.abs(Math.cos(ry)) * 0.9)
  }

  createKiosk(x, z, color) {
    const g = new THREE.Group()
    const body = new THREE.Mesh(new RoundedBoxGeometry(2.6, 1.05, 1.6, 2, 0.05), this.mats.darkMetal)
    body.position.y = 0.55; body.castShadow = true; g.add(body)
    const top = new THREE.Mesh(new RoundedBoxGeometry(2.9, 0.12, 1.9, 2, 0.03), this.mats.steel)
    top.position.y = 1.12; g.add(top)
    const canopy = new THREE.Mesh(new THREE.BoxGeometry(3, 0.1, 2), new THREE.MeshStandardMaterial({ color, roughness: 0.5 }))
    canopy.position.y = 2.5; g.add(canopy)
    for (const dx of [-1.2, 1.2]) for (const dz of [-0.7, 0.7]) {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.4, 8), this.mats.steel)
      pole.position.set(dx, 1.8, dz); g.add(pole)
    }
    const lightStrip = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.05, 1.7), new THREE.MeshBasicMaterial({ color: 0xffedc4, toneMapped: false }))
    lightStrip.position.y = 2.42; g.add(lightStrip)
    const signColor = '#' + new THREE.Color(color).getHexString()
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 0.5), new THREE.MeshBasicMaterial({ map: signTexture(['PRETZEL', 'PHONE CASE', 'SUNGLASSES'][Math.floor(this.rnd() * 3)], { color: signColor, fontSize: 120, letterSpacing: 4 }), toneMapped: false }))
    sign.position.set(0, 2.0, 0.86); g.add(sign)
    g.position.set(x, 0, z)
    g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; o.userData.impact = true } })
    this.group.add(g)
    this.addCollider(x, z, 2.9, 1.9)
  }

  createCart(x, z, ry) {
    const g = new THREE.Group()
    const wire = new THREE.MeshStandardMaterial({ color: 0x8b9197, roughness: 0.35, metalness: 0.85, side: THREE.DoubleSide })
    const basket = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.62, 0.75), wire)
    basket.position.y = 0.85; g.add(basket)
    for (let i = 0; i < 5; i++) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(1.12, 0.02, 0.02), this.mats.steel)
      bar.position.set(0, 0.6 + i * 0.12, 0.38); g.add(bar)
    }
    const handle = new THREE.Mesh(new THREE.BoxGeometry(1.14, 0.05, 0.05), this.mats.steel)
    handle.position.set(0, 1.05, 0.62); g.add(handle)
    for (const dx of [-0.4, 0.4]) for (const dz of [-0.25, 0.25]) {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.05, 10), this.mats.black)
      wheel.rotation.z = Math.PI / 2; wheel.position.set(dx, 0.08, dz); g.add(wheel)
    }
    g.position.set(x, 0, z); g.rotation.y = ry
    this.group.add(g)
    this.addCollider(x, z, 1.2, 1.2)
  }

  createProps() {
    // trash bins
    for (const [x, z] of [[-12.4, 8], [12.4, -22], [-12.4, -34], [12.4, 38]]) {
      const bin = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.36, 1, 12), this.mats.darkMetal)
      bin.position.set(x, 0.5, z); bin.castShadow = true; bin.userData.impact = true; this.group.add(bin)
      const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.08, 12), this.mats.steel)
      lid.position.set(x, 1.03, z); this.group.add(lid)
      this.addCollider(x, z, 0.9, 0.9)
    }
    // stanchions / queue posts
    for (let i = 0; i < 5; i++) {
      const x = 4.5, z = -2 + i * 2.5
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.95, 8), this.mats.brass)
      post.position.set(x, 0.5, z); this.group.add(post)
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 0.05, 12), this.mats.darkMetal)
      base.position.set(x, 0.03, z); this.group.add(base)
    }
    // fallen letters
    for (let i = 0; i < 4; i++) {
      const letter = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.16, 0.6), this.mats.redPlastic)
      letter.position.set(-2 + i * 1.3, 0.1, 17 + i * 0.6); letter.rotation.set(0.02, i * 1.1, 0.02)
      this.group.add(letter)
    }
    // cardboard boxes
    for (let i = 0; i < 9; i++) {
      const s = 0.4 + this.rnd() * 0.5
      const box = new THREE.Mesh(new THREE.BoxGeometry(s, s * 0.8, s * 0.9), new THREE.MeshStandardMaterial({ color: 0x6b5439, roughness: 0.95 }))
      box.position.set(-14 + this.rnd() * 28, s * 0.4, -30 + this.rnd() * 64)
      box.rotation.y = this.rnd() * 3; box.castShadow = true
      this.group.add(box)
    }
    // wet floor sign
    const sign = new THREE.Group()
    const panel = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.75, 0.04), new THREE.MeshStandardMaterial({ color: 0xd7b52e, roughness: 0.6 }))
    panel.rotation.x = 0.18; panel.position.y = 0.42; sign.add(panel)
    const panel2 = panel.clone(); panel2.rotation.x = -0.18; panel2.position.z = -0.18; sign.add(panel2)
    sign.position.set(6.5, 0, 24); sign.rotation.y = 0.6; this.group.add(sign)
  }

  createBarricades() {
    // police tape across the south doors
    const tapeMat = new THREE.MeshBasicMaterial({ color: 0xe6c322, transparent: true, opacity: 0.9, side: THREE.DoubleSide })
    for (let i = 0; i < 2; i++) {
      const tape = new THREE.Mesh(new THREE.PlaneGeometry(13, 0.13), tapeMat)
      tape.position.set(0, 1.2 + i * 2.2, 44.5); tape.rotation.z = i ? -0.08 : 0.1
      this.group.add(tape)
    }
    // stacked furniture barricade near the east service door
    for (let i = 0; i < 4; i++) {
      const chair = new THREE.Mesh(new RoundedBoxGeometry(0.65, 0.1, 0.65, 2, 0.03), this.mats.wood)
      chair.position.set(15.5 + (i % 2) * 0.2, 0.3 + i * 0.28, 12 + (i % 2) * 0.4)
      chair.rotation.set(this.rnd() * 0.4, this.rnd() * 2, this.rnd() * 0.4)
      this.group.add(chair)
    }
    this.addCollider(15.5, 12, 1.2, 1.2)
    // hazard tape on escalator
    const hz = new THREE.Mesh(new THREE.PlaneGeometry(8, 0.5), this.mats.hazard)
    hz.rotation.x = -Math.PI / 2; hz.position.set(-9.5, 0.03, -37.5); this.group.add(hz)
  }

  createEscalators() {
    // intentionally subtle visual escalators at the north end
    for (const side of [-1, 1]) {
      const base = new THREE.Group()
      const body = new THREE.Mesh(new RoundedBoxGeometry(3.2, 0.5, 13, 2, 0.05), this.mats.darkMetal)
      body.position.set(0, 0.25, 0); body.rotation.x = -0.36; base.add(body)
      const railMat = this.mats.glassDark
      for (const dx of [-1.5, 1.5]) {
        const rail = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1, 13), railMat)
        rail.position.set(dx, 0.9, 0); rail.rotation.x = -0.36; base.add(rail)
      }
      const steps = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.08, 12.8), this.mats.steel)
      steps.position.set(0, 0.55, 0); steps.rotation.x = -0.36; base.add(steps)
      base.position.set(side * 9.8, 0, -35)
      this.group.add(base)
      this.addCollider(side * 9.8, -35, 3.4, 12)
    }
  }

  createLighting() {
    const hemi = new THREE.HemisphereLight(0x9fb8d4, 0x241a12, 0.9)
    this.group.add(hemi)
    const moon = new THREE.DirectionalLight(0xa9caff, 2.8)
    moon.position.set(12, 27, 6)
    moon.target.position.set(0, 0, -6)
    moon.castShadow = true
    moon.shadow.mapSize.set(2048, 2048)
    moon.shadow.camera.left = -34; moon.shadow.camera.right = 34
    moon.shadow.camera.top = 46; moon.shadow.camera.bottom = -46
    moon.shadow.camera.near = 1; moon.shadow.camera.far = 70
    moon.shadow.bias = -0.0006
    moon.shadow.normalBias = 0.045
    this.group.add(moon, moon.target)
    this.moonLight = moon

    const warmZs = [-34, -12, 12, 34]
    for (const z of warmZs) {
      const light = new THREE.PointLight(0xffcb8a, 210, 38, 2)
      light.position.set(0, 9.5, z)
      this.group.add(light)
    }
    const teal = new THREE.PointLight(0x5fffe3, 85, 24, 2)
    teal.position.set(16, 4.5, -12); this.group.add(teal)
    const magenta = new THREE.PointLight(0xff3c9a, 70, 20, 2)
    magenta.position.set(16, 4.5, -26); this.group.add(magenta)

    // ceiling fixtures
    for (const side of [-1, 1]) {
      for (let z = -40; z <= 40; z += 10) {
        const housing = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.12, 0.55), this.mats.darkMetal)
        housing.position.set(side * 7.5, 12.9, z); this.group.add(housing)
        const tube = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.05, 0.36), new THREE.MeshBasicMaterial({ color: 0xffe9c7, toneMapped: false, transparent: true, opacity: 0.9 }))
        tube.position.set(side * 7.5, 12.82, z); this.group.add(tube)
        const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.glowTex, color: 0xffd7a0, transparent: true, opacity: 0.25, blending: THREE.AdditiveBlending, depthWrite: false }))
        glow.scale.set(3, 1, 1); glow.position.set(side * 7.5, 12.6, z); this.group.add(glow)
        if (this.rnd() > 0.55) this.flickers.push({ mesh: tube, glow, base: 0.88, speed: 6 + this.rnd() * 12, phase: this.rnd() * 20 })
      }
    }
    // storefront lighting inside
    for (let z = -40; z <= 40; z += 14) {
      for (const side of [-1, 1]) {
        const l = new THREE.PointLight(0xffdcae, 36, 12, 2)
        l.position.set(side * 20.5, 3.2, z); this.group.add(l)
      }
    }

    // emergency red lights
    for (const [x, z] of [[-12.5, -6], [12.5, 30]]) {
      const l = new THREE.PointLight(0xff2a1e, 45, 15, 2)
      l.position.set(x, 4.6, z); this.group.add(l)
      this.flickers.push({ light: l, base: 45, speed: 3.5, phase: 4 + x })
    }
  }

  createSigns() {
    // hanging wayfinding / neon
    const way = [
      ['FOOD COURT', '#5fffe3', -10.5, 38],
      ['CINEMA 8', '#ffb347', 10.5, -20],
      ['RESTROOMS', '#8fb6ff', -10.5, -22],
      ['PARKING P2', '#ff6b60', 10.5, 24]
    ]
    for (const [text, color, x, z] of way) {
      const sign = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 0.64), new THREE.MeshBasicMaterial({ map: signTexture(text, { color, fontSize: 100, letterSpacing: 4 }), toneMapped: false, side: THREE.DoubleSide }))
      sign.position.set(x, 8.2, z); sign.rotation.y = Math.PI / 2
      this.group.add(sign)
      const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.glowTex, color: new THREE.Color(color), transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false }))
      glow.scale.set(5, 2, 1); glow.position.set(x, 8.2, z); this.group.add(glow)
    }

    // huge atrium banner (dead mall)
    const bannerTex = canvasBannerTexture()
    const banner = new THREE.Mesh(new THREE.PlaneGeometry(14, 5), new THREE.MeshBasicMaterial({ map: bannerTex, toneMapped: false, side: THREE.DoubleSide, transparent: true }))
    banner.position.set(0, 9.8, -2); banner.rotation.y = 0
    this.group.add(banner)
    this.banners.push({ mesh: banner, baseY: 9.8, phase: 0 })

    // sale signs in store windows
    for (const side of [-1, 1]) {
      for (let i = 0; i < 3; i++) {
        const s = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1), new THREE.MeshBasicMaterial({ map: signTexture(i === 1 ? 'SALE' : i === 2 ? 'CLOSED' : '50% OFF', { color: i === 2 ? '#e23b32' : '#f5e9d8', fontSize: 118, letterSpacing: 3, background: i === 2 ? 'rgba(12,6,6,0.94)' : 'rgba(30,10,10,0.94)' }), toneMapped: false }))
        s.rotation.y = side > 0 ? -Math.PI / 2 : Math.PI / 2
        s.position.set(side * 17.8, 2.6, -36 + i * 20 + (side > 0 ? 4 : 0))
        this.group.add(s)
      }
    }
  }

  createBanners() {
    const bannerData = [
      { text: 'OMNICORP', sub: 'EVERYTHING UNDER ONE ROOF', color: '#d8e0e4', x: -8.5, z: -14, rot: 0.1 },
      { text: 'EAT · SHOP · SURVIVE', sub: 'MALL OF THE DEAD', color: '#e23b32', x: 8.5, z: 8, rot: -0.1 }
    ]
    for (const b of bannerData) {
      const tex = signTexture(b.text, { color: b.color, sub: b.sub, fontSize: b.text.length > 12 ? 76 : 104, letterSpacing: 5, background: 'rgba(9,12,16,0.9)' })
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 2.2), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false, side: THREE.DoubleSide }))
      mesh.position.set(b.x, 8.3, b.z); mesh.rotation.y = b.rot
      this.group.add(mesh)
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 4.8, 8), this.mats.steel)
      rod.rotation.z = Math.PI / 2; rod.position.set(b.x, 9.45, b.z); this.group.add(rod)
      for (const dx of [-2.1, 2.1]) {
        const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 5.2, 4), this.mats.steel)
        cable.position.set(b.x + dx, 11.9, b.z); cable.rotation.z = 0.18 * Math.sign(dx); this.group.add(cable)
      }
      this.banners.push({ mesh, baseY: 8.3, phase: this.rnd() * 6 })
    }
  }

  createDust() {
    const count = 900
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30
      pos[i * 3 + 1] = Math.random() * 12
      pos[i * 3 + 2] = (Math.random() - 0.5) * 88
      speeds[i] = 0.04 + Math.random() * 0.12
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const mat = new THREE.PointsMaterial({ size: 0.055, map: this.glowTex, transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.AdditiveBlending, color: 0xcfe0e8, sizeAttenuation: true })
    this.dust = new THREE.Points(geo, mat)
    this.dustSpeeds = speeds
    this.group.add(this.dust)
  }

  createSpawnPoints() {
    this.spawnPoints = [
      new THREE.Vector3(0, 0, -42), new THREE.Vector3(-7, 0, -41), new THREE.Vector3(7, 0, -41),
      new THREE.Vector3(-12, 0, -39), new THREE.Vector3(12, 0, -39),
      new THREE.Vector3(0, 0, 43), new THREE.Vector3(-8, 0, 42), new THREE.Vector3(8, 0, 42),
      new THREE.Vector3(0, 0, 20), new THREE.Vector3(-8, 0, 19), new THREE.Vector3(8, 0, 20),
      new THREE.Vector3(-12, 0, 41), new THREE.Vector3(12, 0, 41),
      new THREE.Vector3(-12, 0, 29), new THREE.Vector3(12, 0, 27)
    ]
  }

  addCollider(x, z, w, d) {
    this.colliders.push({ minX: x - w / 2, maxX: x + w / 2, minZ: z - d / 2, maxZ: z + d / 2 })
  }

  collide(pos, radius = 0.38) {
    for (const c of this.colliders) {
      const cx = THREE.MathUtils.clamp(pos.x, c.minX, c.maxX)
      const cz = THREE.MathUtils.clamp(pos.z, c.minZ, c.maxZ)
      let dx = pos.x - cx, dz = pos.z - cz
      let d2 = dx * dx + dz * dz
      if (d2 < radius * radius) {
        let d = Math.sqrt(d2)
        if (d < 1e-5) {
          dx = pos.x - (c.minX + c.maxX) / 2; dz = pos.z - (c.minZ + c.maxZ) / 2
          d = Math.sqrt(dx * dx + dz * dz) || 1
        }
        const push = (radius - d) / d
        pos.x += dx * push; pos.z += dz * push
      }
    }
    pos.x = THREE.MathUtils.clamp(pos.x, -21.8, 21.8)
    pos.z = THREE.MathUtils.clamp(pos.z, -45.2, 45.2)
    return pos
  }

  isClear(x, z, radius = 0.45) {
    for (const c of this.colliders) {
      const cx = THREE.MathUtils.clamp(x, c.minX, c.maxX)
      const cz = THREE.MathUtils.clamp(z, c.minZ, c.maxZ)
      const dx = x - cx, dz = z - cz
      if (dx * dx + dz * dz < radius * radius) return false
    }
    return true
  }

  getSpawnPoint(playerPos, partnerPos) {
    const valid = this.spawnPoints.filter(p => {
      const dp = p.distanceTo(playerPos)
      return dp > 12.5 || (partnerPos && p.distanceTo(partnerPos) > 9)
    })
    const list = valid.length ? valid : this.spawnPoints
    return list[Math.floor(Math.random() * list.length)].clone()
  }

  update(dt, time) {
    for (const f of this.flickers) {
      const n = Math.sin(time * f.speed + f.phase) * 0.5 + 0.5
      const spike = Math.sin(time * f.speed * 3.7 + f.phase * 2.1)
      const v = n > 0.15 ? 1 : (spike > 0 ? 0.35 : 0.08)
      if (f.mesh) {
        if (f.mesh.material && f.mesh.material.transparent) f.mesh.material.opacity = f.base * (0.55 + v * 0.45)
        else if (f.mesh.material) f.mesh.material.color.setScalar(0.35 + v * 0.65)
      }
      if (f.light) f.light.intensity = f.base * (0.35 + v * 0.65)
      if (f.glow) f.glow.material.opacity = 0.25 + v * 0.4
    }
    for (const b of this.banners) {
      b.mesh.rotation.z = Math.sin(time * 0.45 + b.phase) * 0.012
      b.mesh.position.y = b.baseY + Math.sin(time * 0.7 + b.phase) * 0.03
    }
    if (this.dust) {
      const attr = this.dust.geometry.attributes.position
      const arr = attr.array
      for (let i = 0; i < arr.length / 3; i++) {
        arr[i * 3 + 1] += this.dustSpeeds[i] * dt
        arr[i * 3] += Math.sin(time * 0.1 + i) * 0.0015
        if (arr[i * 3 + 1] > 12.5) arr[i * 3 + 1] = 0.2
      }
      attr.needsUpdate = true
      this.dust.material.opacity = 0.38 + Math.sin(time * 0.3) * 0.06
    }
    for (const g of this.glowSprites) g.material.opacity = 0.32 + Math.sin(time * 2 + g.position.x) * 0.05
  }
}

function canvasBannerTexture() {
  const c = document.createElement('canvas')
  c.width = 1024; c.height = 360
  const ctx = c.getContext('2d')
  ctx.clearRect(0, 0, 1024, 360)
  ctx.strokeStyle = 'rgba(226,59,50,0.6)'; ctx.lineWidth = 3
  ctx.strokeRect(18, 18, 988, 324)
  ctx.fillStyle = 'rgba(8,11,15,0.72)'; ctx.fillRect(26, 26, 972, 308)
  ctx.textAlign = 'center'
  ctx.fillStyle = '#efe9df'
  ctx.font = '400 112px "Archivo Black", sans-serif'
  ctx.fillText('MALL OF THE DEAD', 512, 165, 940)
  ctx.fillStyle = '#e23b32'
  ctx.font = '700 34px Rajdhani, sans-serif'
  ctx.fillText('CO-OP SURVIVAL · OMNICORP ATRIUM', 512, 232)
  ctx.fillStyle = 'rgba(207,198,184,0.5)'
  ctx.font = '500 24px Rajdhani, sans-serif'
  ctx.fillText('THE NIGHT SHIFT NEVER ENDS', 512, 282)
  const texture = new THREE.CanvasTexture(c)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  return texture
}
