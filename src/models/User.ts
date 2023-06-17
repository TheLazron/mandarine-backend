import SocketHandler from "../socketHandlers/lobbyHandlers.js";
import redis, { addUsertoSession } from "../utils/redisUtils.js";

class User {
  id: string;
  username: string;
  email: string;
  joiningDate: Date;
  socket: SocketHandler;
  role?: "student" | "teacher";
  session?: string;
  constructor(
    id: string,
    username: string,
    email: string,
    socket: SocketHandler
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.joiningDate = new Date();
    this.socket = socket;
  }

  assignRole(role: string) {
    this.role = role as User["role"];
    console.log("Assiegned role of ", role, " to user ", this.username);
  }

  async joinSession(sessionId: string) {
    this.session = sessionId;
    this.assignRole("student");
    await addUsertoSession(sessionId, this.email, this);
    this.socket.joinRoom(sessionId);
    console.log("Joined session ", sessionId, " with user ", this.username);
    this.socket.io.to(sessionId).emit("message", {
      message: `new user joined session ${sessionId}`,
      user: this.username,
    });
  }

  async createSession(sessionId: string) {
    this.session = sessionId;
    this.assignRole("teacher");
    this.socket.createSocketRoom(sessionId);
    await addUsertoSession(sessionId, this.email, this);
    console.log("Created session ", sessionId, " with user ", this.username);
  }
}

export default User;
