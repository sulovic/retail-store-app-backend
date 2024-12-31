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
}

export default { getAllCategoriesController, getAllCategoriesCountController };