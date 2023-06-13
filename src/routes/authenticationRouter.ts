import express, { Router } from "express";

import { passport } from "../lib/passport.js";
import { signupUser } from "../controllers/authController.js";

const authRouter: Router = express.Router();

authRouter.post("/signup", signupUser);
authRouter.post("/login", passport.authenticate("local"), (req, res) => {
  res.json({ message: "Login successful" });
});

export { authRouter };
