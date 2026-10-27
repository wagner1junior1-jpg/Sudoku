import React, { useState } from "react";
import {
  BarChart2,
  X,
  Trophy,
  Flame,
  CheckCircle2,
  Clock,
  Award,
  Calendar,
  AlertCircle,
  Sparkles,
  Trash2
} from "lucide-react";
import { GameHistoryItem, ThemeId, DifficultyLevel } from "../types";
import { formatTime, DIFFICULTY_CONFIG } from "../utils/sudokuEngine";
import { calculatePlayerStats } from "../utils/storage";
import { getModalTheme } from "../utils/themes";

interface HistoryModalProps {
  history: GameHistoryItem[];
  themeId: ThemeId;
  onClearHistory: () => void;
  onClose: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  history,
  themeId,
  onClearHistory,
  onClose
}) => {
  const currentTheme = getModalTheme(themeId);
  const [filterDiff, setFilterDiff] = useState<DifficultyLevel | "all">("all");
  const stats = calculatePlayerStats(history);

  const filteredHistory =
    filterDiff === "all" ? history : history.filter((h) => h.difficulty === filterDiff);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div
        className={`w-full max-w-2xl max-h-[90vh] rounded-3xl ${currentTheme.cardBg} border shadow-2xl flex flex-col overflow-hidden animate-scale-up`}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-lg sm:text-xl font-bold ${currentTheme.textColor} font-['Outfit']`}>
                Estatísticas e Histórico de Partidas
              </h2>
              <p className={`text-xs ${currentTheme.textMuted}`}>
                Acompanhe sua evolução e todos os jogos salvos localmente
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

        {/* Global Stats Overview Grid */}
        <div className="p-4 bg-black/20 border-b border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col items-center text-center">
            <span className="text-[11px] text-slate-400 font-medium">Partidas Jogadas</span>
            <span className="text-xl sm:text-2xl font-extrabold text-slate-100 font-mono mt-1">
              {stats.totalPlayed}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col items-center text-center">
            <span className="text-[11px] text-slate-400 font-medium">Vitórias</span>
            <span className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono mt-1">
              {stats.totalWon}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col items-center text-center">
            <span className="text-[11px] text-slate-400 font-medium">Taxa de Vitória</span>
            <span className="text-xl sm:text-2xl font-extrabold text-indigo-400 font-mono mt-1">
              {stats.winRate}%
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col items-center text-center">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500" /> Sequência
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-amber-400 font-mono mt-1">
              {stats.currentStreak} 🔥
            </span>
          </div>
        </div>

        {/* Best Times per Difficulty Cards */}
        <div className="p-3 sm:p-4 border-b border-slate-800 bg-slate-950/30">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Melhores Tempos por Nível
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {(["facil", "medio", "dificil", "especialista", "mestre"] as DifficultyLevel[]).map(
              (diff) => {
                const conf = DIFFICULTY_CONFIG[diff];
                const bestTime = stats.bestTimes[diff];

                return (
                  <div
                    key={diff}
                    className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col"
                  >
                    <span className={`text-[11px] font-bold ${conf.color} px-1.5 py-0.5 rounded w-fit`}>
                      {conf.label}
                    </span>
                    <div className="flex items-center gap-1 font-mono font-bold text-xs sm:text-sm text-slate-200 mt-1.5">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{bestTime ? formatTime(bestTime) : "--:--"}</span>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>

        {/* Match History Filter and Actions */}
        <div className="px-4 py-2 bg-black/10 border-b border-slate-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setFilterDiff("all")}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filterDiff === "all"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Todos
            </button>
            {(["facil", "medio", "dificil", "especialista", "mestre"] as DifficultyLevel[]).map(
              (diff) => (
                <button
                  key={diff}
                  onClick={() => setFilterDiff(diff)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    filterDiff === diff
                      ? "bg-indigo-600 text-white"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {DIFFICULTY_CONFIG[diff].label}
                </button>
              )
            )}
          </div>

          {history.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm("Deseja realmente limpar todo o histórico de partidas?")) {
                  onClearHistory();
                }
              }}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition cursor-pointer"
              title="Limpar histórico"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Limpar</span>
            </button>
          )}
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 min-h-[220px]">
          {filteredHistory.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center gap-2 text-slate-500 text-center">
              <Calendar className="w-8 h-8 stroke-1 text-slate-600" />
              <p className="text-sm font-medium">Nenhuma partida registrada no histórico.</p>
              <p className="text-xs text-slate-500">As partidas finalizadas serão listadas automaticamente aqui.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {filteredHistory.map((item) => {
                const conf = DIFFICULTY_CONFIG[item.difficulty];

                return (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-slate-900/40 border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          item.won
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                        }`}
                      >
                        {item.won ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                      </div>

                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded border ${conf.color}`}>
                            {conf.label}
                          </span>
                          <span className="text-xs text-slate-400">
                            {item.completedAt ? new Date(item.completedAt).toLocaleDateString("pt-BR") : item.date}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                          <span>Erros: <strong>{item.mistakes}</strong></span>
                          <span>•</span>
                          <span>Dicas: <strong>{item.hintsUsed}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1 font-mono font-bold text-sm text-indigo-400">
                        <Clock className="w-3 h-3 text-indigo-400/80" />
                        <span>{formatTime(item.timeSeconds)}</span>
                      </div>
                      <span className="text-[11px] font-mono text-amber-400 font-semibold">
                        {item.score.toLocaleString()} pts
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
