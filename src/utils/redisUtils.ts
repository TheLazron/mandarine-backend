import { Redis } from "ioredis";
import User from "../models/User.js";
import Round from "../models/Round.js";
import Session from "../models/Session.js";
import { RedisRound, RedisSession } from "../types/modelTypes.js";

const redis = new Redis();

export const createRedisSession = async (id: string, data: object) => {
  try {
    await redis.hset(id, data);
    console.log("Temporary session instance stored in Redis");
  } catch (err) {
    console.error(err);
  }
};

export const getRedisSession = async (id: string) => {
  try {
    const data = await redis.hgetall(id);
    if (data) {
      console.log("Session found in Redis", data);
      return data;
    } else {
      return null;
    }
  } catch (err) {
    console.error(err);
  }
};

export const getRedisRound = async (
  id: string
): Promise<RedisRound | undefined | null> => {
  try {
    const data = await redis.get(id);
    if (data) {
      console.log("Round found in Redis", data);
      return JSON.parse(data);
    } else {
      return null;
    }
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

export const updateRoundImage = async (roundId: string, imageUrl: string) => {
  try {
    const dataString = await redis.get(roundId);
    if (dataString) {
      const data = JSON.parse(dataString);
      data.imageUrl = imageUrl;
      await redis.set(roundId, JSON.stringify(data));
      console.log("Round image updated in Redis for", roundId);
    } else {
      console.log("Round not found in Redis for", roundId);
    }
  } catch (err) {
    console.error(err);
  }
};

export const createRedisRound = async (roundId: string, data: Round) => {
  try {
    await redis.set(roundId, JSON.stringify(data));

    console.log("Temporary round instance stored in Redis");
  } catch (err) {
    console.error(err);
  }
};

export const deleteRedisRound = async (roundId: string) => {
  try {
    await redis.del(roundId);

    console.log("Temporary round instance deleted from Redis");
  } catch (err) {
    console.error(err);
  }
};

export const addRoundToRedisSession = async (
  sessionId: string,
  newData: Session
) => {
  try {
    const existingData = await redis.hgetall(sessionId);

    if (!existingData) {
      console.log(`Session with ID ${sessionId} does not exist in Redis.`);
      return;
    }

    const updatedData = { ...existingData, ...newData };
    await redis.hset(sessionId, updatedData);
    console.log("new Round added to sessiion", updatedData);
  } catch (err) {
    console.error(err);
  }
};

export const getUsersBySessionId = async (
  sessionId: string
): Promise<Array<User>> => {
  try {
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

    console.log("users", users);

    // const paresdUsers = users.map((user) => JSON.parse(user!));
    return users;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export default redis;
