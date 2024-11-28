import { Router } from "express";
import inventoryController from "../controllers/inventoryController.js";

const router = Router();

router.get("/", inventoryController.getAllInventoriesController);
router.get("/count", inventoryController.getAllInventoriesCountController);
router.get("/:inventoryId", inventoryController.getInventoryController);
router.post("/", inventoryController.createInventoryController);
router.put("/:inventoryId", inventoryController.updateInventoryController);
router.delete("/:inventoryId", inventoryController.deleteInventoryController);

export default router;
