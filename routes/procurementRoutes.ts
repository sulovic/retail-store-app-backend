import { Router } from "express";
import procurementController from "../controllers/procurementController.js";
import validateRequest from "../middleware/validateRequest.js";
import { procurementSchema } from "../types/types.js";

const router = Router();

router.get("/", procurementController.getAllProcurementsController);
router.get("/count", procurementController.getAllProcurementsCountController);
router.get("/:procurementId", procurementController.getProcurementController);
router.post("/", validateRequest(procurementSchema), procurementController.createProcurementController);
router.put("/:procurementId", validateRequest(procurementSchema), procurementController.updateProcurementController);
router.delete("/:procurementId", procurementController.deleteProcurementController);
router.delete("/reset/:storeId", procurementController.resetProcurementsController);

export default router;
