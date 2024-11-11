import { Request, Response, NextFunction } from "express";
import { UserPublicDataType, AuthUserDataType } from "types/types.js";
import jwt from "jsonwebtoken";

import { getAuthUser } from "../../models/userAuthModels.js";
import { generateAccessToken } from "../../utils/generateTokens.js";


const refreshController = async (req: Request, res: Response, next: NextFunction): Promise<Response<any> | void> => {
  try {
    const refreshToken = req?.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "Unauthorized - Refresh token not presented" });
    }

    // Verify the token signature

    const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as UserPublicDataType;

    // Check if the provided refresh token matches the one stored in the database

    const authUser: AuthUserDataType | null = await getAuthUser(decodedRefreshToken?.email);

    if (!authUser) {
      return res.status(401).json({ message: "User not found" });
    }

    if (refreshToken !== authUser.refreshToken) {
      return res.status(401).json({ message: "Unauthorized - Invalid Refresh Token" });
    }

    // Refresh token is valid, issue new access token

    const { password: removedPassword, refreshToken: removedRefreshToken, createdAt, ...userData } = authUser;

    const accessToken = await generateAccessToken(userData);

    return res.status(200).json({
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export default refreshController;
