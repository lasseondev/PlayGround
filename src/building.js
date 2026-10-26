import * as THREE from 'three'
import { canvasTexture, clamp, cardinalYaw } from './util.js'

export const MATERIALS = {
  wood: { name: 'WOOD', cost: 10, hp: 160, color: 0xc39158, edge: 0x7a512a, icon: '#c89453' },
  brick: { name: 'BRICK', cost: 10, hp: 300, color: 0xc5715d, edge: 0x7b3f33, icon: '#d57962' },
  metal: { name: 'METAL', cost: 10, hp: 500, color: 0x9db8c9, edge: 0x567184, icon: '#b9d4e8' }
}

const PIECE_NAMES = { wall: 'WALL', floor: 'FLOOR', ramp: 'RAMP' }

function makeBrickTexture() {
  return canvasTexture(128, 128, (ctx, w, h) => {
    ctx.fillStyle = '#b76551'
    ctx.fillRect(0, 0, w, h)
    const rows = 8
    const bh = h / rows
    for (let r = 0; r < rows; r++) {
      const offset = r % 2 ? 16 : 0
      for (let c = -1; c < 5; c++) {
        const x = c * 32 + offset
        ctx.fillStyle = `hsl(${9 + Math.random() * 8}, ${38 + Math.random() * 14}%, ${54 + Math.random() * 10}%)`
        ctx.fillRect(x + 2, r * bh + 2, 28, bh - 3)
      }
    }
    ctx.strokeStyle = 'rgba(58,27,22,.35)'
    ctx.lineWidth = 2
    for (let r = 0; r <= rows; r++) {
      ctx.beginPath(); ctx.moveTo(0, r * bh); ctx.lineTo(w, r * bh); ctx.stroke()
    }
  }, { repeat: [1, 1] })
}

function makeMetalTexture() {
  return canvasTexture(128, 128, (ctx, w, h) => {
    ctx.fillStyle = '#7e9cae'
    ctx.fillRect(0, 0, w, h)
    for (let i = 0; i < 8; i++) {
      ctx.fillStyle = i % 2 ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.08)'
      ctx.fillRect(0, i * 16, w, 8)
    }
    ctx.strokeStyle = 'rgba(38,56,68,.55)'
    ctx.lineWidth = 2
    ctx.strokeRect(4, 4, w - 8, h - 8)
    for (const [x, y] of [[12, 12], [w - 12, 12], [12, h - 12], [w - 12, h - 12]]) {
      ctx.fillStyle = '#4c6778'
      ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill()
    }
  }, { repeat: [1, 1] })
}

