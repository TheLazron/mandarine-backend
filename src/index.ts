import express from "express";
import { lobbyRouter } from "./routes/lobbyRouter.js";
import http from "http";
import passport from "passport";
import { Server, Socket } from "socket.io";
import session from "express-session";
import SocketHandler from "./socketHandlers/lobbyHandlers.js";
import { authRouter } from "./routes/authenticationRouter.js";
// import { lobbyHandler } from "./socketHandlers/lobbyHandlers.js";

const app = express();

app.use(
  session({
    secret: "your-session-secret",
    resave: false,
    saveUninitialized: false,
  })
);

const server = new http.Server(app);

// const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket: Socket) => {
  console.log("a user connected");
  const socketHandler = new SocketHandler(io, socket);
  app.locals.socketHandler = socketHandler;
});

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRouter);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

app.use(lobbyRouter);

server.listen(3010, () => {
  console.log("listening on port:3010");
});
