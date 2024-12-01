import { PrismaClient } from "@prisma/client";
import { UserPublicDataType } from "../types/types.js";

const prisma = new PrismaClient();

const getAllUsers = async ({ whereClause, orderBy, take, skip }: { whereClause?: object; orderBy?: object; take?: number; skip?: number }): Promise<UserPublicDataType[]> => {
  return await prisma.users.findMany({
    where: { ...whereClause, deleted: false },
    orderBy,
    take,
    skip,
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

const getAllUsersCount = async ({ whereClause }: { whereClause?: object }): Promise<number> => {
  return await prisma.users.count({
    where: { ...whereClause, deleted: false },
  });
};

const getUser = async (userId: number): Promise<UserPublicDataType | null> => {
  return await prisma.users.findUnique({
    where: {
      userId,
      deleted: false,
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

const createUser = async (user: Omit<UserPublicDataType, "userId">): Promise<UserPublicDataType> => {
  return await prisma.users.create({
    data: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      UserRoles: {
        connect: {
          roleId: user?.UserRoles.roleId,
        },
      },
      Stores: {
        connect: user?.Stores.map((store) => ({ storeId: store.storeId })),
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

const updateUser = async (user: UserPublicDataType): Promise<UserPublicDataType> => {
  return await prisma.users.update({
    where: {
      userId: user?.userId,
      deleted: false,
    },
    data: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      UserRoles: {
        connect: {
          roleId: user?.UserRoles.roleId,
        },
      },
      Stores: {
        set: [],
        connect: user?.Stores.map((store) => ({ storeId: store.storeId })),
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

const deleteUser = async (userId: number): Promise<UserPublicDataType> => {
  //Soft deletion
  return await prisma.users.update({
    where: {
      userId,
      deleted: false,
    },
    data: {
      deleted: true,
      deletedAt: new Date(),
    },
    select: {
      userId: true,
      firstName: true,
      lastName: true,
      email: true,
      deleted: true,
      UserRoles: {
        select: {
          roleName: true,
          roleId: true,
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

export default {
  getAllUsers,
  getAllUsersCount,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
