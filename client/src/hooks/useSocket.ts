import { useEffect } from 'react';
import { useGridStore } from '../store/gridstore';
import { socketService } from '../services/Socket';

export function useSocket() {
  const { setTiles, updateTile , revertTile } = useGridStore();

  useEffect(() => {
  const socket = socketService.connect();
  // Keep named handlers so cleanup removes only these listeners.
  const handleGridState = (tiles: any[]) => setTiles(tiles);
  const handleTileUpdated = (data: { tileId: number; ownerId: string | null }) =>
    updateTile({ id: data.tileId, ownerId: data.ownerId });
  const handleCaptureFailed = (data: { tileId: number; ownerId: string | null }) =>
    revertTile({ tileId: data.tileId, ownerId: data.ownerId });

  socket.on('grid_state', handleGridState);
  socket.on('tile_updated', handleTileUpdated);
  socket.on('capture_failed', handleCaptureFailed);

  return () => {
    // Do not call off('event') without handler; it would remove shared listeners.
    socket.off('grid_state', handleGridState);
    socket.off('tile_updated', handleTileUpdated);
    socket.off('capture_failed', handleCaptureFailed);
  };
}, []);
}
