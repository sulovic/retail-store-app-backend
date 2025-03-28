import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { AuthUserDataType } from "../../types/types.js";
import { getAuthUser } from "../../models/userAuthModels.js";
import verifyGoogleToken from "../../utils/verifyGoogleToken.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/generateTokens.js";

const loginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      type,
      email,
      password,
      credential,
    }: { type: "password" | "google"; email: string; password?: string; credential?: string } = req.body;

    if (!type) {
      return res.status(400).json({ message: "Missing authentication type" });
    }

    if (type === "password") {
      if (!email || !password) {
        return res.status(400).json({ message: "Missing email or password" });
      }

      const authUser: AuthUserDataType | null = await getAuthUser(email);
      if (!authUser || !authUser.password) {
        return res.status(401).json({ message: "Invalid email or user has no password" });
      }

      const isPasswordValid = await bcrypt.compare(password, authUser.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      return sendAuthResponse(res, authUser);
    } else if (type === "google") {
      if (!credential) {
        return res.status(400).json({ message: "Missing Google credentials" });
      }

      const decodedCredential = await verifyGoogleToken(credential);

      if (!decodedCredential?.email) {
        return res.status(401).json({ message: "Invalid Google credentials" });
      }

      const authUser: AuthUserDataType | null = await getAuthUser(decodedCredential.email);
      if (!authUser) {
        return res.status(401).json({ message: "User not found" });
      }

      return sendAuthResponse(res, authUser);
    } else {
      return res.status(400).json({ message: "Unsupported authentication type" });
    }
  } catch (error) {
    next(error);
  }
};

const sendAuthResponse = async (res: Response, user: AuthUserDataType) => {
  const { password, refreshToken, createdAt, ...userPublicData } = user; // eslint-disable-line @typescript-eslint/no-unused-vars

  const accessToken = await generateAccessToken(userPublicData);
  const refreshTokenValue = await generateRefreshToken(userPublicData);

  return res
    .cookie("refreshToken", refreshTokenValue, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .json({ accessToken });
};

export default loginController;
