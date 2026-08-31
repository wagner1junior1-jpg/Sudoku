import {
  Achievement,
  DifficultyLevel,
  GameHistoryItem,
  GameMoveHistory
} from "../types";

export const ACHIEVEMENTS_LIST: Achievement[] = [
  {
    id: "first_win",
    title: "Primeiro Triunfo",
    description: "Conclua e vença sua primeira partida de Sudoku.",
    category: "iniciante",
    iconName: "Trophy",
    points: 100,
    reqText: "1 vitória"
  },
  {
    id: "no_mistakes",
    title: "Mente Impecável",
    description: "Vença uma partida sem cometer nenhum erro (0 erros).",
    category: "precisao",
    iconName: "CheckCircle",
    points: 200,
    reqText: "0 erros em qualquer partida"
  },
  {
    id: "no_hints",
    title: "Mestre Autossuficiente",
    description: "Resolva o tabuleiro inteiro sem usar nenhuma dica.",
    category: "precisao",
    iconName: "Brain",
    points: 150,
    reqText: "0 dicas usadas"
  },
  {
    id: "speed_demon_5m",
    title: "Velocista do Raciocínio",
    description: "Conclua uma partida vitoriosa em menos de 5 minutos.",
    category: "velocidade",
    iconName: "Zap",
    points: 250,
    reqText: "Tempo < 5:00"
  },
  {
    id: "speed_demon_3m",
    title: "Relâmpago do Tabuleiro",
    description: "Conclua um tabuleiro em menos de 3 minutos.",
    category: "velocidade",
    iconName: "Timer",
    points: 400,
    reqText: "Tempo < 3:00"
  },
  {
    id: "hard_or_master",
    title: "Desafio Superior",
    description: "Vença uma partida na dificuldade Difícil, Especialista ou Mestre.",
    category: "desafio",
    iconName: "Flame",
    points: 350,
    reqText: "Difícil, Especialista ou Mestre"
  },
  {
    id: "master_legend",
    title: "Grande Mestre Absoluto",
    description: "Conquiste uma vitória na dificuldade Mestre.",
    category: "desafio",
    iconName: "Crown",
    points: 500,
    reqText: "Vitória no nível Mestre"
  },
  {
    id: "perfect_game",
    title: "Execução Perfeita",
    description: "Vença no Médio ou superior com 0 erros, 0 dicas e em menos de 7 minutos.",
    category: "precisao",
    iconName: "Sparkles",
    points: 600,
    reqText: "Médio+, 0 erros, 0 dicas, < 7m"
  },
  {
    id: "notes_tactician",
    title: "Estrategista de Rascunhos",
    description: "Vença uma partida utilizando anotações a lápis (notas).",
    category: "iniciante",
    iconName: "Edit3",
    points: 100,
    reqText: "Usar lápis durante o jogo"
  },
  {
    id: "streak_3",
    title: "Sequência de Vitória",
    description: "Conquiste 3 vitórias consecutivas sem derrotas.",
    category: "desafio",
    iconName: "TrendingUp",
    points: 300,
    reqText: "3 vitórias seguidas"
  },
  {
    id: "veteran_5",
    title: "Veterano dos Números",
    description: "Conclua 5 partidas vitoriosas no total.",
    category: "iniciante",
    iconName: "Award",
    points: 250,
    reqText: "5 vitórias acumuladas"
  },
  {
    id: "score_elite",
    title: "Pontuação de Elite",
    description: "Alcance mais de 7.500 pontos em uma única partida.",
    category: "desafio",
    iconName: "Star",
    points: 350,
    reqText: "7.500+ pontos em 1 jogo"
  }
];

const STORAGE_ACHIEVEMENTS_KEY = "sudoku_achievements_v1";

