import express, { Router } from "express";
import { isAuthenticated } from "../lib/passport.js";
import { createRound, deleteRound } from "../controllers/roundController.js";

const roomRouter: Router = express.Router();

roomRouter.get("/get-room", isAuthenticated);
roomRouter.post("/create-room/:sessionId", isAuthenticated, createRound);
roomRouter.post("/remove-room/:sessionId", isAuthenticated, deleteRound);

export default roomRouter;
