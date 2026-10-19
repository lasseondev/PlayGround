import { RocketRumble } from './game.js'

const canvas = document.getElementById('game')

try {
  const game = new RocketRumble(canvas)
  window.__rocketGame = game

  const params = new URLSearchParams(window.location.search)
  if (params.has('play') || window.location.hash === '#play') {
    setTimeout(() => game.startMatch(), 280)
  }
} catch (error) {
  console.error(error)
  const loading = document.getElementById('loading')
  if (loading) {
    loading.innerHTML = `<div style="max-width:520px;padding:24px;text-align:center;font:14px/1.6 'Segoe UI',Arial,sans-serif;color:#a9c9dd">
      <p style="font:900 22px 'Arial Black',Impact,sans-serif;color:#ff9a42;margin:0 0 10px">ARENA OFFLINE</p>
      <p style="margin:0">This game needs WebGL. Enable hardware acceleration or try a current browser.</p>
      <p style="margin:10px 0 0;opacity:.55;font-size:12px">${String(error.message || error).replace(/[<>]/g, '')}</p>
    </div>`
  }
}
