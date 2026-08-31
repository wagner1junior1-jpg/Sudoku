import {
  DifficultyLevel,
  CellData,
  BoardMatrix,
  HintExplanation,
  CellPosition
} from "../types";

// Difficulty configuration
export const DIFFICULTY_CONFIG: Record<
  DifficultyLevel,
  { label: string; clues: number; multiplier: number; description: string; color: string }
> = {
  facil: {
    label: "Fácil",
    clues: 38,
    multiplier: 1.0,
    description: "Ideal para iniciantes e partidas rápidas e relaxantes.",
    color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
  },
  medio: {
    label: "Médio",
    clues: 32,
    multiplier: 1.5,
    description: "Equilíbrio perfeito de desafio e lógica para jogadores casuais.",
    color: "text-blue-400 border-blue-500/30 bg-blue-500/10"
  },
  dificil: {
    label: "Difícil",
    clues: 27,
    multiplier: 2.2,
    description: "Requer técnicas de anotações e eliminação lógica.",
    color: "text-amber-400 border-amber-500/30 bg-amber-500/10"
  },
  especialista: {
    label: "Especialista",
    clues: 24,
    multiplier: 3.2,
    description: "Pouquíssimas pistas iniciais. Teste rigoroso de dedução.",
    color: "text-rose-400 border-rose-500/30 bg-rose-500/10"
  },
  mestre: {
    label: "Mestre",
    clues: 21,
    multiplier: 4.5,
    description: "Nível supremo para mestres do Sudoku. Raciocínio profundo.",
    color: "text-purple-400 border-purple-500/30 bg-purple-500/10"
  }
};

// Shuffles an array randomly (Fisher-Yates)
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Check if placing num at board[row][col] is valid
export function isValidPlacement(grid: number[][], row: number, col: number, num: number): boolean {
  // Check row
  for (let c = 0; c < 9; c++) {
    if (grid[row][c] === num) return false;
  }
  // Check col
  for (let r = 0; r < 9; r++) {
    if (grid[r][col] === num) return false;
  }
  // Check 3x3 block
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (grid[startRow + r][startCol + c] === num) return false;
    }
  }
  return true;
}

// Backtracking solver to fill grid with a complete valid Sudoku
function solveSudoku(grid: number[][]): boolean {
  let minCandidates = 10;
  let bestRow = -1;
  let bestCol = -1;
  let bestCandidates: number[] = [];

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid[r][c] === 0) {
        const candidates: number[] = [];
        for (let num = 1; num <= 9; num++) {
          if (isValidPlacement(grid, r, c, num)) {
            candidates.push(num);
          }
        }
        if (candidates.length === 0) {
          return false;
        }
        if (candidates.length < minCandidates) {
          minCandidates = candidates.length;
          bestRow = r;
          bestCol = c;
          bestCandidates = candidates;
          if (minCandidates === 1) break;
        }
      }
    }
    if (minCandidates === 1) break;
  }

  if (bestRow === -1) {
    return true;
  }

  const shuffled = shuffle(bestCandidates);
  for (const num of shuffled) {
    grid[bestRow][bestCol] = num;
    if (solveSudoku(grid)) {
      return true;
    }
    grid[bestRow][bestCol] = 0;
  }
  return false;
}

// Count number of solutions (to ensure unique solution) with MRV optimization
function countSolutions(grid: number[][], count = { value: 0 }): number {
  let minCandidates = 10;
  let bestRow = -1;
  let bestCol = -1;
  let bestCandidates: number[] = [];

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid[r][c] === 0) {
        const candidates: number[] = [];
        for (let num = 1; num <= 9; num++) {
          if (isValidPlacement(grid, r, c, num)) {
            candidates.push(num);
          }
        }
        if (candidates.length === 0) {
          return count.value;
        }
        if (candidates.length < minCandidates) {
          minCandidates = candidates.length;
          bestRow = r;
          bestCol = c;
          bestCandidates = candidates;
          if (minCandidates === 1) break;
        }
      }
    }
    if (minCandidates === 1) break;
  }

  if (bestRow === -1) {
    count.value++;
    return count.value;
  }

  for (const num of bestCandidates) {
    grid[bestRow][bestCol] = num;
    countSolutions(grid, count);
    grid[bestRow][bestCol] = 0;
    if (count.value >= 2) return count.value;
  }
  return count.value;
}

// Generate a complete solved 9x9 board
export function generateSolvedBoard(): number[][] {
  const grid: number[][] = Array(9)
    .fill(0)
    .map(() => Array(9).fill(0));
  solveSudoku(grid);
  return grid;
}

