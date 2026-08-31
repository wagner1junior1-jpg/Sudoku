import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import {
  Trophy,
  Clock,
  Award,
  AlertCircle,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Zap,
  Flame,
  Crown
} from "lucide-react";
import { DifficultyLevel, ThemeId, UserProfile, Achievement } from "../types";
import { formatTime, DIFFICULTY_CONFIG } from "../utils/sudokuEngine";
import { THEMES } from "../utils/themes";

interface WinCelebrationModalProps {
  difficulty: DifficultyLevel;
  timeSeconds: number;
  score: number;
  mistakes: number;
  hintsUsed: number;
  userProfile: UserProfile;
  themeId: ThemeId;
  unlockedAchievements?: Achievement[];
  onPlayAgain: () => void;
  onOpenLeaderboard: () => void;
  onOpenAchievements?: () => void;
  onGoHome?: () => void;
}

export const WinCelebrationModal: React.FC<WinCelebrationModalProps> = ({
  difficulty,
  timeSeconds,
  score,
  mistakes,
  hintsUsed,
  themeId,
  unlockedAchievements = [],
  onPlayAgain,
  onOpenLeaderboard,
  onOpenAchievements,
  onGoHome
}) => {
  const currentTheme = THEMES[themeId] || THEMES["light-classic"];
  const diffInfo = DIFFICULTY_CONFIG[difficulty];
  const [displayScore, setDisplayScore] = useState(0);

  // Animated score counter increment
  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const steps = 30;
    const increment = score / steps;
    const intervalTime = duration / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.floor(start));
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [score]);

  // Multistage Festive Fireworks & Confetti Cannon Blast
  useEffect(() => {
    try {
      // Wave 1: Center blast with primary burst
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#3b82f6", "#f59e0b", "#10b981", "#ec4899", "#8b5cf6"]
      });

      // Wave 2: Left and right cannons
      const t1 = setTimeout(() => {
        confetti({
          particleCount: 80,
          angle: 60,
          spread: 60,
          origin: { x: 0.05, y: 0.7 },
          colors: ["#f59e0b", "#fbbf24", "#3b82f6", "#60a5fa"]
        });
        confetti({
          particleCount: 80,
          angle: 120,
          spread: 60,
          origin: { x: 0.95, y: 0.7 },
          colors: ["#10b981", "#34d399", "#a855f7", "#c084fc"]
        });
      }, 350);

      // Wave 3: Star shower & golden glitter
      const t2 = setTimeout(() => {
        confetti({
          particleCount: 60,
          spread: 100,
          origin: { y: 0.4 },
          shapes: ["star", "circle"],
          colors: ["#ffd700", "#ffae19", "#ffffff", "#38bdf8"]
        });
      }, 750);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    } catch {
      // Fallback
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto animate-fade-in">
      <div
        className={`w-full max-w-sm p-5 rounded-2xl ${currentTheme.cardBg} border shadow-2xl flex flex-col items-center gap-3.5 text-center animate-scale-up`}
      >
        {/* Victory Trophy Icon with Animated Glow */}
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/40 animate-pulse">
            <Trophy className="w-9 h-9 fill-slate-950/20" />
          </div>
          <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-[11px] font-bold border-2 border-white shadow-md">
            ★
          </div>
        </div>

        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-500/15 text-blue-500 border border-blue-500/30">
            {diffInfo.label} Concluído
          </span>
          <h2 className={`text-2xl font-bold ${currentTheme.textColor} mt-1.5 font-['Outfit']`}>
            Vitória Espetacular!
          </h2>
          <p className={`text-xs ${currentTheme.textMuted} mt-0.5`}>
            Tabuleiro concluído com sucesso e salvo nos recordes.
          </p>
        </div>

        {/* Newly Unlocked Achievements in this Match */}
        {unlockedAchievements.length > 0 && (
          <div className="w-full p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-left flex flex-col gap-1.5 animate-bounce-in">
            <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-300 text-[11px] font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Conquista Desbloqueada!</span>
            </div>
            {unlockedAchievements.map((ach) => (
              <div key={ach.id} className="flex items-center justify-between gap-2">
                <span className={`text-xs font-bold ${currentTheme.textColor} truncate`}>
                  🏆 {ach.title}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-600 dark:text-amber-200">
                  +{ach.points} XP
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Stats Grid */}
        <div className="w-full grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-black/5 dark:bg-black/30 border border-black/5 dark:border-white/5">
          <div className="flex flex-col items-center p-2 rounded-lg bg-white dark:bg-white/5 shadow-xs">
            <div className="flex items-center gap-1 text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-0.5">
              <Clock className="w-3 h-3 text-blue-500" />
              <span>Tempo</span>
            </div>
            <span className="font-mono font-bold text-lg text-blue-600 dark:text-blue-400">
              {formatTime(timeSeconds)}
            </span>
          </div>

          <div className="flex flex-col items-center p-2 rounded-lg bg-white dark:bg-white/5 shadow-xs">
            <div className="flex items-center gap-1 text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-0.5">
              <Award className="w-3 h-3 text-amber-500" />
              <span>Pontuação</span>
            </div>
            <span className="font-mono font-bold text-lg text-amber-500">
              {displayScore.toLocaleString()}
            </span>
          </div>

          <div className="flex flex-col items-center p-1.5 rounded-lg bg-white/70 dark:bg-white/5 shadow-xs">
            <div className="flex items-center gap-1 text-slate-400 text-[10px] mb-0.5">
              <AlertCircle className="w-3 h-3 text-rose-500" />
              <span>Erros</span>
            </div>
            <span className={`font-mono font-bold text-xs ${currentTheme.textColor}`}>
              {mistakes}
            </span>
          </div>

          <div className="flex flex-col items-center p-1.5 rounded-lg bg-white/70 dark:bg-white/5 shadow-xs">
            <div className="flex items-center gap-1 text-slate-400 text-[10px] mb-0.5">
              <Sparkles className="w-3 h-3 text-cyan-500" />
              <span>Dicas</span>
            </div>
            <span className={`font-mono font-bold text-xs ${currentTheme.textColor}`}>
              {hintsUsed}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2 pt-1">
          <button
            id="btn-play-again"
            onClick={onPlayAgain}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer uppercase tracking-wider"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Jogar Novamente</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            {onOpenAchievements && (
              <button
                id="btn-view-achievements-win"
                onClick={onOpenAchievements}
                className={`py-2 px-2 rounded-xl ${currentTheme.buttonBg} text-xs font-semibold flex items-center justify-center gap-1 transition active:scale-95 cursor-pointer ${currentTheme.textColor}`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Conquistas</span>
              </button>
            )}

            <button
              id="btn-view-leaderboard"
              onClick={onOpenLeaderboard}
              className={`py-2 px-2 rounded-xl ${currentTheme.buttonBg} text-xs font-semibold flex items-center justify-center gap-1 transition active:scale-95 cursor-pointer ${currentTheme.textColor}`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>Recordes</span>
            </button>
          </div>

          {onGoHome && (
            <button
              onClick={onGoHome}
              className={`w-full py-2 rounded-xl bg-black/10 hover:bg-black/20 ${currentTheme.textColor} font-semibold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer`}
            >
              <span>Menu Principal</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
