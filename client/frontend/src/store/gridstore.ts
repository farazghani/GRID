import { create } from 'zustand';
import { socketService } from '../services/Socket';

export interface Tile {
  id: number;
  ownerId: string | null;
  capturedAt: string | null;
}

interface GridStore {
  tiles: Tile[];
  currentUser: string;
  stats: {
    captured: number;
    available: number;
  };

  setTiles: (tilesFromServer: any[]) => void;
  updateTile: (tile: { id: number; ownerId: string | null }) => void;
  captureTile: (tileId: number) => void;
  revertTile: (tile: { tileId: number; ownerId: string | null }) => void;
  setCurrentUser: (userId: string) => void;
}

// Use the signup identity key first and keep backward compatibility with older sessions.
const storedUser =
  localStorage.getItem("auth_id") ?? localStorage.getItem("userId");

const userId = storedUser ?? crypto.randomUUID();

if (!storedUser) {
  localStorage.setItem("auth_id", userId);
}
    

export const useGridStore = create<GridStore>((set, get) => ({

  tiles: [],

  currentUser: userId,
  stats: { captured: 0, available: 0 },
 
  // 🔥 Convert DB shape → UI shape here
  setTiles: (tilesFromServer) => {
    const tiles: Tile[] = tilesFromServer.map((t: any) => ({
      id: t.id,
      ownerId: t.owner_id,
      capturedAt: t.captured_at,
    }));
    
    const captured = tiles.filter(t => t.ownerId !== null).length;

    set({
      tiles,
      stats: {
        captured,
        available: tiles.length - captured,
      },
    });
  },

  updateTile: (updated) => {
  //console.log('[STORE] updateTile called with:', updated);
  
  set((state) => {
   // console.log('[STORE] Current state tiles:', state.tiles.length);
   // console.log('[STORE] Looking for tile id:', updated.id);
    
   // const oldTile = state.tiles.find(t => t.id === updated.id);
  // console.log('[STORE] Old tile:', oldTile);
    
    // Create a NEW array (not map which might be optimized away)
    const tiles = [...state.tiles];
    const index = tiles.findIndex(t => t.id === updated.id);
    
    if (index !== -1) {
      tiles[index] = { ...tiles[index], ownerId: updated.ownerId };
    }
    
   // const newTile = tiles.find(t => t.id === updated.id);
    //console.log('[STORE] New tile:', newTile);

    const captured = tiles.filter(t => t.ownerId !== null).length;

   // console.log('[STORE] Returning new state');

    return {
      tiles,
      stats: {
        captured,
        available: tiles.length - captured,
      },
    };
  });
},
 
   
  // 🔥 Emit capture event to backend
  captureTile: (tileId) => {
    const socket = socketService.getSocket();
    console.log("=== CAPTURE DEBUG ===");
    console.log("socket exists:", !!socket);
    console.log("socket connected:", socket?.connected);
    console.log("tileId:", tileId);
    console.log("userId:", get().currentUser);
    if (!socket?.connected) return; 
    const { currentUser  , tiles} = get();
    const tile = tiles.find(t => t.id === tileId)
    if (!tile) return;
    // Tile may already be set locally by optimistic UI; still send capture for server sync.
    // Allow emit when tile is optimistically marked by current user.
    if (tile.ownerId !== null && tile.ownerId !== currentUser) return;
    socket?.emit('capture_tile', {
      tileId,
      userId: currentUser,
    });
  },
  revertTile: ({ tileId, ownerId }) => {
  set((state) => {
    const tiles = [...state.tiles];
    const index = tiles.findIndex(t => t.id === tileId);
    if (index !== -1) {
      tiles[index] = { ...tiles[index], ownerId }; // restore real owner
    }
    const captured = tiles.filter(t => t.ownerId !== null).length;
    return { tiles, stats: { captured, available: tiles.length - captured } };
  });
},
setCurrentUser: (userId) => {
  set({ currentUser: userId });
},
}));
