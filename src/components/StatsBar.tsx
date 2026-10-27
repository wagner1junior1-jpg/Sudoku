import React from "react";
import { Play, Pause, AlertCircle, Clock, Zap, Award } from "lucide-react";
import { DifficultyLevel, ThemeId, GameStatus } from "../types";
import { formatTime, DIFFICULTY_CONFIG } from "../utils/sudokuEngine";
import { THEMES } from "../utils/themes";

interface StatsBarProps {
  difficulty: DifficultyLevel;
  timerSeconds: number;
  mistakes: number;
  score: number;
  gameStatus: GameStatus;
  maxMistakesLimit: boolean;
  themeId: ThemeId;
  onTogglePause: () => void;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  difficulty,
  timerSeconds,
  mistakes,
  score,
  gameStatus,
  maxMistakesLimit,
  themeId,
  onTogglePause
}) => {
  const currentTheme = THEMES[themeId] || THEMES["light-classic"];
  const diffInfo = DIFFICULTY_CONFIG[difficulty];
  const isPaused = gameStatus === "paused";
  const isLight = currentTheme.category === "light";
  const dangerText = isLight ? "text-rose-600" : "text-rose-400";
  const warnText = isLight ? "text-amber-700" : "text-amber-400";

  return (
    <div
      id="stats-bar"
      className={`${isLight ? "theme-light" : ""} w-full max-w-md mx-auto px-3 py-1.5 rounded-xl ${currentTheme.cardBg} border flex items-center justify-between gap-2 text-xs select-none shadow-md transition-colors`}
    >
      {/* Mistakes Counter */}
      <div className="flex items-center gap-1.5">
        <span className={`text-[10px] ${currentTheme.textMuted} uppercase font-bold tracking-wider`}>
          Erros:
        </span>
        <span
          className={`font-mono font-bold text-xs px-2 py-0.5 rounded-md ${
            maxMistakesLimit && mistakes >= 3
              ? `${dangerText} bg-rose-500/20 ring-1 ring-rose-500/40 font-black animate-pulse`
              : maxMistakesLimit && mistakes === 2
              ? `${warnText} bg-amber-500/20 ring-1 ring-amber-500/30 font-black`
              : mistakes > 0
              ? `${warnText} bg-amber-500/10`
              : `${currentTheme.textColor} ${currentTheme.buttonBg}`
          }`}
        >
          {maxMistakesLimit ? `${mistakes}/3` : mistakes}
        </span>
      </div>

      {/* Live Score */}
      <div className="flex items-center gap-1.5">
        <span className={`text-[10px] ${currentTheme.textMuted} uppercase font-bold tracking-wider`}>
          Pontos:
        </span>
        <span className={`font-mono font-bold text-xs ${currentTheme.textColor}`}>
          {score.toLocaleString()}
        </span>
      </div>

      {/* Stopwatch Timer & Pause Button */}
      <div className="flex items-center gap-1.5">
        <div
          className="flex items-center gap-1 font-mono font-bold text-sm"
          style={{ color: currentTheme.swatch.accent }}
        >
          <Clock className={`w-3 h-3 ${currentTheme.textMuted}`} />
          <span>{isPaused ? "--:--" : formatTime(timerSeconds)}</span>
        </div>

        <button
          id="btn-pause-toggle"
          onClick={onTogglePause}
          className={`p-1.5 rounded-lg ${currentTheme.buttonBg} transition active:scale-95 cursor-pointer`}
          title={isPaused ? "Continuar jogo" : "Pausar jogo"}
        >
          {isPaused ? (
            <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/30" />
          ) : (
            <Pause className="w-3.5 h-3.5 text-blue-400 fill-blue-400/30" />
          )}
        </button>
      </div>
    </div>
  );
};
