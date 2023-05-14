import express, { Router } from "express";
import { createLobby } from "../controllers/lobbyRouter.js";

const lobbyRouter: Router = express.Router();

lobbyRouter.get("/", createLobby);

export { lobbyRouter };
