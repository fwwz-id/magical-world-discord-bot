export const DAILY_MISSION_XP = 25;
export const DAILY_MISSION_GOLD = 50;
export const IDLE_QUEST_XP = 10;
export const IDLE_QUEST_GOLD = 20;

export const IDLE_DURATION_MS = 60 * 60 * 1000;

export type RewardGrant = {
  xp: number;
  gold: number;
};

export type ProgressionState = {
  level: number;
  xp: number;
  nextXp: number;
  gold: number;
};

export type ApplyRewardsResult = ProgressionState & {
  levelsGained: number;
};

export function computeNextXp(level: number): number {
  return Math.floor(100 * 1.5 ** (level - 1));
}

export function applyRewards(
  state: ProgressionState,
  reward: RewardGrant
): ApplyRewardsResult {
  let { level, xp, nextXp, gold } = state;
  let levelsGained = 0;

  gold += reward.gold;
  xp += reward.xp;

  while (xp >= nextXp) {
    xp -= nextXp;
    level += 1;
    levelsGained += 1;
    nextXp = computeNextXp(level);
  }

  return { level, xp, nextXp, gold, levelsGained };
}
