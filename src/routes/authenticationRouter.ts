import express, { Router } from "express";

import { passport } from "../lib/passport.js";
import { loginUser, signupUser } from "../controllers/authController.js";

const authRouter: Router = express.Router();

authRouter.post("/signup", signupUser);
authRouter.post("/login", passport.authenticate("local"), loginUser);

export { authRouter };
