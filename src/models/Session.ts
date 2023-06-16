import SocketHandler from "../socketHandlers/lobbyHandlers.js";
import redis, { createRedisSession } from "../utils/redisUtils.js";
import User from "./User.js";

class Session {
  id: string;
  name: string;
  createdAt: Date;
  members: User[];

  constructor(id: string, name: string, createdAt: Date) {
    this.id = id;
    this.name = name;
    this.createdAt = createdAt;
    this.members = [];
  }

  addMember(user: User) {
    this.members.push(user);
  }

  createSession() {
    createRedisSession(this.id, this);
  }
}

export default Session;
