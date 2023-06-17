import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import generateRoomId from "../lib/generateId.js";
import SocketHandler from "../socketHandlers/lobbyHandlers.js";
import User from "../models/User.js";
import Session from "../models/Session.js";
import generateNames from "../lib/generateNames.js";
import generateName from "../lib/generateNames.js";
import { getRedisSession, getUsersBySessionId } from "../utils/redisUtils.js";
import { create } from "domain";
import { connect } from "http2";
import { createRound } from "./roundController.js";

const prisma = new PrismaClient();

const createLobby = async (req: Request, res: Response) => {
  try {
    //get user fromm session
    const reqSession = req.session as any;
    const user: User = reqSession.passport.user;
    const handler: SocketHandler = req.app.locals.socketHandler;
    const currentUser = new User(user.id, user.username, user.email, handler);
    const roomId = generateRoomId();
    const newDate = new Date();
    const session = new Session(roomId, generateName(), newDate);
    await session.createSession();
    await currentUser.createSession(roomId);

    res.json({
      message: user.username + " created a room",
      id: currentUser.session,
    });
  } catch (err) {
    console.log(err);
  }
};

const getSession = (req: Request, res: Response) => {
  try {
  } catch (err) {
    console.log(err);
  }
};

const joinLobby = (req: Request, res: Response) => {
  const { lobbyId } = req.params;

  const session = req.session as any;
  const user: User = session.passport.user;
  const handler: SocketHandler = req.app.locals.socketHandler;

  const currentUser = new User(user.id, user.username, user.email, handler);

  const room = handler.io.of("/").adapter.rooms.get(lobbyId);

  if (room) {
    currentUser.joinSession(lobbyId);
    console.log("current user object", currentUser);
    console.log(user.username, "joined a room");
    res.json({
      message: user.username + " joined a room",
      id: currentUser.session,
    });
  } else {
    res.json({ message: "room with id does not exist", lobbyId });
  }
};

const startSession = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { name } = req.body;
    const session = await getRedisSession(sessionId);
    session!.name = name;

    console.log("fetched session", session);

    const members = await getUsersBySessionId(sessionId);
    console.log("fetched members", members);

    if (members.length > 0) {
      const savedSession = await prisma.session.create({
        data: {
          name: session!.name,
          createdAt: new Date(session!.createdAt),
          id: session!.id,
          duration: 0,
          members: {
            create: members.map((member) => {
              console.log("iteratedmember", member);

              return {
                role: member.role!,
                user: {
                  connect: {
                    id: member.id,
                  },
                },
              };
            }),
          },
        },
      });
      await createRound(req, res);

      res.json({ session: savedSession });
    } else {
      res.json({ message: "no members in session" });
    }
  } catch (err) {
    console.log(err);
  }
};

export { createLobby, joinLobby, startSession };
