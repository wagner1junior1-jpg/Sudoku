import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  DifficultyLevel,
  BoardMatrix,
  CellPosition,
  GameStatus,
  GameMoveHistory,
  GameHistoryItem,
  LeaderboardItem,
  GameSettings,
  UserProfile,
  HintExplanation,
  ActiveGameState
} from "./types";
import {
  generateSudokuPuzzle,
  detectConflicts,
  generateSmartHint,
  calculateMatchScore,
  getNumberCounts,
  isBoardCompleted
} from "./utils/sudokuEngine";
import { soundEffects } from "./utils/soundEffects";
import {
  saveActiveGame,
  loadActiveGame,
  clearActiveGame,
  saveGameHistory,
  loadGameHistory,
  clearGameHistory,
  saveSettings,
  loadSettings,
  saveUserProfile,
  loadUserProfile,
  saveLocalLeaderboardRecord,
  loadLocalLeaderboard
} from "./utils/storage";
import { THEMES } from "./utils/themes";

// Components
import { Header } from "./components/Header";
import { HomeScreen } from "./components/HomeScreen";
import { StatsBar } from "./components/StatsBar";
import { SudokuGrid } from "./components/SudokuGrid";
import { SudokuPad } from "./components/SudokuPad";
import { PauseOverlay } from "./components/PauseOverlay";
import { WinCelebrationModal } from "./components/WinCelebrationModal";
import { GameOverModal } from "./components/GameOverModal";
import { LeaderboardModal } from "./components/LeaderboardModal";
import { HistoryModal } from "./components/HistoryModal";
import { SettingsModal } from "./components/SettingsModal";
import { HintModal } from "./components/HintModal";
import { NewGameModal } from "./components/NewGameModal";
import { HowToPlayModal } from "./components/HowToPlayModal";
import { QuickThemeModal } from "./components/QuickThemeModal";
import { AchievementsModal } from "./components/AchievementsModal";
import { AchievementToast } from "./components/AchievementToast";
import { PWAInstallModal } from "./components/PWAInstallModal";
import { PWAUpdateToast } from "./components/PWAUpdateToast";
import { FeedbackModal } from "./components/FeedbackModal";
import { evaluateAchievements } from "./utils/achievements";
import { Achievement } from "./types";

