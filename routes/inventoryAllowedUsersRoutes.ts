import { Router } from "express";
import inventoryAllowedUsersController from "../controllers/inventoryAllowedUsersController.js";

const router = Router();

router.get("/", inventoryAllowedUsersController.getAllInventoryAllowedUsersController);
router.get("/:inventoryAllowedUserId", inventoryAllowedUsersController.getInventoryAllowedUserController);
router.post("/", inventoryAllowedUsersController.createInventoryAllowedUsersController);
router.put("/:inventoryAllowedUserId", inventoryAllowedUsersController.updateInventoryAllowedUsersController);
router.delete("/:inventoryAllowedUserId", inventoryAllowedUsersController.deleteInventoryAllowedUsersController);

export default router;