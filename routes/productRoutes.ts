import { Router } from "express";
import productController from "../controllers/productController.js";

const router = Router();

router.get("/", productController.getAllProductsController);
router.get("/count", productController.getAllProductsCountController);
router.get("/:productId", productController.getProductController);
router.post("/", productController.createProductController);
router.post("/bulk-upload", productController.bulkUploadProductsController);
router.put("/:productId", productController.updateProductController);
router.delete("/:productId", productController.deleteProductController);

export default router;