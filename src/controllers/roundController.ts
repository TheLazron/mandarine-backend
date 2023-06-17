import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { getRedisRound, getRedisSession } from "../utils/redisUtils.js";
import Round from "../models/Round.js";
import Session from "../models/Session.js";

const prisma = new PrismaClient();

const createRound = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const currentSession = await getRedisSession(sessionId);
    if (!currentSession) {
      res.status(404).json({ message: "Session not found" });
      return;
    }
    let sessionDate = new Date(currentSession.createdAt);
    const round = new Round(sessionId);
    const session = new Session(
      currentSession.id,
      currentSession.name,
      sessionDate
    );
    console.log("session Id", sessionId);
    console.log("adding round session", session);

    await round.createRound(sessionId);
    await session.addRound();
  } catch (err) {
    console.log(err);
  }
};

const deleteRound = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const round = new Round(sessionId);
    const currentRound: Round = await getRedisRound(round.id);
    console.log("fetched round", currentRound);

    if (currentRound) {
      const savedRound = await prisma.rounds.create({
        data: {
          sessionId: currentRound.sessionId,
        },
      });
    }

    await round.deleteRound();
  } catch (err) {
    console.log(err);
  }
};

export { createRound, deleteRound };
