import { Request, Response } from "express";
import generateRoomId from "../lib/generateId.js";
import SocketHandler from "../socketHandlers/lobbyHandlers.js";
import User from "../models/User.js";
import Session from "../models/Session.js";
import generateNames from "../lib/generateNames.js";
import generateName from "../lib/generateNames.js";
const createLobby = (req: Request, res: Response) => {
  try {
    const reqSession = req.session as any;
    const user: User = reqSession.passport.user;
    const handler: SocketHandler = req.app.locals.socketHandler;
    console.log(user.username, "created a room");
    const currentUser = new User(user.id, user.username, user.email, handler);
    const roomId = generateRoomId();
    console.log("current user object", currentUser);
    const newDate = new Date();
    const session = new Session(roomId, generateName(), newDate);
    session.createSession();
    currentUser.createSession(roomId);

    res.json({
      message: user.username + " created a room",
      id: currentUser.session,
    });
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

export { createLobby, joinLobby };
