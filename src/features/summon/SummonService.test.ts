import { describe, expect, it, mock, beforeEach } from "bun:test";
import { HeroElement, HeroRarity, HeroRole } from "@prisma/client";
import SummonService from "./SummonService";
import type SummonModel from "./SummonModel";
import { SUMMON_COST } from "./summonRates";

const hero = {
  id: "hero-1",
  name: "Ember",
  role: HeroRole.Damage_Dealer,
  element: HeroElement.Fire,
  rarity: HeroRarity.Common,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const user = {
  id: "user-uuid",
  discordId: "discord-123",
  level: 1,
  xp: 0,
  nextXp: 100,
  gold: SUMMON_COST,
};

function createMockModel(overrides: Partial<SummonModel> = {}): SummonModel {
  return {
    getUserByDiscordId: mock(() => Promise.resolve(user)),
    getSquadCount: mock(() => Promise.resolve(1)),
    getHeroesByRarity: mock(() => Promise.resolve([hero])),
    executeSummon: mock(() =>
      Promise.resolve({
        ok: true as const,
        hero,
        goldRemaining: 0,
      })
    ),
    ...overrides,
  } as unknown as SummonModel;
}

describe("SummonService", () => {
  let model: SummonModel;
  let service: SummonService;

  beforeEach(() => {
    model = createMockModel();
    service = new SummonService(model);
  });

  it("rejects unregistered users", async () => {
    model.getUserByDiscordId = mock(() => Promise.resolve(null));
    service = new SummonService(model);

    const result = await service.summon("unknown");

    expect(result).toEqual({ ok: false, reason: "unregistered" });
  });

  it("rejects when squad is full", async () => {
    model.getSquadCount = mock(() => Promise.resolve(6));
    service = new SummonService(model);

    const result = await service.summon(user.discordId);

    expect(result).toEqual({ ok: false, reason: "squad_full" });
    expect(model.executeSummon).not.toHaveBeenCalled();
  });

  it("rejects when gold is insufficient", async () => {
    model.getUserByDiscordId = mock(() =>
      Promise.resolve({ ...user, gold: SUMMON_COST - 1 })
    );
    service = new SummonService(model);

    const result = await service.summon(user.discordId);

    expect(result).toEqual({
      ok: false,
      reason: "insufficient_gold",
      gold: SUMMON_COST - 1,
    });
  });

  it("rejects when no heroes exist for rolled rarity", async () => {
    model.getHeroesByRarity = mock(() => Promise.resolve([]));
    service = new SummonService(model);

    const result = await service.summon(user.discordId);

    expect(result).toEqual({ ok: false, reason: "no_heroes" });
  });

  it("summons a hero and returns remaining gold", async () => {
    const result = await service.summon(user.discordId);

    expect(result).toEqual({
      ok: true,
      hero,
      goldRemaining: 0,
    });
    expect(model.executeSummon).toHaveBeenCalledWith(user.id, hero);
  });

  it("exposes summon cost and rates", () => {
    expect(service.getCost()).toBe(SUMMON_COST);
    expect(service.getRates()).toHaveLength(5);
  });
});
