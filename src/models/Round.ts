import {
  createRedisRound,
  deleteRedisRound,
  updateRoundImage,
} from "../utils/redisUtils.js";
import Session from "./Session.js";

class Round {
  id: string;
  sessionId: string;
  teacherDrawing?: string;

  constructor(sessionId: string) {
    this.id = `${sessionId}:round`;
    this.sessionId = sessionId;
  }

  async createRound() {
    await createRedisRound(this.id, this);
  }

  async addImage(imageUrl: string) {
    await updateRoundImage(this.id, imageUrl);
  }

  async deleteRound() {
    await deleteRedisRound(this.id);
  }
}

export default Round;
