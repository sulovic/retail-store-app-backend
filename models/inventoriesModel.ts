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
          },
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
    where: { ...filter, deleted: false },
    orderBy,
    take,
    skip,
  });
};

const getAllInventoriesCount = async ({ filter }: { filter?: object }): Promise<number> => {
  return await prisma.inventories.count({
    where: { ...filter, deleted: false },
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
          },
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
      deleted: false,
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
      deleted: false,
    },
    data,
  });
};

const deleteInventory = async (inventoryId: number): Promise<Inventories> => {
  // SOFT DELETION
  return await prisma.inventories.update({
    where: {
      inventoryId,
    },
    data: {
      deleted: true,
      deletedAt: new Date(),
    },
  });
};

export default {
  getAllInventories,
  getAllInventoriesCount,
  getInventory,
  createInventory,
  updateInventory,
  deleteInventory,
};
