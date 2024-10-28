import { Request, Response, NextFunction } from "express";
import { Users } from "@prisma/client";
import jwt from "jsonwebtoken";

import { getAuthUser } from "../../models/userAuthModels.js";
import { generateAccessToken } from "../../middleware/generateTokens.js";

type UserPublicDataType = Omit<Users, "password" | "refreshToken" | "roleId" | "createdAt">;

const refreshController = async (req: Request, res: Response, next: NextFunction): Promise<Response<any> | void> => {
  try {
    const refreshToken = req?.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "Unauthorized - Refresh token not presented" });
    }

    // Verify the token signature

    const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as UserPublicDataType;

    // Check if the provided refresh token matches the one stored in the database

    const authUser: Users | null = await getAuthUser(decodedRefreshToken?.email);

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
