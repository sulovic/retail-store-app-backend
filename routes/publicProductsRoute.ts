import { Router } from "express";
import productController from "../controllers/productController.js";

const router = Router();

router.get("/", productController.getAllProductsController);

export default router;