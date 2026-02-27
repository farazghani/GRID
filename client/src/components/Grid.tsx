import { useGridStore } from '../store/gridstore';
import { Tile } from './Tile';

export function Grid() {
  const tiles = useGridStore(state => state.tiles);

  return (
    <div className="grid grid-cols-20 gap-1 p-4">
      {tiles.map(tile => (
        <Tile
          key={tile.id}
          tileId={tile.id}
        />
      ))}
    </div>
  );
}