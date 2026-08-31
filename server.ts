import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

interface LeaderboardRecord {
  id: string;
  name: string;
  country: string;
  difficulty: "facil" | "medio" | "dificil" | "especialista" | "mestre";
  timeSeconds: number;
  score: number;
  date: string;
  isUser?: boolean;
}

// Initial seeded global rankings to simulate an active competitive global community
const INITIAL_LEADERBOARD: LeaderboardRecord[] = [
  // Fácil (Easy)
  { id: "e1", name: "Lucas 'Speedy' Silva", country: "BR", difficulty: "facil", timeSeconds: 84, score: 2850, date: "2026-08-28" },
  { id: "e2", name: "Kenji Sato", country: "JP", difficulty: "facil", timeSeconds: 92, score: 2790, date: "2026-08-27" },
  { id: "e3", name: "Elena Rostova", country: "UA", difficulty: "facil", timeSeconds: 105, score: 2680, date: "2026-08-29" },
  { id: "e4", name: "Mateo Fernandez", country: "AR", difficulty: "facil", timeSeconds: 118, score: 2540, date: "2026-08-25" },
  { id: "e5", name: "Sarah Jenkins", country: "US", difficulty: "facil", timeSeconds: 132, score: 2410, date: "2026-08-26" },
  { id: "e6", name: "Hans Weber", country: "DE", difficulty: "facil", timeSeconds: 145, score: 2320, date: "2026-08-24" },
  { id: "e7", name: "Camila Rodrigues", country: "BR", difficulty: "facil", timeSeconds: 159, score: 2210, date: "2026-08-30" },

  // Médio (Medium)
  { id: "m1", name: "Kenji Sato", country: "JP", difficulty: "medio", timeSeconds: 182, score: 4890, date: "2026-08-29" },
  { id: "m2", name: "Gabriel Souza", country: "BR", difficulty: "medio", timeSeconds: 204, score: 4670, date: "2026-08-28" },
  { id: "m3", name: "Sophie Dupont", country: "FR", difficulty: "medio", timeSeconds: 228, score: 4420, date: "2026-08-27" },
  { id: "m4", name: "Liam O'Connor", country: "IE", difficulty: "medio", timeSeconds: 251, score: 4230, date: "2026-08-26" },
  { id: "m5", name: "Beatriz Lima", country: "PT", difficulty: "medio", timeSeconds: 275, score: 4050, date: "2026-08-25" },
  { id: "m6", name: "Marco Rossi", country: "IT", difficulty: "medio", timeSeconds: 298, score: 3890, date: "2026-08-23" },

  // Difícil (Hard)
  { id: "h1", name: "Alexandre 'SudokuKing' Santos", country: "BR", difficulty: "dificil", timeSeconds: 340, score: 7920, date: "2026-08-30" },
  { id: "h2", name: "Yuki Takahashi", country: "JP", difficulty: "dificil", timeSeconds: 375, score: 7650, date: "2026-08-29" },
  { id: "h3", name: "Max Mustermann", country: "DE", difficulty: "dificil", timeSeconds: 412, score: 7320, date: "2026-08-28" },
  { id: "h4", name: "Ana Clara Mendes", country: "BR", difficulty: "dificil", timeSeconds: 450, score: 6980, date: "2026-08-26" },
  { id: "h5", name: "David Kim", country: "KR", difficulty: "dificil", timeSeconds: 492, score: 6650, date: "2026-08-25" },

  // Especialista (Expert)
  { id: "x1", name: "Master Zhang", country: "CN", difficulty: "especialista", timeSeconds: 512, score: 11400, date: "2026-08-29" },
  { id: "x2", name: "Rodrigo 'Logic' Viana", country: "BR", difficulty: "especialista", timeSeconds: 568, score: 10950, date: "2026-08-28" },
  { id: "x3", name: "Ananya Sharma", country: "IN", difficulty: "especialista", timeSeconds: 620, score: 10450, date: "2026-08-27" },
  { id: "x4", name: "Lars Lindqvist", country: "SE", difficulty: "especialista", timeSeconds: 685, score: 9800, date: "2026-08-24" },

  // Mestre (Master)
  { id: "k1", name: "Daisuke Hirano", country: "JP", difficulty: "mestre", timeSeconds: 740, score: 16500, date: "2026-08-30" },
  { id: "k2", name: "Guilherme Faria", country: "BR", difficulty: "mestre", timeSeconds: 830, score: 15400, date: "2026-08-29" },
  { id: "k3", name: "Viktor Vanev", country: "BG", difficulty: "mestre", timeSeconds: 910, score: 14600, date: "2026-08-26" }
];

let globalLeaderboard: LeaderboardRecord[] = [...INITIAL_LEADERBOARD];

// API Routes
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Get leaderboard filtered by difficulty
app.get("/api/leaderboard", (req: Request, res: Response) => {
  const difficulty = req.query.difficulty as string;
  let results = [...globalLeaderboard];
  
  if (difficulty && ["facil", "medio", "dificil", "especialista", "mestre"].includes(difficulty)) {
    results = results.filter((item) => item.difficulty === difficulty);
  }

  // Sort by lowest time, then highest score
  results.sort((a, b) => {
    if (a.timeSeconds !== b.timeSeconds) {
      return a.timeSeconds - b.timeSeconds;
    }
    return b.score - a.score;
  });

  res.json({
    success: true,
    data: results,
    total: results.length
  });
});

// Submit a new high score
app.post("/api/leaderboard", (req: Request, res: Response) => {
  try {
    const { name, country, difficulty, timeSeconds, score } = req.body;

    if (!name || !difficulty || typeof timeSeconds !== "number" || typeof score !== "number") {
      res.status(400).json({ success: false, message: "Dados incompletos para o ranking." });
      return;
    }

    const newRecord: LeaderboardRecord = {
      id: "rec_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      name: String(name).slice(0, 30),
      country: (country || "BR").slice(0, 4).toUpperCase(),
      difficulty: difficulty,
      timeSeconds: Math.max(1, Math.round(timeSeconds)),
      score: Math.max(0, Math.round(score)),
      date: new Date().toISOString().split("T")[0],
      isUser: true
    };

    globalLeaderboard.push(newRecord);

    // Calculate user rank among that difficulty
    const diffBoard = globalLeaderboard
      .filter((r) => r.difficulty === difficulty)
      .sort((a, b) => a.timeSeconds - b.timeSeconds || b.score - a.score);
    
    const userRank = diffBoard.findIndex((r) => r.id === newRecord.id) + 1;

    res.status(201).json({
      success: true,
      message: "Pontuação registrada no ranking global com sucesso!",
      record: newRecord,
      rank: userRank,
      totalParticipants: diffBoard.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao registrar pontuação." });
  }
});

// Start Server with Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Sudoku Master Pro Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
