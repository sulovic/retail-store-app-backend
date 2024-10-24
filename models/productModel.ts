import { PrismaClient, Products } from "@prisma/client";



const prisma = new PrismaClient();

const getAllProducts = async () : Promise<Products []> => {
  return await prisma.products.findMany();
};

const getProduct = async (productId: number) : Promise<Products | null> => {
    return await prisma.products.findUnique({
    where: {
      productId,
    },
  });
};

const createProduct = async (product: Omit<Products, 'productId'>) : Promise<Products> => {
    return await prisma.products.create({
    data: product,
  });
};

const updateProduct = async (product: Products) : Promise<Products> => {
    return await prisma.products.update({
    where: {
      productId: product.productId,
    },
    data: product,
  });
};

const deleteProduct = async (productId: number) : Promise<Products>  => {
    return await prisma.products.delete({
    where: {
      productId,
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