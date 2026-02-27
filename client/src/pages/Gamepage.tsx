import { Grid } from '../components/Grid';
import { useSocket } from '../hooks/useSocket';
import { Header } from '../components/Header';
import { ConnectionStatus } from '../components/ConnectionStatus';
import { Leaderboard } from '../components/Leaderboard';


export default function Gamepage(){

    useSocket(); // start websocket + listeners
  
      return (
        <div className="h-screen w-screen overflow-hidden bg-gray-100 flex flex-col">
          {/* Header with Connection Status */}
          <div className="flex-none">
            <Header />
            <ConnectionStatus />
          </div>
    
          {/* Main Content - Grid 70% + Leaderboard 30% */}
          <div className="flex-1 flex gap-4 p-4 overflow-hidden">
            {/* Grid - 70% width */}
            <div className="w-[70%] h-full overflow-auto">
              <Grid />
            </div>
            
            {/* Leaderboard - 30% width */}
            <div className="w-[30%] h-full overflow-auto">
              <Leaderboard />
            </div>
          </div>
        </div>
      );
}