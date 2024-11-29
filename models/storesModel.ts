import { PrismaClient, Stores } from "@prisma/client";

const prisma = new PrismaClient();

const getAllStores = async (): Promise<Stores[]> => {
  return await prisma.stores.findMany({ where: { deleted: false } });
};

export default {
  getAllStores,
};
