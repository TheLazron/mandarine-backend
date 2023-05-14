import express from "express";
import { lobbyRouter } from "./routes/lobbyRouter.js";
import http from "http";
import { Server } from "socket.io";

const app = express();

const server = new http.Server(app);

// const server = http.createServer(app);
const io = new Server(server);

app.use(lobbyRouter);
io.on("connection", (socket) => {
  console.log("a user connected");
});

server.listen(3010, () => {
  console.log("listening on port:3010");
});
