import { Router } from "express";
import categoryController from "../controllers/categoryController.js";
import validateRequest from "../middleware/validateRequest.js";
import { Category } from "../types/types.js";

const router = Router();

router.get("/", categoryController.getAllCategoriesController);
router.get("/count", categoryController.getAllCategoriesCountController);
router.get("/:categoryId", categoryController.getCategoryController);
router.post("/", validateRequest(Category), categoryController.createCategoryController);
router.put("/:categoryId", validateRequest(Category), categoryController.updateCategoryController);
router.delete("/:categoryId", categoryController.deleteCategoryController);

export default router;