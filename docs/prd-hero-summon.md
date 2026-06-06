# PRD: Hero Summoning (Gold Sink)

## Problem Statement

Players earn gold from quests but have no way to spend it. The roster is capped at six heroes with no acquisition path beyond the starter hero on join.

## Solution

Add `/summon` — spend gold for a weighted random hero pull. Rates follow the rarity table in project docs.

## v1 Rules

- Cost: **100 gold** per summon
- Squad cap: **6 heroes** — summon blocked when full
- Rates: Common 70%, Rare 20%, Epic 7%, Legendary 2.5%, Mythical 0.5%
- Duplicates allowed (separate collection entries)
