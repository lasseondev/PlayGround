# Pairing Smoke Test — Paddle

A tiny, dependency-free paddle game. Move the paddle, keep the ball in play, and clear
all five rows of bricks.

## Run

Open `index.html` directly, or serve the parent folder:

```bash
python3 -m http.server 4173
# then open http://localhost:4173/pairing-smoke-test/
```

## Controls

| Key | Action |
| --- | --- |
| `←` / `→` or `A` / `D` | Move the paddle |
| `Space` / `↑` | Launch the ball |
| `P` / `Esc` | Pause or resume |
| `R` | Restart |

## Rules

- Each brick is worth 10 points.
- You have three lives; a lost ball costs one.
- Clear every brick to win.
- The ball speeds up slightly on each paddle hit.

## Files

- `index.html` — page shell and controls legend
- `style.css` — layout and presentation
- `game.js` — canvas rendering, input, and physics
