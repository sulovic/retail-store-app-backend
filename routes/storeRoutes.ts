import { Router } from "express";
import storesController from "../controllers/storesController.js";

const router = Router();

router.get("/", storesController.getAllStoresController);

export default router;