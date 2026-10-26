import * as THREE from 'three'

export const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
export const lerp = (a, b, t) => a + (b - a) * t
export const invLerp = (a, b, v) => (v - a) / (b - a || 1)

export function smoothstep(a, b, x) {
  const t = clamp((x - a) / (b - a || 1), 0, 1)
  return t * t * (3 - 2 * t)
}

export function damp(a, b, lambda, dt) {
  return lerp(a, b, 1 - Math.exp(-lambda * dt))
}

export function angleDelta(a, b) {
  let d = (b - a) % (Math.PI * 2)
  if (d > Math.PI) d -= Math.PI * 2
  if (d < -Math.PI) d += Math.PI * 2
  return d
}

export function dampAngle(a, b, lambda, dt) {
  return a + angleDelta(a, b) * (1 - Math.exp(-lambda * dt))
}

export function mulberry32(seed) {
  let t = seed >>> 0
  return function () {
    t += 0x6d2b79f5
    let r = t
    r = Math.imul(r ^ (r >>> 15), r | 1)
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

export function makeRng(seed = 1337) {
  const r = mulberry32(seed)
  return {
    next: r,
    range: (a, b) => a + (b - a) * r(),
    int: (a, b) => Math.floor(a + (b - a + 1) * r()),
    pick: arr => arr[Math.floor(r() * arr.length)],
    chance: p => r() < p
  }
}

export function formatTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

export function cardinalYaw(yaw) {
  const quarter = Math.PI / 2
  return Math.round(yaw / quarter) * quarter
}

export function dirFromYaw(yaw) {
  return new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw))
}

export function yawFromDir(dx, dz) {
  return Math.atan2(-dx, -dz)
}

export function canvasTexture(width, height, draw, { repeat = null, colorSpace = THREE.SRGBColorSpace } = {}) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  draw(ctx, width, height)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = colorSpace
  tex.anisotropy = 4
  if (repeat) {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(repeat[0], repeat[1])
  }
  return tex
}

export function shakeVec(amount, rng = Math.random) {
  return new THREE.Vector3((rng() - 0.5) * 2 * amount, (rng() - 0.5) * 2 * amount, (rng() - 0.5) * 2 * amount)
}

export function disposeObject(root) {
  root.traverse(obj => {
    if (obj.geometry) obj.geometry.dispose?.()
    if (obj.material) {
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
      for (const m of mats) {
        for (const key of Object.keys(m)) {
          const value = m[key]
          if (value && value.isTexture) value.dispose()
        }
        m.dispose?.()
      }
    }
  })
}

export function projectToScreen(pos, camera, width, height) {
  const v = pos.clone().project(camera)
  return {
    x: (v.x * 0.5 + 0.5) * width,
    y: (-v.y * 0.5 + 0.5) * height,
    visible: v.z < 1
  }
}

export function rayAABB(origin, dir, min, max) {
  let tmin = -Infinity
  let tmax = Infinity
  for (const axis of ['x', 'y', 'z']) {
    const o = origin[axis]
    const d = dir[axis]
    if (Math.abs(d) < 1e-8) {
      if (o < min[axis] || o > max[axis]) return null
    } else {
      let t1 = (min[axis] - o) / d
      let t2 = (max[axis] - o) / d
      if (t1 > t2) [t1, t2] = [t2, t1]
      tmin = Math.max(tmin, t1)
      tmax = Math.min(tmax, t2)
      if (tmin > tmax) return null
    }
  }
  return tmin >= 0 ? tmin : tmax >= 0 ? tmax : null
}

export function pointNearSegment(px, pz, ax, az, bx, bz) {
  const abx = bx - ax
  const abz = bz - az
  const len2 = abx * abx + abz * abz || 1
  let t = ((px - ax) * abx + (pz - az) * abz) / len2
  t = clamp(t, 0, 1)
  const x = ax + abx * t
  const z = az + abz * t
  return Math.hypot(px - x, pz - z)
}
