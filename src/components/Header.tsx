import React, { useEffect, useState } from "react";
import {
  Trophy,
  BarChart2,
  Settings,
  Plus,
  HelpCircle,
  Palette,
  Award,
  Home,
  Download,
  MoreHorizontal
} from "lucide-react";
import { DifficultyLevel, ThemeId } from "../types";
import { DIFFICULTY_CONFIG } from "../utils/sudokuEngine";
import { THEMES } from "../utils/themes";

interface HeaderProps {
  difficulty: DifficultyLevel;
  themeId: ThemeId;
  isPWAInstalled?: boolean;
  onGoHome: () => void;
  onOpenNewGame: () => void;
  onOpenLeaderboard: () => void;
  onOpenAchievements: () => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  onOpenHowToPlay: () => void;
  onOpenQuickTheme: () => void;
  onOpenPWAInstall?: () => void;
  onOpenFeedback?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  difficulty,
  themeId,
  isPWAInstalled,
  onGoHome,
  onOpenNewGame,
  onOpenLeaderboard,
  onOpenAchievements,
  onOpenHistory,
  onOpenSettings,
  onOpenHowToPlay,
  onOpenQuickTheme,
  onOpenPWAInstall
}) => {
  const currentTheme = THEMES[themeId] || THEMES["light-classic"];
  const diffInfo = DIFFICULTY_CONFIG[difficulty];
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  const menuItems = [
    { id: "btn-quick-theme", label: "Temas", icon: Palette, iconColor: "text-pink-400", onClick: onOpenQuickTheme },
    { id: "btn-achievements", label: "Conquistas", icon: Award, iconColor: "text-amber-500", onClick: onOpenAchievements },
    { id: "btn-leaderboard", label: "Recordes", icon: Trophy, iconColor: "text-amber-400", onClick: onOpenLeaderboard },
    { id: "btn-history", label: "Histórico", icon: BarChart2, iconColor: "text-indigo-400", onClick: onOpenHistory },
    { id: "btn-how-to-play", label: "Como jogar", icon: HelpCircle, iconColor: "text-emerald-400", onClick: onOpenHowToPlay },
    ...(!isPWAInstalled && onOpenPWAInstall
      ? [{ id: "btn-header-pwa-install", label: "Instalar app", icon: Download, iconColor: "text-blue-400", onClick: onOpenPWAInstall }]
      : [])
  ];

  const iconButtonClass = `w-10 h-10 rounded-xl ${currentTheme.buttonBg} transition active:scale-95 flex items-center justify-center cursor-pointer shrink-0`;

  return (
    <header
      className={`${currentTheme.category === "light" ? "theme-light" : ""} relative z-50 w-full max-w-md mx-auto px-1 sm:px-2 pt-0.5 pb-1 flex items-center justify-between gap-1.5 select-none`}
    >
      {/* Home / Back & Level Pill */}
      <div className="flex items-center gap-1.5 min-w-0">
        <button
          id="btn-header-home"
          onClick={onGoHome}
          className={iconButtonClass}
          title="Voltar ao Menu Principal"
          aria-label="Menu Inicial"
        >
          <Home className="w-5 h-5 text-blue-400" />
        </button>

        <button
          onClick={onOpenNewGame}
          className="min-w-0 truncate h-10 text-[11px] uppercase font-bold tracking-wider px-3 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30 hover:bg-blue-500/25 active:scale-95 transition cursor-pointer"
          title="Mudar Dificuldade / Novo Jogo"
        >
          {diffInfo.label}
        </button>
      </div>

      {/* Action Navigation Buttons */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          id="btn-new-game"
          onClick={onOpenNewGame}
          className="h-10 flex items-center gap-1 px-3 rounded-xl text-xs font-semibold uppercase tracking-wider bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/25 active:scale-95 transition cursor-pointer"
          title="Novo Jogo"
        >
          <Plus className="w-4 h-4" />
          <span className="text-[11px]">Novo</span>
        </button>

        <button
          id="btn-settings"
          onClick={onOpenSettings}
          className={iconButtonClass}
          title="Configurações e Temas"
          aria-label="Configurações"
        >
          <Settings className="w-5 h-5 text-slate-300" />
        </button>

        {/* Overflow menu with the secondary screens */}
        <div className="relative">
          <button
            id="btn-header-more"
            onClick={() => setIsMenuOpen((open) => !open)}
            className={iconButtonClass}
            title="Mais opções"
            aria-label="Mais opções"
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
          >
            <MoreHorizontal className="w-5 h-5 text-slate-300" />
          </button>

          {isMenuOpen && (
            <>
              <button
                type="button"
                aria-label="Fechar menu"
                tabIndex={-1}
                className="fixed inset-0 z-40 cursor-default"
                onClick={() => setIsMenuOpen(false)}
              />
              <div
                role="menu"
                className={`absolute right-0 top-full mt-1.5 z-50 w-48 p-1.5 rounded-2xl ${currentTheme.cardBg} border shadow-2xl flex flex-col gap-0.5 animate-scale-up origin-top-right`}
              >
                {menuItems.map(({ id, label, icon: Icon, iconColor, onClick }) => (
                  <button
                    key={id}
                    id={id}
                    role="menuitem"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onClick();
                    }}
                    className={`w-full h-11 px-3 rounded-xl flex items-center gap-3 text-sm font-semibold ${currentTheme.textColor} hover:bg-black/10 active:scale-[0.98] transition cursor-pointer text-left`}
                  >
                    <Icon className={`w-4 h-4 ${iconColor}`} />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
