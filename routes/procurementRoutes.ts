import { Router } from "express";
import procurementController from "../controllers/procurementController.js";

const router = Router();

router.get("/", procurementController.getAllProcurementsController);
router.get("/count", procurementController.getAllProcurementsCountController);
router.get("/:inventoryId", procurementController.getProcurementController);
router.post("/", procurementController.createProcurementController);
router.put("/:inventoryId", procurementController.updateProcurementController);
router.delete("/:inventoryId", procurementController.deleteProcurementController);

export default router;
