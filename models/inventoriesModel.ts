import { PrismaClient, Inventories } from "@prisma/client";
import { Inventory } from "../types/types.js";

const prisma = new PrismaClient();

const getAllInventories = async ({ filter, orderBy, take, skip }: { filter?: object; orderBy?: object; take?: number; skip?: number }): Promise<Inventory[]> => {
  return await prisma.inventories.findMany({
    select: {
      inventoryId: true,
      inventoryDate: true,
      archived: true,
      Stores: {
        select: {
          storeId: true,
          storeName: true,
          storeAddress: true,
          Users: {
            select: {
              userId: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          }
        },
      },
      Creator: {
        select: {
          userId: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
    where: filter,
    orderBy,
    take,
    skip,
  });
};

const getInventory = async (inventoryId: number): Promise<Inventory | null> => {
  return await prisma.inventories.findUnique({
    select: {
      inventoryId: true,
      inventoryDate: true,
      archived: true,
      Stores: {
        select: {
          storeId: true,
          storeName: true,
          storeAddress: true,
          Users: {
            select: {
              userId: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          }
        },
      },
      Creator: {
        select: {
          userId: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
    where: {
      inventoryId,
    },
  });
};

const createInventory = async (inventory: Omit<Inventories, "inventoryId">): Promise<Inventories> => {
  return await prisma.inventories.create({
    data: inventory,
  });
};

const updateInventory = async (inventory: Inventories): Promise<Inventories> => {
  const { inventoryId, ...data } = inventory;

  return await prisma.inventories.update({
    where: {
      inventoryId,
    },
    data,
  });
};

const deleteInventory = async (inventoryId: number): Promise<Inventories> => {
  return await prisma.inventories.delete({
    where: {
      inventoryId,
    },
  });
};

export default {
  getAllInventories,
  getInventory,
  createInventory,
  updateInventory,
  deleteInventory,
};
