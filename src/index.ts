import express from "express";
import { lobbyRouter } from "./routes/lobbyRouter.js";
import http from "http";
import { Server, Socket } from "socket.io";
import SocketHandler from "./socketHandlers/lobbyHandlers.js";
// import { lobbyHandler } from "./socketHandlers/lobbyHandlers.js";

const app = express();

const server = new http.Server(app);

// const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket: Socket) => {
  console.log("a user connected");
  const socketHandler = new SocketHandler(io, socket);
  app.locals.socketHandler = socketHandler;
});
app.use(lobbyRouter);

server.listen(3010, () => {
  console.log("listening on port:3010");
});
