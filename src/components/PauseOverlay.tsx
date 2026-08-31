import React from "react";
import { Play, Pause, Home } from "lucide-react";
import { ThemeId } from "../types";
import { THEMES } from "../utils/themes";

interface PauseOverlayProps {
  themeId: ThemeId;
  onResume: () => void;
  onGoHome?: () => void;
}

export const PauseOverlay: React.FC<PauseOverlayProps> = ({ themeId, onResume, onGoHome }) => {
  const currentTheme = THEMES[themeId] || THEMES["dark-slate"];

  return (
    <div className="absolute inset-0 z-20 backdrop-blur-md bg-slate-950/75 flex items-center justify-center p-4 rounded-2xl animate-fade-in">
      <div className={`w-full max-w-xs p-6 rounded-2xl ${currentTheme.cardBg} border text-center shadow-2xl flex flex-col items-center gap-4`}>
        <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <Pause className="w-7 h-7 fill-amber-400/20" />
        </div>

        <div>
          <h3 className={`text-xl font-bold ${currentTheme.textColor}`}>Jogo Pausado</h3>
          <p className={`text-xs ${currentTheme.textMuted} mt-1`}>
            O cronômetro está congelado. O tabuleiro fica oculto durante a pausa.
          </p>
        </div>

        <div className="w-full flex flex-col gap-2">
          <button
            id="btn-resume-game"
            onClick={onResume}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Continuar Jogo</span>
          </button>

          {onGoHome && (
            <button
              id="btn-pause-go-home"
              onClick={onGoHome}
              className={`w-full py-2.5 rounded-xl ${currentTheme.buttonBg} ${currentTheme.textColor} font-semibold text-xs flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer`}
            >
              <Home className="w-4 h-4 text-blue-400" />
              <span>Menu Principal</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
