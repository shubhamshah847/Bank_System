import express from 'express'
import router from './routes/auth.routes.js'
import accountRoute from './routes/account.routes.js'
import transactionRoute from './controllers/transaction.controllers.js'
import connectToDb from './config/db.js'
import cookieParser from 'cookie-parser'
const app =express()
connectToDb()
app.use(express.json())
app.use(cookieParser())
app.use('/auth',router)
app.use('/',accountRoute)
app.use('/',transactionRoute)

export default app ;