import { Router } from "express";
import categoryController from "../controllers/categoryController.js";

const router = Router();

router.get("/", categoryController.getAllCategoriesController);
router.get("/count", categoryController.getAllCategoriesCountController);
router.get("/:categoryId", categoryController.getCategoryController);
router.post("/", categoryController.createCategoryController);
router.put("/:categoryId", categoryController.updateCategoryController);
router.delete("/:categoryId", categoryController.deleteCategoryController);

export default router;