//imports
import express from "express";
import { lobbyRouter } from "./routes/lobbyRouter.js";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { Server, Socket } from "socket.io";
import SocketHandler from "./socketHandlers/lobbyHandlers.js";
import {
  deserializeUser,
  passport,
  isAuthenticated,
  localauth,
  passportInit,
  passportSession,
  serializeUser,
} from "./lib/passport.js";
import { authRouter } from "./routes/authenticationRouter.js";
import User from "./models/User.js";
import expressSessionConfig from "./controllers/serverController.js";
import roomRouter from "./routes/roundRouter.js";
import imageRouter from "./routes/imageRouter.js";
dotenv.config();

//express app and applying cors
const app = express();
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

//parsing data
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.raw({ type: "application/octet-stream" }));

app.use(expressSessionConfig);

app.use(passport.initialize());
app.use(passport.session());
passport.use(localauth);
passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);
//setting up express session

//setting up server
const server = new http.Server(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});
// io.engine.use(expressSessionConfig);
const wrap = (middleware: any) => (socket: any, next: any) =>
  middleware(socket.request, {}, next);

io.use(wrap(expressSessionConfig));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));

//passportjs setup

io.use((socket, next) => {
  const a: any = socket.request;
  if (a.user) {
    next();
  } else {
    next(new Error("unauthorized"));
  }
});

//setting up scoket.io server

io.on("connection", (socket: Socket) => {
  // const currentUser = new User()
  console.log(`new connection ${socket.id}`);

  const socketHandler = new SocketHandler(io, socket);
  app.locals.socketHandler = socketHandler;
});

io.on("disconnect", (socket: Socket) => {
  console.log("A user disconnected");
  delete app.locals.socketHandler;
});

//External Routers
app.use(authRouter);
app.use(lobbyRouter);
app.use(roomRouter);
app.use(imageRouter);

app.get("/test", isAuthenticated, (req, res) => {
  console.log(req.session);

  res.json({ message: "you are authenticated" });
});

//starting sever
server.listen(3010, () => {
  console.log("listening on port:3010");
});
