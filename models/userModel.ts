import { PrismaClient, Users } from "@prisma/client";

const prisma = new PrismaClient();

type UserPublicDataType = Omit<Users, "password" | "refreshToken" | "roleId" | "createdAt">


const getAllUsers = async (): Promise<UserPublicDataType[]> => {
  return await prisma.users.findMany({
    select: {
      userId: true,
      firstName: true,
      lastName: true,
      email: true,
      UserRoles: {
        select: {
          roleName: true,
          roleId: true,
        },
      },
    },
  });
};

const getUser = async (userId: number): Promise<UserPublicDataType | null> => {
  return await prisma.users.findUnique({
    where: {
      userId,
    },
    select: {
      userId: true,
      firstName: true,
      lastName: true,
      email: true,
      UserRoles: {
        select: {
          roleName: true,
          roleId: true,
        },
      },
    },
  });
};

const createUser = async (user: Omit<Users, "userId">): Promise<UserPublicDataType> => {
  return await prisma.users.create({
    data: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      UserRoles: {
        connect: {
          roleId: user?.roleId,
        },
      },
    },
    select: {
      userId: true,
      firstName: true,
      lastName: true,
      email: true,
      UserRoles: {
        select: {
          roleName: true,
          roleId: true,
        },
      },
    },
  });
};

const updateUser = async (user: Users): Promise<UserPublicDataType> => {
  return await prisma.users.update({
    where: {
      userId: user?.userId,
    },
    data: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      UserRoles: {
        connect: {
          roleId: user?.roleId,
        },
      },
    },
    select: {
      userId: true,
      firstName: true,
      lastName: true,
      email: true,
      UserRoles: {
        select: {
          roleName: true,
          roleId: true,
        },
      },
    },
  });
};

const deleteUser = async (userId: number): Promise<UserPublicDataType> => {
  return await prisma.users.delete({
    where: {
      userId,
    },
    select: {
      userId: true,
      firstName: true,
      lastName: true,
      email: true,
      UserRoles: {
        select: {
          roleName: true,
          roleId: true,
        },
      },
    },
  });
};

export default {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
