import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { getRedisRound, getRedisSession } from "../utils/redisUtils.js";
import Round from "../models/Round.js";
import Session from "../models/Session.js";
import SocketHandler from "../socketHandlers/lobbyHandlers.js";

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
    console.log("this session rounds", currentSession.totalRounds);
    const session = new Session(
      currentSession.id,
      currentSession.name,
      sessionDate,
      +currentSession.totalRounds
    );
    console.log("session Id", sessionId);
    console.log("adding round session", session);
    const handler: SocketHandler = req.app.locals.socketHandler;
    console.log("prepping to broadcast message");
    handler.startRound(sessionId);
    await round.createRound();
    await session.addRound();
    res.status(200).json({ message: "Round created" });
  } catch (err) {
    console.log(err);
  }
};

const deleteRound = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const round = new Round(sessionId);
    const currentRound = await getRedisRound(round.id);
    console.log("fetched round", currentRound);

    //@TODO
    // if (currentRound) {
    //   const savedRound = await prisma.rounds.create({
    //     data: {
    //       sessionId: currentRound.sessionId,
    //     },
    //   });
    // }

    await round.deleteRound();
    const handler: SocketHandler = req.app.locals.socketHandler;
    console.log("prepping to broadcast message");
    handler.deleteround(sessionId);
    res.status(200).json({ message: "Round deleted" });
  } catch (err) {
    console.log(err);
  }
};

export { createRound, deleteRound };
