# Plan: Minecraft-Style Voxel Survival with Crafting

## 1. Product target

A single-player, browser-based voxel survival sandbox playable in under 10 seconds
from a static page, with a complete 10–15 minute loop:

**Explore → gather → craft tools → survive the night → build a shelter → save progress.**

Scope is deliberately "Minecraft Alpha, not Minecraft": one finite-but-large seeded
world, a small block/item set, one crafting tier chain, day/night, hunger/health,
and no multiplayer. No server, no account, no asset downloads at runtime.

### Non-goals for v1

- Multiplayer, mods, Redstone, villagers, nether/end dimensions.
- Infinite world streaming (use a bounded 256×256×64 world or render-distance chunks).
- Realistic lighting/shadows, shaders, or fluid simulation.
- Mobile/touch controls (desktop keyboard + mouse first).

## 2. Tech stack and constraints

| Concern | Choice | Reason |
|---|---|---|
| Renderer | Three.js (vendored ES module) | Mature, small enough, WebGL2 fallback |
| Language | Vanilla ES modules + JS | No build step; static hosting |
| Textures | One 16×16-tile atlas, nearest filtering | Minecraft look, 1 draw call per chunk material |
| Audio | WebAudio oscillator/SFX synth or tiny local files | No runtime network |
| Save | `localStorage` (seed + block diffs + player state) | Zero backend |
| Serving | Existing `start.sh` runtime (port 3002) | Matches repo tooling |
| Verification | `playwright-cli` screenshot at 1280×720 | Per `Agents.md` |

Target: 60 fps at render distance 4 chunks on SwiftShader is not expected; aim for
playable (≥20 fps) under software rendering and 60 fps on real GPUs.

## 3. Core gameplay loop

1. Spawn on a grassy shore with an empty inventory and full health/hunger.
2. Punch trees → logs → planks → sticks → wooden pickaxe.
3. Mine stone → stone tools → mine coal/iron (iron requires stone pickaxe).
4. Eat food to restore hunger; hunger gates sprinting and slow-heals health.
5. Craft torches, build a shelter before nightfall.
6. Night: reduced light, simple hostile slimes spawn away from torches (stretch goal).
7. Progress persists on reload; death drops inventory at the death site.

## 4. Systems design

### 4.1 World generation

- Seeded deterministic PRNG (mulberry32) + 2D value/simplex noise.
- Chunks: 16×16 columns, world height 64, sea level 28.
- Terrain: continentalness + erosion noise → grass, sand, stone, water.
- Surface pass: dirt layer, trees (oak only), flowers/tall grass (non-colliding).
- Caves: 3D noise threshold below y=40; ores by depth bands
  (coal y 5–40, iron y 5–28).
- Bounded world 16×16 chunks = 256×256, with a bedrock/water edge.
- Chunk data stored as `Uint8Array(16*64*16)`; generated lazily on first view.

### 4.2 Rendering

- Greedy-ish face culling: emit only faces adjacent to air/transparent blocks.
- Separate meshes per chunk: opaque, cutout (leaves), transparent (water/glass).
- Vertex AO from neighboring blocks; baked into vertex colors.
- Texture atlas 16×16 tiles at 16 px; `NearestFilter`, no mipmaps for crispness.
- Sky gradient + fog matched to render distance; sun direction drives ambient.
- Day/night: 10-minute cycle, smooth skylight multiplier; torches add point light
  baked as a simple light value per block (flood fill, radius 8) to avoid real lights.
- Frustum culling per chunk; rebuild at most 2 dirty chunks per frame.

### 4.3 Player and physics

- First-person camera, pointer lock, 0.6×1.8 AABB, eye height 1.62.
- Fixed-timestep (60 Hz) movement; swept AABB collision resolved per axis.
- Gravity, jump, sprint (hunger cost), sneak (edge-safe), fly toggle for debug only.
- Water: slower movement, buoyancy, drowning after 15 s submerged.
- Fall damage above 3 blocks; hurt flash and knockback-free v1.
- Spawn/respawn at world center or last bed (stretch).

### 4.4 Block interaction

- DDA voxel raycast, reach 5 blocks, ignores water/foliage for placement.
- Left-click: break with per-block hardness and tool multiplier; progress overlay.
- Right-click: place selected block if not intersecting the player; context action
  for crafting table/furnace later.
- Highlight targeted block with wireframe box.
- Drops: block → item, added to inventory or dropped entity if full.

### 4.5 Inventory and crafting

- 9-slot hotbar + 27-slot main inventory + 2×2 personal grid.
- Crafting table opens 3×3 grid; recipe matching supports shaped and shapeless.
- Stacks of 64; tools stack to 1; drag-and-drop plus shift-click quick-move.
- Recipes v1:
  - Log → 4 planks (shapeless)
  - 2 planks → 4 sticks
  - 4 planks → crafting table
  - 3 planks + 2 sticks → wooden pickaxe/axe/shovel/sword
  - 3 cobblestone + 2 sticks → stone tools
  - 1 coal + 1 stick → 4 torches
  - 3 iron ingot + 2 sticks → iron tools (stretch)
  - 8 cobblestone → furnace; raw food + fuel → cooked food (stretch)
- Tool durability (wood 60, stone 130); breaking at 0 removes the tool.
- Recipe book panel listing craftable recipes from current inventory.

### 4.6 Survival stats

