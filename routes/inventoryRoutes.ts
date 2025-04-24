import { Router } from "express";
import inventoryController from "../controllers/inventoryController.js";
import validateRequest from "../middleware/validateRequest.js";
import { inventorySchema } from "../types/types.js";

const router = Router();

router.get("/", inventoryController.getAllInventoriesController);
router.get("/count", inventoryController.getAllInventoriesCountController);
router.get("/:inventoryId", inventoryController.getInventoryController);
router.post("/", validateRequest(inventorySchema), inventoryController.createInventoryController);
router.put("/:inventoryId", validateRequest(inventorySchema), inventoryController.updateInventoryController);
router.delete("/:inventoryId", inventoryController.deleteInventoryController);

export default router;
