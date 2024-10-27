import jwt from "jsonwebtoken";
import { PrismaClient, Users } from "@prisma/client";

const prisma = new PrismaClient();

type UserPublicDataType = Omit<Users, "password" | "refreshToken" | "roleId" | "createdAt">;

export const generateAccessToken = async (user: UserPublicDataType): Promise<string> => {
  const accessToken: string = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "30m",
  });
  return accessToken;
};

export const generateRefreshToken = async (user: UserPublicDataType): Promise<string> => {
  const refreshToken: string = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: "1d",
  });

  // Save refresh token in database
  try {
    await prisma.users.update({
      where: {
        email: user?.email,
      },
      data: { refreshToken },
    });
  } catch (error) {
    throw error;
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }

  return refreshToken;
};
