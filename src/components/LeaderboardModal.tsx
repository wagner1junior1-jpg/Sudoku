import React, { useState } from "react";
import {
  Trophy,
  X,
  Clock,
  Award,
  Calendar,
  Trash2,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { DifficultyLevel, LeaderboardItem, ThemeId } from "../types";
import { formatTime, DIFFICULTY_CONFIG } from "../utils/sudokuEngine";
import { THEMES } from "../utils/themes";

interface LeaderboardModalProps {
  currentDifficulty: DifficultyLevel;
  themeId: ThemeId;
  localLeaderboard: LeaderboardItem[];
  onClearLocalRecords?: (diff?: DifficultyLevel) => void;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  currentDifficulty,
  themeId,
  localLeaderboard,
  onClearLocalRecords,
  onClose
}) => {
  const currentTheme = THEMES[themeId] || THEMES["dark-slate"];
  const [selectedDiff, setSelectedDiff] = useState<DifficultyLevel>(currentDifficulty);

  // Filter and sort records for selected difficulty
  const records = localLeaderboard
    .filter((item) => item.difficulty === selectedDiff)
    .sort((a, b) => a.timeSeconds - b.timeSeconds || b.score - a.score);

  const bestRecord = records[0];

  const getRankBadge = (index: number) => {
    if (index === 0) {
      return (
        <span className="flex items-center gap-1 text-amber-400 font-bold text-xs px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30">
          🥇 1º
        </span>
      );
    }
    if (index === 1) {
      return (
        <span className="flex items-center gap-1 text-slate-300 font-bold text-xs px-2 py-0.5 rounded-full bg-slate-400/10 border border-slate-400/30">
          🥈 2º
        </span>
      );
    }
    if (index === 2) {
      return (
        <span className="flex items-center gap-1 text-amber-600 font-bold text-xs px-2 py-0.5 rounded-full bg-amber-700/10 border border-amber-700/30">
          🥉 3º
        </span>
      );
    }
    return (
      <span className="font-mono text-xs text-slate-500 px-2 font-semibold">
        #{index + 1}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto">
      <div
        className={`w-full max-w-md max-h-[92vh] rounded-2xl ${currentTheme.cardBg} border shadow-2xl flex flex-col overflow-hidden animate-scale-up`}
      >
        {/* Header */}
        <div className="p-3.5 border-b border-slate-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 leading-tight">
                Recordes Locais
              </h2>
              <p className="text-[11px] text-slate-400">
                Seus melhores tempos salvos neste dispositivo
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg ${currentTheme.buttonBg} transition active:scale-95 cursor-pointer`}
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Difficulty Selector Tabs */}
        <div className="p-2.5 bg-slate-950/40 border-b border-slate-800">
          <div className="grid grid-cols-5 gap-1">
            {(Object.keys(DIFFICULTY_CONFIG) as DifficultyLevel[]).map((level) => {
              const info = DIFFICULTY_CONFIG[level];
              const isSelected = selectedDiff === level;

              return (
                <button
                  key={`tab-${level}`}
                  onClick={() => setSelectedDiff(level)}
                  className={`py-1.5 px-1 rounded-lg text-[11px] font-bold tracking-wide transition cursor-pointer text-center ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                      : "bg-slate-800/80 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {info.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Best Performance Card */}
        {bestRecord && (
          <div className="p-3 bg-gradient-to-r from-blue-950/40 to-slate-900/40 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Melhor Tempo ({DIFFICULTY_CONFIG[selectedDiff].label})
                </span>
                <p className="text-lg font-mono font-bold text-amber-400 leading-tight">
                  {formatTime(bestRecord.timeSeconds)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Pontuação Máxima
              </span>
              <p className="text-sm font-mono font-bold text-blue-400">
                {bestRecord.score.toLocaleString()} pts
              </p>
            </div>
          </div>
        )}

        {/* Records List */}
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-1.5 min-h-[220px] max-h-[340px]">
          {records.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-8 text-center text-slate-500">
              <Trophy className="w-10 h-10 text-slate-600 mb-2 opacity-50" />
              <p className="text-sm font-semibold text-slate-400">Nenhum recorde neste nível</p>
              <p className="text-xs text-slate-500 mt-1 max-w-[240px]">
                Complete uma partida em {DIFFICULTY_CONFIG[selectedDiff].label} para registrar seu tempo!
              </p>
            </div>
          ) : (
            records.map((item, index) => (
              <div
                key={`record-${item.id || index}`}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  {getRankBadge(index)}
                  <div>
                    <p className="font-semibold text-slate-200 text-xs">
                      {item.name || "Jogador"}
                    </p>
                    <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-2.5 h-2.5" />
                      <span>{item.date || "Hoje"}</span>
                      {item.mistakes !== undefined && (
                        <span>• {item.mistakes} erro(s)</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-right">
                  <div>
                    <div className="font-mono font-bold text-sm text-blue-400 flex items-center justify-end gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{formatTime(item.timeSeconds)}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {item.score.toLocaleString()} pts
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-black/20 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Total de {records.length} partida(s) concluída(s)
          </span>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-blue-600 hover:bg-blue-500 text-white transition active:scale-95 cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
