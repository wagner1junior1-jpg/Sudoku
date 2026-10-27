import { DailyResult, DifficultyLevel } from "../types";
import { generateSudokuPuzzle } from "./sudokuEngine";

// Index = weekday (0 = domingo): lighter at the start of the week, tougher on weekends
const DAILY_DIFFICULTY_BY_WEEKDAY: DifficultyLevel[] = [
  "especialista",
  "facil",
  "medio",
  "medio",
  "dificil",
  "medio",
  "dificil"
];

// Dates are local "YYYY-MM-DD" keys, so the challenge changes at the player's midnight
export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function fromDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export const todayKey = () => toDateKey(new Date());

export function addDays(key: string, days: number): string {
  const date = fromDateKey(key);
  date.setDate(date.getDate() + days);
  return toDateKey(date);
}

export const getDailyDifficulty = (key: string): DifficultyLevel =>
  DAILY_DIFFICULTY_BY_WEEKDAY[fromDateKey(key).getDay()];

// FNV-1a hash of the date: every device generates the same puzzle for the same day
function dailySeed(key: string): number {
  let hash = 0x811c9dc5;
  for (const ch of `sudoku-master-pro:${key}`) {
    hash ^= ch.charCodeAt(0);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

export const generateDailyPuzzle = (key: string) =>
  generateSudokuPuzzle(getDailyDifficulty(key), dailySeed(key));

// Only challenges finished on their own day count; today still unplayed doesn't break the streak
export function getDailyStreak(
  results: Record<string, DailyResult>,
  today = todayKey()
): { current: number; best: number } {
  const onTime = (key: string) => Boolean(results[key]?.onTime);

  let current = 0;
  for (let day = onTime(today) ? today : addDays(today, -1); onTime(day); day = addDays(day, -1)) {
    current++;
  }

  let best = 0;
  let run = 0;
  let prev: string | null = null;
  for (const key of Object.keys(results).filter(onTime).sort()) {
    run = prev && addDays(prev, 1) === key ? run + 1 : 1;
    best = Math.max(best, run);
    prev = key;
  }

  return { current, best };
}

export const formatDailyDate = (key: string, options: Intl.DateTimeFormatOptions) =>
  fromDateKey(key).toLocaleDateString("pt-BR", options);
