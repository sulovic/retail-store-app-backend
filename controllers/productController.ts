import productModel from "../models/productModel.js";
import { Request, Response, NextFunction } from "express";
import { Products } from "@prisma/client";

const getAllProductsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products: Products[] = await productModel.getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

const getProductController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId: number = parseInt(req.params.productId);
    if (isNaN(productId)) {
      res.status(400).json({ message: "Invalid product ID" });
      return;
    }
    const product: Products | null = await productModel.getProduct(productId);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    next(error);
  }
};

const createProductController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product: Omit<Products, "productId"> = req.body;
    const newProduct: Products = await productModel.createProduct(product);
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
};

const updateProductController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product: Products = req.body;
    const updatedProduct: Products = await productModel.updateProduct(product);
    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

const deleteProductController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId: number = parseInt(req.params.productId);
    const deletedProduct: Products = await productModel.deleteProduct(productId);
    res.status(200).json(deletedProduct);
  } catch (error) {
    next(error);
  }
};

export default {
  getAllProductsController,
  getProductController,
  createProductController,
  updateProductController,
  deleteProductController,
};