export class BuildingSystem {
  constructor(game) {
    this.game = game
    this.scene = game.scene
    this.world = game.world
    this.pieces = []
    this.maxPieces = 90
    this.selectedType = 'wall'
    this.selectedMaterial = 'wood'
    this.cooldown = 0
    this.ghostValid = false
    this.ghostData = null
    this.raycaster = new THREE.Raycaster()

    this.textures = {
      wood: this.world.tex.wood,
      brick: makeBrickTexture(),
      metal: makeMetalTexture()
    }
    this.baseMaterials = {}
    for (const key of Object.keys(MATERIALS)) {
      this.baseMaterials[key] = new THREE.MeshStandardMaterial({
        map: this.textures[key],
        color: MATERIALS[key].color,
        roughness: key === 'metal' ? 0.46 : 0.88,
        metalness: key === 'metal' ? 0.55 : 0.03
      })
    }

    this.geometries = {
      wall: new THREE.BoxGeometry(3, 3, 0.24),
      floor: new THREE.BoxGeometry(3, 0.2, 3),
      ramp: new THREE.BoxGeometry(3, 0.2, 4.243)
    }
    this.geometries.wall.translate(0, 1.5, 0)
    this.geometries.floor.translate(0, 0.1, 0)
    this.geometries.ramp.rotateX(-Math.PI / 4)
    this.geometries.ramp.translate(0, 1.5, 0)

    this.ghosts = {}
    for (const type of ['wall', 'floor', 'ramp']) {
      const mat = new THREE.MeshBasicMaterial({ color: 0x6bffb0, transparent: true, opacity: 0.28, depthWrite: false, side: THREE.DoubleSide })
      const mesh = new THREE.Mesh(this.geometries[type], mat)
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(this.geometries[type]), new THREE.LineBasicMaterial({ color: 0x8dffc0, transparent: true, opacity: 0.9, depthWrite: false }))
      const group = new THREE.Group()
      group.add(mesh, edges)
      group.visible = false
      group.userData = { mesh, edges, mat }
      this.scene.add(group)
      this.ghosts[type] = group
    }
  }

  reset() {
    for (const p of [...this.pieces]) this._removePiece(p, false)
    this.pieces.length = 0
  }

  get materialDef() { return MATERIALS[this.selectedMaterial] }

  selectType(type) {
    if (!PIECE_NAMES[type]) return
    this.selectedType = type
    this.game.ui?.setBuildPiece(type)
  }

  cycleMaterial() {
    const keys = ['wood', 'brick', 'metal']
    this.selectedMaterial = keys[(keys.indexOf(this.selectedMaterial) + 1) % keys.length]
    this.game.ui?.setBuildMaterial(this.selectedMaterial)
    this.game.ui?.toast(`${MATERIALS[this.selectedMaterial].name} SELECTED`, 'gold')
  }

  canAfford() {
    return this.game.player.resources[this.selectedMaterial] >= MATERIALS[this.selectedMaterial].cost
  }

  _cellKey(type, x, z, baseY, quarters) {
    return `${type}:${Math.round(x / 3)}:${Math.round(z / 3)}:${Math.round(baseY * 2)}:${quarters}`
  }

  computeGhost(player) {
    const forward = player.forward
    const target = player.position.clone().addScaledVector(forward, 3.35)
    const x = Math.round(target.x / 3) * 3
    const z = Math.round(target.z / 3) * 3
    const groundTarget = this.world.groundHeightAt(x, z, player.position.y + 2.4)
    let baseY = Math.max(groundTarget, player.position.y - 0.12)
    baseY = Math.round(baseY * 4) / 4
    const yaw = cardinalYaw(player.cameraYaw)
    const quarters = Math.round(yaw / (Math.PI / 2)) & 3
    const dir = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw))
    const type = this.selectedType
    const key = this._cellKey(type, x, z, baseY, quarters)
    const occupies = this.pieces.some(p => p.active && p.key === key)
    let valid = !occupies && this.pieces.length < this.maxPieces && this.canAfford()
    let pos
    let rotation
    if (type === 'wall') {
      pos = new THREE.Vector3(x, baseY, z)
      rotation = new THREE.Euler(0, yaw + Math.PI, 0)
    } else if (type === 'floor') {
      pos = new THREE.Vector3(x, baseY, z)
      rotation = new THREE.Euler(0, yaw, 0)
    } else {
      pos = new THREE.Vector3(x, baseY, z)
      rotation = new THREE.Euler(0, Math.atan2(dir.x, dir.z), 0)
    }
    if (Math.abs(x) > 130 || Math.abs(z) > 130) valid = false
    this.ghostData = { type, x, z, baseY, yaw, quarters, key, dir, valid, material: this.selectedMaterial, pos, rotation }
    this.ghostValid = valid
    return this.ghostData
  }

  update(player, dt) {
    this.cooldown = Math.max(0, this.cooldown - dt)
    const active = this.game.buildMode && this.game.state === 'playing'
    for (const type of Object.keys(this.ghosts)) {
      const ghost = this.ghosts[type]
      ghost.visible = active && type === this.selectedType
    }
    if (!active) {
      this.ghostData = null
      return
    }
    const data = this.computeGhost(player)
    const ghost = this.ghosts[data.type]
    ghost.position.copy(data.pos)
    ghost.rotation.copy(data.rotation)
    const color = data.valid ? 0x6bffb0 : 0xff5c6d
    const edgeColor = data.valid ? 0x9dffcd : 0xff8b98
    ghost.userData.mat.color.setHex(color)
    ghost.userData.mesh.material.opacity = data.valid ? 0.26 : 0.2
    ghost.userData.edges.material.color.setHex(edgeColor)
    this.game.ui?.setBuildValidity(data.valid)
  }

  place() {
    if (this.game.state !== 'playing' || !this.game.buildMode || this.cooldown > 0) return false
    const data = this.ghostData
    if (!data || !data.valid) {
      if (data && !this.canAfford()) this.game.ui?.toast('NOT ENOUGH MATERIALS', 'purple')
      else if (data && this.pieces.length >= this.maxPieces) this.game.ui?.toast('BUILD LIMIT REACHED', 'purple')
      return false
    }
    const def = MATERIALS[data.material]
    const player = this.game.player
    player.resources[data.material] -= def.cost
    this.game.ui?.updateResources(player.resources)
    const structure = this._createStructure({
      type: data.type,
      x: data.x,
      z: data.z,
      baseY: data.baseY,
      yaw: data.yaw,
      quarters: data.quarters,
      material: data.material,
      owner: 'player',
      key: data.key
    })
    this.cooldown = 0.19
    if (this.game.stats) this.game.stats.built++
    this.game.audio.build(data.material)
    this.game.effects.buildPulse(new THREE.Vector3(data.x, data.baseY + 0.1, data.z), def.color)
    this.game.ui?.updateResources(player.resources)
    return structure
  }

  _createStructure({ type, x, z, baseY, yaw, quarters, material, owner, key, hpScale = 1 }) {
    const def = MATERIALS[material]
    const mat = this.baseMaterials[material].clone()
    const geo = this.geometries[type]
    const mesh = new THREE.Mesh(geo, mat)
    mesh.castShadow = true
    mesh.receiveShadow = true
    mesh.frustumCulled = true
    let rotation
    if (type === 'wall') rotation = new THREE.Euler(0, yaw + Math.PI, 0)
    else if (type === 'floor') rotation = new THREE.Euler(0, yaw, 0)
    else {
      const dir = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw))
      rotation = new THREE.Euler(0, Math.atan2(dir.x, dir.z), 0)
    }
    mesh.position.set(x, baseY, z)
    mesh.rotation.copy(rotation)
    this.scene.add(mesh)
    const structure = {
      type, x, z, baseY, yaw, quarters, material, owner, key, mesh,
      hp: def.hp * hpScale,
      maxHp: def.hp * hpScale,
      active: true,
      hitFlash: 0,
      materialRef: mat,
      isStructure: true
    }
    mesh.userData.structure = structure
    this.pieces.push(structure)
    this.game.solidTargets?.push(mesh)
    this.game.occluders?.push(mesh)
    this.game.losBlockers?.push(mesh)
    if (type === 'wall') {
      const alongX = quarters % 2 === 0
      const hx = alongX ? 1.5 : 0.14
      const hz = alongX ? 0.14 : 1.5
      this.world.addCollider(x - hx, baseY, z - hz, x + hx, baseY + 3, z + hz, structure, this.world.colliders)
    } else if (type === 'floor') {
      structure.floor = { minX: x - 1.5, maxX: x + 1.5, minZ: z - 1.5, maxZ: z + 1.5, top: baseY + 0.2, structure }
      this.world.floors.push(structure.floor)
    } else if (type === 'ramp') {
      const rampYaw = Math.atan2(-Math.sin(yaw), -Math.cos(yaw))
      structure.ramp = { x, z, y: baseY, rot: rampYaw, active: true, structure }
      this.world.ramps.push(structure.ramp)
    }
    return structure
  }

  placeBotWall(bot, dir) {
    const x = Math.round((bot.position.x + dir.x * 1.9) / 3) * 3
    const z = Math.round((bot.position.z + dir.z * 1.9) / 3) * 3
    const ground = this.world.groundHeightAt(x, z, bot.position.y + 2)
    const baseY = Math.max(ground, bot.position.y - 0.4)
    const yaw = Math.atan2(-dir.x, -dir.z)
    const quarters = Math.round(yaw / (Math.PI / 2)) & 3
    const key = this._cellKey('wall', x, z, baseY, quarters) + ':bot'
    const structure = this._createStructure({
      type: 'wall', x, z, baseY, yaw, quarters, material: 'wood', owner: bot.id, key, hpScale: 0.72
    })
    this.game.effects.buildPulse(new THREE.Vector3(x, baseY + 0.1, z), 0xffc95c)
    this.game.audio.build('wood')
    return structure
  }

  damage(structure, amount, point = null) {
    if (!structure || !structure.active) return
    structure.hp -= amount
    structure.hitFlash = 0.09
    if (structure.materialRef) {
      structure.materialRef.emissive = new THREE.Color(0xffb066)
      structure.materialRef.emissiveIntensity = 0.6
    }
    if (point) {
      this.game.effects.spawnParticles(point, MATERIALS[structure.material].color, 7, { speed: 3.2, life: 0.4, gravity: 9, size: 0.11 })
    }
    if (structure.hp <= 0) this._removePiece(structure, true)
  }

  _removePiece(structure, fx = true) {
    if (!structure.active) return
    structure.active = false
    this.scene.remove(structure.mesh)
    structure.mesh.userData.structure = null
    const solidIndex = this.game.solidTargets?.indexOf(structure.mesh)
    if (solidIndex >= 0) this.game.solidTargets.splice(solidIndex, 1)
    const occIndex = this.game.occluders?.indexOf(structure.mesh)
    if (occIndex >= 0) this.game.occluders.splice(occIndex, 1)
    const losIndex = this.game.losBlockers?.indexOf(structure.mesh)
    if (losIndex >= 0) this.game.losBlockers.splice(losIndex, 1)
    if (structure.collider) structure.collider.active = false
    if (structure.floor) {
      const i = this.world.floors.indexOf(structure.floor)
      if (i >= 0) this.world.floors.splice(i, 1)
    }
    if (structure.ramp) {
      structure.ramp.active = false
      const i = this.world.ramps.indexOf(structure.ramp)
      if (i >= 0) this.world.ramps.splice(i, 1)
    }
    structure.materialRef?.dispose()
    if (fx) {
      this.game.effects.explosion(structure.mesh.position.clone().setY(structure.baseY + 0.7), MATERIALS[structure.material].color, 18)
      this.game.audio.destroy()
    }
  }

  removeAtAim(camera) {
    if (this.game.state !== 'playing' || !this.game.buildMode) return false
    this.raycaster.setFromCamera({ x: 0, y: 0 }, camera)
    this.raycaster.far = 9
    const hits = this.raycaster.intersectObjects(this.pieces.filter(p => p.active).map(p => p.mesh), false)
    if (!hits.length) return false
    const structure = hits[0].object.userData.structure
    if (!structure || structure.owner !== 'player') return false
    const def = MATERIALS[structure.material]
    this.game.player.resources[structure.material] = Math.min(999, this.game.player.resources[structure.material] + Math.round(def.cost / 2))
    this.game.ui?.updateResources(this.game.player.resources)
    this.game.ui?.toast(`+${Math.round(def.cost / 2)} ${def.name}`, 'gold')
    this._removePiece(structure, true)
    return true
  }

  updateEffects(dt) {
    for (const piece of this.pieces) {
      if (!piece.active) continue
      if (piece.hitFlash > 0) {
        piece.hitFlash -= dt
        if (piece.hitFlash <= 0 && piece.materialRef) {
          piece.materialRef.emissive = new THREE.Color(0x000000)
          piece.materialRef.emissiveIntensity = 1
        }
      }
    }
  }
}
