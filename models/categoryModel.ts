import { PrismaClient, Categories } from "@prisma/client";

const prisma = new PrismaClient();

const getAllCategories = async ({
  whereClause,
  orderBy,
  take,
  skip,
}: {
  whereClause?: object;
  orderBy?: object;
  take?: number;
  skip?: number;
}): Promise<Categories[]> => {
  return await prisma.categories.findMany({
    where: { ...whereClause },
    orderBy,
    take,
    skip,
  });
};

const getAllCategoriesCount = async ({ whereClause }: { whereClause?: object }): Promise<number> => {
  return await prisma.categories.count({
    where: { ...whereClause },
  });
};

const getCategory = async (categoryId: number): Promise<Categories | null> => {
  return await prisma.categories.findUnique({
    where: {
      categoryId,
    },
  });
};

const getCategoryByPath = async (categoryPath: string): Promise<Categories | null> => {
  return await prisma.categories.findUnique({
    where: {
      categoryPath,
    },
  });
};

const createCategory = async (category: Omit<Categories, "categoryId">): Promise<Categories> => {
  return await prisma.categories.create({
    data: category,
  });
};

const updateCategory = async (category: Categories): Promise<Categories> => {
  const { categoryId, ...data } = category;

  return await prisma.categories.update({
    where: {
      categoryId,
    },
    data,
  });
};

const deleteCategory = async (categoryId: number): Promise<Categories> => {
  return await prisma.categories.delete({
    where: {
      categoryId,
    },
  });
};

export default {
  getAllCategories,
  getAllCategoriesCount,
  getCategory,
  getCategoryByPath,
  createCategory,
  updateCategory,
  deleteCategory,
};
