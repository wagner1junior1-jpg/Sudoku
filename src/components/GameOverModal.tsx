import React from "react";
import { AlertOctagon, RotateCcw, ShieldAlert, HeartHandshake, Home } from "lucide-react";
import { DifficultyLevel, ThemeId } from "../types";
import { THEMES } from "../utils/themes";

interface GameOverModalProps {
  difficulty: DifficultyLevel;
  mistakes: number;
  themeId: ThemeId;
  onRestart: () => void;
  onContinueUnlimited: () => void;
  onGoHome?: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  themeId,
  onRestart,
  onContinueUnlimited,
  onGoHome
}) => {
  const currentTheme = THEMES[themeId] || THEMES["light-classic"];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div
        className={`w-full max-w-sm p-6 rounded-3xl ${currentTheme.cardBg} border-2 border-rose-500/50 shadow-2xl flex flex-col items-center gap-4 text-center animate-scale-up`}
      >
        <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-500 animate-pulse">
          <ShieldAlert className="w-9 h-9" />
        </div>

        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose-500/15 text-rose-500 border border-rose-500/30">
            3 de 3 Erros
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-rose-500 dark:text-rose-400 mt-1.5 font-['Outfit']">
            Você Perdeu!
          </h3>
          <p className={`text-sm font-semibold ${currentTheme.textColor} mt-2`}>
            Deseja iniciar novamente?
          </p>
          <p className={`text-xs ${currentTheme.textMuted} mt-0.5 leading-relaxed`}>
            Você atingiu o limite de 3 erros nesta partida.
          </p>
        </div>

        <div className="w-full flex flex-col gap-2 mt-2">
          <button
            onClick={onRestart}
            className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer uppercase tracking-wider"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Sim, Iniciar Novamente</span>
          </button>

          <button
            onClick={onContinueUnlimited}
            className={`w-full py-2.5 rounded-xl ${currentTheme.buttonBg} ${currentTheme.textColor} font-semibold text-xs flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer`}
          >
            <HeartHandshake className="w-4 h-4 text-amber-500" />
            <span>Continuar Tabuleiro (Sem Pontos)</span>
          </button>

          {onGoHome && (
            <button
              onClick={onGoHome}
              className={`w-full py-2 rounded-xl bg-black/10 hover:bg-black/20 ${currentTheme.textColor} font-semibold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer`}
            >
              <Home className="w-3.5 h-3.5 text-blue-400" />
              <span>Menu Principal</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
