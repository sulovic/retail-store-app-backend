import { PrismaClient, Procurements } from "@prisma/client";
import { Procurement } from "../types/types.js";

const prisma = new PrismaClient();

const getAllProcurements = async ({
  whereClause,
  orderBy,
  take,
  skip,
}: {
  whereClause?: object;
  orderBy?: object;
  take?: number;
  skip?: number;
}): Promise<Procurement[]> => {
  return await prisma.procurements.findMany({
    where: whereClause,
    orderBy,
    take,
    skip,
    select: {
      procurementId: true,
      Products: {
        select: {
          productId: true,
          productName: true,
          productBarcode: true,
        },
      },
      productQuantity: true,
      Stores: {
        select: {
          storeId: true,
          storeName: true,
        },
      },
      Users: {
        select: {
          userId: true,
          firstName: true,
          lastName: true,
        },
      },
      completed: true,
      createdAt: true,
    },
  });
};

const getAllProcurementsCount = async ({ whereClause }: { whereClause?: object }): Promise<number> => {
  return await prisma.procurements.count({
    where: whereClause,
  });
};

const getProcurement = async (procurementId: number): Promise<Procurement | null> => {
  return await prisma.procurements.findUnique({
    where: {
      procurementId,
    },
    select: {
      procurementId: true,
      Products: {
        select: {
          productId: true,
          productName: true,
          productBarcode: true,
        },
      },
      productQuantity: true,
      Stores: {
        select: {
          storeId: true,
          storeName: true,
        },
      },
      Users: {
        select: {
          userId: true,
          firstName: true,
          lastName: true,
        },
      },
      completed: true,
      createdAt: true,
    },
  });
};

const createProcurement = async (
  procurement: Omit<Procurements, "procurementId">
): Promise<Procurements> => {
  return await prisma.procurements.create({
    data: procurement,
  });
};

const updateProcurement = async (procurement: Procurements): Promise<Procurements> => {
  const { procurementId, ...data } = procurement;

  return await prisma.procurements.update({
    where: {
      procurementId,
    },
    data,
  });
};

const deleteProcurement = async (procurementId: number): Promise<Procurements> => {
  return await prisma.procurements.delete({
    where: {
      procurementId,
    },
  });
};

export default {
  getAllProcurements,
  getAllProcurementsCount,
  getProcurement,
  createProcurement,
  updateProcurement,
  deleteProcurement,
};
