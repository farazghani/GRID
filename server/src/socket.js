import { Server } from "socket.io";
import { getAllTiles, captureTile } from "./services/tileService.js";
import { pg } from "./db.js";
export function setupSocket(io) {
    io.on("connection", async (socket) => {
        console.log("User connected:", socket.id);
        const tiles = await getAllTiles();
        socket.emit("grid_state", tiles);
        socket.on("capture_tile", async (data) => {
            console.log("capture_tile received:", data);
            const { tileId, userId } = data;
            const updatedTile = await captureTile(tileId, userId);
            if (updatedTile) {
                console.log("Broadcasting tile_updated to all clients:", updatedTile.id);
                io.emit("tile_updated", {
                    tileId: updatedTile.id,
                    ownerId: updatedTile.owner_id,
                });
            }
            else {
                const realtile = await pg.query(`
          SELECT * FROM tiles WHERE id = $1`, [tileId]);
                socket.emit("capture_failed", {
                    tileId,
                    ownerId: realtile.rows[0]?.owner_id ?? null,
                });
            }
        });
    });
}
//# sourceMappingURL=socket.js.map