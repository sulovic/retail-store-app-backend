import userRolesModel from "../models/userRole.js";
import { Request, Response, NextFunction } from "express";
import { UserRoles } from "@prisma/client";

const getAllUserRolesController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userRoles: UserRoles[] = await userRolesModel.getAllUserRoles();
    return res.status(200).json(userRoles);
  } catch (error) {
    next(error);
  }
};

export default {
  getAllUserRolesController,
};
