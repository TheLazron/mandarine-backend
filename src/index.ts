//imports
import express from "express";
import { lobbyRouter } from "./routes/lobbyRouter.js";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { Server, Socket } from "socket.io";
import session from "express-session";
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
dotenv.config();

//express app and applying cors
const app = express();
app.use(cors());

//parsing data
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//setting up express session
app.use(
  session({
    secret: "your-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 120 * 60 * 1000,
    },
  })
);
//setting up server
const server = new http.Server(app);
const io = new Server(server);
//setting up scoket.io server
io.on("connection", (socket: Socket) => {
  console.log("a user connected");
  const socketHandler = new SocketHandler(io, socket);
  app.locals.socketHandler = socketHandler;
});

//passportjs setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(localauth);
passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

//External Routers
app.use(authRouter);
app.use(lobbyRouter);

//starting sever
server.listen(3010, () => {
  console.log("listening on port:3010");
});
