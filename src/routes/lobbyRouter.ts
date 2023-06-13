import express, { Router } from "express";
import { createLobby } from "../controllers/lobbyController.js";
import { isAuthenticated } from "../lib/passport.js";

const lobbyRouter: Router = express.Router();

lobbyRouter.post("/create-lobby", isAuthenticated, createLobby);

export { lobbyRouter };
