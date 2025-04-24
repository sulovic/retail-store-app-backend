import { Router } from "express";
import storesController from "../controllers/storesController.js";
//import validateRequest from "../middleware/validateRequest.js";
//import { storeSchema } from "../types/types.js";

const router = Router();

router.get("/", storesController.getAllStoresController);
//router.get("/count", storesController.getAllStoresCountController);
//#router.get("/:storeId", storesController.getStoreController);
//#router.post("/", validateRequest(storeSchema), storesController.createStoreController);
//router.put("/:storeId", validateRequest(storeSchema), storesController.updateStoreController);
//router.delete("/:storeId", storesController.deleteStoreController);

export default router;