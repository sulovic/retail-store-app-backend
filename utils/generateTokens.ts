import jwt from "jsonwebtoken";
import { storeRefreshToken } from "../models/userAuthModels.js";
import { TokenUserDataType } from "../types/types.js"


export const generateAccessToken = async (user: TokenUserDataType): Promise<string> => {
  const accessToken: string = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "30m",
  });
  return accessToken;
};

export const generateRefreshToken = async (user: TokenUserDataType): Promise<string> => {
  const refreshToken: string = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: "1d",
  });
  // Save refresh token in database
  try {
    await storeRefreshToken(user.email, refreshToken);
  } catch (error) {
    throw error;
  }

  return refreshToken;
};
