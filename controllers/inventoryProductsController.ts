import inventoryProductsModel from "../models/inventoryProductsModel.js";
import inventoriesModel from "../models/inventoriesModel.js";
import { Request, Response, NextFunction } from "express";
import { InventoryProducts } from "@prisma/client";
import { InventoryProduct } from "../types/types.js";
import { TokenUserDataType } from "../types/types.js";

interface AuthenticatedRequest extends Request {
  authUser?: TokenUserDataType;
}

const getAllInventoryProductsController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<Response<any> | void> => {
  try {
    const queryParams: any = req?.query;

    const { sortBy, sortOrder, limit, page, search, ...filters } = queryParams;

    const take: number | undefined = limit ? parseInt(limit) : undefined;
    const skip: number | undefined = page && limit ? (parseInt(page) - 1) * parseInt(limit) : undefined;

    const orderBy: object | undefined =
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : undefined;

    const andKeys = ["inventoryProductId", "inventoryId", "productId", "userId"];
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

    if (search) {
      andConditions.push({
        OR: [
          { Products: { productName: { contains: search } } },
          { Products: { productBarcode: { contains: search } } },
          { Products: { productDesc: { contains: search } } },
        ],
      });
    }
    // Check if the user is authorized to access all inventories, return only their inventories otherwise
    if (!req.authUser || req.authUser.UserRoles.roleId < 3000) {
      andConditions.push({ Users: { userId: req.authUser?.userId } });
    }

    const whereClause = {
      AND: andConditions.length > 0 ? andConditions : undefined,
      OR: orConditions.length > 0 ? orConditions : undefined,
    };

    const inventoryProducts: InventoryProduct[] = await inventoryProductsModel.getAllInventoryProducts({
      whereClause,
      orderBy,
      take,
      skip,
    });
    return res.status(200).json(inventoryProducts);
  } catch (error) {
    next(error);
  }
};

const getAllInventoryProductsCountController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const queryParams: any = req?.query;

    const { sortBy, sortOrder, limit, page, search, ...filters } = queryParams;

    const andKeys = ["inventoryProductId", "inventoryId", "productId", "userId"];
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

    if (search) {
      andConditions.push({
        OR: [
          { Products: { productName: { contains: search } } },
          { Products: { productBarcode: { contains: search } } },
          { Products: { productDesc: { contains: search } } },
        ],
      });
    }
    // Check if the user is authorized to access all inventories, return only their inventories otherwise
    if (!req.authUser || req.authUser.UserRoles.roleId < 3000) {
      andConditions.push({ Users: { userId: req.authUser?.userId } });
    }

    const whereClause = {
      AND: andConditions.length > 0 ? andConditions : undefined,
      OR: orConditions.length > 0 ? orConditions : undefined,
    };

    const count: number = await inventoryProductsModel.getAllInventoryProductsCount({ whereClause });
    return res.status(200).json({ count });
  } catch (error) {
    next(error);
  }
};

const getInventoryProductsController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const inventoryProductId: number = parseInt(req.params.inventoryProductId);
    if (isNaN(inventoryProductId)) {
      return res.status(400).json({ message: "Invalid inventory product ID" });
    }
    const inventoryProduct: InventoryProduct | null = await inventoryProductsModel.getInventoryProduct(
      inventoryProductId
    );

    if (!inventoryProduct) {
      return res.status(404).json({ message: "Inventory product not found" });
    }

    // Check if the user is authorized to access the inventory product
    if (
      !req.authUser ||
      (req.authUser.UserRoles.roleId < 3000 && inventoryProduct.Users.userId !== req.authUser?.userId)
    ) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    return res.status(200).json(inventoryProduct);
  } catch (error) {
    next(error);
  }
};

const createInventoryProductsController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const inventoryProduct: Omit<InventoryProducts, "inventoryProductId"> = req.body;

    const inventory = await inventoriesModel.getInventory(inventoryProduct.inventoryId);
    if (!inventory || inventory.archived) {
      return res.status(404).json({ message: "Inventory not found or archived" });
    }
    if (
      !req.authUser ||
      (req.authUser.UserRoles.roleId < 3000 &&
        !inventory.Stores.Users.some((user) => user.userId === req.authUser?.userId))
    ) {
      return res.status(401).json({ message: "Unauthorized to create products in this inventory" });
    }
    // Set the user ID if not provided
    inventoryProduct.userId = req.authUser.userId;
    const newInventoryProduct: InventoryProducts = await inventoryProductsModel.createInventoryProduct(
      inventoryProduct
    );
    return res.status(201).json(newInventoryProduct);
  } catch (error) {
    next(error);
  }
};

const updateInventoryProductsController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const existingInventoryProduct = await inventoryProductsModel.getInventoryProduct(
      parseInt(req.params.inventoryProductId)
    );
    if (!existingInventoryProduct) {
      return res.status(404).json({ message: "Inventory product not found" });
    }
    const inventory = await inventoriesModel.getInventory(existingInventoryProduct.inventoryId);
    if (!inventory || inventory.archived) {
      return res.status(404).json({ message: "Inventory not found or archived" });
    }

    if (
      !req.authUser ||
      (req.authUser.UserRoles.roleId < 3000 && existingInventoryProduct.Users.userId !== req.authUser?.userId)
    ) {
      return res.status(401).json({ message: "Unauthorized to update this inventory product" });
    }
    const inventoryProduct: InventoryProducts = req.body;
    const updatedInventoryProduct: InventoryProducts = await inventoryProductsModel.updateInventoryProduct(
      inventoryProduct
    );
    return res.status(200).json(updatedInventoryProduct);
  } catch (error) {
    next(error);
  }
};

const deleteInventoryProductsController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const inventoryProductId: number = parseInt(req.params.inventoryProductId);

    const existingInventoryProduct = await inventoryProductsModel.getInventoryProduct(inventoryProductId);
    if (!existingInventoryProduct) {
      return res.status(404).json({ message: "Inventory product not found" });
    }

    const inventory = await inventoriesModel.getInventory(existingInventoryProduct.inventoryId);

    if (!inventory || inventory.archived) {
      return res.status(404).json({ message: "Inventory not found or archived" });
    }
    if (
      !req.authUser ||
      (req.authUser.UserRoles.roleId < 3000 && existingInventoryProduct.Users.userId !== req.authUser?.userId)
    ) {
      return res.status(401).json({ message: "Unauthorized to delete this inventory product" });
    }
    const deletedInventoryProduct: InventoryProducts = await inventoryProductsModel.deleteInventoryProduct(
      inventoryProductId
    );
    return res.status(200).json(deletedInventoryProduct);
  } catch (error) {
    next(error);
  }
};

export default {
  getAllInventoryProductsController,
  getAllInventoryProductsCountController,
  getInventoryProductsController,
  createInventoryProductsController,
  updateInventoryProductsController,
  deleteInventoryProductsController,
};
