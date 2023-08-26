import { Request, Response } from "express";
import SocketHandler from "../socketHandlers/lobbyHandlers.js";
import { PrismaClient } from "@prisma/client";
import { uploadSupabaseImage } from "../utils/supabseUtils.js";
import generateRoomId from "../lib/generateId.js";
import { getRedisRound, getRedisSession } from "../utils/redisUtils.js";
import { RedisSession } from "../types/modelTypes.js";
import Round from "../models/Round.js";

const uploadImage = async (req: Request, res: Response) => {
  try {
    const { sessionCode } = req.params;
    //check if session exists or not
    const session = await getRedisSession(sessionCode);
    if (!session) {
      console.log("session", session);
      return res.status(404).json({ message: "Session not found" });
    }

    //retrieve image data from request body and name it with sessionCode and round number
    const imageData = req.body;
    const fileName = `${sessionCode}-${session.totalRounds}`;
    //upload image to supabase storage
    if (imageData) {
      console.log("uploading image...");
      const uploadError = await uploadSupabaseImage(imageData, fileName);

      if (!uploadError) {
        //update round with image url in redisDB
        console.log("image uploaded successfully");
        const imageUrl = `${process.env.SUPABASE_TEACHER_UPLOAD_PRE}/${sessionCode}-${session.totalRounds}`;
        const round = await getRedisRound(`${sessionCode}:round`);
        if (round) {
          console.log("fetched this round image", round);

          const r = new Round(round.sessionId);
          console.log("matching this round image", round);
          await r.addImage(imageUrl);
          const handler: SocketHandler = req.app.locals.socketHandler;
          console.log("sessionCode", sessionCode);
          console.log("imageUrl", imageUrl);
          handler.teacherImageBroadCast(sessionCode, imageUrl);
        }
        console.log("updatedImage in redis");

        res.status(200).json({ imageUrl });
      }
    }
  } catch (err) {
    console.log(err);
  }
};

export { uploadImage };
