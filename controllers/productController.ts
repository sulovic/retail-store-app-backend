import productModel from "../models/productModel.js";
import { Request, Response, NextFunction } from "express";
import { Products } from "@prisma/client";
import { QueryParams } from "types/types.js";

const getAllProductsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queryParams: QueryParams = req?.query as QueryParams;

    const { sortBy, sortOrder, limit, page, search, categoryPath, ...filters } = queryParams;

    const take: number | undefined = limit ? parseInt(limit) : undefined;
    const skip: number | undefined = page && limit ? (parseInt(page) - 1) * parseInt(limit) : undefined;

    const orderBy: object | undefined =
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : undefined;

    const andKeys = ["productId", "productBarcode"];
    const orKeys: string[] = [];

    const hasAnyAndKeys = andKeys.some((key) => key in filters);
    const hasAnyOrKeys = orKeys.some((key) => key in filters);

    if (Object.keys(filters).length > 0 && !hasAnyAndKeys && !hasAnyOrKeys) {
      return res.status(400).json({ message: "Invalid filters provided" });
    }

    const createCondition = (key: string, value: string) => {
      const values = value.split(",").map((item) => {
        if (key === "productBarcode") {
          return item.toString();
        }
        return isNaN(Number(item)) ? item.toString() : Number(item);
      });
      return values.length === 1 ? { [key]: values[0] } : { [key]: { in: values } };
    };

    const andConditions: object[] = [];
    const orConditions: object[] = [];

    if (categoryPath) {
      andConditions.push({
        Categories: {
          some: {
            categoryPath: categoryPath,
          },
        },
      });
    }

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
          { productName: { contains: search } },
          { productBarcode: { contains: search } },
          { productDesc: { contains: search } },
        ],
      });
    }

    const whereClause = {
      AND: andConditions.length > 0 ? andConditions : undefined,
      OR: orConditions.length > 0 ? orConditions : undefined,
    };

    const products: Products[] = await productModel.getAllProducts({
      whereClause,
      orderBy,
      take,
      skip,
    });
    return res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

const getAllProductsCountController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queryParams: QueryParams = req?.query as QueryParams;

    const { sortBy, sortOrder, limit, page, search, categoryPath, ...filters } = queryParams; // eslint-disable-line @typescript-eslint/no-unused-vars

    const andKeys = ["productId", "productBarcode"];
    const orKeys: string[] = [];

    const hasAnyAndKeys = andKeys.some((key) => key in filters);
    const hasAnyOrKeys = orKeys.some((key) => key in filters);

    if (Object.keys(filters).length > 0 && !hasAnyAndKeys && !hasAnyOrKeys) {
      return res.status(400).json({ message: "Invalid filters provided" });
    }

    const createCondition = (key: string, value: string) => {
      const values = value.split(",").map((item) => {
        if (key === "productBarcode") {
          return item.toString();
        }
        return isNaN(Number(item)) ? item.toString() : Number(item);
      });
      return values.length === 1 ? { [key]: values[0] } : { [key]: { in: values } };
    };

    const andConditions: object[] = [];
    const orConditions: object[] = [];

    if (categoryPath) {
      andConditions.push({
        Categories: {
          some: {
            categoryPath: categoryPath,
          },
        },
      });
    }

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
          { productName: { contains: search } },
          { productBarcode: { contains: search } },
          { productDesc: { contains: search } },
        ],
      });
    }

    const whereClause = {
      AND: andConditions.length > 0 ? andConditions : undefined,
      OR: orConditions.length > 0 ? orConditions : undefined,
    };

    const productsCount: number = await productModel.getAllProductsCount({ whereClause });
    return res.status(200).json({ count: productsCount });
  } catch (error) {
    next(error);
  }
};

const getProductController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId: number = parseInt(req.params.productId);
    if (isNaN(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    const product: Products | null = await productModel.getProduct(productId);
    if (product) {
      return res.status(200).json(product);
    } else {
      return res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    next(error);
  }
};

const createProductController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product: Omit<Products, "productId"> = req.body;
    const newProduct: Products = await productModel.createProduct(product);
    return res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
};

const updateProductController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product: Products = req.body;
    const updatedProduct: Products = await productModel.updateProduct(product);
    return res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

const deleteProductController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId: number = parseInt(req.params.productId);
    const deletedProduct: Products = await productModel.deleteProduct(productId);
    return res.status(200).json(deletedProduct);
  } catch (error) {
    next(error);
  }
};

const bulkUploadProductsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products: Omit<Products, "productId">[] = req.body;
    const newProducts: Products[] = await productModel.bulkUploadProducts(products);
    return res.status(201).json(newProducts);
  } catch (error) {
    next(error);
  }
};

export default {
  getAllProductsController,
  getAllProductsCountController,
  getProductController,
  createProductController,
  updateProductController,
  deleteProductController,
  bulkUploadProductsController,
};
