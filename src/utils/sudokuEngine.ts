import {
  DifficultyLevel,
  CellData,
  BoardMatrix,
  HintExplanation,
  CellPosition
} from "../types";

// Difficulty configuration (clues = typical count; generation targets are in GENERATION_TARGETS)
export const DIFFICULTY_CONFIG: Record<
  DifficultyLevel,
  { label: string; clues: number; multiplier: number; description: string; color: string }
> = {
  facil: {
    label: "Fácil",
    clues: 44,
    multiplier: 1.0,
    description: "Pistas abundantes: basta achar a casa ou o número que sobra.",
    color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
  },
  medio: {
    label: "Médio",
    clues: 34,
    multiplier: 1.5,
    description: "Menos pistas, mas ainda se resolve só com posições únicas.",
    color: "text-blue-400 border-blue-500/30 bg-blue-500/10"
  },
  dificil: {
    label: "Difícil",
    clues: 26,
    multiplier: 2.2,
    description: "Exige anotações e candidatos apontados (linha × bloco).",
    color: "text-amber-400 border-amber-500/30 bg-amber-500/10"
  },
  especialista: {
    label: "Especialista",
    clues: 25,
    multiplier: 3.2,
    description: "Exige pares e trios ocultos ou expostos nas anotações.",
    color: "text-rose-400 border-rose-500/30 bg-rose-500/10"
  },
  mestre: {
    label: "Mestre",
    clues: 24,
    multiplier: 4.5,
    description: "Exige técnicas avançadas como X-Wing, XY-Wing e Swordfish.",
    color: "text-purple-400 border-purple-500/30 bg-purple-500/10"
  }
};

// Random source for generation; swapped for a seeded one to make daily puzzles reproducible
let random: () => number = Math.random;

// Mulberry32: small deterministic PRNG (same seed -> same puzzle on every device)
function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Shuffles an array randomly (Fisher-Yates)
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
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

// Generate a complete solved 9x9 board
export function generateSolvedBoard(): number[][] {
  const grid: number[][] = Array(9)
    .fill(0)
    .map(() => Array(9).fill(0));
  solveSudoku(grid);
  return grid;
}

// ---------------------------------------------------------------------------
// Logical solver: solves only with human techniques, easiest first.
// Grades generated puzzles by the hardest technique they require and
// explains hints step by step.
// ---------------------------------------------------------------------------

type TechniqueId =
  | "hidden_single"
  | "naked_single"
  | "pointing"
  | "claiming"
  | "naked_pair"
  | "hidden_pair"
  | "naked_triple"
  | "hidden_triple"
  | "x_wing"
  | "swordfish"
  | "xy_wing";

export const TECHNIQUES: Record<TechniqueId, { label: string; level: number }> = {
  hidden_single: { label: "Posição Única", level: 1 },
  naked_single: { label: "Candidato Único", level: 1 },
  pointing: { label: "Candidatos Apontados", level: 2 },
  claiming: { label: "Redução Linha-Bloco", level: 2 },
  naked_pair: { label: "Par Exposto", level: 3 },
  hidden_pair: { label: "Par Oculto", level: 3 },
  naked_triple: { label: "Trio Exposto", level: 3 },
  hidden_triple: { label: "Trio Oculto", level: 3 },
  x_wing: { label: "X-Wing", level: 4 },
  swordfish: { label: "Swordfish", level: 4 },
  xy_wing: { label: "XY-Wing", level: 4 }
};

const NINE = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const rowOf = (i: number) => Math.floor(i / 9);
const colOf = (i: number) => i % 9;
const boxOf = (i: number) => Math.floor(rowOf(i) / 3) * 3 + Math.floor(colOf(i) / 3);

// Units 0-8 are boxes, 9-17 rows, 18-26 columns (boxes first: easiest for people to scan)
const UNITS: number[][] = [
  ...NINE.map((b) =>
    NINE.map((k) => (Math.floor(b / 3) * 3 + Math.floor(k / 3)) * 9 + (b % 3) * 3 + (k % 3))
  ),
  ...NINE.map((r) => NINE.map((c) => r * 9 + c)),
  ...NINE.map((c) => NINE.map((r) => r * 9 + c))
];
const ROW_UNIT = 9;
const COL_UNIT = 18;

const sees = (a: number, b: number) =>
  a !== b && (rowOf(a) === rowOf(b) || colOf(a) === colOf(b) || boxOf(a) === boxOf(b));

