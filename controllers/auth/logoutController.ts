import { Request, Response, NextFunction } from "express";
import { Users } from "@prisma/client";
import jwt from "jsonwebtoken";

import { removeAuthUserToken } from "../../models/userAuthModels.js";

type UserPublicDataType = Omit<Users, "password" | "refreshToken" | "roleId" | "createdAt">;

const logoutController = async (req: Request, res: Response, next: NextFunction): Promise<Response<any> | void> => {
  try {
    const refreshToken: string = req?.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "Unauthorized - No Refresh Token presented" });
    }

    //Verify refreshToken

    const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as UserPublicDataType;

    // Delete refreshToken from DB

    await removeAuthUserToken(decodedRefreshToken?.email);

    // Remove refreshToken httpOnly cookie

    res
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      .status(200)
      .json({ message: "Logout successful" });
  } catch (error) {
    next(error);
  }
};

export default logoutController;
