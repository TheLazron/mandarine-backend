import express, { Router } from "express";
import {
  createLobby,
  joinLobby,
  startSession,
} from "../controllers/lobbyController.js";
import { isAuthenticated } from "../lib/passport.js";

const lobbyRouter: Router = express.Router();

lobbyRouter.post("/create-lobby", isAuthenticated, createLobby);
lobbyRouter.post("/join-lobby/:lobbyId", isAuthenticated, joinLobby);
lobbyRouter.post("/start-session/:sessionId", isAuthenticated, startSession);

export { lobbyRouter };
