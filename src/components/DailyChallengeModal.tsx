import React, { useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Flame, Play, Trophy, X } from "lucide-react";
import { DailyResult, ThemeId } from "../types";
import { getModalTheme } from "../utils/themes";
import { DIFFICULTY_CONFIG, formatTime } from "../utils/sudokuEngine";
import {
  formatDailyDate,
  getDailyDifficulty,
  getDailyStreak,
  todayKey,
  toDateKey
} from "../utils/daily";

interface DailyChallengeModalProps {
  themeId: ThemeId;
  results: Record<string, DailyResult>;
  inProgressDate?: string; // daily challenge saved mid-game, if any
  onPlay: (dateKey: string) => void;
  onClose: () => void;
}

const WEEKDAYS = ["D", "S", "T", "Q", "Q", "S", "S"];

export const DailyChallengeModal: React.FC<DailyChallengeModalProps> = ({
  themeId,
  results,
  inProgressDate,
  onPlay,
  onClose
}) => {
  const currentTheme = getModalTheme(themeId);
  const today = todayKey();
  const now = new Date();
  const [month, setMonth] = useState(() => new Date(now.getFullYear(), now.getMonth(), 1));
  const [selected, setSelected] = useState(today);

  const { current, best } = getDailyStreak(results, today);
  const isCurrentMonth =
    month.getFullYear() === now.getFullYear() && month.getMonth() === now.getMonth();

  const firstWeekday = month.getDay();
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const dayKeys = Array.from({ length: daysInMonth }, (_, i) =>
    toDateKey(new Date(month.getFullYear(), month.getMonth(), i + 1))
  );

  const shiftMonth = (delta: number) =>
    setMonth(new Date(month.getFullYear(), month.getMonth() + delta, 1));

  const selectedResult = results[selected];
  const selectedDiff = DIFFICULTY_CONFIG[getDailyDifficulty(selected)];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div
        className={`w-full max-w-sm p-5 rounded-3xl ${currentTheme.cardBg} border shadow-2xl flex flex-col gap-4 animate-scale-up max-h-full overflow-y-auto`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <CalendarDays className="w-5 h-5" />
            </div>
            <h3 className={`text-base font-bold ${currentTheme.textColor}`}>Desafio Diário</h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-xl ${currentTheme.buttonBg} transition cursor-pointer`}
            aria-label="Fechar"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Streak summary */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-400" />
            <div>
              <div className="text-lg font-black text-orange-400 leading-none">{current}</div>
              <div className="text-[10px] text-slate-400 font-semibold">sequência atual</div>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <div>
              <div className="text-lg font-black text-amber-400 leading-none">{best}</div>
              <div className="text-[10px] text-slate-400 font-semibold">melhor sequência</div>
            </div>
          </div>
        </div>

        {/* Month calendar */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <button
              onClick={() => shiftMonth(-1)}
              className={`p-1.5 rounded-xl ${currentTheme.buttonBg} transition cursor-pointer`}
              aria-label="Mês anterior"
            >
              <ChevronLeft className="w-4 h-4 text-slate-300" />
            </button>
            <span className={`text-sm font-bold first-letter:uppercase ${currentTheme.textColor}`}>
              {month.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
            </span>
            <button
              onClick={() => shiftMonth(1)}
              disabled={isCurrentMonth}
              className={`p-1.5 rounded-xl ${currentTheme.buttonBg} transition cursor-pointer disabled:opacity-30 disabled:cursor-default`}
              aria-label="Próximo mês"
            >
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {WEEKDAYS.map((w, i) => (
              <span key={i} className="text-[10px] font-bold text-slate-500">
                {w}
              </span>
            ))}
            {Array.from({ length: firstWeekday }, (_, i) => (
              <span key={`pad-${i}`} />
            ))}
            {dayKeys.map((key, i) => {
              const result = results[key];
              const isFuture = key > today;
              const isSelected = key === selected;
              const tone = result
                ? result.onTime
                  ? "bg-emerald-500/80 text-white border-emerald-400"
                  : "bg-blue-500/20 text-blue-300 border-blue-500/50"
                : isFuture
                  ? "text-slate-600 border-transparent"
                  : "text-slate-200 border-slate-700 hover:bg-white/5";
              return (
                <button
                  key={key}
                  disabled={isFuture}
                  onClick={() => setSelected(key)}
                  className={`aspect-square rounded-lg border text-xs font-bold transition cursor-pointer disabled:cursor-default ${tone} ${
                    isSelected ? "ring-2 ring-orange-400" : ""
                  } ${key === today && !isSelected ? "ring-1 ring-orange-400/60" : ""}`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>

          <p className="text-[10px] text-slate-500 leading-snug">
            <span className="text-emerald-400 font-bold">■</span> concluído no dia (conta na
            sequência) · <span className="text-blue-400 font-bold">■</span> concluído depois
          </p>
        </div>

        {/* Selected day */}
        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-100 first-letter:uppercase">
              {selected === today
                ? "Hoje"
                : formatDailyDate(selected, { weekday: "short", day: "numeric", month: "short" })}
              <span className="text-slate-400 font-semibold normal-case"> · {selectedDiff.label}</span>
            </div>
            <div className="text-[11px] text-slate-400">
              {selectedResult
                ? `Concluído em ${formatTime(selectedResult.timeSeconds)} · ${selectedResult.score.toLocaleString("pt-BR")} pts`
                : selected === inProgressDate
                  ? "Em andamento"
                  : selected === today
                    ? "Ainda não jogado"
                    : "Perdido, mas ainda dá para jogar"}
            </div>
          </div>
          {!selectedResult && (
            <button
              onClick={() => onPlay(selected)}
              className="shrink-0 px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-white text-xs font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              {selected === inProgressDate ? "Continuar" : "Jogar"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
