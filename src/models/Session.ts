import SocketHandler from "../socketHandlers/lobbyHandlers.js";
import redis, {
  addRoundToRedisSession,
  createRedisSession,
} from "../utils/redisUtils.js";
import User from "./User.js";

class Session {
  id: string;
  name: string;
  createdAt: Date;
  totalRounds: number = 0;
  members: User[];

  constructor(id: string, name: string, createdAt: Date, totalRounds: number) {
    this.id = id;
    this.name = name;
    this.createdAt = createdAt;
    this.totalRounds = totalRounds;
    this.members = [];
  }

  addMember(user: User) {
    this.members.push(user);
  }

  async createSession() {
    await createRedisSession(this.id, this);
  }

  async addRound() {
    this.totalRounds += 1;
    console.log("added one round", this);
    await addRoundToRedisSession(this.id, this);
  }
}

export default Session;
