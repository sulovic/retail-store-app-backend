import { PrismaClient, InventoryProducts } from "@prisma/client";
import { InventoryProduct } from "../types/types.js";

const prisma = new PrismaClient();

const getAllInventoryProducts = async ({ filter, orderBy, take, skip }: { filter?: object; orderBy?: object; take?: number; skip?: number }): Promise<InventoryProduct[]> => {
  return await prisma.inventoryProducts.findMany({
    select: {
      inventoryProductId: true,
      inventoryId: true,
      productPrice: true,
      productQuantity: true,
      Users: {
        select: {
          userId: true,
          firstName: true,
          lastName: true,
        },
      },
      Products: {
        select: {
          productId: true,
          productName: true,
        },
      },
    },
    where: filter,
    orderBy,
    take,
    skip,
  });
};

const getAllInventoryProductsCount = async ({ filter }: { filter?: object }): Promise<number> => {
  return await prisma.inventoryProducts.count({
    where: filter,
  });
};

const getInventoryProduct = async (inventoryProductId: number): Promise<InventoryProduct | null> => {
  return await prisma.inventoryProducts.findUnique({
    select: {
      inventoryProductId: true,
      inventoryId: true,
      productPrice: true,
      productQuantity: true,
      Users: {
        select: {
          userId: true,
          firstName: true,
          lastName: true,
        },
      },
      Products: {
        select: {
          productId: true,
          productName: true,
        },
      },
    },
    where: {
      inventoryProductId,
    },
  });
};

const createInventoryProduct = async (inventoryProduct: Omit<InventoryProducts, "inventoryProductId">): Promise<InventoryProducts> => {
  return await prisma.inventoryProducts.create({
    data: inventoryProduct,
  });
};

const updateInventoryProduct = async (inventoryProduct: InventoryProducts): Promise<InventoryProducts> => {
  const { inventoryProductId, ...data } = inventoryProduct;

  return await prisma.inventoryProducts.update({
    where: {
      inventoryProductId,
    },
    data,
  });
};

const deleteInventoryProduct = async (inventoryProductId: number): Promise<InventoryProducts> => {
  return await prisma.inventoryProducts.delete({
    where: {
      inventoryProductId,
    },
  });
};

export default {
  getAllInventoryProducts,
  getAllInventoryProductsCount,
  getInventoryProduct,
  createInventoryProduct,
  updateInventoryProduct,
  deleteInventoryProduct,
};
