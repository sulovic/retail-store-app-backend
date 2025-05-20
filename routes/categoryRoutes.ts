import { Router } from "express";
import categoryController from "../controllers/categoryController.js";
import validateRequest from "../middleware/validateRequest.js";
import { categorySchema } from "../types/types.js";

const router = Router();

router.get("/", categoryController.getAllCategoriesController);
router.get("/count", categoryController.getAllCategoriesCountController);
router.get("/:categoryId", categoryController.getCategoryController);
router.post("/", validateRequest(categorySchema), categoryController.createCategoryController);
router.put("/:categoryId", validateRequest(categorySchema), categoryController.updateCategoryController);
router.delete("/:categoryId", categoryController.deleteCategoryController);

export default router;
