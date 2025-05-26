import productModel from "../models/productModel.js";
import { Request, Response, NextFunction } from "express";
import { QueryParams } from "types/types.js";
import { Product } from "types/types.js";

const getAllProductsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queryParams: QueryParams = req?.query as QueryParams;

    const { sortBy, sortOrder, limit, page, search, ...filters } = queryParams;

    const take: number | undefined = limit ? parseInt(limit) : 100; // default to 100 to avoid excessive data
    const skip: number | undefined = page && limit ? (parseInt(page) - 1) * parseInt(limit) : 0;

    const orderBy: object | undefined = sortBy
      ? {
          [sortBy]: sortOrder || "asc",
        }
      : undefined;

    const andConditions: object[] = [];

    if (filters) {
      const categoryPath = (filters as Record<string, string>)["categoryPath"];
      const productUrl = (filters as Record<string, string>)["productUrl"];

      if (productUrl) {
        andConditions.push({
          productUrl: productUrl,
        });
      }

      if (categoryPath) {
        andConditions.push({
          Categories: {
            some: {
              categoryPath: categoryPath,
            },
          },
        });
      }
    }

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
    };

    const products: Product[] = await productModel.getAllProducts({
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

    const { sortBy, sortOrder, limit, page, search, ...filters } = queryParams; // eslint-disable-line @typescript-eslint/no-unused-vars

    const andConditions: object[] = [];

    if (filters) {
      const categoryPath = (filters as Record<string, string>)["categoryPath"];

      if (categoryPath) {
        andConditions.push({
          Categories: {
            some: {
              categoryPath: categoryPath,
            },
          },
        });
      }
    }

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
    const product: Product | null = await productModel.getProduct(productId);
    if (product) {
      return res.status(200).json(product);
    } else {
      return res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    next(error);
  }
};

export default { getAllProductsController, getAllProductsCountController, getProductController };
