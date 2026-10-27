import React, { useState } from "react";
import {
  Play,
  RotateCcw,
  Trophy,
  BarChart2,
  Settings,
  HelpCircle,
  Palette,
  User,
  ChevronRight,
  Sparkles,
  Clock,
  Download,
  Plus
} from "lucide-react";
import {
  DifficultyLevel,
  ThemeId,
  UserProfile,
  GameHistoryItem,
  ActiveGameState
} from "../types";
import { THEMES } from "../utils/themes";
import { DIFFICULTY_CONFIG, formatTime } from "../utils/sudokuEngine";
import { getAllAchievementsWithStatus } from "../utils/achievements";

interface HomeScreenProps {
  userProfile: UserProfile;
  themeId: ThemeId;
  savedGame: ActiveGameState | null;
  gameHistory: GameHistoryItem[];
  isPWAInstalled?: boolean;
  onStartNewGame: () => void;
  onResumeGame: () => void;
  onOpenNewGameModal: () => void;
  onOpenLeaderboard: () => void;
  onOpenAchievements: () => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  onOpenHowToPlay: () => void;
  onOpenQuickTheme: () => void;
  onOpenPWAInstall?: () => void;
  onOpenFeedback?: () => void;
  onUpdateProfile: (newProfile: UserProfile) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  userProfile,
  themeId,
  savedGame,
  gameHistory,
  isPWAInstalled,
  onResumeGame,
  onOpenNewGameModal,
  onOpenLeaderboard,
  onOpenAchievements,
  onOpenHistory,
  onOpenSettings,
  onOpenHowToPlay,
  onOpenQuickTheme,
  onOpenPWAInstall,
  onOpenFeedback,
  onUpdateProfile
}) => {
  const currentTheme = THEMES[themeId] || THEMES["light-classic"];
  const [playerName, setPlayerName] = useState(userProfile.name);
  const [isEditingName, setIsEditingName] = useState(false);

  const { achievements, unlockedCount, totalPoints, earnedPoints } =
    getAllAchievementsWithStatus(gameHistory);

  const completionPercent = Math.round((unlockedCount / achievements.length) * 100);

  const handleNameBlur = () => {
    setIsEditingName(false);
    const trimmed = playerName.trim() || "Mestre Sudoku";
    setPlayerName(trimmed);
    onUpdateProfile({ ...userProfile, name: trimmed });
  };

  const hasValidSavedGame =
    Boolean(savedGame) &&
    savedGame?.board &&
    (savedGame.gameStatus === "playing" || savedGame.gameStatus === "paused");

  return (
    <div
      id="home-screen"
      className={`h-full max-h-full w-full ${currentTheme.bg} ${currentTheme.textColor} flex flex-col justify-between py-3 px-3.5 max-w-md mx-auto select-none overflow-y-auto no-scrollbar font-['Plus_Jakarta_Sans'] transition-colors duration-300 animate-fade-in`}
    >
      {/* Top Header Bar */}
      <header className="flex items-center justify-between gap-2 pt-1 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-500 shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-black tracking-widest text-blue-500">
              Jogo 100% Offline
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Developer Feedback / Bug Report (+) Button */}
          {onOpenFeedback && (
            <button
              onClick={onOpenFeedback}
              className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 hover:bg-emerald-500/25 transition active:scale-95 cursor-pointer shadow-sm flex items-center justify-center text-emerald-400"
              title="Sugestões ou Erros? Fale com o desenvolvedor (+)"
              aria-label="Fale com o desenvolvedor (+)"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
            </button>
          )}

          {/* PWA Install Button Shortcut if available */}
          {!isPWAInstalled && onOpenPWAInstall && (
            <button
              onClick={onOpenPWAInstall}
              className={`p-2 rounded-xl bg-blue-500/15 border border-blue-500/30 hover:bg-blue-500/25 transition active:scale-95 cursor-pointer shadow-sm flex items-center gap-1 text-blue-400`}
              title="Instalar Aplicativo PWA"
              aria-label="Instalar App"
            >
              <Download className="w-4 h-4 animate-bounce" />
              <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">
                Instalar
              </span>
            </button>
          )}

          {/* Quick Theme Switcher */}
          <button
            onClick={onOpenQuickTheme}
            className={`p-2 rounded-xl ${currentTheme.buttonBg} transition active:scale-95 cursor-pointer shadow-sm`}
            title="Mudar Paleta de Cores"
            aria-label="Temas"
          >
            <Palette className="w-4 h-4 text-pink-400" />
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className={`p-2 rounded-xl ${currentTheme.buttonBg} transition active:scale-95 cursor-pointer shadow-sm`}
            title="Configurações"
            aria-label="Configurações"
          >
            <Settings className="w-4 h-4 text-slate-300" />
          </button>
        </div>
      </header>

      {/* Main Hero & Branding Area */}
      <main className="flex-1 flex flex-col items-center justify-center gap-3 [@media(max-height:760px)]:gap-1.5 my-auto py-1 text-center">
        {/* Animated Visual Board Artwork */}
        <div className="relative group cursor-pointer" onClick={onOpenNewGameModal}>
          <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-amber-400 rounded-3xl blur-md opacity-35 group-hover:opacity-60 transition duration-300 animate-pulse" />
          
          <div
            className={`relative w-24 h-24 sm:w-28 sm:h-28 [@media(max-height:760px)]:w-16 [@media(max-height:760px)]:h-16 rounded-3xl ${currentTheme.cardBg} border-2 border-blue-500/40 p-2 shadow-2xl flex flex-col justify-between overflow-hidden`}
          >
            {/* 3x3 Mini Grid Art */}
            <div className="grid grid-cols-3 grid-rows-3 gap-1 h-full w-full">
              <div className="flex items-center justify-center bg-blue-500/10 rounded font-black text-sm text-blue-400">5</div>
              <div className="flex items-center justify-center bg-white/5 rounded font-black text-xs text-slate-400">·</div>
              <div className="flex items-center justify-center bg-blue-500/10 rounded font-black text-sm text-blue-400">3</div>
              <div className="flex items-center justify-center bg-white/5 rounded font-black text-xs text-slate-400">·</div>
              <div className="flex items-center justify-center bg-blue-600 text-white rounded-lg font-black text-base shadow-md shadow-blue-600/40 scale-105">9</div>
              <div className="flex items-center justify-center bg-white/5 rounded font-black text-xs text-slate-400">·</div>
              <div className="flex items-center justify-center bg-blue-500/10 rounded font-black text-sm text-blue-400">7</div>
              <div className="flex items-center justify-center bg-white/5 rounded font-black text-xs text-slate-400">·</div>
              <div className="flex items-center justify-center bg-blue-500/10 rounded font-black text-sm text-blue-400">2</div>
            </div>
          </div>
        </div>

        {/* Game Title */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight font-['Outfit']">
            SUDOKU <span className="text-blue-500">MASTER</span> PRO
          </h1>
          <p className={`text-xs ${currentTheme.textMuted} mt-0.5 font-medium [@media(max-height:760px)]:hidden`}>
            Desafie sua mente no clássico jogo de números
          </p>
        </div>

        {/* Player Name Input Card */}
        <div
          className={`w-full p-2.5 rounded-2xl ${currentTheme.cardBg} border shadow-md flex items-center justify-between gap-2.5 text-left`}
        >
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="w-9 h-9 shrink-0 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Nome do Jogador
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onFocus={() => setIsEditingName(true)}
                onBlur={handleNameBlur}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleNameBlur();
                }}
                maxLength={20}
                placeholder="Seu Nome / Apelido"
                className={`w-full bg-transparent font-bold text-sm ${currentTheme.textColor} focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 -ml-1 transition`}
              />
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
            {isEditingName ? "Salvar" : "Editar"}
          </span>
        </div>

        {/* PWA Install Promotion Banner */}
        {!isPWAInstalled && onOpenPWAInstall && (
          <button
            onClick={onOpenPWAInstall}
            className="w-full p-2.5 rounded-2xl bg-gradient-to-r from-blue-600/15 via-indigo-600/15 to-purple-600/15 hover:from-blue-600/25 hover:to-purple-600/25 border border-blue-500/30 flex items-center justify-between gap-2.5 transition active:scale-[0.99] cursor-pointer text-left shadow-sm group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 group-hover:scale-105 transition">
                <Download className="w-4 h-4 animate-bounce" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                  <span>Instalar Aplicativo PWA</span>
                  <span className="text-[9px] uppercase font-black px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    Offline
                  </span>
                </h4>
                <p className="text-[10px] text-slate-400 truncate">
                  Jogue 100% offline em tela cheia no seu celular
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0 text-blue-400 text-xs font-bold">
              <span className="hidden sm:inline">Instalar</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        )}

        {/* Developer Feedback (+) Banner */}
        {onOpenFeedback && (
          <button
            onClick={onOpenFeedback}
            className="w-full p-2.5 rounded-2xl bg-gradient-to-r from-emerald-600/15 via-teal-600/15 to-emerald-600/15 hover:from-emerald-600/25 hover:to-teal-600/25 border border-emerald-500/30 flex items-center justify-between gap-2.5 transition active:scale-[0.99] cursor-pointer text-left shadow-sm group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition font-black text-sm">
                +
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                  <span>Sugestões ou Erros?</span>
                  <span className="text-[9px] uppercase font-black px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    WhatsApp
                  </span>
                </h4>
                <p className="text-[10px] text-slate-300 truncate">
                  Fale com o desenvolvedor direto pelo WhatsApp
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0 text-emerald-400 text-xs font-bold">
              <span className="hidden sm:inline">Contatar</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        )}

        {/* Clickable Achievements Card */}
        <button
          onClick={onOpenAchievements}
          className={`w-full p-2.5 rounded-2xl ${currentTheme.cardBg} border shadow-md flex flex-col gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer text-left`}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500">
                <Trophy className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-xs font-bold leading-tight flex items-center gap-1">
                  Conquistas & Troféus
                </h3>
                <p className={`text-[10px] ${currentTheme.textMuted}`}>
                  {unlockedCount} de {achievements.length} desbloqueadas ({completionPercent}%)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-500">
                {earnedPoints} XP
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-amber-400 transition-all duration-500"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </button>

        {/* Primary Action Buttons */}
        <div className="w-full flex flex-col gap-2 pt-1">
          {/* Continue Game Button (if active game in progress exists) */}
          {hasValidSavedGame && savedGame && (
            <button
              id="btn-resume-game-home"
              onClick={onResumeGame}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-between gap-2 transition active:scale-95 cursor-pointer uppercase tracking-wider border border-emerald-400/30"
            >
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                <span>Continuar Partida</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold bg-black/20 px-2 py-0.5 rounded-lg">
                <Clock className="w-3 h-3 text-emerald-300" />
                <span>{formatTime(savedGame.timerSeconds)}</span>
                <span className="capitalize text-emerald-200">({savedGame.difficulty})</span>
              </div>
            </button>
          )}

          {/* New Game / Play Button */}
          <button
            id="btn-start-game-home"
            onClick={onOpenNewGameModal}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-base shadow-xl shadow-blue-600/35 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer uppercase tracking-wider border border-blue-400/40 animate-scale-up"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>{hasValidSavedGame ? "Novo Jogo" : "Iniciar Jogo"}</span>
          </button>
        </div>
      </main>

      {/* Bottom Navigation & Shortcuts Bar */}
      <footer className="pt-2 pb-1 border-t border-black/10 dark:border-white/10 grid grid-cols-4 gap-1">
        {/* Leaderboard */}
        <button
          id="btn-nav-leaderboard"
          onClick={onOpenLeaderboard}
          className={`py-2 px-1 rounded-xl ${currentTheme.buttonBg} flex flex-col items-center justify-center gap-1 transition active:scale-95 cursor-pointer`}
          title="Recordes Locais"
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="text-[10px] font-bold">Recordes</span>
        </button>

        {/* History / Stats */}
        <button
          id="btn-nav-history"
          onClick={onOpenHistory}
          className={`py-2 px-1 rounded-xl ${currentTheme.buttonBg} flex flex-col items-center justify-center gap-1 transition active:scale-95 cursor-pointer`}
          title="Estatísticas e Histórico"
        >
          <BarChart2 className="w-4 h-4 text-indigo-400" />
          <span className="text-[10px] font-bold">Histórico</span>
        </button>

        {/* Themes Palette */}
        <button
          id="btn-nav-themes"
          onClick={onOpenQuickTheme}
          className={`py-2 px-1 rounded-xl ${currentTheme.buttonBg} flex flex-col items-center justify-center gap-1 transition active:scale-95 cursor-pointer`}
          title="Paleta de Cores"
        >
          <Palette className="w-4 h-4 text-pink-400" />
          <span className="text-[10px] font-bold">Temas</span>
        </button>

        {/* How to play / Rules */}
        <button
          id="btn-nav-how-to-play"
          onClick={onOpenHowToPlay}
          className={`py-2 px-1 rounded-xl ${currentTheme.buttonBg} flex flex-col items-center justify-center gap-1 transition active:scale-95 cursor-pointer`}
          title="Como Jogar / Regras"
        >
          <HelpCircle className="w-4 h-4 text-emerald-400" />
          <span className="text-[10px] font-bold">Regras</span>
        </button>
      </footer>
    </div>
  );
};
