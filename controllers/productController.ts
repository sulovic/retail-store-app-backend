import productModel from "../models/productModel.js";
import { Request, Response } from "express";
import { Products } from "@prisma/client";

const getAllProductsController = async (req: Request, res: Response) => {
  try {
    const products: Products[] = await productModel.getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    // Log errors and handle response codes appropriately
    console.error("Error :", error);
    res.status(500).json(error);
  }
};

const getProductController = async (req: Request, res: Response) => {
  try {
    const productId: number = parseInt(req.params.productId);
    const product: Products | null = await productModel.getProduct(productId);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    // Log errors and handle response codes appropriately
    console.error("Error :", error);
    res.status(500).json(error);
  }
};

const createProductController = async (req: Request, res: Response) => {
  try {
    const product: Omit<Products, "productId"> = req.body;
    const newProduct: Products = await productModel.createProduct(product);
    res.status(201).json(newProduct);
  } catch (error) {
    // Log errors and handle response codes appropriately
    console.error("Error :", error);
    res.status(500).json(error);
  }
};

const updateProductController = async (req: Request, res: Response) => {
  try {
    const product: Products = req.body;
    const updatedProduct: Products = await productModel.updateProduct(product);
    res.json(updatedProduct);
  } catch (error) {
    // Log errors and handle response codes appropriately
    console.error("Error :", error);
    res.status(500).json(error);
  }
};

const deleteProductController = async (req: Request, res: Response) => {
  try {
    const productId: number = parseInt(req.params.productId);
    const deletedProduct: Products = await productModel.deleteProduct(productId);
    res.json(deletedProduct);
  } catch (error) {
    // Log errors and handle response codes appropriately
    console.error("Error :", error);
    res.status(500).json(error);
  }
};

export default {
  getAllProductsController,
  getProductController,
  createProductController,
  updateProductController,
  deleteProductController,
};
