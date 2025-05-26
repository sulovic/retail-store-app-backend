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

    const andKeys = ["productId", "productBarcode"];
    const orKeys: string[] = [];

    const hasAnyAndKeys = andKeys.some((key) => key in filters);
    const hasAnyOrKeys = orKeys.some((key) => key in filters);

    if (Object.keys(filters).length > 0 && !hasAnyAndKeys && !hasAnyOrKeys && !("categoryPath" in filters)) {
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

    if (filters) {
      andKeys.forEach((key) => {
        const value = (filters as Record<string, string>)[key];
        if (value) {
          andConditions.push(createCondition(key, value));
        }
      });

      orKeys.forEach((key) => {
        const value = (filters as Record<string, string>)[key];
        if (value) {
          orConditions.push(createCondition(key, value));
        }
      });

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
      OR: orConditions.length > 0 ? orConditions : undefined,
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

    if (filters) {
      andKeys.forEach((key) => {
        const value = (filters as Record<string, string>)[key];
        if (value) {
          andConditions.push(createCondition(key, value));
        }
      });

      orKeys.forEach((key) => {
        const value = (filters as Record<string, string>)[key];
        if (value) {
          orConditions.push(createCondition(key, value));
        }
      });

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

const createProductController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product: Omit<Product, "productId"> = req.body;
    const newProduct: Product = await productModel.createProduct(product);
    return res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
};

const updateProductController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product: Product = req.body;
    const updatedProduct: Product = await productModel.updateProduct(product);
    return res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

const deleteProductController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId: number = parseInt(req.params.productId);
    const deletedProduct: Product = await productModel.deleteProduct(productId);
    return res.status(200).json(deletedProduct);
  } catch (error) {
    next(error);
  }
};

const bulkUploadProductsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products: Omit<Product, "productId">[] = req.body;
    const newProducts: Product[] = await productModel.bulkUploadProducts(products);
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
