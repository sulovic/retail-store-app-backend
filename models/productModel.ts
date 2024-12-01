import { PrismaClient, Products } from "@prisma/client";

const prisma = new PrismaClient();

const getAllProducts = async ({ whereClause, orderBy, take, skip }: { whereClause: object; orderBy?: object; take?: number; skip?: number }): Promise<Products[]> => {
  return await prisma.products.findMany({
    where: { ...whereClause, deleted: false },
    orderBy,
    take,
    skip,
  });
};

const getAllProductsCount = async ({ whereClause }: { whereClause: object }): Promise<number> => {
  return await prisma.products.count({
    where: { ...whereClause, deleted: false },
  });
};

const getProduct = async (productId: number): Promise<Products | null> => {
  return await prisma.products.findUnique({
    where: {
      productId,
      deleted: false,
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
      deleted: false,
    },
    data,
  });
};

const deleteProduct = async (productId: number): Promise<Products> => {
  // SOFT DELETION
  return await prisma.products.update({
    where: {
      productId,
      deleted: false,
    },
    data: {
      deleted: true,
      deletedAt: new Date(),
    },
  });
};

const bulkUploadProducts = async (products: Omit<Products, "productId">[]): Promise<Products[]> => {
  const chunkSize = 100;
  const chunkArray = (array: any[], size: number) => {
    const chunks: any[] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  };

  // Split the products array into chunks
  const productChunks = chunkArray(products, chunkSize);
  const allUploadedProducts = [];

  for (const chunk of productChunks) {
    const uploadedChunk = await Promise.all(
      chunk.map((product: Omit<Products, "productId">) => {
        // Map update data to remove empty strings or invalid price
        const updateData: Partial<typeof product> = {};

        if (product.productName && product.productName.trim() !== "") {
          updateData.productName = product.productName;
        }
        if (product.productDesc && product.productDesc.trim() !== "") {
          updateData.productDesc = product.productDesc;
        }

        if (typeof product.productPrice === "number") {
          updateData.productPrice = product.productPrice;
        }

        return prisma.products.upsert({
          where: {
            productBarcode: product.productBarcode,
            deleted: false,
          },
          update: updateData,
          create: product,
        });
      })
    );

    allUploadedProducts.push(...uploadedChunk);
  }

  return allUploadedProducts;
};

export default {
  getAllProducts,
  getAllProductsCount,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkUploadProducts,
};
