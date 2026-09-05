import express from 'express'
import dotenv from 'dotenv'
import app from './src/app.js'
dotenv.config()



app.listen('3000',(req,res)=>{
    console.log("server started at 3000")
})

