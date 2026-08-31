import React from "react";
import { PlusCircle, X, Sparkles, Zap, Flame, ShieldAlert, Award } from "lucide-react";
import { DifficultyLevel, ThemeId } from "../types";
import { DIFFICULTY_CONFIG } from "../utils/sudokuEngine";
import { THEMES } from "../utils/themes";

interface NewGameModalProps {
  currentDifficulty: DifficultyLevel;
  themeId: ThemeId;
  onSelectDifficulty: (difficulty: DifficultyLevel) => void;
  onClose: () => void;
}

export const NewGameModal: React.FC<NewGameModalProps> = ({
  currentDifficulty,
  themeId,
  onSelectDifficulty,
  onClose
}) => {
  const currentTheme = THEMES[themeId] || THEMES["dark-slate"];

  const difficulties: { key: DifficultyLevel; icon: React.ReactNode }[] = [
    { key: "facil", icon: <Sparkles className="w-5 h-5 text-emerald-400" /> },
    { key: "medio", icon: <Zap className="w-5 h-5 text-blue-400" /> },
    { key: "dificil", icon: <Flame className="w-5 h-5 text-amber-400" /> },
    { key: "especialista", icon: <ShieldAlert className="w-5 h-5 text-rose-400" /> },
    { key: "mestre", icon: <Award className="w-5 h-5 text-purple-400" /> }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div
        className={`w-full max-w-md p-6 rounded-3xl ${currentTheme.cardBg} border shadow-2xl flex flex-col gap-4 animate-scale-up`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-lg font-bold ${currentTheme.textColor} font-['Outfit']`}>
                Iniciar Nova Partida
              </h2>
              <p className={`text-xs ${currentTheme.textMuted}`}>
                Escolha o nível de dificuldade desejado
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl ${currentTheme.buttonBg} transition active:scale-95 cursor-pointer`}
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Difficulty List */}
        <div className="flex flex-col gap-2.5">
          {difficulties.map(({ key, icon }) => {
            const config = DIFFICULTY_CONFIG[key];
            const isCurrent = currentDifficulty === key;

            return (
              <button
                key={key}
                onClick={() => onSelectDifficulty(key)}
                className={`p-3.5 rounded-2xl border text-left flex items-center justify-between gap-3 transition cursor-pointer ${
                  isCurrent
                    ? `${config.color} ring-1 ring-white/20 shadow-md`
                    : "bg-slate-900/60 hover:bg-slate-800/60 border-slate-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-950/70 border border-white/5 flex items-center justify-center">
                    {icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-100">{config.label}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        ({config.clues} pistas)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                      {config.description}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold px-2 py-1 rounded-lg bg-black/30 text-slate-300">
                  {config.multiplier}x pts
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
