import express from 'express'
import authMiddleware from '../middleware/auth.middleware.js'
import accountController from '../controllers/account.controllers.js'
import { Router } from 'express'

const router = Router()

router.post('/user/account',authMiddleware,accountController.accountCreateController)
router.get('/get-account',authMiddleware,accountController.userAcountGet)
router.get('/get/balance/:accountId',authMiddleware,accountController.getAccountBalance)

export default router ;
