import userRolesModel from "../models/userRole.js";
import { Request, Response } from "express";
import { UserRoles } from "@prisma/client";

const getAllUserRolesController = async (req: Request, res: Response) => {
    try {
      const userRoles: UserRoles[] = await userRolesModel.getAllUserRoles();
      res.status(200).json(userRoles);
    } catch (error) {
      // Log errors and handle response codes appropriately
      console.error("Error :", error);
      res.status(500).json(error);
    }
  };

  export default {
    getAllUserRolesController,
  };