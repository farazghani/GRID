import { useGridStore } from "../store/gridstore";
import { getUserColor } from "../utils/useColors";
import { useShallow } from 'zustand/react/shallow';
interface TileProps {
  tileId: number;
}

export function Tile({ tileId }: TileProps) {
  
const tile = useGridStore(
  useShallow(state => state.tiles.find(t => t.id === tileId))
);
  const currentUser = useGridStore(state => state.currentUser);
 const captureTile = useGridStore(state => state.captureTile);
 const updateTile = useGridStore(state => state.updateTile);
  
  if (!tile) return null;

  const handleClick = () => {
    if (tile.ownerId !== null) return;
    updateTile({
      id: tile.id,
      ownerId: currentUser,
    });
    captureTile(tile.id);
  };

  const isOwned = tile.ownerId === currentUser;
  const isUnclaimed = tile.ownerId === null;
  const userColor = getUserColor(tile.ownerId);

  return (
    <button
      onClick={handleClick}
      style={{ 
        backgroundColor: userColor,
        borderColor: isOwned ? '#3B82F6' : 'transparent',
      }}
      className={`
        w-full aspect-square rounded
        transition-all duration-200 cursor-pointer
        border-2
        ${isOwned ? 'scale-105 shadow-lg' : ''}
        ${isUnclaimed ? 'hover:bg-gray-300' : 'hover:brightness-110'}
        active:scale-95
      `}
      title={
        isUnclaimed 
          ? 'Click to claim!' 
          : isOwned 
            ? 'Your tile' 
            : `Owned by ${tile.ownerId?.slice(-4)}`
      }
    />
  );
}