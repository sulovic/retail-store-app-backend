import { PrismaClient, Stores } from "@prisma/client";

const prisma = new PrismaClient();

const getAllStores = async (): Promise<Stores[]> => {
  return await prisma.stores.findMany();
};

export default {
    getAllStores,
}