// Generate puzzle with specified difficulty
export function generateSudokuPuzzle(difficulty: DifficultyLevel): {
  initialGrid: number[][];
  solution: number[][];
  board: BoardMatrix;
} {
  const solution = generateSolvedBoard();
  const puzzle = solution.map((row) => [...row]);
  const targetClues = DIFFICULTY_CONFIG[difficulty].clues;
  const cellsToRemove = 81 - targetClues;

  const positions: CellPosition[] = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      positions.push({ row: r, col: c });
    }
  }
  const shuffledPositions = shuffle(positions);

  let removed = 0;
  for (const pos of shuffledPositions) {
    if (removed >= cellsToRemove) break;

    const temp = puzzle[pos.row][pos.col];
    puzzle[pos.row][pos.col] = 0;

    // Check unique solution
    const copy = puzzle.map((row) => [...row]);
    const solCount = countSolutions(copy, { value: 0 });

    if (solCount === 1) {
      removed++;
    } else {
      // Restore if removing leads to multiple solutions
      puzzle[pos.row][pos.col] = temp;
    }
  }

  // Convert to full BoardMatrix format
  const board: BoardMatrix = Array(9)
    .fill(null)
    .map((_, r) =>
      Array(9)
        .fill(null)
        .map((_, c) => {
          const val = puzzle[r][c];
          return {
            row: r,
            col: c,
            value: val,
            solutionValue: solution[r][c],
            isInitial: val !== 0,
            notes: [],
            isError: false,
            isConflict: false
          };
        })
    );

  return {
    initialGrid: puzzle,
    solution,
    board
  };
}

// Real-time duplicate conflict detector
export function detectConflicts(board: BoardMatrix): {
  conflicts: Set<string>; // "r,c"
  errors: Set<string>;
} {
  const conflicts = new Set<string>();
  const errors = new Set<string>();

  // Check rows
  for (let r = 0; r < 9; r++) {
    const seen = new Map<number, number[]>();
    for (let c = 0; c < 9; c++) {
      const val = board[r][c].value;
      if (val !== 0) {
        if (!seen.has(val)) seen.set(val, []);
        seen.get(val)!.push(c);
      }
    }
    seen.forEach((cols) => {
      if (cols.length > 1) {
        cols.forEach((c) => {
          const cell = board[r][c];
          if (!cell.isInitial) {
            conflicts.add(`${r},${c}`);
          }
        });
      }
    });
  }

  // Check columns
  for (let c = 0; c < 9; c++) {
    const seen = new Map<number, number[]>();
    for (let r = 0; r < 9; r++) {
      const val = board[r][c].value;
      if (val !== 0) {
        if (!seen.has(val)) seen.set(val, []);
        seen.get(val)!.push(r);
      }
    }
    seen.forEach((rows) => {
      if (rows.length > 1) {
        rows.forEach((r) => {
          const cell = board[r][c];
          if (!cell.isInitial) {
            conflicts.add(`${r},${c}`);
          }
        });
      }
    });
  }

  // Check 3x3 blocks
  for (let boxRow = 0; boxRow < 3; boxRow++) {
    for (let boxCol = 0; boxCol < 3; boxCol++) {
      const seen = new Map<number, { r: number; c: number }[]>();
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          const row = boxRow * 3 + r;
          const col = boxCol * 3 + c;
          const val = board[row][col].value;
          if (val !== 0) {
            if (!seen.has(val)) seen.set(val, []);
            seen.get(val)!.push({ r: row, c: col });
          }
        }
      }
      seen.forEach((cells) => {
        if (cells.length > 1) {
          cells.forEach((cellPos) => {
            const cell = board[cellPos.r][cellPos.c];
            if (!cell.isInitial) {
              conflicts.add(`${cellPos.r},${cellPos.c}`);
            }
          });
        }
      });
    }
  }

  // Check errors against solution (only for user-placed incorrect cells)
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const cell = board[r][c];
      if (!cell.isInitial && cell.value !== 0 && cell.value !== cell.solutionValue) {
        errors.add(`${r},${c}`);
      }
    }
  }

  return { conflicts, errors };
}

// Get valid candidates for a cell
export function getCellCandidates(board: BoardMatrix, row: number, col: number): number[] {
  if (board[row][col].value !== 0) return [];
  const rawGrid = board.map((r) => r.map((c) => c.value));
  const candidates: number[] = [];
  for (let num = 1; num <= 9; num++) {
    if (isValidPlacement(rawGrid, row, col, num)) {
      candidates.push(num);
    }
  }
  return candidates;
}

