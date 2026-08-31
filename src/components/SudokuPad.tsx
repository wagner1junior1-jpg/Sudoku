import React from "react";
import {
  Undo2,
  Redo2,
  Eraser,
  Pencil,
  Sparkles,
  MousePointerClick,
  Hash
} from "lucide-react";
import { ThemeId, InputMode } from "../types";
import { THEMES } from "../utils/themes";

interface SudokuPadProps {
  numberCounts: Record<number, number>;
  isNotesMode: boolean;
  selectedNumber: number | null;
  inputMode: InputMode;
  canUndo: boolean;
  canRedo: boolean;
  themeId: ThemeId;
  onNumberClick: (num: number) => void;
  onToggleNotes: () => void;
  onErase: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onHint: () => void;
  onToggleInputMode: () => void;
}

export const SudokuPad: React.FC<SudokuPadProps> = ({
  numberCounts,
  isNotesMode,
  selectedNumber,
  inputMode,
  canUndo,
  canRedo,
  themeId,
  onNumberClick,
  onToggleNotes,
  onErase,
  onUndo,
  onRedo,
  onHint,
  onToggleInputMode
}) => {
  const currentTheme = THEMES[themeId] || THEMES["light-classic"];

  return (
    <div
      id="sudoku-controls-pad"
      className="w-full max-w-md mx-auto flex flex-col gap-1 select-none"
    >
      {/* Mobile Ergonomic Action & Number Pad Container */}
      <div className={`flex flex-col gap-1.5 p-1.5 sm:p-2.5 rounded-2xl ${currentTheme.cardBg} border shadow-xl`}>
        {/* Top Actions Row: 5 Thumb Controls */}
        <div className="grid grid-cols-5 gap-1 sm:gap-1.5">
          {/* Undo */}
          <button
            id="btn-action-undo"
            onClick={onUndo}
            disabled={!canUndo}
            className={`py-1.5 sm:py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
              canUndo
                ? `${currentTheme.buttonBg} active:scale-95 shadow-sm`
                : "opacity-35 cursor-not-allowed bg-black/20 text-slate-500 border border-transparent"
            }`}
            title="Desfazer jogada"
          >
            <Undo2 className="w-4 h-4" />
            <span className="text-[10px]">Desfazer</span>
          </button>

          {/* Redo */}
          <button
            id="btn-action-redo"
            onClick={onRedo}
            disabled={!canRedo}
            className={`py-1.5 sm:py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
              canRedo
                ? `${currentTheme.buttonBg} active:scale-95 shadow-sm`
                : "opacity-35 cursor-not-allowed bg-black/20 text-slate-500 border border-transparent"
            }`}
            title="Refazer jogada"
          >
            <Redo2 className="w-4 h-4" />
            <span className="text-[10px]">Refazer</span>
          </button>

          {/* Erase */}
          <button
            id="btn-action-erase"
            onClick={onErase}
            className={`py-1.5 sm:py-2 rounded-xl text-xs font-semibold uppercase tracking-wider ${currentTheme.buttonBg} transition active:scale-95 cursor-pointer flex flex-col items-center justify-center gap-0.5 shadow-sm`}
            title="Apagar célula"
          >
            <Eraser className="w-4 h-4 text-rose-400" />
            <span className="text-[10px]">Apagar</span>
          </button>

          {/* Notes (Pencil Mode) */}
          <button
            id="btn-action-notes"
            onClick={onToggleNotes}
            className={`py-1.5 sm:py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition active:scale-95 cursor-pointer flex flex-col items-center justify-center gap-0.5 shadow-sm ${
              isNotesMode
                ? `${currentTheme.buttonActiveBg} font-bold ring-2 ring-white/40`
                : currentTheme.buttonBg
            }`}
            title="Modo Notas / Rascunho"
          >
            <Pencil className="w-4 h-4" />
            <span className="text-[10px]">{isNotesMode ? "Notas ON" : "Notas"}</span>
          </button>

          {/* Hint Button */}
          <button
            id="btn-action-hint"
            onClick={onHint}
            className="py-1.5 sm:py-2 rounded-xl text-xs font-semibold uppercase tracking-wider bg-gradient-to-tr from-amber-500 to-amber-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-md shadow-amber-500/25 transition active:scale-95 cursor-pointer flex flex-col items-center justify-center gap-0.5 border border-amber-300/40"
            title="Pedir Dica"
          >
            <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950/20" />
            <span className="text-[10px] font-bold">Dica</span>
          </button>
        </div>

        {/* Number Pad (1-9) in Mobile Ergonomic Circular Style */}
        <div className="grid grid-cols-9 gap-1 pt-1 border-t border-white/10">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
            const placedCount = numberCounts[num] || 0;
            const isComplete = placedCount >= 9;
            const isSelected = selectedNumber === num && inputMode === "number-first";

            return (
              <button
                key={`numpad-${num}`}
                id={`btn-numpad-${num}`}
                type="button"
                onClick={() => onNumberClick(num)}
                disabled={isComplete}
                className={`relative aspect-square rounded-xl flex flex-col items-center justify-center transition-all duration-100 cursor-pointer border ${
                  isComplete
                    ? "opacity-25 cursor-not-allowed bg-black/20 border-white/5 text-slate-500"
                    : isSelected
                    ? "scale-105 shadow-md ring-2 ring-white"
                    : `${currentTheme.buttonBg} active:scale-95`
                }`}
                style={
                  isSelected
                    ? { backgroundColor: currentTheme.swatch?.accent || "#3b82f6", color: "#ffffff" }
                    : {}
                }
              >
                <span className="text-xl sm:text-2xl font-black leading-none">{num}</span>
                {placedCount > 0 && !isComplete && (
                  <span className="text-[8px] font-mono opacity-60 mt-0.5 font-bold">
                    {9 - placedCount}
                  </span>
                )}
                {isComplete && (
                  <span className="text-[8px] font-bold text-emerald-400 mt-0.5">✓</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mode toggle helper text */}
      <div className="flex items-center justify-between px-2 text-[10px] opacity-70">
        <button
          onClick={onToggleInputMode}
          className="flex items-center gap-1 hover:underline transition cursor-pointer"
        >
          {inputMode === "cell-first" ? (
            <>
              <MousePointerClick className="w-3 h-3 text-blue-400" />
              <span>Modo: Célula primeiro</span>
            </>
          ) : (
            <>
              <Hash className="w-3 h-3 text-blue-400" />
              <span>Modo: Número primeiro</span>
            </>
          )}
        </button>

        <span>Jogo 100% Local & Offline</span>
      </div>
    </div>
  );
};
