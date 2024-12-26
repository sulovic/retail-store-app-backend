import categoryModel from "../models/categoryModel.js";
import { Request, Response, NextFunction } from "express";
import { Categories } from "@prisma/client";
import { QueryParams } from "types/types.js";

const getAllCategoriesController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queryParams: QueryParams = req?.query as QueryParams;

    const { sortBy, sortOrder, limit, page, search, ...filters } = queryParams;

    const take: number | undefined = limit ? parseInt(limit) : undefined;
    const skip: number | undefined = page && limit ? (parseInt(page) - 1) * parseInt(limit) : undefined;

    const orderBy: object | undefined =
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : undefined;

    const andKeys = ["categoryId", "categoryName", "categoryPath"];
    const orKeys: string[] = [];

    const hasAnyAndKeys = andKeys.some((key) => key in filters);
    const hasAnyOrKeys = orKeys.some((key) => key in filters);

    if (Object.keys(filters).length > 0 && !hasAnyAndKeys && !hasAnyOrKeys) {
      return res.status(400).json({ message: "Invalid filters provided" });
    }

    const createCondition = (key: string, value: string) => {
      const values = value.split(",").map((item) => {
        return isNaN(Number(item)) ? item.toString() : Number(item);
      });
      return values.length === 1 ? { [key]: values[0] } : { [key]: { in: values } };
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
        OR: [{ categoryName: { contains: search } }, { categoryPath: { contains: search } }],
      });
    }

    const whereClause = {
      AND: andConditions.length > 0 ? andConditions : undefined,
      OR: orConditions.length > 0 ? orConditions : undefined,
    };

    const categories: Categories[] = await categoryModel.getAllCategories({
      whereClause,
      orderBy,
      take,
      skip,
    });
    return res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

const getAllCategoriesCountController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queryParams: QueryParams = req?.query as QueryParams;

    const { sortBy, sortOrder, limit, page, search, ...filters } = queryParams; // eslint-disable-line @typescript-eslint/no-unused-vars

    const andKeys = ["categoryId", "categoryName", "categoryPath"];
    const orKeys: string[] = [];

    const hasAnyAndKeys = andKeys.some((key) => key in filters);
    const hasAnyOrKeys = orKeys.some((key) => key in filters);

    if (Object.keys(filters).length > 0 && !hasAnyAndKeys && !hasAnyOrKeys) {
      return res.status(400).json({ message: "Invalid filters provided" });
    }

    const createCondition = (key: string, value: string) => {
      const values = value.split(",").map((item) => {
        return isNaN(Number(item)) ? item.toString() : Number(item);
      });
      return values.length === 1 ? { [key]: values[0] } : { [key]: { in: values } };
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
        OR: [{ categoryName: { contains: search } }, { categoryPath: { contains: search } }],
      });
    }

    const whereClause = {
      AND: andConditions.length > 0 ? andConditions : undefined,
      OR: orConditions.length > 0 ? orConditions : undefined,
    };

    const categoriesCount: number = await categoryModel.getAllCategoriesCount({ whereClause });
    return res.status(200).json({ count: categoriesCount });
  } catch (error) {
    next(error);
  }
};

const getCategoryController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoryId: number = parseInt(req.params.categoryId);
    if (isNaN(categoryId)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }
    const category: Categories | null = await categoryModel.getCategory(categoryId);
    if (category) {
      return res.status(200).json(category);
    } else {
      return res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    next(error);
  }
};

const createCategoryController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category: Omit<Categories, "categoryId"> = req.body;

    if (category.categoryName.toLowerCase() !== category.categoryPath.split("/").pop()) {
      return res.status(400).json({ message: "Category name and path do not match" });
    }

    const parentCategoryPath = category.categoryPath.split("/").slice(0, -1).join("/");

    const parentCategoryExists = await categoryModel.getAllCategories({
      whereClause: { categoryPath: parentCategoryPath },
    });

    if (!parentCategoryExists.length) {
      return res.status(400).json({ message: "Parent category does not exist" });
    }

    const newCategory: Categories = await categoryModel.createCategory(category);
    return res.status(201).json(newCategory);
  } catch (error) {
    next(error);
  }
};

const updateCategoryController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category: Categories = req.body;

    if (category.categoryName.toLowerCase() !== category.categoryPath.split("/").pop()) {
      return res.status(400).json({ message: "Category name and path do not match" });
    }

    const parentCategoryPath = category.categoryPath.split("/").slice(0, -1).join("/");

    const parentCategoryExists = await categoryModel.getAllCategories({
      whereClause: { categoryPath: parentCategoryPath },
    });

    if (!parentCategoryExists.length) {
      return res.status(400).json({ message: "Parent category does not exist" });
    }

    const updatedCategory: Categories = await categoryModel.updateCategory(category);
    return res.status(200).json(updatedCategory);
  } catch (error) {
    next(error);
  }
};

const deleteCategoryController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoryId: number = parseInt(req.params.categoryId);
    const deletedCategory: Categories = await categoryModel.deleteCategory(categoryId);
    return res.status(200).json(deletedCategory);
  } catch (error) {
    next(error);
  }
};

export default {
  getAllCategoriesController,
  getAllCategoriesCountController,
  getCategoryController,
  createCategoryController,
  updateCategoryController,
  deleteCategoryController,
};
