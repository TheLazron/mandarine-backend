import { Request, Response } from "express";

const createLobby = (req: Request, res: Response) => {
  res.json({ message: "working" });
};

export { createLobby };
