import { describe, expect, it } from "bun:test";
import { applyRewards, computeNextXp } from "./questRewards";

describe("computeNextXp", () => {
  it("returns 100 for level 1", () => {
    expect(computeNextXp(1)).toBe(100);
  });

  it("scales exponentially", () => {
    expect(computeNextXp(2)).toBe(150);
    expect(computeNextXp(3)).toBe(225);
  });
});

describe("applyRewards", () => {
  const base = { level: 1, xp: 0, nextXp: 100, gold: 0 };

  it("adds gold without leveling", () => {
    const result = applyRewards(base, { xp: 50, gold: 25 });

    expect(result.gold).toBe(25);
    expect(result.level).toBe(1);
    expect(result.xp).toBe(50);
    expect(result.levelsGained).toBe(0);
  });

  it("levels up once when xp reaches nextXp", () => {
    const result = applyRewards(base, { xp: 100, gold: 0 });

    expect(result.level).toBe(2);
    expect(result.xp).toBe(0);
    expect(result.nextXp).toBe(150);
    expect(result.levelsGained).toBe(1);
  });

  it("levels up multiple times in one grant", () => {
    const result = applyRewards(base, { xp: 250, gold: 0 });

    expect(result.level).toBe(3);
    expect(result.levelsGained).toBe(2);
  });

  it("carries remainder xp after level-up", () => {
    const result = applyRewards(base, { xp: 125, gold: 0 });

    expect(result.level).toBe(2);
    expect(result.xp).toBe(25);
    expect(result.levelsGained).toBe(1);
  });
});
