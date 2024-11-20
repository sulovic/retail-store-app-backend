import inventoryModel from "../models/inventoriesModel.js";
import { Request, Response, NextFunction } from "express";
import { Inventories } from "@prisma/client";
import { Inventory } from "../types/types.js";

const getAllInventoriesController = async (req: Request, res: Response, next: NextFunction): Promise<Response<any> | void> => {
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
      } else if (key.includes("archived")) {
        filterValue = value === "true";
      } else {
        filterValue = key.includes("Id") ? parseInt(value) : value;
      }

      filter[key] = filterValue;
    }

    const inventories: Inventory[] = await inventoryModel.getAllInventories({
      filter,
      orderBy,
      take,
      skip,
    });
    return res.status(200).json(inventories);
  } catch (error) {
    next(error);
  }
};

const getInventoryController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const inventoryId: number = parseInt(req.params.inventoryId);
    if (isNaN(inventoryId)) {
      return res.status(400).json({ message: "Invalid inventory ID" });
    }
    const inventory: Inventory | null = await inventoryModel.getInventory(inventoryId);
    if (inventory) {
      return res.status(200).json(inventory);
    } else {
      return res.status(404).json({ message: "Inventory not found" });
    }
  } catch (error) {
    next(error);
  }
};

const createInventoryController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const inventory: Omit<Inventories, "inventoryId"> = req.body;
    const newInventory: Inventories = await inventoryModel.createInventory(inventory);
    return res.status(201).json(newInventory);
  } catch (error) {
    next(error);
  }
};

const updateInventoryController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const inventory: Inventories = req.body;
    const updatedInventory: Inventories = await inventoryModel.updateInventory(inventory);
    return res.status(200).json(updatedInventory);
  } catch (error) {
    next(error);
  }
};

const deleteInventoryController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const inventoryId: number = parseInt(req.params.inventoryId);
    const deletedInventory: Inventories = await inventoryModel.deleteInventory(inventoryId);
    return res.status(200).json(deletedInventory);
  } catch (error) {
    next(error);
  }
};

export default {
  getAllInventoriesController,
  getInventoryController,
  createInventoryController,
  updateInventoryController,
  deleteInventoryController,
};
