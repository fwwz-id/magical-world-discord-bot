export type DailyMissionId = 1 | 2 | 3;

export type DailyMission = {
  id: DailyMissionId;
  name: string;
  description: string;
};

export const DAILY_MISSIONS: DailyMission[] = [
  {
    id: 1,
    name: "Scout the realm",
    description: "View your profile with /profile",
  },
  {
    id: 2,
    name: "Study the grimoire",
    description: "Browse the hero catalogue with /hero",
  },
  {
    id: 3,
    name: "Begin an expedition",
    description: "Start an idle quest with /quest idle start",
  },
];

export function getUtcDateString(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}
