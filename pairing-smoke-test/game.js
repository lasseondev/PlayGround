(() => {
  'use strict';

  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const status = document.getElementById('status');

  const W = canvas.width;
  const H = canvas.height;
  const COLS = 8;
  const ROWS = 5;
  const BRICK_W = 72;
  const BRICK_H = 22;
  const BRICK_GAP = 8;
  const BRICK_TOP = 64;
  const BRICK_LEFT = (W - (COLS * BRICK_W + (COLS - 1) * BRICK_GAP)) / 2;
  const ROW_COLORS = ['#5eead4', '#60a5fa', '#c084fc', '#f472b6', '#fbbf24'];
  const FONT = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

  const paddle = {
    w: 104,
    h: 14,
    x: (W - 104) / 2,
    y: H - 42,
    speed: 540
  };

  const ball = {
    r: 7,
    x: W / 2,
    y: 0,
    vx: 0,
    vy: 0,
    speed: 340
  };

  const keys = { left: false, right: false };
  let bricks = [];
  let score = 0;
  let lives = 3;
  let phase = 'ready';
  let lastTime = 0;
  let frameCount = 0;
  let announced = '';

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  function buildBricks() {
    bricks = [];
    for (let row = 0; row < ROWS; row += 1) {
      for (let col = 0; col < COLS; col += 1) {
        bricks.push({
          x: BRICK_LEFT + col * (BRICK_W + BRICK_GAP),
          y: BRICK_TOP + row * (BRICK_H + BRICK_GAP),
          w: BRICK_W,
          h: BRICK_H,
          color: ROW_COLORS[row],
          alive: true
        });
      }
    }
  }

  function remainingBricks() {
    return bricks.reduce((total, brick) => total + (brick.alive ? 1 : 0), 0);
  }

  function announce(message) {
    if (message !== announced) {
      announced = message;
      status.textContent = message;
    }
  }

  function setPhase(next) {
    phase = next;
    if (phase === 'ready') announce('Ready. Press Space to launch.');
    if (phase === 'playing') announce('Playing.');
    if (phase === 'paused') announce('Paused. Press P to resume.');
    if (phase === 'over') announce(`Game over. Final score ${score}. Press R to restart.`);
    if (phase === 'won') announce(`You cleared the wall with ${score} points. Press R to play again.`);
  }

  function placeBall() {
    ball.x = paddle.x + paddle.w / 2;
    ball.y = paddle.y - ball.r - 2;
    ball.vx = 0;
    ball.vy = 0;
    setPhase('ready');
  }

  function newGame() {
    score = 0;
    lives = 3;
    paddle.x = (W - paddle.w) / 2;
    buildBricks();
    placeBall();
  }

  function serve() {
    if (phase !== 'ready') return;
    const direction = Math.random() < 0.5 ? -1 : 1;
    const vx = direction * ball.speed * 0.45;
    ball.vx = vx;
    ball.vy = -Math.sqrt(ball.speed * ball.speed - vx * vx);
    setPhase('playing');
  }

  function togglePause() {
    if (phase === 'playing') setPhase('paused');
    else if (phase === 'paused') setPhase('playing');
  }

  function loseBall() {
    lives -= 1;
    if (lives <= 0) {
      setPhase('over');
    } else {
      placeBall();
    }
  }

  function bounceOffBrick(brick) {
    const ballLeft = ball.x - ball.r;
    const ballRight = ball.x + ball.r;
    const ballTop = ball.y - ball.r;
    const ballBottom = ball.y + ball.r;
    const overlapX = Math.min(ballRight - brick.x, brick.x + brick.w - ballLeft);
    const overlapY = Math.min(ballBottom - brick.y, brick.y + brick.h - ballTop);

    if (overlapX < overlapY) {
      if (ball.x < brick.x + brick.w / 2) {
        ball.x = brick.x - ball.r - 0.5;
        ball.vx = -Math.abs(ball.vx);
      } else {
        ball.x = brick.x + brick.w + ball.r + 0.5;
        ball.vx = Math.abs(ball.vx);
      }
    } else if (ball.y < brick.y + brick.h / 2) {
      ball.y = brick.y - ball.r - 0.5;
      ball.vy = -Math.abs(ball.vy);
    } else {
      ball.y = brick.y + brick.h + ball.r + 0.5;
      ball.vy = Math.abs(ball.vy);
    }

    brick.alive = false;
    score += 10;
    if (remainingBricks() === 0) setPhase('won');
  }

  function update(dt) {
    if (phase === 'paused' || phase === 'over' || phase === 'won') return;

    const direction = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
    paddle.x = clamp(paddle.x + direction * paddle.speed * dt, 0, W - paddle.w);

    if (phase === 'ready') {
      ball.x = paddle.x + paddle.w / 2;
      ball.y = paddle.y - ball.r - 2;
      return;
    }

    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;

    if (ball.x - ball.r < 0) {
      ball.x = ball.r;
      ball.vx = Math.abs(ball.vx);
    } else if (ball.x + ball.r > W) {
      ball.x = W - ball.r;
      ball.vx = -Math.abs(ball.vx);
    }

    if (ball.y - ball.r < 0) {
      ball.y = ball.r;
      ball.vy = Math.abs(ball.vy);
    }

    const closestX = clamp(ball.x, paddle.x, paddle.x + paddle.w);
    const closestY = clamp(ball.y, paddle.y, paddle.y + paddle.h);
    const dx = ball.x - closestX;
    const dy = ball.y - closestY;
    if (ball.vy > 0 && dx * dx + dy * dy <= ball.r * ball.r) {
      ball.y = paddle.y - ball.r - 0.5;
      const hit = clamp((ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2), -1, 1);
      const angle = hit * 1.05;
      const speed = Math.min(Math.hypot(ball.vx, ball.vy) + 12, 520);
      ball.vx = speed * Math.sin(angle);
      ball.vy = -Math.abs(speed * Math.cos(angle));
    }

    for (const brick of bricks) {
      if (!brick.alive) continue;
      if (
        ball.x + ball.r > brick.x &&
        ball.x - ball.r < brick.x + brick.w &&
        ball.y + ball.r > brick.y &&
        ball.y - ball.r < brick.y + brick.h
      ) {
        bounceOffBrick(brick);
        break;
      }
    }

    if (ball.y - ball.r > H) loseBall();
  }

  function roundedRect(x, y, w, h, radius) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, radius);
  }

  function drawBackground() {
    const gradient = ctx.createLinearGradient(0, 0, 0, H);
    gradient.addColorStop(0, '#0c1329');
    gradient.addColorStop(1, '#070b17');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.07)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= W; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, H);
      ctx.stroke();
    }
    for (let y = 0; y <= H; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(W, y + 0.5);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawHud() {
    ctx.save();
    ctx.font = `700 15px ${FONT}`;
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'left';
    ctx.fillText(`SCORE ${String(score).padStart(4, '0')}`, 28, 32);
    ctx.textAlign = 'right';
    ctx.fillText(`LIVES ${'●'.repeat(Math.max(0, lives))}`, W - 28, 32);
    ctx.restore();
  }

  function drawBricks() {
    for (const brick of bricks) {
      if (!brick.alive) continue;
      ctx.save();
      ctx.shadowColor = brick.color;
      ctx.shadowBlur = 10;
      roundedRect(brick.x, brick.y, brick.w, brick.h, 5);
      ctx.fillStyle = brick.color;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
      roundedRect(brick.x + 3, brick.y + 3, brick.w - 6, 4, 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function drawPaddle() {
    ctx.save();
    ctx.shadowColor = 'rgba(94, 234, 212, 0.75)';
    ctx.shadowBlur = 22;
    const gradient = ctx.createLinearGradient(paddle.x, 0, paddle.x + paddle.w, 0);
    gradient.addColorStop(0, '#99f6e4');
    gradient.addColorStop(0.5, '#ecfeff');
    gradient.addColorStop(1, '#5eead4');
    roundedRect(paddle.x, paddle.y, paddle.w, paddle.h, 7);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.restore();
  }

  function drawBall() {
    ctx.save();
    ctx.shadowColor = 'rgba(236, 254, 255, 0.9)';
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fillStyle = '#ecfeff';
    ctx.fill();
    ctx.restore();
  }

  function drawOverlay(title, detail, color) {
    ctx.fillStyle = 'rgba(5, 8, 18, 0.62)';
    ctx.fillRect(0, 0, W, H);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = color;
    ctx.font = `800 34px ${FONT}`;
    ctx.fillText(title, W / 2, H / 2 - 12);
    ctx.fillStyle = '#cbd5e1';
    ctx.font = `500 14px ${FONT}`;
    ctx.fillText(detail, W / 2, H / 2 + 32);
    ctx.textAlign = 'left';
  }

  function draw() {
    drawBackground();
    drawBricks();
    drawPaddle();
    drawBall();
    drawHud();

    if (phase === 'ready') {
      ctx.save();
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(236, 254, 255, 0.78)';
      ctx.font = `700 13px ${FONT}`;
      ctx.fillText('PRESS SPACE TO LAUNCH', W / 2, H / 2 + 42);
      ctx.restore();
    } else if (phase === 'paused') {
      drawOverlay('PAUSED', 'PRESS P TO RESUME', '#5eead4');
    } else if (phase === 'over') {
      drawOverlay('GAME OVER', `SCORE ${score} — PRESS R TO RESTART`, '#f472b6');
    } else if (phase === 'won') {
      drawOverlay('WALL CLEARED', `SCORE ${score} — PRESS R TO PLAY AGAIN`, '#fbbf24');
    }
  }

  function frame(time) {
    const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.033) : 0;
    lastTime = time;
    frameCount += 1;
    update(dt);
    draw();
    requestAnimationFrame(frame);
  }

  window.addEventListener('keydown', (event) => {
    const key = event.key;
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', ' '].includes(key)) {
      event.preventDefault();
    }

    if (key === 'ArrowLeft' || key === 'a' || key === 'A') keys.left = true;
    if (key === 'ArrowRight' || key === 'd' || key === 'D') keys.right = true;

    if (key === ' ' || key === 'ArrowUp') {
      if (phase === 'over' || phase === 'won') {
        newGame();
        serve();
      } else {
        serve();
      }
    }

    if (key === 'p' || key === 'P' || key === 'Escape') togglePause();
    if (key === 'r' || key === 'R') newGame();
  });

  window.addEventListener('keyup', (event) => {
    const key = event.key;
    if (key === 'ArrowLeft' || key === 'a' || key === 'A') keys.left = false;
    if (key === 'ArrowRight' || key === 'd' || key === 'D') keys.right = false;
  });

  window.addEventListener('blur', () => {
    keys.left = false;
    keys.right = false;
  });

  // Small hook used by the smoke test to inspect and reset live state.
  window.__pairingSmokeTest = {
    getState: () => ({
      phase,
      score,
      lives,
      bricksRemaining: remainingBricks(),
      paddleX: Math.round(paddle.x),
      ballX: Math.round(ball.x),
      ballY: Math.round(ball.y),
      ballVX: Math.round(ball.vx),
      ballVY: Math.round(ball.vy),
      keys: { ...keys },
      frameCount
    }),
    restart: newGame
  };

  newGame();
  requestAnimationFrame(frame);
})();
