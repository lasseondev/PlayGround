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

## Legends Arena

A self-contained browser MOBA built with HTML, CSS, and Canvas 2D. Pick one of three champions, fight a 1v1 AI opponent in a single lane, farm minions, buy items, destroy two towers, and shatter the enemy nexus.

### Play

```bash
./start.sh
```

The game is served by the workspace runtime. Open the printed local URL.

### Controls

- Right-click: move
- Left mouse (hold): basic attack
- Arrow keys: move
- Q / W / E / R: abilities
- D / F: summoner spells
- B: armory
- P or Esc: pause
- M: mute

On touch devices, drag the joystick, tap Strike to attack, and tap Q/W/E/R to cast.

### Tests

```bash
node --test tests/game.test.mjs
```

The simulation tests cover champion kits, ability gating, items, tower and minion behavior, XP, structure damage, and long-running stability.
