import './style.css'
import { Game } from './core/Game.js'

const loading = document.getElementById('loading')
const status = document.getElementById('loading-status')
const bar = document.getElementById('loading-bar')
const tips = [
  'TIP: AIM FOR THE HEAD. THEY HATE THAT.',
  'TIP: FRAG GRENADES CLEAR A CROWDED ATRIUM.',
  'TIP: ROOK CAN BE REVIVED WITH E. SO CAN YOU.',
  'TIP: A RUNNING ZOMBIE IS STILL A DEAD ZOMBIE.',
  'TIP: THE FLASHLIGHT DOES NOT ATTRACT THEM. PROBABLY.',
  'TIP: WATCH THE CINEMA DOORS.'
]
const tipEl = document.getElementById('loading-tip')
if (tipEl) tipEl.textContent = tips[Math.floor(Math.random() * tips.length)]

function progress(value, text) {
  if (bar) bar.style.width = `${value}%`
  if (status && text) status.textContent = text
}
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))

async function boot() {
  try {
    progress(8, 'LINKING SECURITY FEED')
    await wait(180)
    progress(24, 'LOADING FONTS AND FLOOR PLANS')
    await document.fonts.ready.catch(() => {})
    await wait(120)
    progress(46, 'SEALING EXTERIOR DOORS')
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    const game = new Game()
    window.__game = game
    progress(78, 'CALIBRATING FLASHLIGHT')
    await wait(240)
    progress(92, 'COUNTING THE HOSTILES')
    await wait(280)
    progress(100, 'ATRIUM SECURED')
    await wait(420)
    loading?.classList.add('out')
    setTimeout(() => loading?.classList.add('hidden'), 900)
    window.__ready = true
  } catch (error) {
    console.error(error)
    window.__bootError = String(error && error.stack || error)
    if (loading) {
      status.textContent = 'RENDERER FAILURE'
      bar.style.width = '100%'
      bar.style.background = '#e23b32'
    }
    document.getElementById('webgl-error')?.classList.remove('hidden')
  }
}

boot()
