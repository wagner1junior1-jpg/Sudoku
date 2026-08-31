import React, { useEffect } from "react";
import { Award, Trophy, Zap, Crown, Sparkles, CheckCircle2, X } from "lucide-react";
import { Achievement } from "../types";

interface AchievementToastProps {
  achievement: Achievement;
  onClose: () => void;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({
  achievement,
  onClose
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      id={`achievement-toast-${achievement.id}`}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[92%] max-w-sm bg-gradient-to-r from-amber-950/95 via-zinc-900/95 to-slate-900/95 border-2 border-amber-400/80 text-white rounded-2xl p-3 shadow-2xl backdrop-blur-md animate-bounce-in flex items-center gap-3 select-none"
    >
      <div className="w-11 h-11 shrink-0 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/30">
        <Trophy className="w-6 h-6 fill-slate-950/20" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] uppercase font-black tracking-widest text-amber-300 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-300" />
            Nova Conquista!
          </span>
          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-200">
            +{achievement.points} XP
          </span>
        </div>
        <h4 className="text-sm font-bold text-white truncate leading-tight mt-0.5">
          {achievement.title}
        </h4>
        <p className="text-[11px] text-slate-300 truncate mt-0.5">
          {achievement.description}
        </p>
      </div>

      <button
        onClick={onClose}
        className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
        aria-label="Fechar notificação"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
