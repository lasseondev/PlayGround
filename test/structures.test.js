import test from "node:test";
import assert from "node:assert/strict";
import Matter from "matter-js";
import { GROUND_Y, LEVELS, MATERIALS } from "../src/game/levels.js";

const { Engine, World, Bodies, Composite } = Matter;

function build(level) {
  const engine = Engine.create({ gravity: { x: 0, y: 1, scale: 0.001 }, enableSleeping: true });
  engine.positionIterations = 10;
  engine.velocityIterations = 7;
  const ground = Bodies.rectangle(950, GROUND_Y + 260, 4200, 520, {
    isStatic: true,
    friction: 0.95,
    restitution: 0.02,
  });
  World.add(engine.world, ground);
  const bodies = [];
  for (const data of level.blocks) {
    const mat = MATERIALS[data.material];
    const body = Bodies.rectangle(data.x, data.y, data.w, data.h, {
      density: mat.density,
      friction: mat.friction,
      frictionStatic: 1.1,
      frictionAir: 0.004,
      restitution: mat.restitution,
      angle: data.angle || 0,
      slop: 0.02,
      sleepThreshold: 45,
    });
    body.plugin = { start: { x: data.x, y: data.y } };
    bodies.push(body);
    Composite.add(engine.world, body);
  }
  for (const data of level.pigs) {
    const body = Bodies.circle(data.x, data.y, data.r, {
      density: 0.00105,
      friction: 0.58,
      frictionStatic: 0.8,
      frictionAir: 0.006,
      restitution: 0.24,
      sleepThreshold: 40,
    });
    body.plugin = { start: { x: data.x, y: data.y } };
    bodies.push(body);
    Composite.add(engine.world, body);
  }
  return { engine, bodies };
}

for (const level of LEVELS) {
  test(`level ${level.id} (${level.name}) settles without collapsing on spawn`, () => {
    const { engine, bodies } = build(level);
    for (let i = 0; i < 360; i++) Engine.update(engine, 1000 / 60);
    let maxMove = 0;
    for (const body of bodies) {
      assert.ok(body.position.y < 1060, "body stays on the stage");
      const moved = Math.hypot(body.position.x - body.plugin.start.x, body.position.y - body.plugin.start.y);
      maxMove = Math.max(maxMove, moved);
    }
    assert.ok(maxMove < 14, `level ${level.id} drifted ${maxMove.toFixed(2)}px on spawn`);
  });
}
