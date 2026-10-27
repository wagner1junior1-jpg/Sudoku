export type DifficultyLevel = "facil" | "medio" | "dificil" | "especialista" | "mestre";

export type InputMode = "cell-first" | "number-first";

export interface CellPosition {
  row: number;
  col: number;
}

export interface CellData {
  row: number;
  col: number;
  value: number; // 0 for empty, 1-9
  solutionValue: number;
  isInitial: boolean;
  notes: number[]; // numbers 1-9 as pencil marks
  isError: boolean;
  isConflict: boolean;
  isHinted?: boolean;
}

export type BoardMatrix = CellData[][];

export type GameStatus = "home" | "idle" | "playing" | "paused" | "completed" | "game_over";

export interface GameMoveHistory {
  row: number;
  col: number;
  prevValue: number;
  newValue: number;
  prevNotes: number[];
  newNotes: number[];
  type: "value" | "note" | "erase" | "hint";
}

export interface GameHistoryItem {
  id: string;
  date: string;
  difficulty: DifficultyLevel;
  timeSeconds: number;
  score: number;
  mistakes: number;
  hintsUsed: number;
  won: boolean;
  completedAt: string;
}

export interface LeaderboardItem {
  id: string;
  name: string;
  country: string;
  difficulty: DifficultyLevel;
  timeSeconds: number;
  score: number;
  date: string;
  isUser?: boolean;
}

export type ThemeId =
  | "dark-slate"
  | "dark-oled"
  | "dark-cyber"
  | "emerald-forest"
  | "sunset-amber"
  | "ruby-crimson"
  | "warm-paper"
  | "light-classic";

export interface GameSettings {
  theme: ThemeId;
  realTimeValidation: boolean;
  highlightDuplicates: boolean;
  highlightCrosshair: boolean;
  highlightSameNumbers: boolean;
  autoClearNotes: boolean;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  maxMistakesLimit: boolean; // 3 mistakes limit or unlimited
  inputMode: InputMode;
}

export interface ActiveGameState {
  board: BoardMatrix;
  solution: number[][];
  initialGrid: number[][];
  difficulty: DifficultyLevel;
  timerSeconds: number;
  mistakes: number;
  hintsUsed: number;
  score: number;
  gameStatus: GameStatus;
  historyStack: GameMoveHistory[];
  redoStack: GameMoveHistory[];
  lastUpdated: number;
}

export interface HintExplanation {
  type: "naked_single" | "hidden_single" | "advanced_logic" | "error_correction";
  position: CellPosition;
  value: number;
  title: string;
  explanation: string;
  highlightCells?: CellPosition[];
}

export interface UserProfile {
  name: string;
  country: string;
  avatarIcon: string;
}

export type AchievementCategory = "all" | "iniciante" | "velocidade" | "precisao" | "desafio";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: "iniciante" | "velocidade" | "precisao" | "desafio";
  iconName: string;
  points: number;
  unlockedAt?: string;
  progress?: number; // 0-100
  reqText?: string;
}

export interface AchievementUnlockEvent {
  achievement: Achievement;
  isNew: boolean;
}
