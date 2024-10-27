import { Request, Response, NextFunction } from "express";
import {getAuthUser} from "../../models/userAuthModels.js";
import { Users } from "@prisma/client";
import verifyGoogleToken from "../../middleware/verifyGoogleToken.js";
import { generateAccessToken, generateRefreshToken } from "../../middleware/generateTokens.js";
import bcrypt from "bcryptjs";

const loginController = async (req: Request, res: Response, next: NextFunction): Promise<Response<any> | void> => {
  try {
    const { type, email, password, credential }: { type: "password" | "google"; email: string; password: string | null; credential: string | null } = req?.body;
    if (!type) {
      return res.status(400).json({ message: "Missing Auth type" });
    }

    if (type === "password") {
      // User-Password authentication

      if (!email || !password) {
        return res.status(400).json({ message: "Missing Email or Password" });
      }

      const authUser: Users | null = await getAuthUser(email);

      if (!authUser) {
        return res.status(401).json({ message: "User not found" });
      }
      if (!authUser.password) {
        return res.status(401).json({ message: "User has no password" });
      }

      const isPasswordValid = await bcrypt.compare(password, authUser.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const { password: removedPassword, refreshToken: removedRefreshToken, createdAt, ...userData} = authUser;

      const accessToken = await generateAccessToken(userData);
      const refreshToken = await generateRefreshToken(userData);

      return res
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
          sameSite: "strict",
          secure: true,
        })
        .status(200)
        .json({
          info: "User found, Password OK!",
          accessToken,
        });
    } else if (type === "google") {
      // Google authentication

      if (!credential) {
        return res.status(400).json({ message: "Missing Google Credentials" });
      }

      const decodedCredential = await verifyGoogleToken(credential);

      if (!decodedCredential || !decodedCredential.email) {
        return res.status(401).json({ message: "Invalid Google Credentials" });
      }

      const authUser: Users | null = await getAuthUser(decodedCredential.email);

      if (!authUser) {
        return res.status(401).json({ message: "User not found" });
      }

      const { password: removedPassword, refreshToken: removedRefreshToken, createdAt, ...userData} = authUser;

        const accessToken = await generateAccessToken(userData);
        const refreshToken = await generateRefreshToken(userData);

      return res
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
          sameSite: "strict",
          secure: true,
        })
        .status(200)
        .json({
          info: "User found, Google Credentials OK!",
          accessToken,
        });
    } else {
      return res.status(401).json({ message: "Invalid Auth type" });
    }
  } catch (error) {
    next(error);
  }
};

export default loginController;
