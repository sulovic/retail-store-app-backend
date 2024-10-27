import { Request, Response, NextFunction } from "express";
import { Users } from "@prisma/client";
import jwt from "jsonwebtoken";
type UserPublicDataType = Omit<Users, "password" | "refreshToken" | "roleId" | "createdAt">;

import { removeAuthUserToken } from "../../models/userAuthModels.js";

const logoutController = async (req: Request, res: Response, next: NextFunction): Promise<Response<any> | void> => {
  try {
    const refreshToken: string = req?.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: "Unauthorized - No Refresh Token presented" });
    }

    //Verify refreshToken

    const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as Users

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
