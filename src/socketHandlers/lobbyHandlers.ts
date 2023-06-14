import { Server, Socket } from "socket.io";
import generateRoomId from "../lib/generateId.js";

class SocketHandler {
  io: Server;
  socket: Socket;

  constructor(io: Server, socket: Socket) {
    this.io = io;
    this.socket = socket;

    // Bind the methods to the class instance
    this.lobbyHandler = this.lobbyHandler.bind(this);
    this.createSocketRoom = this.createSocketRoom.bind(this);
  }

  lobbyHandler(message: string) {
    this.io.on("message", () => {
      console.log("Received message:", message);
      this.socket.emit("foo", "lesgoooo");
    });
    // this.socket.emit("foo", "lesgoooo");
  }

  createSocketRoom(roomId: string) {
    this.socket.join(roomId);
    // Send a message to the socket that joined the room

    this.socket.emit("message", `You have joined room ${roomId}`);
    this.io.to(roomId).emit("message", `new user joined lobby ${roomId}`);
  }

  joinRoom(roomId: string) {
    this.socket.join(roomId);
    this.socket.emit("message", `You have joined room ${roomId}`);
    this.io.to(roomId).emit("message", `new user joined lobby ${roomId}`);
  }
}

export default SocketHandler;
