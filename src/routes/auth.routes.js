import { Router } from "express";
import * as  authController from '../controllers/auth.controller.js'
const router = Router()

router.post('/user/register',authController.userRegister)
router.post('/user/login',authController.userLogin)

export default router;