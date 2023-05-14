import express, { Router } from "express";
import {
  googleAuth,
  googleAuthCallback,
} from "../controllers/authController.js";

const authRouter: Router = express.Router();

authRouter.get("/google", googleAuth);
authRouter.get("/google/callback", googleAuthCallback);

export { authRouter };
