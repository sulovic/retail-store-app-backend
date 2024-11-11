import { Router } from "express";
import inventoryProductsController from "../controllers/inventoryProductsController.js";

const router = Router();

router.get("/", inventoryProductsController.getAllInventoryProductsController);
router.get("/:inventoryProductId", inventoryProductsController.getInventoryProductsController);
router.post("/", inventoryProductsController.createInventoryProductsController);
router.put("/:inventoryProductId", inventoryProductsController.updateInventoryProductsController);
router.delete("/:inventoryProductId", inventoryProductsController.deleteInventoryProductsController);

export default router;
