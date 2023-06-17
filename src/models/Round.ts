import { createRedisRound, deleteRedisRound } from "../utils/redisUtils.js";
import Session from "./Session.js";

class Round {
  id: string;
  sessionId: string;
  teacherDrawing?: string;

  constructor(sessionId: string) {
    this.id = `${sessionId}:round`;
    this.sessionId = sessionId;
  }

  async createRound(sessionId: string) {
    await createRedisRound(this.id, this);
  }

  async deleteRound() {
    await deleteRedisRound(this.id);
  }
}

export default Round;
