import { PrismaClient, InventoryAllowedUsers } from "@prisma/client";

const prisma = new PrismaClient();

const getAllInventoryAllowedUsers = async ({ filter, orderBy, take, skip }: { filter?: object; orderBy?: object; take?: number; skip?: number }): Promise<InventoryAllowedUsers[]> => {
  return await prisma.inventoryAllowedUsers.findMany({
    where: filter,
    orderBy,
    take,
    skip,
  });
};

const getInventoryAllowedUser = async (inventoryAllowedUserId: number): Promise<InventoryAllowedUsers | null> => {
  return await prisma.inventoryAllowedUsers.findUnique({
    where: {
      inventoryAllowedUserId,
    },
  });
};

const createInventoryAllowedUser = async (inventoryAllowedUser: Omit<InventoryAllowedUsers, "inventoryAllowedUserId">): Promise<InventoryAllowedUsers> => {
  return await prisma.inventoryAllowedUsers.create({
    data: inventoryAllowedUser,
  });
};

const updateInventoryAllowedUser = async (inventoryAllowedUser: InventoryAllowedUsers): Promise<InventoryAllowedUsers> => {
  const { inventoryAllowedUserId, ...data } = inventoryAllowedUser;

  return await prisma.inventoryAllowedUsers.update({
    where: {
      inventoryAllowedUserId,
    },
    data,
  });
};

const deleteInventoryAllowedUser = async (inventoryAllowedUserId: number): Promise<InventoryAllowedUsers> => {
  return await prisma.inventoryAllowedUsers.delete({
    where: {
      inventoryAllowedUserId,
    },
  });
};

export default {
  getAllInventoryAllowedUsers,
  getInventoryAllowedUser,
  createInventoryAllowedUser,
  updateInventoryAllowedUser,
  deleteInventoryAllowedUser,
};
