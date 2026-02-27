import { io } from "socket.io-client";
const socket = io("http://localhost:3000");
const userId = "user-" + Math.floor(Math.random() * 1000);
socket.on("connect", () => {
    console.log("Connected as", userId);
});
socket.on("grid_state", (tiles) => {
    const freeTile = tiles.find(t => !t.owner_id);
    if (freeTile) {
        socket.emit("capture_tile", {
            tileId: freeTile.id,
            userId,
        });
    }
});
socket.on("tile_updated", (data) => {
    console.log("Tile updated:", data);
});
//# sourceMappingURL=test-client.js.map