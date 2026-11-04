# SUPER CLOUD HOP 3D

A complete little Mario-style 3D platformer that runs in the browser. Hop across floating cloud islands, grab coins and Lucky Stars, bounce off springs, stomp goombas, and take down the three-hit Mega Goomba before raising the flag at the end of **Cloudtop Cascade**.

Built with [Three.js](https://threejs.org/) and [Vite](https://vitejs.dev/). Every model, texture, and sound is generated procedurally — there are no external art or audio assets.

## Play

```bash
npm install
npm run dev      # http://localhost:3002
```

Production build:

```bash
npm run build
npm run preview
```

The build uses a relative base (`--base ./`), so `dist/` can be served from any static path.

## Controls

| Action | Keyboard / mouse | Touch |
| --- | --- | --- |
| Move | `WASD` or arrow keys | Left joystick |
| Jump / stomp | `Space` | `JUMP` button |
| Sprint | `Shift` | Push joystick to the edge |
| Orbit camera | Drag with the mouse | Drag the sky |
| Zoom camera | Mouse wheel | — |
| Pause | `Esc` or `P` | Pause button |
| Mute | `M` or speaker button | Speaker button |

The hero has coyote time, a jump buffer, and variable jump height, so short taps give small hops and held jumps go higher. Landing on a goomba bounces you; touching one from the side costs a heart.

## The course

- **Cloudtop Cascade** — one hand-built course of floating grass islands, stone steps, bridges, moving platforms, and a spring that launches you to the high island.
- **75 coins**, **3 Lucky Stars** (each worth +5 coins and a heal), and **3 checkpoints**.
- **Mega Goomba** boss with three hit points, a boss health bar, and a stomp cooldown.
- A finish flag, course timer, heart health, results screen with coin/time/star stats, and an `S`–`C` rank.

Falling off the islands costs a heart and respawns you at the last checkpoint. Losing all three hearts ends the run; clearing the course shows your results.

## Technical notes

- `src/game.js` — fixed-step physics, AABB collisions, checkpoints, enemies/boss, camera, scoring, and win/lose flow.
- `src/world.js` — level layout, pickups, props, sky, clouds, and merged static geometry.
- `src/character.js` — the hero rig and low-poly goomba/boss models.
- `src/input.js` — keyboard, mouse, touch joystick, and jump input.
- `src/audio.js` — synthesized WebAudio sound effects and looping music.
- `src/main.js` — renderer, UI wiring, game loop, and the `window.__cloudHop` test hook.

Assumptions: this is a single self-contained course rather than a full world map, progress is not saved between sessions, and the game is designed for modern desktop and mobile browsers with WebGL.

---

<!-- omgithub:readme:start -->
## 🚀 Build, play, and remix with OMGithub

**Created using [OMGithub.com](https://go.ondev.store/).**

[![OMGithub](https://img.shields.io/badge/OMGithub-Open%20project-orange?style=for-the-badge)](https://go.ondev.store/lasseondev/PlayGround)
[![GitHub](https://img.shields.io/badge/GitHub-Source-181717?logo=github&style=for-the-badge)](https://github.com/lasseondev/PlayGround)

- 🎮 [Open the project](https://go.ondev.store/lasseondev/PlayGround).
- ✨ [Remix this project](https://go.ondev.store/lasseondev/PlayGround?remix=1).
- 💻 [Explore the source](https://github.com/lasseondev/PlayGround).
- 🛠️ [Check build runs](https://github.com/lasseondev/PlayGround/actions).
- 🐛 [Report an issue](https://github.com/lasseondev/PlayGround/issues).
- 👤 [Explore the creator's projects](https://go.ondev.store/lasseondev).
- 🌍 [Create with OMGithub](https://go.ondev.store/).
<!-- omgithub:readme:end -->
