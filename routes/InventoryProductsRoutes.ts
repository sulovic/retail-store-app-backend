import { Router } from "express";
import inventoryProductsController from "../controllers/inventoryProductsController.js";
import validateRequest from "../middleware/validateRequest.js";
import { inventoryProductSchema } from "../types/types.js";

const router = Router();

router.get("/", inventoryProductsController.getAllInventoryProductsController);
router.get("/count", inventoryProductsController.getAllInventoryProductsCountController);
router.get("/:inventoryProductId", inventoryProductsController.getInventoryProductsController);
router.post("/", validateRequest(inventoryProductSchema) , inventoryProductsController.createInventoryProductsController);
router.put("/:inventoryProductId", validateRequest(inventoryProductSchema), inventoryProductsController.updateInventoryProductsController);
router.delete("/:inventoryProductId", inventoryProductsController.deleteInventoryProductsController);

export default router;
