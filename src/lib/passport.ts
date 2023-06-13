import exp from "constants";
import type { Request, Response, NextFunction } from "express";
import passport from "passport";
import { PrismaClient, User } from "@prisma/client";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";

const prisma = new PrismaClient();

const localauth = new LocalStrategy(
  async (username: any, password: any, done: any) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          username,
        },
      });

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }

      if (user.password !== password) {
        return done(null, false, { message: "Incorrect password" });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
);

const serializeUser = (
  user: Express.User,
  done: (error: any, serializedUser: Express.User) => void
): void => {
  console.log("serializedUser", user);
  done(null, user);
};

const deserializeUser = async (
  user: User,
  done: (error: any, deserializedUser: User) => void
) => {
  console.log("deserializeduser", user);

  const foundUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  done(null, foundUser!);
};

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

const passportInit = () => {
  return passport.initialize();
};

const passportSession = () => {
  return passport.session();
};

export {
  localauth,
  passport,
  serializeUser,
  deserializeUser,
  isAuthenticated,
  passportInit,
  passportSession,
};
