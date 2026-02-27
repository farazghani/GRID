import { useState } from 'react';
import { useGridStore } from '../store/gridstore';

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export function Header() {
  const { stats, currentUser, tiles } = useGridStore();
  const [resetting, setResetting] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const myCapturedCount = tiles.filter((tile) => tile.ownerId === currentUser).length;

  const handleClearMyTiles = async () => {
    if (!currentUser || resetting || myCapturedCount === 0) return;

    setResetError(null);
    setResetting(true);

    try {
      const response = await fetch(`${API_URL}/api/reset/${currentUser}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to clear tiles');
      }
    } catch (error) {
      console.error('Clear tiles failed:', error);
      setResetError('Could not clear your tiles. Try again.');
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="flex justify-between items-center p-4 bg-white shadow">
      <div>
        <h1 className="text-xl font-bold">Real-Time Grid</h1>
        <p className="text-sm text-gray-500">You are: {currentUser}</p>
        {resetError && <p className="text-xs text-red-600 mt-1">{resetError}</p>}
      </div>

      <div className="flex items-center gap-6 text-sm">
        <div>Captured: <b>{stats.captured}</b></div>
        <div>Available: <b>{stats.available}</b></div>
        <button
          onClick={handleClearMyTiles}
          disabled={resetting || myCapturedCount === 0}
          className="px-3 py-2 rounded bg-red-600 text-white font-medium disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed"
        >
          {resetting ? 'Clearing...' : `Clear My Tiles (${myCapturedCount})`}
        </button>
      </div>
    </div>
  );
}
