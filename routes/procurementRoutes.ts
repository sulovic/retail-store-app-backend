import { Router } from "express";
import procurementController from "../controllers/procurementController.js";

const router = Router();

router.get("/", procurementController.getAllProcurementsController);
router.get("/count", procurementController.getAllProcurementsCountController);
router.get("/:procurementId", procurementController.getProcurementController);
router.post("/", procurementController.createProcurementController);
router.put("/:procurementId", procurementController.updateProcurementController);
router.delete("/:procurementId", procurementController.deleteProcurementController);

export default router;
