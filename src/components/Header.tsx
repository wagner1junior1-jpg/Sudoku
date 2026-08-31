import React from "react";
import {
  Trophy,
  BarChart2,
  Settings,
  Plus,
  HelpCircle,
  Palette,
  Award,
  Home
} from "lucide-react";
import { DifficultyLevel, ThemeId } from "../types";
import { DIFFICULTY_CONFIG } from "../utils/sudokuEngine";
import { THEMES } from "../utils/themes";

interface HeaderProps {
  difficulty: DifficultyLevel;
  themeId: ThemeId;
  onGoHome: () => void;
  onOpenNewGame: () => void;
  onOpenLeaderboard: () => void;
  onOpenAchievements: () => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  onOpenHowToPlay: () => void;
  onOpenQuickTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  difficulty,
  themeId,
  onGoHome,
  onOpenNewGame,
  onOpenLeaderboard,
  onOpenAchievements,
  onOpenHistory,
  onOpenSettings,
  onOpenHowToPlay,
  onOpenQuickTheme
}) => {
  const currentTheme = THEMES[themeId] || THEMES["light-classic"];
  const diffInfo = DIFFICULTY_CONFIG[difficulty];

  return (
    <header className="w-full max-w-md mx-auto px-1 sm:px-2 pt-0.5 pb-1 flex items-center justify-between gap-1.5 select-none">
      {/* Home / Back & Level Pill */}
      <div className="flex items-center gap-1.5">
        <button
          id="btn-header-home"
          onClick={onGoHome}
          className={`p-1.5 rounded-lg ${currentTheme.buttonBg} transition active:scale-95 flex items-center justify-center cursor-pointer`}
          title="Voltar ao Menu Principal"
          aria-label="Menu Inicial"
        >
          <Home className="w-4 h-4 text-blue-400" />
        </button>

        <button
          onClick={onOpenNewGame}
          className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/30 hover:bg-blue-500/25 active:scale-95 transition cursor-pointer"
          title="Mudar Dificuldade / Novo Jogo"
        >
          {diffInfo.label}
        </button>
      </div>

      {/* Action Navigation Buttons */}
      <div className="flex items-center gap-1">
        {/* Quick Theme Switcher Shortcut */}
        <button
          id="btn-quick-theme"
          onClick={onOpenQuickTheme}
          className={`flex items-center gap-1 px-2 py-1 rounded-lg ${currentTheme.buttonBg} text-xs font-semibold tracking-wide transition active:scale-95 cursor-pointer shadow-sm`}
          title="Mudar Paleta de Cores e Temas"
        >
          <Palette className="w-3.5 h-3.5 text-pink-400" />
          <span
            className="w-2.5 h-2.5 rounded-full border border-white/30 shadow-xs"
            style={{ backgroundColor: currentTheme.swatch?.accent || "#3b82f6" }}
          />
        </button>

        <button
          id="btn-new-game"
          onClick={onOpenNewGame}
          className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/25 active:scale-95 transition cursor-pointer"
          title="Novo Jogo"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="text-[10px]">Novo</span>
        </button>

        <button
          id="btn-achievements"
          onClick={onOpenAchievements}
          className={`p-1.5 rounded-lg ${currentTheme.buttonBg} transition active:scale-95 flex items-center justify-center cursor-pointer`}
          title="Conquistas e Troféus"
        >
          <Award className="w-3.5 h-3.5 text-amber-500" />
        </button>

        <button
          id="btn-leaderboard"
          onClick={onOpenLeaderboard}
          className={`p-1.5 rounded-lg ${currentTheme.buttonBg} transition active:scale-95 flex items-center justify-center cursor-pointer`}
          title="Recordes Locais"
        >
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
        </button>

        <button
          id="btn-history"
          onClick={onOpenHistory}
          className={`p-1.5 rounded-lg ${currentTheme.buttonBg} transition active:scale-95 flex items-center justify-center cursor-pointer`}
          title="Histórico de Partidas e Estatísticas"
        >
          <BarChart2 className="w-3.5 h-3.5 text-slate-400" />
        </button>

        <button
          id="btn-how-to-play"
          onClick={onOpenHowToPlay}
          className={`p-1.5 rounded-lg ${currentTheme.buttonBg} transition active:scale-95 flex items-center justify-center cursor-pointer`}
          title="Como Jogar / Regras"
        >
          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
        </button>

        <button
          id="btn-settings"
          onClick={onOpenSettings}
          className={`p-1.5 rounded-lg ${currentTheme.buttonBg} transition active:scale-95 flex items-center justify-center cursor-pointer`}
          title="Configurações e Temas"
        >
          <Settings className="w-3.5 h-3.5 text-slate-300" />
        </button>
      </div>
    </header>
  );
};