export function loadUnlockedAchievementsMap(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_ACHIEVEMENTS_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function saveUnlockedAchievementsMap(map: Record<string, string>): void {
  try {
    localStorage.setItem(STORAGE_ACHIEVEMENTS_KEY, JSON.stringify(map));
  } catch (e) {
    console.error("Erro ao salvar conquistas:", e);
  }
}

export interface MatchCheckContext {
  difficulty: DifficultyLevel;
  timeSeconds: number;
  score: number;
  mistakes: number;
  hintsUsed: number;
  historyStack: GameMoveHistory[];
  allHistory: GameHistoryItem[];
}

export function evaluateAchievements(ctx: MatchCheckContext): Achievement[] {
  const currentUnlockedMap = loadUnlockedAchievementsMap();
  const newlyUnlocked: Achievement[] = [];
  const updatedMap = { ...currentUnlockedMap };
  const nowStr = new Date().toISOString();

  const unlock = (achievementId: string) => {
    if (!updatedMap[achievementId]) {
      updatedMap[achievementId] = nowStr;
      const item = ACHIEVEMENTS_LIST.find((a) => a.id === achievementId);
      if (item) {
        newlyUnlocked.push({ ...item, unlockedAt: nowStr });
      }
    }
  };

  const wonHistory = ctx.allHistory.filter((h) => h.won);
  const totalWins = wonHistory.length + 1; // including current win

  // 1. First win
  unlock("first_win");

  // 2. No mistakes
  if (ctx.mistakes === 0) {
    unlock("no_mistakes");
  }

  // 3. No hints
  if (ctx.hintsUsed === 0) {
    unlock("no_hints");
  }

  // 4. Speed < 5m
  if (ctx.timeSeconds <= 300) {
    unlock("speed_demon_5m");
  }

  // 5. Speed < 3m
  if (ctx.timeSeconds <= 180) {
    unlock("speed_demon_3m");
  }

  // 6. Hard, Specialist or Master
  if (["dificil", "especialista", "mestre"].includes(ctx.difficulty)) {
    unlock("hard_or_master");
  }

  // 7. Master legend
  if (ctx.difficulty === "mestre") {
    unlock("master_legend");
  }

  // 8. Perfect game
  if (
    ["medio", "dificil", "especialista", "mestre"].includes(ctx.difficulty) &&
    ctx.mistakes === 0 &&
    ctx.hintsUsed === 0 &&
    ctx.timeSeconds <= 420
  ) {
    unlock("perfect_game");
  }

  // 9. Notes tactician
  const hasUsedNotes = ctx.historyStack.some((m) => m.type === "note" || m.newNotes.length > 0);
  if (hasUsedNotes) {
    unlock("notes_tactician");
  }

  // 10. Streak 3
  let currentStreak = 1;
  for (const match of ctx.allHistory) {
    if (match.won) currentStreak++;
    else break;
  }
  if (currentStreak >= 3) {
    unlock("streak_3");
  }

  // 11. Veteran 5
  if (totalWins >= 5) {
    unlock("veteran_5");
  }

  // 12. Score elite
  if (ctx.score >= 7500) {
    unlock("score_elite");
  }

  if (newlyUnlocked.length > 0) {
    saveUnlockedAchievementsMap(updatedMap);
  }

  return newlyUnlocked;
}

export function getAllAchievementsWithStatus(allHistory: GameHistoryItem[]): {
  achievements: Achievement[];
  unlockedCount: number;
  totalPoints: number;
  earnedPoints: number;
} {
  const map = loadUnlockedAchievementsMap();
  const wonHistory = allHistory.filter((h) => h.won);
  const totalWins = wonHistory.length;

  let earnedPoints = 0;
  let totalPoints = 0;
  let unlockedCount = 0;

  const achievements = ACHIEVEMENTS_LIST.map((ach) => {
    totalPoints += ach.points;
    const unlockedAt = map[ach.id];
    const isUnlocked = Boolean(unlockedAt);

    if (isUnlocked) {
      unlockedCount++;
      earnedPoints += ach.points;
    }

    let progress = isUnlocked ? 100 : 0;
    if (!isUnlocked) {
      if (ach.id === "first_win") progress = totalWins > 0 ? 100 : 0;
      else if (ach.id === "veteran_5") progress = Math.min(100, Math.round((totalWins / 5) * 100));
    }

    return {
      ...ach,
      unlockedAt,
      progress
    };
  });

  return {
    achievements,
    unlockedCount,
    totalPoints,
    earnedPoints
  };
}
