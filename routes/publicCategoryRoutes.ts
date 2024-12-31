import { Router } from "express";
import publicCategoryController from "../controllers/publicCategoryController.js";

const router = Router();

router.get("/", publicCategoryController.getAllCategoriesController);
router.get("/count", publicCategoryController.getAllCategoriesCountController);


export default router;