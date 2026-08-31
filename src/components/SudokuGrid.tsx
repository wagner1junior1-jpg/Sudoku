import React from "react";
import { BoardMatrix, CellPosition, ThemeId, GameSettings } from "../types";
import { THEMES } from "../utils/themes";

interface SudokuGridProps {
  board: BoardMatrix;
  selectedPos: CellPosition | null;
  highlightNumber: number | null;
  conflicts: Set<string>;
  errors: Set<string>;
  hintPos: CellPosition | null;
  settings: GameSettings;
  themeId: ThemeId;
  isPaused: boolean;
  isCompleted?: boolean;
  onCellClick: (row: number, col: number) => void;
}

export const SudokuGrid: React.FC<SudokuGridProps> = ({
  board,
  selectedPos,
  highlightNumber,
  conflicts,
  errors,
  hintPos,
  settings,
  themeId,
  isPaused,
  isCompleted = false,
  onCellClick
}) => {
  const currentTheme = THEMES[themeId] || THEMES["light-classic"];

  // Helper to determine cell background and styling
  const getCellClasses = (r: number, c: number) => {
    const cell = board[r][c];
    const key = `${r},${c}`;
    const isSelected = selectedPos?.row === r && selectedPos?.col === c;
    const isHintTarget = hintPos?.row === r && hintPos?.col === c;

    const isSameRowCol =
      settings.highlightCrosshair &&
      selectedPos !== null &&
      (selectedPos.row === r || selectedPos.col === c);

    const isSameBox =
      settings.highlightCrosshair &&
      selectedPos !== null &&
      Math.floor(selectedPos.row / 3) === Math.floor(r / 3) &&
      Math.floor(selectedPos.col / 3) === Math.floor(c / 3);

    const isSameNum =
      settings.highlightSameNumbers &&
      highlightNumber !== null &&
      highlightNumber > 0 &&
      cell.value === highlightNumber;

    const isWrongValue = !cell.isInitial && cell.value !== 0 && cell.value !== cell.solutionValue;
    const hasConflict = !cell.isInitial && settings.highlightDuplicates && conflicts.has(key);
    const hasError = !cell.isInitial && (cell.isError || (settings.realTimeValidation && (errors.has(key) || isWrongValue)));

    let bgClass = cell.isInitial ? currentTheme.cellInitialBg : currentTheme.cellEmptyBg;
    let extraEffects = "";

    if (isCompleted) {
      // Festive wave cascading across the solved grid
      const delay = (r + c) * 40;
      bgClass = "bg-gradient-to-tr from-emerald-500/30 to-blue-500/20 text-emerald-400";
      extraEffects = "animate-pulse shadow-xs";
    } else if (hasConflict || hasError) {
      bgClass = currentTheme.cellConflictBg;
      extraEffects = "z-20";
    } else if (isSelected && isSameNum) {
      // Selected cell that contains the active number
      bgClass = currentTheme.cellSelectedBg;
      extraEffects = "z-30 scale-[1.04]";
    } else if (isSameNum) {
      // ALL other cells containing this same number on the entire board (Identical to clicked 1)
      bgClass = currentTheme.cellSameNumberBg;
      extraEffects = "z-20 scale-[1.02]";
    } else if (isSelected) {
      // Empty selected cell
      bgClass = currentTheme.cellSelectedBg;
      extraEffects = "z-30 scale-[1.03]";
    } else if (isSameRowCol || isSameBox) {
      // Soft crosshair highlight for row, col and 3x3 box
      bgClass = currentTheme.cellHighlightBg;
      if (isSameBox && isSameRowCol) {
        extraEffects = "brightness-110";
      }
    }


    if (isHintTarget) {
      bgClass = "bg-blue-500/60 ring-2 ring-blue-300 animate-pulse z-30";
    }

    return {
      bgClass,
      extraEffects,
      isSelected,
      isSameNum,
      hasError,
      hasConflict
    };
  };

  return (
    <div
      id="sudoku-grid-container"
      className="w-full max-w-[min(100vw-8px,460px,55vh)] mx-auto select-none flex items-center justify-center"
    >
      <div
        className={`relative aspect-square w-full rounded-2xl ${currentTheme.cardBg} p-1 sm:p-1.5 border shadow-2xl overflow-hidden`}
      >
        {/* 3x3 Blocks with perfectly aligned major and minor grid lines */}
        <div
          className={`grid grid-cols-3 grid-rows-3 h-full w-full border-2 sm:border-[3px] ${currentTheme.majorBorderColor} ${currentTheme.majorGridLineColor} gap-[2px] sm:gap-[2.5px] overflow-hidden rounded-xl shadow-inner`}
        >
          {[0, 1, 2].map((blockRow) =>
            [0, 1, 2].map((blockCol) => (
              <div
                key={`block-${blockRow}-${blockCol}`}
                className={`grid grid-cols-3 grid-rows-3 gap-[1px] ${currentTheme.gridLineColor} w-full h-full`}
              >
                {[0, 1, 2].map((cellRow) =>
                  [0, 1, 2].map((cellCol) => {
                    const r = blockRow * 3 + cellRow;
                    const c = blockCol * 3 + cellCol;
                    const cell = board[r][c];
                    const {
                      bgClass,
                      extraEffects,
                      isSelected,
                      isSameNum,
                      hasError,
                      hasConflict
                    } = getCellClasses(r, c);

                    return (
                      <button
                        key={`cell-${r}-${c}`}
                        id={`cell-${r}-${c}`}
                        type="button"
                        onClick={() => onCellClick(r, c)}
                        disabled={isPaused}
                        className={`relative flex items-center justify-center p-0 m-0 w-full h-full transition-all duration-100 cursor-pointer ${bgClass} ${extraEffects} outline-none focus:outline-none antialiased touch-manipulation active:scale-[0.97]`}
                        aria-label={`Linha ${r + 1}, Coluna ${c + 1}, Valor ${cell.value || "vazio"}`}
                      >
                        {isPaused ? (
                          <span className="text-slate-600 font-mono text-xs">·</span>
                        ) : cell.value !== 0 ? (
                          // Display placed number with maximum size, crispness and vibrant highlight
                          <span
                            className={`text-2xl sm:text-3xl md:text-4xl select-none font-sans leading-none transition-transform ${
                              isSelected ? "scale-105" : ""
                            } ${
                              hasError || hasConflict
                                ? currentTheme.cellErrorText
                                : isSelected || isSameNum
                                ? `${currentTheme.sameNumberTextColor} drop-shadow-sm`
                                : cell.isInitial
                                ? currentTheme.initialDigitColor
                                : currentTheme.userDigitColor
                            }`}
                          >
                            {cell.value}
                          </span>
                        ) : (
                          // Display Candidate Notes (Pencil marks)
                          <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-0.5 pointer-events-none">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => {
                              const isNoteHighlighted =
                                highlightNumber !== null &&
                                highlightNumber === digit &&
                                settings.highlightSameNumbers;

                              return (
                                <div
                                  key={`note-${r}-${c}-${digit}`}
                                  className="flex items-center justify-center text-[8.5px] sm:text-[11px] leading-none font-bold font-sans"
                                >
                                  {cell.notes.includes(digit) ? (
                                    <span
                                      className={`${
                                        isNoteHighlighted
                                          ? "bg-blue-500 text-white px-1 py-0.5 rounded font-black scale-125 shadow-xs"
                                          : currentTheme.notesColor
                                      }`}
                                    >
                                      {digit}
                                    </span>
                                  ) : null}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
