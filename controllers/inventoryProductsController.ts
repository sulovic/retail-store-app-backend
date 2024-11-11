import inventoryProductsModel from "../models/inventoryProductsModel.js";
import { Request, Response, NextFunction } from "express";
import { InventoryProducts } from "@prisma/client";
import { InventoryProduct } from "../types/types.js";

const getAllInventoryProductsController = async (req: Request, res: Response, next: NextFunction): Promise<Response<any> | void> => {
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

const getInventoryProductsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const inventoryProductId: number = parseInt(req.params.inventoryProductId);
    if (isNaN(inventoryProductId)) {
      return res.status(400).json({ message: "Invalid inventory product ID" });
    }
    const inventoryProduct: InventoryProduct | null = await inventoryProductsModel.getInventoryProduct(inventoryProductId);
    if (inventoryProduct) {
      return res.status(200).json(inventoryProduct);
    } else {
      return res.status(404).json({ message: "Inventory product not found" });
    }
  } catch (error) {
    next(error);
  }
};

const createInventoryProductsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const inventoryProduct: Omit<InventoryProducts, "inventoryProductId"> = req.body;
    const newInventoryProduct: InventoryProducts = await inventoryProductsModel.createInventoryProduct(inventoryProduct);
    return res.status(201).json(newInventoryProduct);
  } catch (error) {
    next(error);
  }
};

const updateInventoryProductsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const inventoryProduct: InventoryProducts = req.body;
    const updatedInventoryProduct: InventoryProducts = await inventoryProductsModel.updateInventoryProduct(inventoryProduct);
    return res.status(200).json(updatedInventoryProduct);
  } catch (error) {
    next(error);
  }
};

const deleteInventoryProductsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const inventoryProductId: number = parseInt(req.params.inventoryProductId);
    const deletedInventoryProduct: InventoryProducts = await inventoryProductsModel.deleteInventoryProduct(inventoryProductId);
    return res.status(200).json(deletedInventoryProduct);
  } catch (error) {
    next(error);
  }
};

export default {
  getAllInventoryProductsController,
  getInventoryProductsController,
  createInventoryProductsController,
  updateInventoryProductsController,
  deleteInventoryProductsController,
};
