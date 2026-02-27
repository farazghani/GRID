import { io , Socket } from 'socket.io-client';
const Socketurl = "http://localhost:3000";

class SocketServices{
    private socket: Socket | null = null;
    connect(){
       if (this.socket) {
    console.log("reusing existing socket");
    return this.socket;
  }

  console.log("creating new socket");
  this.socket = io(Socketurl, {
    autoConnect: true,
  });

  this.socket.on("connect", () => {
    console.log("connected to server");
  });

  return this.socket;
    }

    disconnect(){
        if(this.socket){
            this.socket.disconnect();
            console.log("disconnected!");
        }
    }

    getSocket(){
        return this.socket;
    }
}

export const socketService = new SocketServices();
