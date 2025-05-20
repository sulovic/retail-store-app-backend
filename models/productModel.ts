import { PrismaClient } from "@prisma/client";
import { Product } from "types/types.js";

const prisma = new PrismaClient();

const getAllProducts = async ({
  whereClause,
  orderBy,
  take,
  skip,
}: {
  whereClause?: object;
  orderBy?: object;
  take?: number;
  skip?: number;
}): Promise<Product[]> => {
  return await prisma.products.findMany({
    where: { ...whereClause, deleted: false },
    orderBy,
    take,
    skip,
    select: {
      productId: true,
      productName: true,
      productBarcode: true,
      productUrl: true,
      productPrice: true,
      productDesc: true,
      productImage: true,
      Categories: {
        select: {
          categoryId: true,
          categoryName: true,
          categoryPath: true,
        },
      },
    },
  });
};

const getAllProductsCount = async ({ whereClause }: { whereClause?: object }): Promise<number> => {
  return await prisma.products.count({
    where: { ...whereClause, deleted: false },
  });
};

const getProduct = async (productId: number): Promise<Product | null> => {
  return await prisma.products.findUnique({
    where: {
      productId,
      deleted: false,
    },
    select: {
      productId: true,
      productName: true,
      productBarcode: true,
      productUrl: true,
      productPrice: true,
      productDesc: true,
      productImage: true,
      Categories: {
        select: {
          categoryId: true,
          categoryName: true,
          categoryPath: true,
        },
      },
    },
  });
};

const createProduct = async (product: Omit<Product, "productId">): Promise<Product> => {
  return await prisma.products.create({
    data: {
      ...product,
      Categories: {
        connect: product.Categories.map((category) => ({
          categoryId: category.categoryId,
        })),
      },
    },
    select: {
      productId: true,
      productName: true,
      productBarcode: true,
      productUrl: true,
      productPrice: true,
      productDesc: true,
      productImage: true,
      Categories: {
        select: {
          categoryId: true,
          categoryName: true,
          categoryPath: true,
        },
      },
    },
  });
};

const updateProduct = async (product: Product): Promise<Product> => {
  return await prisma.products.update({
    where: {
      productId: product.productId,
      deleted: false,
    },
    data: {
      ...product,
      Categories: {
        set: [],
        connect: product.Categories.map((category) => ({
          categoryId: category.categoryId,
        })),
      },
    },
    select: {
      productId: true,
      productName: true,
      productBarcode: true,
      productUrl: true,
      productPrice: true,
      productDesc: true,
      productImage: true,
      Categories: {
        select: {
          categoryId: true,
          categoryName: true,
          categoryPath: true,
        },
      },
    },
  });
};

const deleteProduct = async (productId: number): Promise<Product> => {
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
    select: {
      productId: true,
      productName: true,
      productBarcode: true,
      productUrl: true,
      productPrice: true,
      productDesc: true,
      productImage: true,
      Categories: {
        select: {
          categoryId: true,
          categoryName: true,
          categoryPath: true,
        },
      },
    },
  });
};

const bulkUploadProducts = async (products: Omit<Product, "productId">[]): Promise<Product[]> => {
  const chunkSize = 100;
  const chunkArray = (array: Omit<Product, "productId">[], size: number) => {
    const chunks = [];
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
      chunk.map((product: Omit<Product, "productId">) => {
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
          update: {
            ...updateData,
            Categories: {
              set: [],
              connect: updateData.Categories?.map((category) => ({
                categoryId: category.categoryId,
              })),
            },
          },
          create: {
            ...product,
            Categories: {
              connect: product.Categories?.map((category) => ({
                categoryId: category.categoryId,
              })),
            },
          },
          select: {
            productId: true,
            productName: true,
            productBarcode: true,
            productUrl: true,
            productPrice: true,
            productDesc: true,
            productImage: true,
            Categories: {
              select: {
                categoryId: true,
                categoryName: true,
                categoryPath: true,
              },
            },
          },
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