const PEERS: number[][] = Array.from({ length: 81 }, (_, i) =>
  Array.from({ length: 81 }, (_, j) => j).filter((j) => sees(i, j))
);

// Candidates are bitmasks: bit d set means digit d (1-9) is still possible
const bit = (d: number) => 1 << d;
const ALL_DIGITS = 0b1111111110;
const MASK_DIGITS: number[][] = Array.from({ length: 1024 }, (_, mask) =>
  [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((d) => mask & bit(d))
);
const popcount = (mask: number) => MASK_DIGITS[mask].length;

interface SolverState {
  values: number[]; // 81 cells, 0 = empty
  cands: number[]; // candidate bitmask per cell, 0 when filled
  empty: number;
}

interface Elimination {
  cell: number;
  digit: number;
}

type PlaceStep = {
  kind: "place";
  technique: TechniqueId;
  cell: number;
  digit: number;
  unit: number; // unit for hidden singles, -1 for naked singles
};

type EliminateStep = {
  kind: "eliminate";
  technique: TechniqueId;
  eliminations: Elimination[];
  cells: number[]; // cells forming the pattern
  digits: number[];
  units: number[];
};

type SolveStep = PlaceStep | EliminateStep;

function createSolverState(values: number[]): SolverState {
  const cands = values.map((v, i) => {
    if (v) return 0;
    let mask = ALL_DIGITS;
    for (const p of PEERS[i]) if (values[p]) mask &= ~bit(values[p]);
    return mask;
  });
  return { values: [...values], cands, empty: values.filter((v) => v === 0).length };
}

function applyStep(s: SolverState, step: SolveStep): void {
  if (step.kind === "place") {
    s.values[step.cell] = step.digit;
    s.cands[step.cell] = 0;
    s.empty--;
    for (const p of PEERS[step.cell]) s.cands[p] &= ~bit(step.digit);
  } else {
    for (const e of step.eliminations) s.cands[e.cell] &= ~bit(e.digit);
  }
}

function combinations<T>(items: T[], size: number): T[][] {
  const result: T[][] = [];
  const pick = (start: number, combo: T[]) => {
    if (combo.length === size) {
      result.push(combo);
      return;
    }
    for (let i = start; i < items.length; i++) pick(i + 1, [...combo, items[i]]);
  };
  pick(0, []);
  return result;
}

const cellsWith = (s: SolverState, cells: number[], d: number) =>
  cells.filter((i) => s.cands[i] & bit(d));

const allSame = (cells: number[], key: (i: number) => number) =>
  cells.every((i) => key(i) === key(cells[0]));

function findSingle(s: SolverState): SolveStep | null {
  for (let u = 0; u < 27; u++) {
    for (let d = 1; d <= 9; d++) {
      const spots = cellsWith(s, UNITS[u], d);
      if (spots.length === 1) {
        return { kind: "place", technique: "hidden_single", cell: spots[0], digit: d, unit: u };
      }
    }
  }
  for (let i = 0; i < 81; i++) {
    if (s.cands[i] && popcount(s.cands[i]) === 1) {
      return { kind: "place", technique: "naked_single", cell: i, digit: MASK_DIGITS[s.cands[i]][0], unit: -1 };
    }
  }
  return null;
}

// Pointing (box -> line) and claiming (line -> box)
function findLockedCandidates(s: SolverState): SolveStep | null {
  for (let u = 0; u < 27; u++) {
    for (let d = 1; d <= 9; d++) {
      const spots = cellsWith(s, UNITS[u], d);
      if (spots.length < 2) continue;
      const targets =
        u < ROW_UNIT
          ? [
              allSame(spots, rowOf) ? ROW_UNIT + rowOf(spots[0]) : -1,
              allSame(spots, colOf) ? COL_UNIT + colOf(spots[0]) : -1
            ]
          : [allSame(spots, boxOf) ? boxOf(spots[0]) : -1];
      for (const t of targets) {
        if (t < 0) continue;
        const elims = cellsWith(s, UNITS[t], d).filter((i) => !UNITS[u].includes(i));
        if (elims.length) {
          return {
            kind: "eliminate",
            technique: u < ROW_UNIT ? "pointing" : "claiming",
            eliminations: elims.map((cell) => ({ cell, digit: d })),
            cells: spots,
            digits: [d],
            units: [u, t]
          };
        }
      }
    }
  }
  return null;
}

function findNakedSubset(s: SolverState, size: 2 | 3): SolveStep | null {
  for (let u = 0; u < 27; u++) {
    const pool = UNITS[u].filter((i) => s.cands[i] && popcount(s.cands[i]) <= size);
    if (pool.length < size) continue;
    for (const combo of combinations(pool, size)) {
      const mask = combo.reduce((m, i) => m | s.cands[i], 0);
      if (popcount(mask) !== size) continue;
      const digits = MASK_DIGITS[mask];
      const eliminations = UNITS[u]
        .filter((i) => !combo.includes(i))
        .flatMap((cell) => digits.filter((d) => s.cands[cell] & bit(d)).map((digit) => ({ cell, digit })));
      if (eliminations.length) {
        return {
          kind: "eliminate",
          technique: size === 2 ? "naked_pair" : "naked_triple",
          eliminations,
          cells: combo,
          digits,
          units: [u]
        };
      }
    }
  }
  return null;
}

function findHiddenSubset(s: SolverState, size: 2 | 3): SolveStep | null {
  for (let u = 0; u < 27; u++) {
    const pool = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((d) => {
      const n = cellsWith(s, UNITS[u], d).length;
      return n >= 2 && n <= size;
    });
    if (pool.length < size) continue;
    for (const digits of combinations(pool, size)) {
      const keep = digits.reduce((m, d) => m | bit(d), 0);
      const cells = UNITS[u].filter((i) => s.cands[i] & keep);
      if (cells.length !== size) continue;
      const eliminations = cells.flatMap((cell) =>
        MASK_DIGITS[s.cands[cell] & ~keep].map((digit) => ({ cell, digit }))
      );
      if (eliminations.length) {
        return {
          kind: "eliminate",
          technique: size === 2 ? "hidden_pair" : "hidden_triple",
          eliminations,
          cells,
          digits,
          units: [u]
        };
      }
    }
  }
  return null;
}

// X-Wing (size 2) and Swordfish (size 3), with rows or columns as base lines
function findFish(s: SolverState, size: 2 | 3): SolveStep | null {
  const orientations = [
    { base: ROW_UNIT, cover: COL_UNIT, crossOf: colOf },
    { base: COL_UNIT, cover: ROW_UNIT, crossOf: rowOf }
  ];
  for (let d = 1; d <= 9; d++) {
    for (const { base, cover, crossOf } of orientations) {
      const lines = NINE.filter((k) => {
        const n = cellsWith(s, UNITS[base + k], d).length;
        return n >= 2 && n <= size;
      });
      for (const combo of combinations(lines, size)) {
        const spots = combo.flatMap((k) => cellsWith(s, UNITS[base + k], d));
        const covers = [...new Set(spots.map(crossOf))].sort((a, b) => a - b);
        if (covers.length !== size) continue;
        const eliminations = covers
          .flatMap((k) => cellsWith(s, UNITS[cover + k], d))
          .filter((i) => !spots.includes(i))
          .map((cell) => ({ cell, digit: d }));
        if (eliminations.length) {
          return {
            kind: "eliminate",
            technique: size === 2 ? "x_wing" : "swordfish",
            eliminations,
            cells: spots,
            digits: [d],
            units: [...combo.map((k) => base + k), ...covers.map((k) => cover + k)]
          };
        }
      }
    }
  }
  return null;
}

function findXYWing(s: SolverState): SolveStep | null {
  for (let pivot = 0; pivot < 81; pivot++) {
    const p = s.cands[pivot];
    if (popcount(p) !== 2) continue;
    const wings = PEERS[pivot].filter(
      (i) => popcount(s.cands[i]) === 2 && popcount(s.cands[i] & p) === 1
    );
    for (const [a, b] of combinations(wings, 2)) {
      const z = s.cands[a] & ~p;
      if (z !== (s.cands[b] & ~p) || (s.cands[a] & p) === (s.cands[b] & p)) continue;
      const digit = MASK_DIGITS[z][0];
      const eliminations = PEERS[a]
        .filter((i) => i !== pivot && sees(i, b) && s.cands[i] & z)
        .map((cell) => ({ cell, digit }));
      if (eliminations.length) {
        return {
          kind: "eliminate",
          technique: "xy_wing",
          eliminations,
          cells: [pivot, a, b],
          digits: [MASK_DIGITS[s.cands[a] & p][0], MASK_DIGITS[s.cands[b] & p][0], digit],
          units: []
        };
      }
    }
  }
  return null;
}

const STEP_FINDERS: { level: number; find: (s: SolverState) => SolveStep | null }[] = [
  { level: 1, find: findSingle },
  { level: 2, find: findLockedCandidates },
  { level: 3, find: (s) => findNakedSubset(s, 2) },
  { level: 3, find: (s) => findHiddenSubset(s, 2) },
  { level: 3, find: (s) => findNakedSubset(s, 3) },
  { level: 3, find: (s) => findHiddenSubset(s, 3) },
  { level: 4, find: (s) => findFish(s, 2) },
  { level: 4, find: findXYWing },
  { level: 4, find: (s) => findFish(s, 3) }
];

function findStep(s: SolverState, maxLevel: number): SolveStep | null {
  for (const finder of STEP_FINDERS) {
    if (finder.level > maxLevel) break;
    const step = finder.find(s);
    if (step) return step;
  }
  return null;
}

/**
 * Solves a puzzle (81 values, 0 = empty) using only techniques up to `maxLevel`.
 * `level` is the hardest technique the solution required. Every technique is sound,
 * so a puzzle that gets solved also has a unique solution.
 */
export function ratePuzzle(values: number[], maxLevel = 4): { solved: boolean; level: number } {
  const s = createSolverState(values);
  let level = 0;
  while (s.empty > 0) {
    const step = findStep(s, maxLevel);
    if (!step) return { solved: false, level };
    level = Math.max(level, TECHNIQUES[step.technique].level);
    applyStep(s, step);
  }
  return { solved: true, level };
}

// Each difficulty requires a technique level and removes clues down to minClues
const GENERATION_TARGETS: Record<DifficultyLevel, { minClues: number; minLevel: number; maxLevel: number }> = {
  facil: { minClues: 44, minLevel: 1, maxLevel: 1 },
  medio: { minClues: 34, minLevel: 1, maxLevel: 1 },
  dificil: { minClues: 26, minLevel: 2, maxLevel: 2 },
  especialista: { minClues: 24, minLevel: 3, maxLevel: 3 },
  mestre: { minClues: 22, minLevel: 4, maxLevel: 4 }
};
const MAX_GENERATION_ATTEMPTS = 40;

// Generate puzzle with specified difficulty; a seed always yields the same puzzle
export function generateSudokuPuzzle(
  difficulty: DifficultyLevel,
  seed?: number
): {
  initialGrid: number[][];
  solution: number[][];
  board: BoardMatrix;
} {
  if (seed !== undefined) {
    random = seededRandom(seed);
    try {
      return generateSudokuPuzzle(difficulty);
    } finally {
      random = Math.random;
    }
  }

  const target = GENERATION_TARGETS[difficulty];
  let best: { puzzle: number[]; solution: number[]; level: number; clues: number } | null = null;

  for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt++) {
    const solution = generateSolvedBoard().flat();
    const puzzle = [...solution];
    let clues = 81;

    for (const i of shuffle(Array.from({ length: 81 }, (_, k) => k))) {
      if (clues <= target.minClues) break;
      const digit = puzzle[i];
      puzzle[i] = 0;
      if (ratePuzzle(puzzle, target.maxLevel).solved) {
        clues--;
      } else {
        puzzle[i] = digit;
      }
    }

    const { level } = ratePuzzle(puzzle, target.maxLevel);
    if (!best || level > best.level || (level === best.level && clues < best.clues)) {
      best = { puzzle, solution, level, clues };
    }
    if (level >= target.minLevel) break;
  }

  const { puzzle, solution } = best!;
  const toGrid = (values: number[]) => NINE.map((r) => values.slice(r * 9, r * 9 + 9));

  const board: BoardMatrix = toGrid(puzzle).map((row, r) =>
    row.map((val, c) => ({
      row: r,
      col: c,
      value: val,
      solutionValue: solution[r * 9 + c],
      isInitial: val !== 0,
      notes: [],
      isError: false,
      isConflict: false
    }))
  );

  return {
    initialGrid: toGrid(puzzle),
    solution: toGrid(solution),
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

// ---------------------------------------------------------------------------
// Smart hints: runs the logical solver from the current board and explains
// the deductions that lead to the next number.
// ---------------------------------------------------------------------------

const BOX_NAMES = [
  "superior esquerdo",
  "superior central",
  "superior direito",
  "central esquerdo",
  "central",
  "central direito",
  "inferior esquerdo",
  "inferior central",
  "inferior direito"
];

const unitName = (u: number) =>
  u < ROW_UNIT ? `bloco ${BOX_NAMES[u]}` : u < COL_UNIT ? `linha ${u - ROW_UNIT + 1}` : `coluna ${u - COL_UNIT + 1}`;
const inUnit = (u: number) => `${u < ROW_UNIT ? "No" : "Na"} ${unitName(u)}`;
const cellName = (i: number) => `L${rowOf(i) + 1}C${colOf(i) + 1}`;
const cellFullName = (i: number) => `linha ${rowOf(i) + 1}, coluna ${colOf(i) + 1}`;

const listPt = (items: (string | number)[]) =>
  items.length <= 1 ? items.join("") : `${items.slice(0, -1).join(", ")} e ${items[items.length - 1]}`;

// "linhas 2 e 7" / "colunas 1, 4 e 8"
const linesName = (units: number[]) =>
  `${units[0] < COL_UNIT ? "linhas" : "colunas"} ${listPt(units.map((u) => unitName(u).split(" ")[1]))}`;

function describeEliminations(eliminations: Elimination[]): string {
  const byDigit = new Map<number, number[]>();
  for (const { cell, digit } of eliminations) {
    byDigit.set(digit, [...(byDigit.get(digit) ?? []), cell]);
  }
  return listPt([...byDigit].map(([d, cells]) => `o ${d} sai de ${listPt(cells.map(cellName))}`));
}

function describeStep(step: EliminateStep): string {
  const { cells, digits, units } = step;
  const d = digits[0];
  const elims = describeEliminations(step.eliminations);
  const where = listPt(cells.map(cellName));
  const all = cells.length === 2 ? "as duas" : "todas";

  switch (step.technique) {
    case "pointing":
      return `${inUnit(units[0])}, o ${d} só pode ficar em ${where}, ${all} na ${unitName(units[1])}. Então o ${d} dessa ${unitName(units[1]).split(" ")[0]} está obrigatoriamente nesse bloco: ${elims}.`;
    case "claiming":
      return `${inUnit(units[0])}, o ${d} só pode ficar em ${where}, ${all} dentro do ${unitName(units[1])}. Então o ${d} desse bloco está obrigatoriamente nessa ${unitName(units[0]).split(" ")[0]}: ${elims}.`;
    case "naked_pair":
    case "naked_triple":
      return `${inUnit(units[0])}, as casas ${where} só aceitam ${listPt(digits)}. Esses números ficam presos nelas e saem do resto da unidade: ${elims}.`;
    case "hidden_pair":
    case "hidden_triple":
      return `${inUnit(units[0])}, os números ${listPt(digits)} só cabem em ${where}. Então essas casas não podem ter outros números: ${elims}.`;
    case "x_wing":
    case "swordfish": {
      const size = units.length / 2;
      const base = units.slice(0, size);
      const cover = units.slice(size);
      return `Nas ${linesName(base)}, o ${d} só pode ficar nas ${linesName(cover)} (${where}). Cada uma dessas ${linesName(base).split(" ")[0]} terá seu ${d} numa dessas ${linesName(cover).split(" ")[0]}, então elas já estão ocupadas: ${elims}.`;
    }
    case "xy_wing": {
      const [pivot, a, b] = cells;
      const [x, y, z] = digits;
      return `${cellName(pivot)} só aceita ${x} ou ${y}. Se for ${x}, ${cellName(a)} vira ${z}; se for ${y}, ${cellName(b)} vira ${z}. De qualquer jeito uma delas é ${z}, então nenhuma casa que veja as duas pode ter ${z}: ${elims}.`;
    }
    default:
      return elims;
  }
}

// Keeps only the elimination steps that (directly or through other kept steps) lead to the placement
function relevantSteps(chain: EliminateStep[], final: PlaceStep): EliminateStep[] {
  const focus = new Map<number, number>();
  if (final.unit >= 0) {
    for (const i of UNITS[final.unit]) focus.set(i, bit(final.digit));
  } else {
    focus.set(final.cell, ALL_DIGITS);
  }
  const kept: EliminateStep[] = [];
  for (let k = chain.length - 1; k >= 0; k--) {
    const step = chain[k];
    if (step.eliminations.some((e) => (focus.get(e.cell) ?? 0) & bit(e.digit))) {
      kept.unshift(step);
      for (const i of step.cells) focus.set(i, ALL_DIGITS);
    }
  }
  return kept;
}

const MAX_EXPLAINED_STEPS = 4;

// Where the number goes inside the unit: "coluna 4" in a row, "linha 2" in a column
const spotInUnit = (u: number, i: number) =>
  u < ROW_UNIT ? cellFullName(i) : u < COL_UNIT ? `coluna ${colOf(i) + 1}` : `linha ${rowOf(i) + 1}`;

function buildHint(final: PlaceStep, chain: EliminateStep[]): HintExplanation {
  const relevant = relevantSteps(chain, final);
  // Long chains: explain the deductions closest to the answer
  const skipped = Math.max(0, relevant.length - MAX_EXPLAINED_STEPS);
  const steps = relevant.slice(skipped);
  const hardest = [...steps.map((st) => st.technique), final.technique].reduce((a, b) =>
    TECHNIQUES[b].level > TECHNIQUES[a].level ? b : a
  );
  const d = final.digit;
  const target = cellFullName(final.cell);

  const lines = steps.map((st, k) => {
    const number = steps.length > 1 ? `${k + 1}. ` : "";
    return `${number}${TECHNIQUES[st.technique].label} — ${describeStep(st)}`;
  });
  if (skipped) {
    lines.unshift(
      skipped === 1
        ? "(Já considerando 1 eliminação anterior.)"
        : `(Já considerando ${skipped} eliminações anteriores.)`
    );
  }

  if (final.technique === "hidden_single") {
    const spot = spotInUnit(final.unit, final.cell);
    lines.push(
      steps.length
        ? `${inUnit(final.unit)}, o ${d} agora só cabe na ${spot}.`
        : `${inUnit(final.unit)}, o ${d} só cabe na ${spot}: todas as outras casas vazias já veem um ${d} na sua linha, coluna ou bloco.`
    );
  } else {
    lines.push(
      steps.length
        ? `Com essas eliminações, a casa da ${target} fica só com o ${d}.`
        : `A casa da ${target} já vê todos os outros números na sua linha, coluna e bloco. Só sobra o ${d}.`
    );
  }

  const highlightCells = [...new Set([...steps.flatMap((st) => st.cells), final.cell])].map((i) => ({
    row: rowOf(i),
    col: colOf(i)
  }));

  return {
    type: final.technique === "hidden_single" ? "hidden_single" : "naked_single",
    position: { row: rowOf(final.cell), col: colOf(final.cell) },
    value: d,
    title: `${TECHNIQUES[hardest].label}: Linha ${rowOf(final.cell) + 1}, Coluna ${colOf(final.cell) + 1}`,
    explanation: lines.join("\n\n"),
    highlightCells
  };
}

// Smart Hint Generator with pedagogical logic
export function generateSmartHint(board: BoardMatrix): HintExplanation | null {
  const cells = board.flat();

  // A wrong number makes every later deduction unreliable, so fix it first
  const wrong = cells.find((c) => !c.isInitial && c.value !== 0 && c.value !== c.solutionValue);
  if (wrong) {
    return {
      type: "error_correction",
      position: { row: wrong.row, col: wrong.col },
      value: wrong.solutionValue,
      title: `Correção: Linha ${wrong.row + 1}, Coluna ${wrong.col + 1}`,
      explanation: `O ${wrong.value} colocado aqui não faz parte da solução e levaria a contradições mais adiante. O número correto desta casa é ${wrong.solutionValue}.`,
      highlightCells: [{ row: wrong.row, col: wrong.col }]
    };
  }

  const s = createSolverState(cells.map((c) => c.value));
  if (s.empty === 0) return null;

  const chain: EliminateStep[] = [];
  for (let step = findStep(s, Infinity); step; step = findStep(s, Infinity)) {
    if (step.kind === "place") return buildHint(step, chain);
    chain.push(step);
    applyStep(s, step);
  }

  // Beyond the explained techniques: point to the cell with the fewest options
  const empties = s.values.flatMap((v, i) => (v ? [] : [i]));
  const cell = empties.reduce((a, b) => (popcount(s.cands[b]) < popcount(s.cands[a]) ? b : a));
  const solVal = cells[cell].solutionValue;
  return {
    type: "advanced_logic",
    position: { row: rowOf(cell), col: colOf(cell) },
    value: solVal,
    title: `Dedução Avançada: Linha ${rowOf(cell) + 1}, Coluna ${colOf(cell) + 1}`,
    explanation: `Este ponto do tabuleiro exige técnicas além das que a dica explica (cadeias longas ou tentativa e erro). A casa com menos opções é a da ${cellFullName(cell)}, que aceita ${listPt(MASK_DIGITS[s.cands[cell]])}. A resposta certa é ${solVal}.`,
    highlightCells: [{ row: rowOf(cell), col: colOf(cell) }]
  };
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
