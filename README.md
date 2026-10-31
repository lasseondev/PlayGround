# PlayGround

<!-- omgithub:readme:start -->
## 🚀 Build, play, and remix with OMGithub

**Created using [OMGithub.com](https://omgithub.com).**

[![OMGithub](https://img.shields.io/badge/OMGithub-Open%20project-orange?style=for-the-badge)](https://omgithub.com/lasseondev/PlayGround)
[![GitHub](https://img.shields.io/badge/GitHub-Source-181717?logo=github&style=for-the-badge)](https://github.com/lasseondev/PlayGround)

- 🎮 [Open the project](https://omgithub.com/lasseondev/PlayGround).
- ✨ [Remix this project](https://omgithub.com/?remix=lasseondev%2FPlayGround).
- 💻 [Explore the source](https://github.com/lasseondev/PlayGround).
- 🛠️ [Check build runs](https://github.com/lasseondev/PlayGround/actions).
- 🐛 [Report an issue](https://github.com/lasseondev/PlayGround/issues).
- 👤 [Explore the creator's projects](https://omgithub.com/lasseondev).
- 🌍 [Create with OMGithub](https://omgithub.com).
<!-- omgithub:readme:end -->

# Ashen Vow

A three-act, third-person boss rush built with Three.js. Learn each boss's
telegraph, parry the white glint, break their guard, and riposte. Death sends
you back to the current boss; clearing all three acts ends the vow.

## Run

```bash
npm install
npm run dev
```

Open the printed URL. For a production build:

```bash
npm run build
npm run preview
```

## Controls

| Action | Desktop | Touch |
| --- | --- | --- |
| Move | `WASD` / arrows | Left joystick |
| Look | Mouse | Drag the right side of the screen |
| Strike | Left mouse / `J` | **STRIKE** |
| Heavy strike | `K` | **HEAVY** |
| Parry | Right mouse / `F` | **PARRY** |
| Roll | `Shift` / `Space` | **ROLL** |
| Ember flask | `R` | **FLASK** |
| Lock on | `Q` | **LOCK** |
| Pause | `Esc` | Pause with the browser / OS |

The parry window opens just after the shield is raised. The boss's weapon blooms
white and a **PARRY** prompt appears roughly a quarter-second before impact.
A successful parry staggers the boss; strike immediately for a riposte.

## The Court

1. **The Ashen Warden** — keeper of the first gate.
2. **The Pale Chorister** — a hovering duelist with twin blades and ranged notes.
3. **The Hollow King** — the final throne, with a second phase at half health.

## Technical notes

- Vanilla JavaScript + Three.js, Vite build, no external model or texture assets.
- Procedural arena, characters, textures, particles, and Web Audio soundscape.
- DOM/CSS HUD with responsive desktop, portrait-phone, and landscape-phone layouts.
- Touch controls use pointer capture, `touch-action: none`, and safe-area insets to
  avoid browser gestures and notches.
- Rendering uses ACES tone mapping, bloom, soft shadows, and an adaptive render
  scale for software WebGL.
