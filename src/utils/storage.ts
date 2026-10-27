import {
  ActiveGameState,
  GameHistoryItem,
  GameSettings,
  LeaderboardItem,
  UserProfile,
  DifficultyLevel,
  DailyResult
} from "../types";

const STORAGE_KEYS = {
  ACTIVE_GAME: "sudoku_active_game_v1",
  GAME_HISTORY: "sudoku_game_history_v1",
  SETTINGS: "sudoku_settings_v1",
  USER_PROFILE: "sudoku_user_profile_v1",
  OFFLINE_LEADERBOARD: "sudoku_offline_leaderboard_v1",
  DAILY_RESULTS: "sudoku_daily_results_v1"
};

export const DEFAULT_SETTINGS: GameSettings = {
  theme: "light-classic",
  realTimeValidation: true,
  highlightDuplicates: true,
  highlightCrosshair: true,
  highlightSameNumbers: true,
  autoClearNotes: true,
  soundEnabled: true,
  hapticEnabled: true,
  maxMistakesLimit: true, // 3 mistakes triggers Game Over
  inputMode: "cell-first"
};

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: "Mestre Sudoku",
  country: "BR",
  avatarIcon: "brain"
};

// Save active game progress
export function saveActiveGame(state: ActiveGameState): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_GAME, JSON.stringify(state));
  } catch (e) {
    console.error("Erro ao salvar progresso do jogo:", e);
  }
}

// Load active game
export function loadActiveGame(): ActiveGameState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_GAME);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// Clear active game
export function clearActiveGame(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_GAME);
  } catch {
    // Ignore
  }
}

// Save match history
export function saveGameHistory(item: GameHistoryItem): void {
  try {
    const existing = loadGameHistory();
    const updated = [item, ...existing].slice(0, 100); // keep up to 100 recent games
    localStorage.setItem(STORAGE_KEYS.GAME_HISTORY, JSON.stringify(updated));
  } catch (e) {
    console.error("Erro ao salvar histórico:", e);
  }
}

// Load match history
export function loadGameHistory(): GameHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GAME_HISTORY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// Clear match history
export function clearGameHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.GAME_HISTORY);
  } catch (e) {
    console.error("Erro ao limpar histórico:", e);
  }
}

// Settings
export function saveSettings(settings: GameSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error("Erro ao salvar configurações:", e);
  }
}

export function loadSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

// User Profile
export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error("Erro ao salvar perfil:", e);
  }
}

export function loadUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (!raw) return DEFAULT_USER_PROFILE;
    return { ...DEFAULT_USER_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_USER_PROFILE;
  }
}

// Offline Leaderboard Fallback
export function saveLocalLeaderboardRecord(item: LeaderboardItem): void {
  try {
    const current = loadLocalLeaderboard();
    const updated = [...current, item];
    localStorage.setItem(STORAGE_KEYS.OFFLINE_LEADERBOARD, JSON.stringify(updated));
  } catch {
    // Ignore
  }
}

export function loadLocalLeaderboard(): LeaderboardItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.OFFLINE_LEADERBOARD);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// Daily challenge results, keyed by challenge date
export function saveDailyResult(result: DailyResult): void {
  try {
    const updated = { ...loadDailyResults(), [result.date]: result };
    localStorage.setItem(STORAGE_KEYS.DAILY_RESULTS, JSON.stringify(updated));
  } catch {
    // Ignore
  }
}

export function loadDailyResults(): Record<string, DailyResult> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DAILY_RESULTS);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

// Calculate player stats summary
export function calculatePlayerStats(history: GameHistoryItem[]) {
  const totalPlayed = history.length;
  const totalWon = history.filter((h) => h.won).length;
  const winRate = totalPlayed > 0 ? Math.round((totalWon / totalPlayed) * 100) : 0;

  const bestTimes: Partial<Record<DifficultyLevel, number>> = {};
  const bestScores: Partial<Record<DifficultyLevel, number>> = {};
  const countsPerDiff: Partial<Record<DifficultyLevel, number>> = {};

  history.forEach((h) => {
    if (h.won) {
      if (!bestTimes[h.difficulty] || h.timeSeconds < bestTimes[h.difficulty]!) {
        bestTimes[h.difficulty] = h.timeSeconds;
      }
      if (!bestScores[h.difficulty] || h.score > bestScores[h.difficulty]!) {
        bestScores[h.difficulty] = h.score;
      }
      countsPerDiff[h.difficulty] = (countsPerDiff[h.difficulty] || 0) + 1;
    }
  });

  // Calculate current streak
  let currentStreak = 0;
  for (const match of history) {
    if (match.won) {
      currentStreak++;
    } else {
      break;
    }
  }

  return {
    totalPlayed,
    totalWon,
    winRate,
    bestTimes,
    bestScores,
    countsPerDiff,
    currentStreak
  };
}
