import { PrismaClient, Users } from "@prisma/client";

const prisma = new PrismaClient();

const getAllUsers = async (): Promise<Users[]> => {
  return await prisma.users.findMany({
    include: {
      UserRoles: true,
    },
  });
};

const getUser = async (userId: number): Promise<Users | null> => {
  return await prisma.users.findUnique({
    where: {
      userId,
    },
    include: {
      UserRoles: true,
    },
  });
};

const createUser = async (user: Omit<Users, "userId">): Promise<Users> => {
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
  });
};

const updateUser = async (user: Users): Promise<Users> => {
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
  });
};

const deleteUser = async (userId: number): Promise<Users> => {
  return await prisma.users.delete({
    where: {
      userId,
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
