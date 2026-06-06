import { describe, expect, it, mock, beforeEach } from "bun:test";
import QuestService from "./QuestService";
import type QuestModel from "./QuestModel";
import { getUtcDateString } from "./questMissions";

const user = {
  id: "user-uuid",
  discordId: "discord-123",
  level: 1,
  xp: 0,
  nextXp: 100,
  gold: 0,
};

function createMockModel(overrides: Partial<QuestModel> = {}): QuestModel {
  return {
    getUserByDiscordId: mock(() => Promise.resolve(user)),
    getOrCreateDailyProgress: mock(() =>
      Promise.resolve({
        id: "progress-uuid",
        userId: user.id,
        date: getUtcDateString(),
        mission1Completed: false,
        mission1Claimed: false,
        mission2Completed: false,
        mission2Claimed: false,
        mission3Completed: false,
        mission3Claimed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    ),
    completeMission: mock(() => Promise.resolve({})),
    claimMission: mock(() =>
      Promise.resolve({
        ok: true as const,
        progression: {
          level: 1,
          xp: 25,
          nextXp: 100,
          gold: 50,
          levelsGained: 0,
        },
      })
    ),
    startIdleQuest: mock(() =>
      Promise.resolve({
        ok: true as const,
        idle: {
          id: "idle-uuid",
          userId: user.id,
          startedAt: new Date(),
          endsAt: new Date(Date.now() + 3_600_000),
          claimed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })
    ),
    claimIdleQuest: mock(() =>
      Promise.resolve({
        ok: true as const,
        progression: {
          level: 1,
          xp: 10,
          nextXp: 100,
          gold: 20,
          levelsGained: 0,
        },
      })
    ),
    ...overrides,
  } as unknown as QuestModel;
}

describe("QuestService", () => {
  let model: QuestModel;
  let service: QuestService;

  beforeEach(() => {
    model = createMockModel();
    service = new QuestService(model);
  });

  it("returns null daily board for unregistered users", async () => {
    model.getUserByDiscordId = mock(() => Promise.resolve(null));
    service = new QuestService(model);

    const board = await service.getDailyBoard("unknown");

    expect(board).toBeNull();
  });

  it("tracks mission 1 when user is registered", async () => {
    await service.trackMission(user.discordId, 1);

    expect(model.completeMission).toHaveBeenCalledWith(user.id, 1);
  });

  it("does not track mission for unregistered users", async () => {
    model.getUserByDiscordId = mock(() => Promise.resolve(null));
    service = new QuestService(model);

    await service.trackMission("unknown", 1);

    expect(model.completeMission).not.toHaveBeenCalled();
  });

  it("rejects daily claim when mission is incomplete", async () => {
    model.claimMission = mock(() =>
      Promise.resolve({ ok: false as const, reason: "incomplete" as const })
    );
    service = new QuestService(model);

    const result = await service.claimDailyMission(user.discordId, 1);

    expect(result).toEqual({ ok: false, reason: "incomplete" });
  });

  it("rejects duplicate daily claim", async () => {
    model.claimMission = mock(() =>
      Promise.resolve({ ok: false as const, reason: "already_claimed" as const })
    );
    service = new QuestService(model);

    const result = await service.claimDailyMission(user.discordId, 1);

    expect(result).toEqual({ ok: false, reason: "already_claimed" });
  });

  it("completes mission 3 when idle expedition starts", async () => {
    await service.startIdle(user.discordId);

    expect(model.startIdleQuest).toHaveBeenCalledWith(user.id);
    expect(model.completeMission).toHaveBeenCalledWith(user.id, 3);
  });

  it("returns in-progress when idle timer is active", async () => {
    const endsAt = new Date(Date.now() + 1_800_000);
    model.startIdleQuest = mock(() =>
      Promise.resolve({
        ok: false as const,
        reason: "in_progress" as const,
        endsAt,
      })
    );
    service = new QuestService(model);

    const result = await service.startIdle(user.discordId);

    expect(result).toEqual({ ok: false, reason: "in_progress", endsAt });
    expect(model.completeMission).not.toHaveBeenCalled();
  });

  it("rejects idle claim before timer ends", async () => {
    const endsAt = new Date(Date.now() + 1_800_000);
    model.claimIdleQuest = mock(() =>
      Promise.resolve({
        ok: false as const,
        reason: "not_ready" as const,
        endsAt,
      })
    );
    service = new QuestService(model);

    const result = await service.claimIdle(user.discordId);

    expect(result).toEqual({ ok: false, reason: "not_ready", endsAt });
  });
});
