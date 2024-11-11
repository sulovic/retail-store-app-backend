import { PrismaClient, Users } from "@prisma/client";
import { AuthUserDataType } from "../types/types.js";

const prisma = new PrismaClient();

export const getAuthUser = async (email: string): Promise<AuthUserDataType | null> => {
  return await prisma.users.findUnique({
    where: {
      email,
    },
    include: {
      UserRoles: true,
    },
  });
};

export const removeRefreshToken = async (email: string): Promise<void> => {
   await prisma.users.update({
    where: {
      email,
    },
    data: {
      refreshToken: null,
    },
  });
};

export const storeRefreshToken = async (email: string, refreshToken: string): Promise<void> => {
  await prisma.users.update({
    where: {
      email,
    },
    data: {
      refreshToken,
    },
  });
};
