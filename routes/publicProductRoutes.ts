import { Router } from "express";
import publicProductConroller from "../controllers/publicProductConroller.js";

const router = Router();

router.get("/", publicProductConroller.getAllProductsController);
router.get("/count", publicProductConroller.getAllProductsCountController);
router.get("/:productId", publicProductConroller.getProductController);

export default router;