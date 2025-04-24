import { Router } from "express";
import userController from "../controllers/userController.js";
import validateRequest from "../middleware/validateRequest.js";
import { userPublicDataSchema } from "../types/types.js";

const router = Router();

router.get("/", userController.getAllUsersController);
router.get("/count", userController.getAllUsersCountController);
router.get("/:userId", userController.getUserController);
router.post("/", validateRequest(userPublicDataSchema), userController.createUserController);
router.put("/:userId", validateRequest(userPublicDataSchema), userController.updateUserController);
router.delete("/:userId", userController.deleteUserController);

export default router;