export default function App() {
  // Settings & Profile
  const [settings, setSettings] = useState<GameSettings>(() => loadSettings());
  const [userProfile, setUserProfile] = useState<UserProfile>(() => loadUserProfile());

  // Active Game State
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("facil");
  const [board, setBoard] = useState<BoardMatrix>(() => generateSudokuPuzzle("facil").board);
  const [solution, setSolution] = useState<number[][]>(() => generateSudokuPuzzle("facil").solution);
  const [initialGrid, setInitialGrid] = useState<number[][]>(() => generateSudokuPuzzle("facil").initialGrid);

  const [selectedPos, setSelectedPos] = useState<CellPosition | null>({ row: 4, col: 4 });
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [isNotesMode, setIsNotesMode] = useState<boolean>(false);
  const [gameStatus, setGameStatus] = useState<GameStatus>("home");
  const [savedGame, setSavedGame] = useState<ActiveGameState | null>(() => loadActiveGame());
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [mistakes, setMistakes] = useState<number>(0);
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [score, setScore] = useState<number>(5000);

  // Undo / Redo Stacks
  const [historyStack, setHistoryStack] = useState<GameMoveHistory[]>([]);
  const [redoStack, setRedoStack] = useState<GameMoveHistory[]>([]);

  // Persistent Match History & Local Leaderboard
  const [gameHistory, setGameHistory] = useState<GameHistoryItem[]>(() => loadGameHistory());
  const [localLeaderboard, setLocalLeaderboard] = useState<LeaderboardItem[]>(() =>
    loadLocalLeaderboard()
  );

  // Modals & UI overlays
  const [isNewGameOpen, setIsNewGameOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [isQuickThemeOpen, setIsQuickThemeOpen] = useState(false);
  const [isPWAInstallOpen, setIsPWAInstallOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isPWAInstalled, setIsPWAInstalled] = useState(false);
  const [activeHint, setActiveHint] = useState<HintExplanation | null>(null);
  const [recentUnlockedAchievements, setRecentUnlockedAchievements] = useState<Achievement[]>([]);
  const [activeAchievementToast, setActiveAchievementToast] = useState<Achievement | null>(null);
  const [hasContinuedPastLimit, setHasContinuedPastLimit] = useState(false);

  // Detect PWA installation and listen for install prompts
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsPWAInstalled(true);
      setDeferredPrompt(null);
    };

    const checkStandalone = () => {
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      setIsPWAInstalled(Boolean(standalone));
    };

    checkStandalone();
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  // Sound effects sync
  useEffect(() => {
    soundEffects.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  // Sync saved game on mount
  useEffect(() => {
    const saved = loadActiveGame();
    if (saved && saved.board && saved.solution) {
      setSavedGame(saved);
    }
  }, []);

  // Resume active saved game
  const handleResumeSavedGame = useCallback(() => {
    const saved = savedGame || loadActiveGame();
    if (saved && saved.board && saved.solution) {
      setBoard(saved.board);
      setSolution(saved.solution);
      setInitialGrid(saved.initialGrid);
      setDifficulty(saved.difficulty);
      setTimerSeconds(saved.timerSeconds);
      setMistakes(saved.mistakes);
      setHintsUsed(saved.hintsUsed);
      setScore(saved.score);
      setHistoryStack(saved.historyStack || []);
      setRedoStack(saved.redoStack || []);
      setGameStatus("playing");
      setIsNotesMode(false);
      setActiveHint(null);
    }
  }, [savedGame]);

  // Autosave game progress
  useEffect(() => {
    if (gameStatus === "playing" || gameStatus === "paused") {
      const stateToSave: ActiveGameState = {
        board,
        solution,
        initialGrid,
        difficulty,
        timerSeconds,
        mistakes,
        hintsUsed,
        score,
        gameStatus,
        historyStack,
        redoStack,
        lastUpdated: Date.now()
      };
      saveActiveGame(stateToSave);
      setSavedGame(stateToSave);
    }
  }, [
    board,
    solution,
    initialGrid,
    difficulty,
    timerSeconds,
    mistakes,
    hintsUsed,
    score,
    gameStatus,
    historyStack,
    redoStack
  ]);

  // Stopwatch Timer Interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (gameStatus === "playing") {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
        if (hasContinuedPastLimit || mistakes >= 3) {
          setScore(0);
        } else {
          setScore(() => calculateMatchScore(difficulty, timerSeconds + 1, mistakes, hintsUsed));
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameStatus, difficulty, timerSeconds, mistakes, hintsUsed, hasContinuedPastLimit]);

  // Check conflicts and errors in real-time
  const { conflicts, errors } = detectConflicts(board);
  const numberCounts = getNumberCounts(board);

  // Active highlighted number for matching number highlight
  const currentHighlightedNumber =
    selectedPos !== null && board[selectedPos.row][selectedPos.col].value > 0
      ? board[selectedPos.row][selectedPos.col].value
      : selectedNumber;

  // Start a new game
  const startNewGame = useCallback((newDifficulty: DifficultyLevel) => {
    const puzzle = generateSudokuPuzzle(newDifficulty);
    setDifficulty(newDifficulty);
    setBoard(puzzle.board);
    setSolution(puzzle.solution);
    setInitialGrid(puzzle.initialGrid);
    setTimerSeconds(0);
    setMistakes(0);
    setHintsUsed(0);
    setScore(5000);
    setSelectedPos({ row: 4, col: 4 });
    setSelectedNumber(null);
    setHistoryStack([]);
    setRedoStack([]);
    setGameStatus("playing");
    setHasContinuedPastLimit(false);
    setIsNotesMode(false);
    setActiveHint(null);
    setIsNewGameOpen(false);
  }, []);

  // Place number or note at specific cell
  const handleInputDigit = useCallback(
    (digit: number, targetPos?: CellPosition | null) => {
      const pos = targetPos || selectedPos;
      if (!pos || gameStatus !== "playing") return;

      const { row, col } = pos;
      const cell = board[row][col];
      if (cell.isInitial) return; // Cannot modify initial clues

      if (isNotesMode) {
        // Toggle candidate note
        const currentNotes = [...cell.notes];
        const noteIndex = currentNotes.indexOf(digit);
        let updatedNotes: number[];

        if (noteIndex >= 0) {
          updatedNotes = currentNotes.filter((n) => n !== digit);
        } else {
          updatedNotes = [...currentNotes, digit].sort((a, b) => a - b);
        }

        const prevNotes = [...cell.notes];
        const move: GameMoveHistory = {
          row,
          col,
          prevValue: cell.value,
          newValue: cell.value,
          prevNotes,
          newNotes: updatedNotes,
          type: "note"
        };

        const newBoard = board.map((r, rIdx) =>
          r.map((c, cIdx) => {
            if (rIdx === row && cIdx === col) {
              return { ...c, notes: updatedNotes };
            }
            return c;
          })
        );

        setBoard(newBoard);
        setHistoryStack((prev) => [...prev, move]);
        setRedoStack([]);
        soundEffects.playNoteTick();
        if (settings.hapticEnabled) soundEffects.triggerHaptic(15);
      } else {
        // Placing a value
        const prevValue = cell.value;
        const prevNotes = [...cell.notes];
        const isSame = prevValue === digit;
        const newValue = isSame ? 0 : digit; // toggle off if clicked same number

        const isWrong = newValue !== 0 && newValue !== cell.solutionValue;

        if (isWrong) {
          soundEffects.playError();
          if (settings.hapticEnabled) soundEffects.triggerHaptic(40);
          setMistakes((prev) => {
            const nextMistakes = prev + 1;
            if (nextMistakes >= 3 && !hasContinuedPastLimit) {
              setGameStatus("game_over");
              soundEffects.playGameOver();
            }
            return nextMistakes;
          });
        } else if (newValue !== 0) {
          soundEffects.playPlaceNumber(digit);
          if (settings.hapticEnabled) soundEffects.triggerHaptic(20);
        } else {
          soundEffects.playErase();
        }

        // Auto-clear candidate notes in same row, column, and 3x3 block if enabled
        const newBoard = board.map((r, rIdx) =>
          r.map((c, cIdx) => {
            if (rIdx === row && cIdx === col) {
              return {
                ...c,
                value: newValue,
                notes: newValue !== 0 ? [] : c.notes,
                isError: isWrong
              };
            }

            if (settings.autoClearNotes && newValue !== 0 && !isWrong) {
              const inSameRow = rIdx === row;
              const inSameCol = cIdx === col;
              const inSameBox =
                Math.floor(rIdx / 3) === Math.floor(row / 3) &&
                Math.floor(cIdx / 3) === Math.floor(col / 3);

              if (inSameRow || inSameCol || inSameBox) {
                return {
                  ...c,
                  notes: c.notes.filter((n) => n !== newValue)
                };
              }
            }

            return c;
          })
        );

        const move: GameMoveHistory = {
          row,
          col,
          prevValue,
          newValue,
          prevNotes,
          newNotes: newValue !== 0 ? [] : cell.notes,
          type: "value"
        };

        setBoard(newBoard);
        setHistoryStack((prev) => [...prev, move]);
        setRedoStack([]);

        // Check if board is completely solved
        if (isBoardCompleted(newBoard)) {
          handleVictory(newBoard);
        }
      }
    },
    [
      board,
      selectedPos,
      gameStatus,
      isNotesMode,
      settings.autoClearNotes,
      settings.hapticEnabled,
      hasContinuedPastLimit
    ]
  );

  // Guarantee game over triggers if 3 mistakes are reached
  useEffect(() => {
    if (mistakes >= 3 && gameStatus === "playing" && !hasContinuedPastLimit) {
      setGameStatus("game_over");
      soundEffects.playGameOver();
    }
  }, [mistakes, gameStatus, hasContinuedPastLimit]);

  // Handle Win Completion
  const handleVictory = (finalBoard: BoardMatrix) => {
    soundEffects.playVictory();
    setGameStatus("completed");
    clearActiveGame();

    const finalScore =
      hasContinuedPastLimit || mistakes >= 3
        ? 0
        : calculateMatchScore(difficulty, timerSeconds, mistakes, hintsUsed);

    const historyItem: GameHistoryItem = {
      id: "hist_" + Date.now(),
      date: new Date().toISOString().split("T")[0],
      difficulty,
      timeSeconds: timerSeconds,
      score: finalScore,
      mistakes,
      hintsUsed,
      won: true,
      completedAt: new Date().toISOString()
    };

    saveGameHistory(historyItem);
    const updatedHistory = [historyItem, ...gameHistory];
    setGameHistory(updatedHistory);

    // Evaluate and trigger achievements
    const newlyUnlocked = evaluateAchievements({
      difficulty,
      timeSeconds: timerSeconds,
      score: finalScore,
      mistakes,
      hintsUsed,
      historyStack,
      allHistory: updatedHistory
    });

    if (newlyUnlocked.length > 0) {
      setRecentUnlockedAchievements(newlyUnlocked);
      setActiveAchievementToast(newlyUnlocked[0]);
    } else {
      setRecentUnlockedAchievements([]);
    }

    // Save locally to offline leaderboard as well
    const localRecord: LeaderboardItem = {
      id: historyItem.id,
      name: userProfile.name,
      country: userProfile.country,
      difficulty,
      timeSeconds: timerSeconds,
      score: finalScore,
      date: historyItem.date,
      isUser: true
    };
    saveLocalLeaderboardRecord(localRecord);
    setLocalLeaderboard((prev) => [...prev, localRecord]);
  };


  // Erase active cell
  const handleErase = useCallback(() => {
    if (!selectedPos || gameStatus !== "playing") return;
    const { row, col } = selectedPos;
    const cell = board[row][col];
    if (cell.isInitial) return;
    if (cell.value === 0 && cell.notes.length === 0) return;

    const move: GameMoveHistory = {
      row,
      col,
      prevValue: cell.value,
      newValue: 0,
      prevNotes: [...cell.notes],
      newNotes: [],
      type: "erase"
    };

    const newBoard = board.map((r, rIdx) =>
      r.map((c, cIdx) => {
        if (rIdx === row && cIdx === col) {
          return { ...c, value: 0, notes: [], isError: false };
        }
        return c;
      })
    );

    setBoard(newBoard);
    setHistoryStack((prev) => [...prev, move]);
    setRedoStack([]);
    soundEffects.playErase();
    if (settings.hapticEnabled) soundEffects.triggerHaptic(15);
  }, [board, selectedPos, gameStatus, settings.hapticEnabled]);

  // Undo Move
  const handleUndo = useCallback(() => {
    if (historyStack.length === 0 || gameStatus !== "playing") return;

    const lastMove = historyStack[historyStack.length - 1];
    const newHistory = historyStack.slice(0, -1);

    const newBoard = board.map((r, rIdx) =>
      r.map((c, cIdx) => {
        if (rIdx === lastMove.row && cIdx === lastMove.col) {
          return {
            ...c,
            value: lastMove.prevValue,
            notes: lastMove.prevNotes,
            isError: false
          };
        }
        return c;
      })
    );

    setBoard(newBoard);
    setHistoryStack(newHistory);
    setRedoStack((prev) => [...prev, lastMove]);
    setSelectedPos({ row: lastMove.row, col: lastMove.col });
    soundEffects.playNoteTick();
  }, [historyStack, board, gameStatus]);

  // Redo Move
  const handleRedo = useCallback(() => {
    if (redoStack.length === 0 || gameStatus !== "playing") return;

    const nextMove = redoStack[redoStack.length - 1];
    const newRedo = redoStack.slice(0, -1);

    const newBoard = board.map((r, rIdx) =>
      r.map((c, cIdx) => {
        if (rIdx === nextMove.row && cIdx === nextMove.col) {
          return {
            ...c,
            value: nextMove.newValue,
            notes: nextMove.newNotes,
            isError: false
          };
        }
        return c;
      })
    );

    setBoard(newBoard);
    setRedoStack(newRedo);
    setHistoryStack((prev) => [...prev, nextMove]);
    setSelectedPos({ row: nextMove.row, col: nextMove.col });
    soundEffects.playNoteTick();
  }, [redoStack, board, gameStatus]);

  // Trigger Smart Hint
  const handleRequestHint = useCallback(() => {
    if (gameStatus !== "playing") return;
    const hint = generateSmartHint(board);
    if (hint) {
      setActiveHint(hint);
      setSelectedPos(hint.position);
      setHintsUsed((prev) => prev + 1);
      soundEffects.playHint();
    }
  }, [board, gameStatus]);

  // Apply Hint from Modal
  const handleApplyHint = () => {
    if (!activeHint) return;
    const { row, col } = activeHint.position;
    const digit = activeHint.value;

    const newBoard = board.map((r, rIdx) =>
      r.map((c, cIdx) => {
        if (rIdx === row && cIdx === col) {
          return { ...c, value: digit, notes: [], isError: false };
        }
        return c;
      })
    );

    setBoard(newBoard);
    setActiveHint(null);
    soundEffects.playPlaceNumber(digit);

    if (isBoardCompleted(newBoard)) {
      handleVictory(newBoard);
    }
  };

  // Cell click handler
  const handleCellClick = (row: number, col: number) => {
    setSelectedPos({ row, col });

    if (settings.inputMode === "number-first" && selectedNumber !== null) {
      handleInputDigit(selectedNumber, { row, col });
    }
  };

  // Number pad button click
  const handleNumberPadClick = (num: number) => {
    if (settings.inputMode === "number-first") {
      setSelectedNumber((prev) => (prev === num ? null : num));
      if (selectedPos) {
        handleInputDigit(num, selectedPos);
      }
    } else {
      handleInputDigit(num);
    }
  };

  // Keyboard Navigation & Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture when typing in text inputs
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      // 1-9 Numbers
      if (e.key >= "1" && e.key <= "9") {
        e.preventDefault();
        const digit = parseInt(e.key, 10);
        handleInputDigit(digit);
        return;
      }

      // Erase
      if (e.key === "Backspace" || e.key === "Delete") {
        e.preventDefault();
        handleErase();
        return;
      }

      // Toggle Notes
      if (e.key === "n" || e.key === "N") {
        e.preventDefault();
        setIsNotesMode((prev) => !prev);
        return;
      }

      // Hint
      if (e.key === "h" || e.key === "H") {
        e.preventDefault();
        handleRequestHint();
        return;
      }

      // Space -> Pause/Resume
      if (e.key === " ") {
        e.preventDefault();
        setGameStatus((prev) => (prev === "playing" ? "paused" : prev === "paused" ? "playing" : prev));
        return;
      }

      // Undo / Redo (Ctrl+Z, Ctrl+Y, U)
      if ((e.ctrlKey || e.metaKey) && (e.key === "z" || e.key === "Z")) {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
        return;
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === "y" || e.key === "Y")) {
        e.preventDefault();
        handleRedo();
        return;
      }
      if (e.key === "u" || e.key === "U") {
        e.preventDefault();
        handleUndo();
        return;
      }

      // Arrow keys navigation
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key) && selectedPos) {
        e.preventDefault();
        let { row, col } = selectedPos;
        if (e.key === "ArrowUp") row = (row - 1 + 9) % 9;
        if (e.key === "ArrowDown") row = (row + 1) % 9;
        if (e.key === "ArrowLeft") col = (col - 1 + 9) % 9;
        if (e.key === "ArrowRight") col = (col + 1) % 9;
        setSelectedPos({ row, col });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPos, handleInputDigit, handleErase, handleUndo, handleRedo, handleRequestHint]);

  const currentTheme = THEMES[settings.theme] || THEMES["light-classic"];

  return (
    <div
      className={`h-[100dvh] max-h-[100dvh] w-full ${currentTheme.bg} ${currentTheme.textColor} flex flex-col justify-between max-w-md mx-auto select-none overflow-hidden transition-colors duration-300 font-['Plus_Jakarta_Sans']`}
    >
      {/* Home Screen / Main Menu */}
      {gameStatus === "home" ? (
        <HomeScreen
          userProfile={userProfile}
          themeId={settings.theme}
          savedGame={savedGame}
          gameHistory={gameHistory}
          isPWAInstalled={isPWAInstalled}
          onStartNewGame={() => setIsNewGameOpen(true)}
          onResumeGame={handleResumeSavedGame}
          onOpenNewGameModal={() => setIsNewGameOpen(true)}
          onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
          onOpenAchievements={() => setIsAchievementsOpen(true)}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
          onOpenQuickTheme={() => setIsQuickThemeOpen(true)}
          onOpenPWAInstall={() => setIsPWAInstallOpen(true)}
          onOpenFeedback={() => setIsFeedbackOpen(true)}
          onUpdateProfile={(newProfile) => {
            setUserProfile(newProfile);
            saveUserProfile(newProfile);
          }}
        />
      ) : (
        /* In-Game Arena Screen */
        <div className="h-full w-full flex flex-col justify-between py-1 px-2">
          {/* App Mobile Header */}
          <Header
            difficulty={difficulty}
            themeId={settings.theme}
            isPWAInstalled={isPWAInstalled}
            onGoHome={() => setGameStatus("home")}
            onOpenNewGame={() => setIsNewGameOpen(true)}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
            onOpenAchievements={() => setIsAchievementsOpen(true)}
            onOpenHistory={() => setIsHistoryOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
            onOpenQuickTheme={() => setIsQuickThemeOpen(true)}
            onOpenPWAInstall={() => setIsPWAInstallOpen(true)}
            onOpenFeedback={() => setIsFeedbackOpen(true)}
          />

          {/* Live Timer, Mistakes, Score bar */}
          <StatsBar
            difficulty={difficulty}
            timerSeconds={timerSeconds}
            mistakes={mistakes}
            score={score}
            gameStatus={gameStatus}
            maxMistakesLimit={settings.maxMistakesLimit}
            themeId={settings.theme}
            onTogglePause={() =>
              setGameStatus((prev) => (prev === "playing" ? "paused" : "playing"))
            }
          />

          {/* Center Main Arena: 9x9 Interactive Grid */}
          <main className="w-full flex-1 flex items-center justify-center my-auto py-1">
            <div className="relative w-full flex items-center justify-center">
              <SudokuGrid
                board={board}
                selectedPos={selectedPos}
                highlightNumber={currentHighlightedNumber}
                conflicts={conflicts}
                errors={errors}
                hintPos={activeHint?.position || null}
                settings={settings}
                themeId={settings.theme}
                isPaused={gameStatus === "paused"}
                isCompleted={gameStatus === "completed"}
                onCellClick={handleCellClick}
              />

              {/* Pause Screen Overlay */}
              {gameStatus === "paused" && (
                <PauseOverlay
                  themeId={settings.theme}
                  onResume={() => setGameStatus("playing")}
                  onGoHome={() => setGameStatus("home")}
                />
              )}
            </div>
          </main>

          {/* Bottom Area: Controls & Touch Number Pad */}
          <SudokuPad
            numberCounts={numberCounts}
            isNotesMode={isNotesMode}
            selectedNumber={selectedNumber}
            inputMode={settings.inputMode}
            canUndo={historyStack.length > 0}
            canRedo={redoStack.length > 0}
            themeId={settings.theme}
            onNumberClick={handleNumberPadClick}
            onToggleNotes={() => setIsNotesMode((prev) => !prev)}
            onErase={handleErase}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onHint={handleRequestHint}
            onToggleInputMode={() =>
              setSettings((prev) => {
                const nextMode = prev.inputMode === "cell-first" ? "number-first" : "cell-first";
                saveSettings({ ...prev, inputMode: nextMode });
                return { ...prev, inputMode: nextMode };
              })
            }
          />
        </div>
      )}

      {/* Modals */}
      {isNewGameOpen && (
        <NewGameModal
          currentDifficulty={difficulty}
          themeId={settings.theme}
          onSelectDifficulty={(diff) => startNewGame(diff)}
          onClose={() => setIsNewGameOpen(false)}
        />
      )}

      {isAchievementsOpen && (
        <AchievementsModal
          gameHistory={gameHistory}
          themeId={settings.theme}
          onClose={() => setIsAchievementsOpen(false)}
        />
      )}

      {isLeaderboardOpen && (
        <LeaderboardModal
          currentDifficulty={difficulty}
          themeId={settings.theme}
          localLeaderboard={localLeaderboard}
          onClose={() => setIsLeaderboardOpen(false)}
        />
      )}

      {isHistoryOpen && (
        <HistoryModal
          history={gameHistory}
          themeId={settings.theme}
          onClearHistory={() => {
            setGameHistory([]);
            clearGameHistory();
          }}
          onClose={() => setIsHistoryOpen(false)}
        />
      )}

      {isQuickThemeOpen && (
        <QuickThemeModal
          currentThemeId={settings.theme}
          onSelectTheme={(newTheme) => {
            const updated = { ...settings, theme: newTheme };
            setSettings(updated);
            saveSettings(updated);
          }}
          onClose={() => setIsQuickThemeOpen(false)}
        />
      )}

      {isSettingsOpen && (
        <SettingsModal
          settings={settings}
          userProfile={userProfile}
          onUpdateSettings={(newVals) => {
            const updated = { ...settings, ...newVals };
            setSettings(updated);
            saveSettings(updated);
          }}
          onUpdateProfile={(newProfile) => {
            setUserProfile(newProfile);
            saveUserProfile(newProfile);
          }}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {isHowToPlayOpen && (
        <HowToPlayModal
          themeId={settings.theme}
          onClose={() => setIsHowToPlayOpen(false)}
        />
      )}

      {activeHint && (
        <HintModal
          hint={activeHint}
          themeId={settings.theme}
          onApplyHint={handleApplyHint}
          onClose={() => setActiveHint(null)}
        />
      )}

      {gameStatus === "completed" && (
        <WinCelebrationModal
          difficulty={difficulty}
          timeSeconds={timerSeconds}
          score={score}
          mistakes={mistakes}
          hintsUsed={hintsUsed}
          userProfile={userProfile}
          themeId={settings.theme}
          unlockedAchievements={recentUnlockedAchievements}
          onPlayAgain={() => startNewGame(difficulty)}
          onOpenLeaderboard={() => {
            setIsLeaderboardOpen(true);
          }}
          onOpenAchievements={() => {
            setIsAchievementsOpen(true);
          }}
          onGoHome={() => setGameStatus("home")}
        />
      )}

      {/* Developer Feedback / Bug Report Modal */}
      {isFeedbackOpen && (
        <FeedbackModal
          themeId={settings.theme}
          onClose={() => setIsFeedbackOpen(false)}
        />
      )}

      {/* PWA Installation Modal */}
      {isPWAInstallOpen && (
        <PWAInstallModal
          themeId={settings.theme}
          deferredPrompt={deferredPrompt}
          onClose={() => setIsPWAInstallOpen(false)}
          onInstallSuccess={() => {
            setIsPWAInstalled(true);
            setDeferredPrompt(null);
          }}
        />
      )}

      {/* PWA Background Update Toast */}
      <PWAUpdateToast />

      {/* Real-time Achievement Unlock Toast */}
      {activeAchievementToast && (
        <AchievementToast
          achievement={activeAchievementToast}
          onClose={() => setActiveAchievementToast(null)}
        />
      )}

      {gameStatus === "game_over" && (
        <GameOverModal
          difficulty={difficulty}
          mistakes={mistakes}
          themeId={settings.theme}
          onRestart={() => startNewGame(difficulty)}
          onContinueUnlimited={() => {
            setHasContinuedPastLimit(true);
            setScore(0);
            setGameStatus("playing");
          }}
          onGoHome={() => setGameStatus("home")}
        />
      )}
    </div>
  );
}
