interface RedisSession {
  totalRounds: string;
  id: string;
  name: string;
  createdAt: string;
  members: string;
}

interface RedisRound {
  id: string;
  sessionId: string;
  teacherDrawing?: string;
}

export { RedisSession, RedisRound };
