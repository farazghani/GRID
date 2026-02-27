import { useEffect, useState } from 'react';
import { socketService } from '../services/Socket';

export function ConnectionStatus() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = socketService.connect();

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  return (
    <div className="p-2 text-center text-sm">
      {connected ? (
        <span className="text-green-600">🟢 Connected</span>
      ) : (
        <span className="text-red-600">🔴 Disconnected</span>
      )}
    </div>
  );
}
