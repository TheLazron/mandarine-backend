import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
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
  try {
    const fetchedUser = await prisma.user.findUnique({
      where: {
        username: req.body.username,
      },
    });
    const sessionCount = await prisma.userSession.count({
      where: {
        userId: fetchedUser?.id,
      },
    });

    res.json({ user: fetchedUser, sessionCount: sessionCount });
    res.json({ user: fetchedUser });
  } catch (error) {
    console.log(error);
  }
};

export { signupUser, loginUser };
