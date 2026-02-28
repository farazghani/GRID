import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

import { setupSocket } from "./socket.js";
import { resetTilesForUser } from "./services/tileService.js";
import { pg, initDB } from "./db.js";
import { createUser } from "./services/userService.js";

const PORT = process.env.PORT || 3000;

/**
 * 🔥 Production-safe allowed origins
 */
const allowedOrigins = [
  "https://grid-six-eta.vercel.app", // production frontend
  "http://localhost:5173",           // local dev
  "http://127.0.0.1:5173",           // local dev alt
];

async function startServer() {
  await initDB();

  const app = express();

  app.use(express.json());

  /**
   * 🔥 Express CORS
   */
  app.use(
    cors({
      origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        } else {
          console.log("❌ Blocked by CORS:", origin);
          return callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    })
  );

  const server = http.createServer(app);

  /**
   * 🔥 Socket.IO CORS
   */
  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  setupSocket(io);

  // ------------------ REST API ------------------

  app.get("/health", (_, res) => {
    res.json({ status: "ok", timestamp: new Date() });
  });

  app.get("/api/tiles", async (_, res) => {
    const { rows } = await pg.query("SELECT * FROM tiles ORDER BY id");
    res.json({ tiles: rows });
  });

  app.get("/api/stats", async (_, res) => {
    const { rows } = await pg.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(owner_id) as captured,
        COUNT(*) - COUNT(owner_id) as available,
        COUNT(DISTINCT owner_id) as owners
      FROM tiles
    `);

    res.json(rows[0]);
  });

  app.post("/api/users", async (req, res) => {
    try {
      const { username } = req.body;

      const createU = await createUser(username);

      res.status(201).json({
        message: "User created!",
        user: createU,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/reset/:userId", async (req, res) => {
    const { userId } = req.params;

    const clearedTiles = await resetTilesForUser(userId);

    clearedTiles.forEach((tileId) => {
      io.emit("tile_updated", {
        tileId,
        ownerId: null,
      });
    });

    res.json({ cleared: clearedTiles.length });
  });

  // ------------------ START SERVER ------------------

  server.listen(PORT, () => {
    console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Server running on port ${PORT}
📡 WebSocket server ready
🌐 Production mode
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
  });
}

startServer().catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});