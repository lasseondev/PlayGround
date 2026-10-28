import { strict as assert } from 'node:assert'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const read = file => readFileSync(resolve(root, file), 'utf8')

const pkg = JSON.parse(read('package.json'))
assert.match(pkg.scripts.dev, /^vite(?:\s|$)/)
assert.equal(pkg.scripts.build, 'vite build')
assert.ok(pkg.dependencies.three, 'three dependency is missing')

const html = read('index.html')
assert.match(html, /id="btn-play"/)
assert.match(html, /aria-label="Play"/)
assert.match(html, /id="menu"/)
assert.match(html, /id="hud"/)

const required = [
  'src/main.js',
  'src/style.css',
  'src/core/Game.js',
  'src/core/Input.js',
  'src/world/Mall.js',
  'src/player/Player.js',
  'src/player/Weapon.js',
  'src/entities/Zombie.js',
  'src/entities/Partner.js',
  'src/systems/Waves.js',
  'src/ui/HUD.js'
]
for (const file of required) assert.ok(existsSync(resolve(root, file)), `${file} is missing`)

const game = read('src/core/Game.js')
assert.match(game, /startGame\(mode\)/)
assert.match(game, /composer\.render/)
assert.match(read('src/systems/Waves.js'), /spawnTimer/)
assert.match(read('src/entities/Partner.js'), /reviveProgress/)

console.log(`smoke: ${required.length + 8} checks passed`)
