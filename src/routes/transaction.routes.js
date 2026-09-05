import { Router } from "express";
import transactionController from "../controllers/transaction.controllers";
import authMiddleware from "../middleware/auth.middleware";
import systemMiddleware from "../middleware/system.middleware.js";
const router = Router()

router.post('/api/transaction',authMiddleware,transactionController)
router.post('/api/system/paisa',systemMiddleware,)
export default router ;