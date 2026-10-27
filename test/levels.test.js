import test from "node:test";
import assert from "node:assert/strict";
import {
  BIRDS,
  GROUND_Y,
  LEVELS,
  MATERIALS,
  SLINGSHOT,
  THEMES,
  blockHealth,
  levelScoreStars,
  pigHealth,
} from "../src/game/levels.js";

test("every level is playable data with valid materials, birds and stars", () => {
  assert.equal(LEVELS.length, 5);
  const ids = new Set();
  for (const [index, level] of LEVELS.entries()) {
    assert.equal(level.id, index + 1, "level ids are sequential");
    assert.ok(!ids.has(level.id), "level ids are unique");
    ids.add(level.id);
    assert.ok(level.name.length > 2);
    assert.ok(THEMES[level.theme], `theme ${level.theme} exists`);
    assert.ok(level.birds.length >= 3, "at least three birds");
    for (const type of level.birds) assert.ok(BIRDS[type], `bird ${type} exists`);
    assert.ok(level.pigs.length >= 2, "at least two pigs");
    assert.ok(level.stars.length === 3);
    assert.ok(level.stars[0] < level.stars[1] && level.stars[1] < level.stars[2], "stars ascend");
    assert.ok(level.blocks.length >= 4);

    for (const block of level.blocks) {
      assert.ok(MATERIALS[block.material], `material ${block.material} exists`);
      assert.ok(block.w > 0 && block.h > 0);
      assert.ok(block.x > 0 && block.x < 1900);
      const bottom = block.y + block.h / 2;
      assert.ok(bottom <= GROUND_Y + 1.5, `block ${level.id} ${block.x} sits above ground`);
      assert.ok(blockHealth(block) > 20);
    }
    for (const pig of level.pigs) {
      assert.ok(pig.r >= 20 && pig.r <= 40);
      assert.ok(pig.y + pig.r <= GROUND_Y + 1.5, "pig sits above ground");
      assert.ok(pigHealth(pig) >= 40);
    }
  }
});

test("slingshot and scoring config stay inside the world", () => {
  assert.ok(SLINGSHOT.maxPull > 100);
  assert.ok(SLINGSHOT.maxSpeed > SLINGSHOT.minSpeed);
  assert.ok(SLINGSHOT.anchorY < GROUND_Y);
  const level = LEVELS[0];
  assert.equal(levelScoreStars(level, 0), 0);
  assert.equal(levelScoreStars(level, level.stars[0]), 1);
  assert.equal(levelScoreStars(level, level.stars[1]), 2);
  assert.equal(levelScoreStars(level, level.stars[2]), 3);
});

test("all bird types expose sane physics and abilities", () => {
  for (const [key, bird] of Object.entries(BIRDS)) {
    assert.ok(bird.radius >= 18 && bird.radius <= 34, `${key} radius`);
    assert.ok(bird.density > 0);
    assert.ok(bird.ability === null || typeof bird.ability === "string");
    if (bird.ability) assert.ok(bird.abilityLabel.length > 3);
  }
});
