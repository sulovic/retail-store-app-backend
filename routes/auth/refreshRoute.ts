import { Router } from "express";
import refreshController from "../../controllers/auth/refreshController.js";
const router = Router();

router.post("/", refreshController);

export default router;