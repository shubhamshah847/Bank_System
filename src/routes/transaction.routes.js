import { Router } from "express";
import transactionController from "../controllers/transaction.controllers.js";
import authMiddleware from "../middleware/auth.middleware.js";
import systemMiddleware from "../middleware/system.middleware.js";

const router = Router()


router.post('/api/transaction',authMiddleware,transactionController.transactionController)
router.post('/api/system/paisa',systemMiddleware,transactionController.createInitialFundTransfer)
export default router ;