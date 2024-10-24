import { Router } from "express";
import userRolesController from "../controllers/userRoleController.js";

const router = Router();

router.get("/", userRolesController.getAllUserRolesController);

export default router;