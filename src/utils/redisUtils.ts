import { Redis } from "ioredis";
import User from "../models/User.js";

const redis = new Redis();

export const createRedisSession = async (id: string, data: object) => {
  try {
    await redis.hset(id, "data", JSON.stringify(data));
    console.log("Temporary session instance stored in Redis");
  } catch (err) {
    console.error(err);
  }
};

export const addUsertoSession = async (
  sessionId: string,
  email: string,
  data: User
) => {
  try {
    const { socket, ...userData } = data;
    await redis.set(email, JSON.stringify(userData));
    console.log("Temporary user instance stored in Redis");
    await redis.sadd(`${sessionId}:users`, email);
    console.log("User added to session in Redis");
  } catch (err) {
    console.error(err);
  }
};

export const getUsersBySessionId = async (sessionId: string) => {
  try {
    const fields = [
      "id",
      "username",
      "email",
      "joiningDate",
      "role",
      "session",
    ];
    const members = await redis.smembers(`${sessionId}:users`);
    console.log("members", members);

    const users = await Promise.all(
      members.map(async (email) => {
        const data = await redis.get(email);
        if (data) {
          return JSON.parse(data);
        } else {
          return null;
        }
      })
    );
    return users;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export default redis;
