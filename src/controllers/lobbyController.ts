import { Request, Response } from "express";
import generateRoomId from "../lib/generateId.js";
import SocketHandler from "../socketHandlers/lobbyHandlers.js";
const createLobby = (req: Request, res: Response) => {
  const id = generateRoomId();

  const socketHandler: SocketHandler = req.app.locals.socketHandler;

  socketHandler.createSocketRoom(id);

  res.json({ message: "created lobby", id });
};

const joinLobby = (req: Request, res: Response) => {
  const { lobbyId } = req.params;

  const socketHandler: SocketHandler = req.app.locals.socketHandler;
  // const room = io.sockets.adapter.rooms.get(roomId);

  const room = socketHandler.io.of("/").adapter.rooms.get(lobbyId);

  if (room) {
    socketHandler.joinRoom(lobbyId);
    res.json({ message: "joined-room ", lobbyId });
  } else {
    res.json({ message: "room with id does not exist", lobbyId });
  }
};

export { createLobby, joinLobby };
