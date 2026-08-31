import React, { useState } from "react";
import {
  Trophy,
  Award,
  Zap,
  CheckCircle,
  Brain,
  Timer,
  Flame,
  Crown,
  Sparkles,
  Edit3,
  TrendingUp,
  Star,
  Lock,
  X,
  Filter
} from "lucide-react";
import { ThemeId, GameHistoryItem, Achievement } from "../types";
import { THEMES } from "../utils/themes";
import { getAllAchievementsWithStatus } from "../utils/achievements";

interface AchievementsModalProps {
  gameHistory: GameHistoryItem[];
  themeId: ThemeId;
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  gameHistory,
  themeId,
  onClose
}) => {
  const currentTheme = THEMES[themeId] || THEMES["light-classic"];
  const [activeFilter, setActiveFilter] = useState<"all" | "unlocked" | "locked">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { achievements, unlockedCount, totalPoints, earnedPoints } =
    getAllAchievementsWithStatus(gameHistory);

  const getIcon = (iconName: string, isUnlocked: boolean) => {
    const className = `w-5 h-5 ${isUnlocked ? "text-amber-400" : "text-slate-400"}`;
    switch (iconName) {
      case "Trophy":
        return <Trophy className={className} />;
      case "CheckCircle":
        return <CheckCircle className={className} />;
      case "Brain":
        return <Brain className={className} />;
      case "Zap":
        return <Zap className={className} />;
      case "Timer":
        return <Timer className={className} />;
      case "Flame":
        return <Flame className={className} />;
      case "Crown":
        return <Crown className={className} />;
      case "Sparkles":
        return <Sparkles className={className} />;
      case "Edit3":
        return <Edit3 className={className} />;
      case "TrendingUp":
        return <TrendingUp className={className} />;
      case "Star":
        return <Star className={className} />;
      case "Award":
      default:
        return <Award className={className} />;
    }
  };

  const filteredAchievements = achievements.filter((ach) => {
    if (activeFilter === "unlocked" && !ach.unlockedAt) return false;
    if (activeFilter === "locked" && ach.unlockedAt) return false;
    if (selectedCategory !== "all" && ach.category !== selectedCategory) return false;
    return true;
  });

  const completionPercent = Math.round((unlockedCount / achievements.length) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
      <div
        className={`w-full max-w-lg rounded-2xl ${currentTheme.cardBg} border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto`}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20">
              <Trophy className="w-5 h-5 fill-slate-950/20" />
            </div>
            <div>
              <h3 className={`text-lg font-bold ${currentTheme.textColor} leading-tight`}>
                Sistema de Conquistas
              </h3>
              <p className={`text-xs ${currentTheme.textMuted}`}>
                Desbloqueie medalhas e troféus ao jogar
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl ${currentTheme.buttonBg} hover:opacity-80 transition cursor-pointer`}
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress & Stats Summary */}
        <div className="p-4 bg-black/5 dark:bg-black/20 border-b border-black/5 dark:border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold ${currentTheme.textColor}`}>
                Progresso Total
              </span>
              <span className="text-xs font-bold text-blue-500">
                {unlockedCount} de {achievements.length} ({completionPercent}%)
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-500 font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {earnedPoints} / {totalPoints} XP
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-amber-400 transition-all duration-500"
              style={{ width: `${completionPercent}%` }}
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center justify-between gap-1.5 pt-1">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeFilter === "all"
                    ? currentTheme.accentColor
                    : `${currentTheme.buttonBg} ${currentTheme.textMuted}`
                }`}
              >
                Todas ({achievements.length})
              </button>
              <button
                onClick={() => setActiveFilter("unlocked")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeFilter === "unlocked"
                    ? currentTheme.accentColor
                    : `${currentTheme.buttonBg} ${currentTheme.textMuted}`
                }`}
              >
                Desbloqueadas ({unlockedCount})
              </button>
              <button
                onClick={() => setActiveFilter("locked")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeFilter === "locked"
                    ? currentTheme.accentColor
                    : `${currentTheme.buttonBg} ${currentTheme.textMuted}`
                }`}
              >
                Bloqueadas ({achievements.length - unlockedCount})
              </button>
            </div>
          </div>
        </div>

        {/* Achievement Cards List */}
        <div className="p-4 space-y-2.5 overflow-y-auto flex-1 max-h-[50vh]">
          {filteredAchievements.length === 0 ? (
            <div className="text-center py-8">
              <Lock className="w-8 h-8 mx-auto text-slate-400 mb-2 opacity-50" />
              <p className={`text-sm font-semibold ${currentTheme.textColor}`}>
                Nenhuma conquista neste filtro
              </p>
              <p className={`text-xs ${currentTheme.textMuted} mt-0.5`}>
                Continue jogando para desbloquear novos troféus!
              </p>
            </div>
          ) : (
            filteredAchievements.map((ach) => {
              const isUnlocked = Boolean(ach.unlockedAt);

              return (
                <div
                  key={ach.id}
                  id={`achievement-card-${ach.id}`}
                  className={`p-3 rounded-xl border transition-all flex items-center gap-3 ${
                    isUnlocked
                      ? "bg-amber-500/10 border-amber-500/30 shadow-xs"
                      : "bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5 opacity-70"
                  }`}
                >
                  {/* Icon Avatar */}
                  <div
                    className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center ${
                      isUnlocked
                        ? "bg-amber-500/20 text-amber-500 border border-amber-500/40"
                        : "bg-slate-500/15 text-slate-400 border border-slate-500/20"
                    }`}
                  >
                    {isUnlocked ? getIcon(ach.iconName, true) : <Lock className="w-5 h-5" />}
                  </div>

                  {/* Title & Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4
                        className={`text-sm font-bold truncate leading-tight ${
                          isUnlocked ? currentTheme.textColor : currentTheme.textMuted
                        }`}
                      >
                        {ach.title}
                      </h4>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                          isUnlocked
                            ? "bg-amber-500/20 text-amber-600 dark:text-amber-300"
                            : "bg-slate-500/15 text-slate-500"
                        }`}
                      >
                        +{ach.points} XP
                      </span>
                    </div>

                    <p className={`text-xs ${currentTheme.textMuted} mt-0.5 leading-snug`}>
                      {ach.description}
                    </p>

                    {/* Progress / Status Tag */}
                    <div className="flex items-center justify-between mt-1.5 text-[10px]">
                      <span className="font-mono text-slate-400">{ach.reqText}</span>
                      {isUnlocked ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Concluído{" "}
                          {ach.unlockedAt
                            ? new Date(ach.unlockedAt).toLocaleDateString("pt-BR")
                            : ""}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-semibold flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          Bloqueado
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-black/5 dark:bg-black/20 border-t border-black/5 dark:border-white/5 flex justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-xl ${currentTheme.buttonBg} text-xs font-semibold hover:opacity-80 transition cursor-pointer`}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
