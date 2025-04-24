import { Router } from "express";
import productController from "../controllers/productController.js";
import validateRequest from "../middleware/validateRequest.js";
import { productSchema } from "../types/types.js";
import * as z from "zod";

const router = Router();
const bulkProductSchema = z.array(productSchema);

router.get("/", productController.getAllProductsController);
router.get("/count", productController.getAllProductsCountController);
router.get("/:productId", productController.getProductController);
router.post("/", validateRequest(productSchema), productController.createProductController);
router.post(
  "/bulk-upload", validateRequest(bulkProductSchema), productController.bulkUploadProductsController
);
router.put("/:productId", validateRequest(productSchema), productController.updateProductController);
router.delete("/:productId", productController.deleteProductController);

export default router;