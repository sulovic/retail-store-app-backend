import inventoryProductsModel from "../models/inventoryProductsModel.js";
import inventoriesModel from "../models/inventoriesModel.js";
import { Request, Response, NextFunction } from "express";
import { InventoryProducts } from "@prisma/client";
import { InventoryProduct } from "../types/types.js";
import { TokenUserDataType } from "../types/types.js";

interface AuthenticatedRequest extends Request {
  authUser?: TokenUserDataType;
}

const getAllInventoryProductsController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any> | void> => {
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

    // Check if the user is authorized to access all inventories, return only their inventories otherwise
    if (!req.authUser || req.authUser.UserRoles.roleId < 3000) {
      filter.Users = {
        userId: req.authUser?.userId,
      };
    }

    const inventoryProducts: InventoryProduct[] = await inventoryProductsModel.getAllInventoryProducts({
      filter,
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

    const { sortBy, sortOrder, limit, page, ...filters } = queryParams;

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

    // Check if the user is authorized to access all inventories, return only their inventories otherwise
    if (!req.authUser || req.authUser.UserRoles.roleId < 3000) {
      filter.Users = {
        userId: req.authUser?.userId,
      };
    }


    const count: number = await inventoryProductsModel.getAllInventoryProductsCount(filter);
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
    const inventoryProduct: InventoryProduct | null = await inventoryProductsModel.getInventoryProduct(inventoryProductId);

    if (!inventoryProduct) {
      return res.status(404).json({ message: "Inventory product not found" });
    }

    // Check if the user is authorized to access the inventory product
    if (!req.authUser || (req.authUser.UserRoles.roleId < 3000 && inventoryProduct.Users.userId !== req.authUser?.userId)) {
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
    if (!req.authUser || (req.authUser.UserRoles.roleId < 3000 && !inventory.Stores.Users.some((user) => user.userId === req.authUser?.userId))) {
      return res.status(401).json({ message: "Unauthorized to create products in this inventory" });
    }
    // Set the user ID if not provided
    inventoryProduct.userId = req.authUser.userId;
    const newInventoryProduct: InventoryProducts = await inventoryProductsModel.createInventoryProduct(inventoryProduct);
    return res.status(201).json(newInventoryProduct);
  } catch (error) {
    next(error);
  }
};

const updateInventoryProductsController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const existingInventoryProduct = await inventoryProductsModel.getInventoryProduct(parseInt(req.params.inventoryProductId));
    if (!existingInventoryProduct) {
      return res.status(404).json({ message: "Inventory product not found" });
    }
    const inventory = await inventoriesModel.getInventory(existingInventoryProduct.inventoryId);
    if (!inventory || inventory.archived) {
      return res.status(404).json({ message: "Inventory not found or archived" });
    }

    if (!req.authUser || (req.authUser.UserRoles.roleId < 3000 && existingInventoryProduct.Users.userId !== req.authUser?.userId)) {
      return res.status(401).json({ message: "Unauthorized to update this inventory product" });
    }
    const inventoryProduct: InventoryProducts = req.body;
    const updatedInventoryProduct: InventoryProducts = await inventoryProductsModel.updateInventoryProduct(inventoryProduct);
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
    if (!req.authUser || (req.authUser.UserRoles.roleId < 3000 && existingInventoryProduct.Users.userId !== req.authUser?.userId)) {
      return res.status(401).json({ message: "Unauthorized to delete this inventory product" });
    }
    const deletedInventoryProduct: InventoryProducts = await inventoryProductsModel.deleteInventoryProduct(inventoryProductId);
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
