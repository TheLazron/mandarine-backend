import { customAlphabet } from "nanoid";

const generateRoomId = (): string => {
  const alphabet = "123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const nanoid = customAlphabet(alphabet, 8);
  const generatedId = nanoid();

  return generatedId;
};

export default generateRoomId;
