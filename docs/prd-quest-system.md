# PRD: Quest System (Daily, Idle, Story Stub)

## Problem Statement

Magical World Discord Bot has account management, a hero catalogue, and a starter hero on join — but players have no repeatable gameplay loop. Level, XP, and `nextXp` exist on the user record but never change after registration. There is no way to earn gold, progress through levels, or engage with the idle RPG vision described in the project docs. Players who join quickly exhaust what the bot offers and have no reason to return daily.

## Solution

Introduce a **quest system** as the core progression loop: three daily missions, one-hour idle expeditions, and a story-mode stub that previews future PvE combat. Completing and claiming quests grants **XP and gold**, driving exponential level-ups. Daily missions are tracked passively when players use existing commands; rewards are claimed manually via `/quest daily` embed buttons. Idle quests use explicit subcommands to start and claim. Story mode is a roadmap embed only — no combat in this release.

## User Stories

1. As a new adventurer, I want to see quest commands in `/help`, so that I know how to progress after joining.
2. As a registered player, I want to run `/quest daily` to see my three daily missions, so that I understand what to do today.
3. As a registered player, I want daily missions to reset at UTC midnight, so that I have fresh goals every day.
4. As a registered player, I want mission progress to update automatically when I use `/profile`, so that "Scout the realm" completes without extra steps.
5. As a registered player, I want mission progress to update when I use `/hero`, so that "Study the grimoire" completes when I browse the catalogue.
6. As a registered player, I want mission progress to update when I run `/quest idle start`, so that "Begin an expedition" completes when I start an idle run.
7. As a registered player, I want to see per-mission progress on the daily embed (e.g. complete vs incomplete), so that I know what is left to do.
8. As a registered player, I want Claim buttons on completed daily missions, so that I can collect rewards in one tap.
9. As a registered player, I want each daily mission to grant 25 XP and 50 gold on claim, so that completing all three missions feels meaningfully rewarding.
10. As a registered player, I want to be prevented from claiming the same daily mission twice in one day, so that rewards cannot be exploited.
11. As a registered player, I want to run `/quest idle start` to begin a one-hour expedition, so that I can earn passive rewards.
12. As a registered player, I want only one idle expedition active at a time, so that the idle loop stays simple and predictable.
13. As a registered player, I want `/quest idle start` to show remaining time if an expedition is already running, so that I know when I can claim.
14. As a registered player, I want `/quest idle claim` to grant 10 XP and 20 gold when the timer has elapsed, so that idle play contributes to progression.
15. As a registered player, I want `/quest idle claim` to show time remaining when the timer has not elapsed, so that I know when to come back.
16. As a registered player, I want level-up to happen automatically when claim rewards push me over `nextXp`, so that progression feels immediate.
17. As a registered player, I want to level up multiple times in a single claim if rewards are large enough, so that the progression math stays correct long-term.
18. As a registered player, I want claim responses to mention level-ups when they occur, so that I get positive feedback.
19. As a registered player, I want `/profile` to display my gold balance, so that I can track currency earned from quests.
20. As a registered player, I want unregistered users to receive the existing unregistered embed when using quest commands, so that onboarding stays consistent.
21. As a registered player, I want to run `/quest story` to see Chapter 1 lore and a feature roadmap, so that I understand where the game is headed.
22. As a registered player, I want the story embed to mention elemental combat, squad limits, and chapter rewards, so that the long-term vision is visible.
23. As a developer, I want quest business logic separated from Discord embed formatting, so that services remain testable and maintainable.
24. As a developer, I want a single `applyRewards` pathway for XP and gold, so that daily and idle claims share consistent leveling behavior.
25. As a developer, I want daily quest state in a dedicated table keyed by user and UTC date, so that resets do not mutate unrelated user fields.
26. As a developer, I want idle quest state in a dedicated table, so that timer logic is isolated from daily progress.
27. As a developer, I want button interactions for daily claims routed through the bot interaction handler, so that Claim buttons work reliably.
28. As a returning player, I want to complete all three dailies and one idle run in a single session (with wait), so that the full loop is playable end-to-end.

## Implementation Decisions

### Modules to build or modify

| Module | Role | Depth |
|--------|------|-------|
| **ProgressionService** (or `questRewards`) | `applyRewards(userId, { xp, gold })`, `computeNextXp(level)`, multi-level loop | Deep — pure logic, no Discord imports |
| **QuestService** | Daily board, mission tracking hooks, idle start/claim, claim validation | Deep — orchestrates models + progression |
| **QuestModel** | Prisma access for `DailyQuestProgress`, `IdleQuest`, user gold reads/writes | Shallow — data access only |
| **QuestResponse** | Embeds, Claim button rows, story roadmap embed | Shallow — Discord presentation |
| **Quest command** | `/quest` with subcommands: `daily`, `idle start`, `idle claim`, `story` | Shallow — delegates to service/response |
| **Bot interaction handler** | Extend beyond slash commands to handle button `customId` for daily claims | Shallow — routing only |
| **UserService / UserResponse** | Refactor: move `EmbedBuilder` construction out of UserService into UserResponse | Cleanup — align with quest layering |
| **Profile command / response** | Add gold field to profile embed | Shallow |
| **Existing commands** | `/profile`, `/hero` call QuestService mission hook after success | Shallow — one-line hook |