- Health 20, hunger 20, saturation hidden; hunger drains with sprint/jump and over time.
- Hunger ≤ 6 disables sprint; hunger 0 drains health slowly; hunger ≥ 18 slow-heals.
- Food items restore hunger (apple 4, cooked meat 8, bread 5 — whichever content ships).
- Death → respawn screen, inventory drops as a loot bag/entities at death point.
- Simple passive mob (pig) as food source is a stretch goal; apples from leaves
  guarantee the loop closes without mobs.

### 4.7 UI / UX

- Title screen: seed input, "New World", "Continue" (if save exists), controls.
- HUD: crosshair, hotbar with counts/durability, health hearts, hunger drumsticks,
  selected-block name toast, FPS/debug toggle (F3).
- Inventory/crafting modal; Esc pauses; pointer lock reacquired on click.
- Settings: render distance (2–6), mouse sensitivity, invert Y, mute.
- Accessibility: remappable keys (stretch), reduced camera bob toggle.

### 4.8 Persistence

- Save schema v1: seed, world edits map `"x,y,z": blockId`, player pos/rot,
  inventory, health/hunger, time-of-day, spawn point.
- Autosave every 5 s and on pause/unload; manual "Save & Quit".
- Version field + migration guard; corrupt saves fall back to new world with warning.
- Reset-world button with confirmation.

## 5. Content matrix (v1)

**Blocks:** air, grass, dirt, stone, cobblestone, sand, water, log, leaves, planks,
crafting table, torch, coal ore, iron ore, bedrock, glass (optional), snow (optional).

**Items:** log, planks, stick, cobblestone, coal, raw iron, iron ingot, apple,
wooden/stone/iron pickaxe, axe, shovel, sword, torch, crafting table, furnace (stretch).

**Tool tiers:** hand (1×) → wood (2×) → stone (4×) → iron (6×). Correct tool required
for stone drops; wrong tool yields nothing (or slow/no drop) to teach the loop.

## 6. Code layout

```
/index.html            entry, import map, canvas + UI roots
/src/main.js           boot, game state machine (menu/play/pause/dead)
/src/world/            noise.js, world.js, chunk.js, mesher.js, lighting.js
/src/render/           renderer.js, atlas.js, sky.js, highlight.js
/src/player/           controls.js, physics.js, interaction.js, stats.js
/src/inventory/        inventory.js, recipes.js, crafting.js, ui.js
/src/content/          blocks.js, items.js, recipes.data.js
/src/save/             storage.js, schema.js
/src/ui/               hud.js, menus.js, styles.css
/vendor/three.module.js
/tests/                recipe tests + smoke script (node --test)
```

Pure logic (noise, recipes, inventory, save schema) stays renderer-free so it can be
unit tested with `node --test`; DOM/Three code is verified in the browser.

## 7. Milestones

| # | Milestone | Done when |
|---|---|---|
| M1 | Static world renders | Seeded chunk terrain + textured blocks + sky/fog at 60 fps GPU; screenshot verified |
| M2 | Player moves and blocks break/place | Pointer-lock FPS controller, collision, raycast break/place, hotbar selection, save of edits |
| M3 | Survival loop | Health/hunger/fall/water damage, day-night, food restores hunger, death/respawn |
| M4 | Inventory + crafting | Full inventory UI, drag/drop, 2×2 and 3×3 crafting, recipe book, tools/durability |
| M5 | Persistence + polish | Autosave/reload exact state, title/pause/settings, audio, particles, README + screenshot |
| M6 | Hardening | Unit tests green, no console errors, 30-minute soak, fresh-save and corrupt-save paths |

Each milestone ends with: run the static server, capture a screenshot via
`playwright-cli`, inspect it for non-blank real geometry, and record the result.

## 8. Acceptance criteria (v1)

- [ ] Page loads offline to a title screen with no console errors.
- [ ] New world generates deterministic terrain from a seed; same seed → same world.
- [ ] Player can walk, jump, sprint, swim, and cannot fall through terrain.
- [ ] Breaking a log and crafting a wooden pickaxe is possible without external help.
- [ ] Crafting table gives a 3×3 grid and at least 8 working recipes.
- [ ] Hunger affects sprinting/healing; death and respawn work; inventory drops.
- [ ] Night is visibly darker; torches light the area.
- [ ] Reload restores world edits, inventory, position, and time.
- [ ] Stable frame pacing with render distance ≥4; no unbounded memory growth.
- [ ] Desktop Chrome/Firefox latest; keyboard + mouse only.

## 9. Risks and mitigations

- **Meshing/physics bugs:** unit-test world get/set and recipe matching; add a
  debug overlay with coordinates, chunk, and collision state.
- **Software-renderer slowness:** cap render distance, avoid per-frame allocations,
  reuse vectors, pack vertex data, keep draw calls per chunk low.
- **Scope creep (mobs, biomes, redstone):** freeze v1 content matrix; anything else
  goes to a "post-v1" list.
- **Save corruption:** schema version + try/catch + backup slot.
- **Texture/asset licensing:** generate the atlas procedurally at build time (canvas
  or committed PNG authored here); no third-party textures.

## 10. Post-v1 backlog

Furnaces and smelting, passive/hostile mobs, biomes and caves decoration, bed/sleep,
chests, hunger tuning, controller/mobile support, creative mode, world import/export.
