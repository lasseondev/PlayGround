export class Input {
  constructor(canvas) {
    this.canvas = canvas
    this.keys = new Set()
    this.pressed = new Set()
    this.released = new Set()
    this.mouse = { left: false, right: false, middle: false }
    this.lookDX = 0
    this.lookDY = 0
    this.wheel = 0
    this.pointerLocked = false
    this.enabled = false

    window.addEventListener('keydown', (e) => {
      if (!this.enabled) return
      if (['Tab', 'Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault()
      if (!this.keys.has(e.code)) this.pressed.add(e.code)
      this.keys.add(e.code)
    })
    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.code)
      this.released.add(e.code)
    })
    window.addEventListener('blur', () => { this.keys.clear(); this.mouse.left = this.mouse.right = this.mouse.middle = false })
    document.addEventListener('mousemove', (e) => {
      if (!this.pointerLocked || !this.enabled) return
      this.lookDX += e.movementX
      this.lookDY += e.movementY
    })
    document.addEventListener('mousedown', (e) => {
      if (!this.pointerLocked || !this.enabled) return
      if (e.button === 0) this.mouse.left = true
      if (e.button === 1) this.mouse.middle = true
      if (e.button === 2) this.mouse.right = true
    })
    document.addEventListener('mouseup', (e) => {
      if (e.button === 0) this.mouse.left = false
      if (e.button === 1) this.mouse.middle = false
      if (e.button === 2) this.mouse.right = false
    })
    document.addEventListener('contextmenu', (e) => e.preventDefault())
    document.addEventListener('wheel', (e) => {
      if (!this.pointerLocked || !this.enabled) return
      this.wheel += Math.sign(e.deltaY)
    }, { passive: true })
    document.addEventListener('pointerlockchange', () => {
      this.pointerLocked = document.pointerLockElement === this.canvas
      if (!this.pointerLocked) { this.mouse.left = this.mouse.right = this.mouse.middle = false }
    })
  }

  down(code) { return this.keys.has(code) }
  hit(code) { return this.pressed.has(code) }
  endFrame() {
    this.pressed.clear(); this.released.clear()
    this.wheel = 0
    this.lookDX = 0; this.lookDY = 0
  }
  requestLock() {
    if (document.pointerLockElement !== this.canvas) {
      this.canvas.requestPointerLock?.()
    }
  }
  releaseLock() { if (document.pointerLockElement) document.exitPointerLock?.() }
}