### Schema changes

```
User
  + gold Int @default(0)

DailyQuestProgress
  userId, date (UTC date string or Date at midnight UTC)
  mission1Completed, mission1Claimed
  mission2Completed, mission2Claimed
  mission3Completed, mission3Claimed
  @@unique([userId, date])

IdleQuest
  userId (unique while active — one row per user)
  startedAt, endsAt
  claimed Boolean
```

### Progression contract

```typescript
// nextXp for level L (1-indexed current level before level-up):
nextXp = floor(100 * 1.5 ** (level - 1))

// applyRewards pseudocode:
gold += reward.gold
xp += reward.xp
while (xp >= nextXp) {
  xp -= nextXp
  level += 1
  nextXp = computeNextXp(level)
}
```

### Reward constants (v1)

| Source | XP | Gold |
|--------|-----|------|
| Daily mission (each of 3) | 25 | 50 |
| Idle expedition (1 hour) | 10 | 20 |

### Daily missions

| # | Name | Trigger command |
|---|------|-----------------|
| 1 | Scout the realm | `/profile` |
| 2 | Study the grimoire | `/hero` (any invocation) |
| 3 | Begin an expedition | `/quest idle start` |

Reset: new `DailyQuestProgress` row when UTC date changes.

### Command tree (hybrid UX)

- `/quest daily` — embed listing 3 missions + Claim buttons for completed-unclaimed missions
- `/quest idle start` — start 1h timer or show remaining time
- `/quest idle claim` — claim if `now >= endsAt`, else show countdown
- `/quest story` — Chapter 1 teaser + roadmap embed (no DB reads)

### Button interaction contract

- `customId` format encodes mission index and user scope, e.g. `quest:daily:claim:1:<userId>` or validated via interaction user id on receipt
- Handler validates: user owns interaction, mission complete, not yet claimed, correct UTC day
- On success: `applyRewards`, mark claimed, edit reply or follow-up embed with result

### Layering rule (from refactor decision)

- **Service** returns plain data structures (mission status, timers, claim results, level-up info)
- **Response** converts to `EmbedBuilder` + `ActionRowBuilder`
- No `discord.js` imports in ProgressionService or QuestService

### Story stub content (`/quest story`)

- Title: Chapter 1 — The Shimmering Gate
- Short lore paragraph (rift, squad, elemental weaknesses)
- Roadmap bullets: elemental combat, squad of 6 heroes, chapter rewards
- Footer: combat system in development

## Testing Decisions

**What makes a good test:** Assert externally observable outcomes — XP/gold/level values after `applyRewards`, mission flags after hooks, idle timer rejection when one is active, claim rejection when already claimed. Do not assert embed field ordering or Discord API calls.

**Modules to test (recommended):**

| Module | Priority | Rationale |
|--------|----------|-----------|
| **ProgressionService / questRewards** | High | Pure functions; multi-level edge cases are easy to table-test |
| **QuestService** (daily hooks, claim validation, idle lifecycle) | High | Core game rules; test with mocked model or in-memory DB |
| **QuestResponse** | Low | Presentation only; manual Discord verification sufficient for v1 |
| **Quest command handlers** | Low | Thin wrappers; integration tested manually |

**Prior art:** Project currently has no automated test suite (`npm test` is a stub). First tests would establish pattern — prefer unit tests on ProgressionService and QuestService using Vitest or Jest (align with future test runner choice).

**Suggested test cases:**

- `applyRewards`: 0 XP → no level change; exact `nextXp` → level +1 with 0 remainder; 2× `nextXp` → two levels in one call
- Daily: hook on `/profile` sets mission1 complete; claim sets mission1 claimed + rewards; second claim rejected
- Daily: UTC date rollover creates fresh row with all missions incomplete
- Idle: start sets `endsAt = startedAt + 1h`; claim before end rejected; claim after end grants rewards and marks claimed
- Idle: second `start` while active returns remaining duration without resetting timer

## Out of Scope

- Story mode combat, enemies, win/loss, chapter progression table
- Premium quests, crystals, or paid currency
- Quest types beyond the three defined dailies and single idle slot
- Telegram or multi-platform adapters
- Inventory, summoning/gacha, guilds, PvP, dungeons, enchanting, mail/gifts
- Automatic reward granting (rewards require explicit claim)
- Tiered idle durations (1h / 4h / 8h) — deferred to future release
- Cron jobs for idle completion notifications — players claim manually
- `/help` auto-discovery updates beyond registering new `/quest` subcommands

## Further Notes

- Existing bot only handles `interaction.isChatInputCommand()`; button support requires extending the `interactionCreate` handler (pattern exists in `/delete-account` via `awaitMessageComponent`, but daily claims need persistent `customId` buttons on the daily embed).
- `UserService` currently mixes business logic and `EmbedBuilder` creation; refactor should happen in the same PR to avoid duplicating the anti-pattern in quest code.
- Domain vocabulary from project docs: **heroes** (roles, elements, rarities), **squad** (max 6), **adventurer** (registered user), **realm** (game world).
- After this PR, natural follow-ups: gold sink (summon), inventory resource display, story combat engine.
