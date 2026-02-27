import { useGridStore } from '../store/gridstore';
import { getUserColor } from '../utils/useColors';

export function Leaderboard() {
  const tiles = useGridStore(state => state.tiles);
  const currentUser = useGridStore(state => state.currentUser);

  // Count tiles per user
  const userCounts = tiles.reduce((acc, tile) => {
    if (tile.ownerId) {
      acc[tile.ownerId] = (acc[tile.ownerId] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Sort and get top 3
  const top3 = Object.entries(userCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h2 className="text-xl font-bold mb-4">🏆 Leaderboard</h2>
      
      <div className="space-y-3">
        {top3.map(([userId, count], index) => {
          const isCurrentUser = userId === currentUser;
          const medal = ['🥇', '🥈', '🥉'][index];
          
          return (
            <div
              key={userId}
              className={`flex items-center gap-3 p-2 rounded ${
                isCurrentUser ? 'bg-blue-50 ring-2 ring-blue-400' : 'bg-gray-50'
              }`}
            >
              <span className="text-2xl">{medal}</span>
              
              <div
                className="w-6 h-6 rounded"
                style={{ backgroundColor: getUserColor(userId) }}
              />
              
              <div className="flex-1">
                <div className="font-medium">
                  {isCurrentUser ? 'You' : `User ${userId.slice(-4)}`}
                </div>
                <div className="text-sm text-gray-600">
                  {count} tiles
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {top3.length === 0 && (
        <p className="text-gray-500 text-center py-4">
          No tiles captured yet. Be the first!
        </p>
      )}
    </div>
  );
}