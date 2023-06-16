import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import User from "../models/User.js";
import SocketHandler from "../socketHandlers/lobbyHandlers.js";
const prisma = new PrismaClient();

const signupUser = async (req: Request, res: Response) => {
  const { username, password, email } = req.body;

  try {
    const user = await prisma.user.create({
      data: {
        email,
        password,
        username,
      },
    });

    res.json({ user });
  } catch (err) {
    console.log(err);
  }
};

const loginUser = async (req: Request, res: Response) => {
  // try{

  //   // const fetchedUser = await prisma.user.findUnique({
  //   //   where: {
  //   //     email: req.body.email,
  //   //   },
  //   // });

  // }
  const session = req.session as any;
  const user: User = session.passport.user;
  const handler: SocketHandler = req.app.locals.socketHandler;
  console.log("Got user", user);
  const currentUser = new User(user.id, user.username, user.email, user.socket);
  console.log(currentUser);

  req.app.locals.currentUser = currentUser;

  res.json({ user: currentUser });
};

export { signupUser, loginUser };
