import { Request, Response } from "express";
import generateRoomId from "../lib/generateId.js";
import SocketHandler from "../socketHandlers/lobbyHandlers.js";
const createLobby = (req: Request, res: Response) => {
  const id = generateRoomId();

  const socketHandler: SocketHandler = req.app.locals.socketHandler;

  socketHandler.createSocketRoom(id);

  res.json({ message: "working" });
};

export { createLobby };
