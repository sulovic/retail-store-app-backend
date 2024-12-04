import { Router } from "express";
import callbackController from "../../controllers/auth/callbackController.js";

const router = Router();

router.post("/", callbackController);

export default router;