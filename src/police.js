import * as THREE from 'three'
import { createBikeMesh } from './bike.js'
import { CITY } from './world.js'

const clamp = THREE.MathUtils.clamp

export class Police {
  constructor(scene, world) {
    this.scene = scene
    this.world = world
    this.units = []
    this.markerCooldown = 0
    for (let i = 0; i < 2; i++) {
      const root = createBikeMesh({ police: true })
      root.visible = false
      scene.add(root)
      this.units.push({
        root,
        parts: root.userData,
        x: 0,
        z: 0,
        y: 0,
        yaw: 0,
        speed: 0,
        active: false,
        cooldown: 0,
        spin: 0,
        lean: 0,
        age: 0,
        stuck: 0,
      })
    }
  }

  spawn(u, player, heat) {
    let best = null
    for (let i = 0; i < 24; i++) {
      const x = CITY.roadCenters[Math.floor(Math.random() * CITY.roadCenters.length)]
      const z = CITY.roadCenters[Math.floor(Math.random() * CITY.roadCenters.length)]
      const d = Math.hypot(x - player.x, z - player.z)
      if (d > 95 && d < 190) { best = { x, z }; break }
    }
    if (!best) best = { x: player.x + 120, z: player.z + 80 }
    u.x = best.x
    u.z = best.z
    u.y = this.world.groundHeightAt(u.x, u.z)
    u.yaw = Math.atan2(player.x - u.x, player.z - u.z)
    u.speed = 20
    u.active = true
    u.age = 0
    u.stuck = 0
    u.root.visible = true
    u.root.position.set(u.x, u.y + 0.02, u.z)
    u.root.rotation.y = u.yaw
    u.cooldown = 2
  }

  update(dt, player, playerSpeed, heat, time) {
    const events = []
    let closest = 999
    let activeIndex = 0
    for (let i = 0; i < this.units.length; i++) {
      const u = this.units[i]
      u.cooldown = Math.max(0, u.cooldown - dt)
      if (heat < 2.6) {
        if (u.active) {
          u.active = false
          u.root.visible = false
        }
        continue
      }
      if (!u.active && i <= Math.floor((heat - 1) / 1.6)) {
        this.spawn(u, player, heat)
      }
      if (!u.active) continue
      activeIndex++
      u.age += dt

      const dx = player.x - u.x
      const dz = player.z - u.z
      const dist = Math.hypot(dx, dz)
      closest = Math.min(closest, dist)
      if (dist > 320) {
        this.spawn(u, player, heat)
        continue
      }

      const desired = Math.atan2(dx, dz)
      let diff = ((desired - u.yaw + Math.PI * 3) % (Math.PI * 2)) - Math.PI
      const turn = clamp(diff, -1.6 * dt, 1.6 * dt)
      u.yaw += turn
      const targetSpeed = dist < 14 ? 18 : 25 + heat * 2.5
      u.speed += (targetSpeed - u.speed) * (1 - Math.exp(-dt * 1.8))
      const fx = Math.sin(u.yaw)
      const fz = Math.cos(u.yaw)
      u.x += fx * u.speed * dt
      u.z += fz * u.speed * dt
      u.x = clamp(u.x, -this.world.bounds + 5, this.world.bounds - 5)
      u.z = clamp(u.z, -this.world.bounds + 5, this.world.bounds - 5)

      const R = 0.8
      let bumped = false
      for (const b of this.world.buildings) {
        if (u.x < b.minX - 3 || u.x > b.maxX + 3 || u.z < b.minZ - 3 || u.z > b.maxZ + 3) continue
        const cx = clamp(u.x, b.minX, b.maxX)
        const cz = clamp(u.z, b.minZ, b.maxZ)
        let ox = u.x - cx
        let oz = u.z - cz
        const d2 = ox * ox + oz * oz
        if (d2 >= R * R) continue
        let len = Math.sqrt(d2)
        if (len < 1e-4) { ox = 1; oz = 0; len = 1 }
        u.x = cx + (ox / len) * R
        u.z = cz + (oz / len) * R
        u.speed *= 0.75
        bumped = true
      }
      u.stuck = bumped ? u.stuck + dt : 0
      if (u.stuck > 3) {
        this.spawn(u, player, heat)
        continue
      }

      u.lean = THREE.MathUtils.damp(u.lean, clamp(-diff, -1, 1) * 0.32, 7, dt)
      u.spin += (u.speed * dt) / 0.52
      u.y = this.world.groundHeightAt(u.x, u.z)
      u.root.position.set(u.x, u.y + 0.02, u.z)
      u.root.rotation.y = u.yaw
      u.parts.lean.rotation.z = -u.lean
      u.parts.wheels[0].rotation.x = u.spin
      u.parts.wheels[1].rotation.x = u.spin
      u.parts.frontWheel.rotation.y = clamp(-diff, -0.3, 0.3)
      u.parts.headlight.intensity = u.parts.headlight.intensity || 0

      if (u.parts.policeLights) {
        const phase = Math.sin(time * 16 + i * 2.4)
        const red = u.parts.policeLights[0]
        const blue = u.parts.policeLights[1]
        red.color.setHex(phase > 0 ? 0xff2233 : 0x3a0008)
        blue.color.setHex(phase < 0 ? 0x2277ff : 0x060a26)
      }

      if (dist < 2.5 && u.cooldown <= 0) {
        u.cooldown = 2.2
        const nx = dx / (dist || 1)
        const nz = dz / (dist || 1)
        player.x += nx * 0.6
        player.z += nz * 0.6
        events.push({ type: 'cop', impact: 12, x: u.x, z: u.z, dist })
      }
      if (activeIndex >= 1 && dist < 45) events.currentDistance = Math.min(events.currentDistance ?? 999, dist)
    }
    if (events.currentDistance === undefined) events.currentDistance = closest
    return events
  }
}
