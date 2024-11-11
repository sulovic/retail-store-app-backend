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
  return await prisma.inventoryProducts.update({
    where: {
      inventoryProductId: inventoryProduct.inventoryProductId,
    },
    data: inventoryProduct,
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
  getInventoryProduct,
  createInventoryProduct,
  updateInventoryProduct,
  deleteInventoryProduct,
};
