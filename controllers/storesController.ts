import storesModel from "../models/storesModel.js";
import { Request, Response, NextFunction } from "express";
import { Stores } from "@prisma/client";

const getAllStoresController = async (req: Request, res: Response, next: NextFunction): Promise<Response<any> | void> => {
  try {
    const stores: Stores[] = await storesModel.getAllStores();
    return res.status(200).json(stores);
  } catch (error) {
    next(error);
  }
};

export default {
  getAllStoresController,
};
