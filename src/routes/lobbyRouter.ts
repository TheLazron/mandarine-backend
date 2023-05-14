import express, { Router } from "express";
import { createLobby } from "../controllers/lobbyController.js";

const lobbyRouter: Router = express.Router();

lobbyRouter.post("/create-lobby", createLobby);

export { lobbyRouter };
