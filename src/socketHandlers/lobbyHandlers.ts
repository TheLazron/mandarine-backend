import { Server, Socket } from "socket.io";
import { getUsersBySessionId } from "../utils/redisUtils.js";

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

  async createSocketRoom(roomId: string) {
    this.socket.join(roomId);
    // Send a message to the socket that joined the room
    const users = await getUsersBySessionId(roomId);
    console.log("what is happening here", users);

    this.socket.emit("message", `You have joined room ${roomId}`);
    this.io.to(roomId).emit("message", `new user joined lobby ${roomId}`);
    this.io.to(roomId).emit("newUser", { users: users });
  }

  async joinRoom(roomId: string) {
    this.socket.join(roomId);
    this.socket.emit("message", `You have joined room ${roomId}`);
    this.io.to(roomId).emit("message", `new user joined lobby ${roomId}`);
    const users = await getUsersBySessionId(roomId);
    console.log(users);
    this.io.to(roomId).emit("newUser", { users: users });
  }

  async startSession(roomId: string, roomName: string) {
    const room = this.io.of("/").adapter.rooms.get(roomId);

    if (room) {
      this.io.to(roomId).emit("start-session", "started session");
      console.log("broadcasted startSession to students", roomId);
    } else {
      console.log(`Room ${roomName} does not exist.`);
    }
  }

  async startRound(roomId: string) {
    ``;
    const room = this.io.of("/").adapter.rooms.get(roomId);
    if (room) {
      this.io.to(roomId).emit("start-round", "round started");
      console.log("broadcasted startRound to students", roomId);
    }
  }
  async deleteround(roomId: string) {
    const room = this.io.of("/").adapter.rooms.get(roomId);
    if (room) {
      this.io.to(roomId).emit("delete-round", "round deleted");
      console.log("broadcasted deleteRound to students", roomId);
    }
  }

  async teacherImageBroadCast(roomId: string, imageUrl: string) {
    this.io.to(roomId).emit("teacherImage", imageUrl);
    console.log("broadcasted teacherImageUrl to students");
  }
}

export default SocketHandler;
