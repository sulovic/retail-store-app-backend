import { PrismaClient, Users } from "@prisma/client";

const prisma = new PrismaClient();

export const getAuthUser = async (email: string): Promise<Users | null> => {
  return await prisma.users.findUnique({
    where: {
      email,
    },
    include: {
      UserRoles: true,
    },
  });
};

export const removeAuthUserToken = async (email: string): Promise<Users | null> => {
  return await prisma.users.update({
    where: {
      email,
    },
    data: {
      refreshToken: null,
    },
  });
};
