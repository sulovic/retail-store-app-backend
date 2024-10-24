import { PrismaClient, UserRoles } from "@prisma/client";

const prisma = new PrismaClient();

const getAllUserRoles = async (): Promise<UserRoles[]> => {
  return await prisma.userRoles.findMany();
};

export default {
  getAllUserRoles,
}