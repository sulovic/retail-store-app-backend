import categoryModel from "../models/categoryModel.js";
import { Request, Response, NextFunction } from "express";
import { Categories } from "@prisma/client";

const getAllCategoriesController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories: Categories[] = await categoryModel.getAllCategories({});
    return res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

const getAllCategoriesCountController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoriesCount: number = await categoryModel.getAllCategoriesCount({});
    return res.status(200).json(categoriesCount);
  } catch (error) {
    next(error);
  }
};

const getCategoyrByPathController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoryPath: string = req.params[0];
    const category: Categories | null = await categoryModel.getCategoryByPath(categoryPath);
    if (category) {
      return res.status(200).json(category);
    } else {
      return res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    next(error);
  }
};

export default { getAllCategoriesController, getAllCategoriesCountController, getCategoyrByPathController };
