export function hash2(x, z) {
  const s = Math.sin(x * 127.1 + z * 311.7) * 43758.5453123
  return s - Math.floor(s)
}

export function smoothstep(t) {
  return t * t * (3 - 2 * t)
}

export function valueNoise(x, z) {
  const x0 = Math.floor(x)
  const z0 = Math.floor(z)
  const fx = x - x0
  const fz = z - z0
  const u = smoothstep(fx)
  const v = smoothstep(fz)
  const a = hash2(x0, z0)
  const b = hash2(x0 + 1, z0)
  const c = hash2(x0, z0 + 1)
  const d = hash2(x0 + 1, z0 + 1)
  return a * (1 - u) * (1 - v) + b * u * (1 - v) + c * (1 - u) * v + d * u * v
}

export function fbm(x, z, octaves = 4) {
  let amplitude = 0.5
  let frequency = 1
  let sum = 0
  let norm = 0
  for (let i = 0; i < octaves; i += 1) {
    sum += amplitude * valueNoise(x * frequency, z * frequency)
    norm += amplitude
    amplitude *= 0.5
    frequency *= 2
  }
  return sum / norm
}

export function mulberry32(seed) {
  let a = seed >>> 0
  return function random() {
    a += 0x6d2b79f5
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