// Smart Hint Generator with pedagogical logic
export function generateSmartHint(board: BoardMatrix): HintExplanation | null {
  // 1. Search for Naked Single (cell has only 1 valid candidate in current grid state)
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c].value === 0) {
        const candidates = getCellCandidates(board, r, c);
        if (candidates.length === 1) {
          const val = candidates[0];
          return {
            type: "naked_single",
            position: { row: r, col: c },
            value: val,
            title: `Candidato Único (Naked Single): Linha ${r + 1}, Coluna ${c + 1}`,
            explanation: `Todos os outros números de 1 a 9 já estão presentes na mesma linha, coluna ou bloco 3x3. Portanto, esta célula obrigatoriamente deve ser o número ${val}.`,
            highlightCells: [{ row: r, col: c }]
          };
        }
      }
    }
  }

  // 2. Search for Hidden Single in 3x3 Box
  for (let boxRow = 0; boxRow < 3; boxRow++) {
    for (let boxCol = 0; boxCol < 3; boxCol++) {
      for (let num = 1; num <= 9; num++) {
        // Check if num is already in this box
        let alreadyInBox = false;
        const validCells: CellPosition[] = [];
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) {
            const row = boxRow * 3 + r;
            const col = boxCol * 3 + c;
            if (board[row][col].value === num) {
              alreadyInBox = true;
              break;
            }
            if (board[row][col].value === 0) {
              const cand = getCellCandidates(board, row, col);
              if (cand.includes(num)) {
                validCells.push({ row, col });
              }
            }
          }
          if (alreadyInBox) break;
        }

        if (!alreadyInBox && validCells.length === 1) {
          const target = validCells[0];
          return {
            type: "hidden_single",
            position: target,
            value: num,
            title: `Posição Única no Bloco 3x3: Número ${num}`,
            explanation: `No bloco 3x3 atual, a única posição possível para encaixar o número ${num} sem conflitar com outras linhas e colunas é na Linha ${target.row + 1}, Coluna ${target.col + 1}.`,
            highlightCells: [target]
          };
        }
      }
    }
  }

  // 3. Search for Hidden Single in Rows
  for (let r = 0; r < 9; r++) {
    for (let num = 1; num <= 9; num++) {
      const hasNum = board[r].some((cell) => cell.value === num);
      if (hasNum) continue;

      const validCols: number[] = [];
      for (let c = 0; c < 9; c++) {
        if (board[r][c].value === 0 && getCellCandidates(board, r, c).includes(num)) {
          validCols.push(c);
        }
      }

      if (validCols.length === 1) {
        const c = validCols[0];
        return {
          type: "hidden_single",
          position: { row: r, col: c },
          value: num,
          title: `Posição Única na Linha ${r + 1}: Número ${num}`,
          explanation: `Ao analisar a Linha ${r + 1}, o número ${num} só pode ser posicionado na Coluna ${c + 1}, pois todas as outras colunas vazias estão bloqueadas.`,
          highlightCells: [{ row: r, col: c }]
        };
      }
    }
  }

  // 4. Search for Hidden Single in Columns
  for (let c = 0; c < 9; c++) {
    for (let num = 1; num <= 9; num++) {
      let hasNum = false;
      for (let r = 0; r < 9; r++) {
        if (board[r][c].value === num) {
          hasNum = true;
          break;
        }
      }
      if (hasNum) continue;

      const validRows: number[] = [];
      for (let r = 0; r < 9; r++) {
        if (board[r][c].value === 0 && getCellCandidates(board, r, c).includes(num)) {
          validRows.push(r);
        }
      }

      if (validRows.length === 1) {
        const r = validRows[0];
        return {
          type: "hidden_single",
          position: { row: r, col: c },
          value: num,
          title: `Posição Única na Coluna ${c + 1}: Número ${num}`,
          explanation: `Na Coluna ${c + 1}, o número ${num} só tem uma casa livre válida que não conflita com as linhas adjacentes (Linha ${r + 1}).`,
          highlightCells: [{ row: r, col: c }]
        };
      }
    }
  }

  // 5. Fallback: Find any empty cell and provide solution-based deduction
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c].value === 0) {
        const solVal = board[r][c].solutionValue;
        return {
          type: "advanced_logic",
          position: { row: r, col: c },
          value: solVal,
          title: `Dedução Lógica: Linha ${r + 1}, Coluna ${c + 1}`,
          explanation: `Pela resolução matemática do tabuleiro, a célula selecionada deve ser preenchida com o valor ${solVal}.`,
          highlightCells: [{ row: r, col: c }]
        };
      }
    }
  }

  return null;
}

// Calculate match score
export function calculateMatchScore(
  difficulty: DifficultyLevel,
  timeSeconds: number,
  mistakes: number,
  hintsUsed: number
): number {
  const config = DIFFICULTY_CONFIG[difficulty];
  const baseScore = 5000 * config.multiplier;

  // Time decay factor (e.g. 5 points lost per second over target)
  const targetTime = {
    facil: 180,
    medio: 360,
    dificil: 600,
    especialista: 900,
    mestre: 1200
  }[difficulty];

  const timeBonus = Math.max(0, (targetTime - timeSeconds) * 8 * config.multiplier);
  const timePenalty = Math.max(0, (timeSeconds - targetTime) * 3);

  const mistakePenalty = mistakes * 350;
  const hintPenalty = hintsUsed * 450;

  const rawScore = baseScore + timeBonus - timePenalty - mistakePenalty - hintPenalty;
  return Math.max(100, Math.round(rawScore));
}

// Counts placed numbers on board for 1-9 count badges
export function getNumberCounts(board: BoardMatrix): Record<number, number> {
  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const val = board[r][c].value;
      if (val >= 1 && val <= 9) {
        counts[val]++;
      }
    }
  }
  return counts;
}

// Check if entire board is filled correctly
export function isBoardCompleted(board: BoardMatrix): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const cell = board[r][c];
      if (cell.value === 0 || cell.value !== cell.solutionValue) {
        return false;
      }
    }
  }
  return true;
}

// Format seconds into MM:SS
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}
