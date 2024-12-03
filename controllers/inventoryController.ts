import inventoryModel from "../models/inventoriesModel.js";
import { Request, Response, NextFunction } from "express";
import { Inventories } from "@prisma/client";
import { Inventory } from "../types/types.js";
import { TokenUserDataType } from "../types/types.js";

interface AuthenticatedRequest extends Request {
  authUser?: TokenUserDataType;
}

const getAllInventoriesController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<Response<any> | void> => {
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

    const andKeys = ["inventoryId", "storeId", "creatorId"];
    const orKeys: string[] = [];

    const hasAnyAndKeys = andKeys.some((key) => key in filters);
    const hasAnyOrKeys = orKeys.some((key) => key in filters);

    if (Object.keys(filters).length > 0 && !hasAnyAndKeys && !hasAnyOrKeys) {
      return res.status(400).json({ message: "Invalid filters provided" });
    }

    const createCondition = (key: string, value: string) => {
      const values = value.split(",").map(Number);
      return values.length === 1
        ? { [key]: key.includes("Id") ? values[0] : values[0].toString() }
        : { [key]: { in: key.includes("Id") ? values : values.toString() } };
    };

    const andConditions: object[] = [];
    const orConditions: object[] = [];

    andKeys.forEach((key) => {
      if (filters[key]) {
        andConditions.push(createCondition(key, filters[key]));
      }
    });

    orKeys.forEach((key) => {
      if (filters[key]) {
        orConditions.push(createCondition(key, filters[key]));
      }
    });

    // Check if the user is authorized to access all inventories, return only their inventories otherwise
    if (!req.authUser || req.authUser.UserRoles.roleId < 3000) {
      andConditions.push({ AND: [{ Creator: { some: { userId: req.authUser?.userId } } }] });
    }

    const whereClause = {
      AND: andConditions.length > 0 ? andConditions : undefined,
      OR: orConditions.length > 0 ? orConditions : undefined,
    };

    const inventories: Inventory[] = await inventoryModel.getAllInventories({
      whereClause,
      orderBy,
      take,
      skip,
    });
    return res.status(200).json(inventories);
  } catch (error) {
    next(error);
  }
};

const getAllInventoriesCountController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<Response<any> | void> => {
  try {
    const queryParams: any = req?.query;

    const { ...filters } = queryParams;

    const andKeys = ["inventoryId", "storeId", "creatorId"];
    const orKeys: string[] = [];

    const hasAnyAndKeys = andKeys.some((key) => key in filters);
    const hasAnyOrKeys = orKeys.some((key) => key in filters);

    if (Object.keys(filters).length > 0 && !hasAnyAndKeys && !hasAnyOrKeys) {
      return res.status(400).json({ message: "Invalid filters provided" });
    }

    const createCondition = (key: string, value: string) => {
      const values = value.split(",").map(Number);
      return values.length === 1
        ? { [key]: key.includes("Id") ? values[0] : values[0].toString() }
        : { [key]: { in: key.includes("Id") ? values : values.toString() } };
    };

    const andConditions: object[] = [];
    const orConditions: object[] = [];

    andKeys.forEach((key) => {
      if (filters[key]) {
        andConditions.push(createCondition(key, filters[key]));
      }
    });

    orKeys.forEach((key) => {
      if (filters[key]) {
        orConditions.push(createCondition(key, filters[key]));
      }
    });

    // Check if the user is authorized to access all inventories, return only their inventories otherwise
    if (!req.authUser || req.authUser.UserRoles.roleId < 3000) {
      andConditions.push({ AND: [{ Creator: { some: { userId: req.authUser?.userId } } }] });
    }

    const whereClause = {
      AND: andConditions.length > 0 ? andConditions : undefined,
      OR: orConditions.length > 0 ? orConditions : undefined,
    };

    const count: number = await inventoryModel.getAllInventoriesCount({ whereClause });
    return res.status(200).json({ count });
  } catch (error) {
    next(error);
  }
};

const getInventoryController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const inventoryId: number = parseInt(req.params.inventoryId);
    if (isNaN(inventoryId)) {
      return res.status(400).json({ message: "Invalid inventory ID" });
    }

    const inventory: Inventory | null = await inventoryModel.getInventory(inventoryId);

    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }

    // Check if the user is authorized to access the inventory
    if (
      !req.authUser ||
      (req.authUser.UserRoles.roleId < 3000 &&
        !inventory.Stores.Users.some((user) => user.userId === req.authUser?.userId))
    ) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    return res.status(200).json(inventory);
  } catch (error) {
    next(error);
  }
};

const createInventoryController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const inventory: Omit<Inventories, "inventoryId"> = req.body;
    if (!req.authUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // Set the user ID if not provided
    inventory.creatorId = req.authUser.userId;
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
  getAllInventoriesCountController,
  getInventoryController,
  createInventoryController,
  updateInventoryController,
  deleteInventoryController,
};
