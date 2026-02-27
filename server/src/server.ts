import express from "express";
import http from "http";
import { Server } from "socket.io";
import { setupSocket } from "./socket.js";
import { resetTilesForUser } from "./services/tileService.js";
import { pg, initDB } from "./db.js";
import { createUser } from "./services/userService.js";
import cors from "cors";

const PORT = process.env.PORT || 3000;
const allowedOrigins = (
  process.env.FRONTEND_ORIGIN ??
  "http://localhost:5173,http://127.0.0.1:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

async function startServer() {
  // 🔥 Ensure DB + Redis are ready before accepting connections
  await initDB();

  const app = express();
  app.use(express.json());
  app.use(
    cors({
      origin: allowedOrigins,
    })
  );
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: { origin: allowedOrigins },
  });

  // Setup WebSocket logic
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

  app.post("/api/users" , async(req ,res)=>{
   try {
    const { username } = req.body;

    const createU = await createUser(username);
    console.log(createU);

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

    // Broadcast freed tiles
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
🌐 HTTP API: http://localhost:${PORT}
💚 Health check: http://localhost:${PORT}/health
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
  });
}

startServer().catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});
