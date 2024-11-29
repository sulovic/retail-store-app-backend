import { PrismaClient, Users } from "@prisma/client";
import { AuthUserDataType } from "../types/types.js";

const prisma = new PrismaClient();

export const getAuthUser = async (email: string): Promise<AuthUserDataType | null> => {
  return await prisma.users.findUnique({
    where: {
      email,
      deleted: false,
    },
    select: {
      userId: true,
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      refreshToken: true,
      createdAt: true,
      UserRoles: {
        select: {
          roleId: true,
          roleName: true,
        },
      },
      Stores: {
        select: {
          storeId: true,
          storeName: true,
          storeAddress: true,
        },
      },
    },
  });
};

export const removeRefreshToken = async (email: string): Promise<void> => {
  await prisma.users.update({
    where: {
      email,
      deleted: false,
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
      deleted: false,
    },
    data: {
      refreshToken,
    },
  });
};
