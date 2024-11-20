import inventoryAllowedUsersModel from "../models/inventoryAllowedUsersModel.js";
import { Request, Response, NextFunction } from "express";
import { InventoryAllowedUsers } from "@prisma/client";

const getAllInventoryAllowedUsersController = async (req: Request, res: Response, next: NextFunction): Promise<Response<any> | void> => {
  try {
    const queryParams: any = req?.query;

    const { sortBy, sortOrder, limit, page, ...filters } = queryParams;

    const take: number | undefined = limit ? parseInt(limit) : undefined;
    const skip: number | undefined = page && limit ? (parseInt(page) - 1) * parseInt(limit) : undefined;

    const orderBy: object | undefined =
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : undefined;

    const filter: Record<string, any> = {};

    for (const key in filters) {
      const value = filters[key];
      const values = value.split(",") as string[];

      let filterValue;

      if (values.length > 1) {
        filterValue = {
          in: key.includes("Id") ? values.map((v) => parseInt(v)) : values,
        };
      } else {
        filterValue = key.includes("Id") ? parseInt(value) : value;
      }

      filter[key] = filterValue;
    }

    const inventoryAllowedUsers: InventoryAllowedUsers[] = await inventoryAllowedUsersModel.getAllInventoryAllowedUsers({
      filter,
      orderBy,
      take,
      skip,
    });
    return res.status(200).json(inventoryAllowedUsers);
  } catch (error) {
    next(error);
  }
};

const getInventoryAllowedUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const inventoryAllowedUserId: number = parseInt(req.params.inventoryAllowedUserId);
    if (isNaN(inventoryAllowedUserId)) {
      return res.status(400).json({ message: "Invalid inventory allowed users ID" });
    }
    const inventoryAllowedUser: InventoryAllowedUsers | null = await inventoryAllowedUsersModel.getInventoryAllowedUser(inventoryAllowedUserId);
    if (inventoryAllowedUser) {
      return res.status(200).json(inventoryAllowedUser);
    } else {
      return res.status(404).json({ message: "Inventory allowed users not found" });
    }
  } catch (error) {
    next(error);
  }
};

const createInventoryAllowedUsersController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const inventoryAllowedUser: Omit<InventoryAllowedUsers, "inventoryAllowedUserId"> = req.body;
    const newInventoryAllowedUser: InventoryAllowedUsers = await inventoryAllowedUsersModel.createInventoryAllowedUser(inventoryAllowedUser);
    return res.status(201).json(newInventoryAllowedUser);
  } catch (error) {
    next(error);
  }
};

const updateInventoryAllowedUsersController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const inventoryAllowedUser: InventoryAllowedUsers = req.body;
    const updatedInventoryAllowedUser: InventoryAllowedUsers = await inventoryAllowedUsersModel.updateInventoryAllowedUser(inventoryAllowedUser);
    return res.status(200).json(updatedInventoryAllowedUser);
  } catch (error) {
    next(error);
  }
};

const deleteInventoryAllowedUsersController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const inventoryAllowedUserId: number = parseInt(req.params.inventoryAllowedUserId);
    const deletedInventoryAllowedUser: InventoryAllowedUsers = await inventoryAllowedUsersModel.deleteInventoryAllowedUser(inventoryAllowedUserId);
    return res.status(200).json(deletedInventoryAllowedUser);
  } catch (error) {
    next(error);
  }
};

export default {
  getAllInventoryAllowedUsersController,
  getInventoryAllowedUserController,
  createInventoryAllowedUsersController,
  updateInventoryAllowedUsersController,
  deleteInventoryAllowedUsersController,
};
