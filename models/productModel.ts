import { PrismaClient, Products } from "@prisma/client";

const prisma = new PrismaClient();

const getAllProducts = async ({ filter, orderBy, take, skip }: { filter?: object; orderBy?: object; take?: number; skip?: number }): Promise<Products[]> => {
  return await prisma.products.findMany({
    where: filter,
    orderBy,
    take,
    skip,
  });
};

const getProduct = async (productId: number): Promise<Products | null> => {
  return await prisma.products.findUnique({
    where: {
      productId,
    },
  });
};

const createProduct = async (product: Omit<Products, "productId">): Promise<Products> => {
  return await prisma.products.create({
    data: product,
  });
};

const updateProduct = async (product: Products): Promise<Products> => {
  const { productId, ...data } = product;

  return await prisma.products.update({
    where: {
      productId,
    },
    data,
  });
};

const deleteProduct = async (productId: number): Promise<Products> => {
  // SOFT DELETION
  return await prisma.products.update({
    where: {
      productId,
    },
    data: {
      deleted: true,
    },
  });
};

export default {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
