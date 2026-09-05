import mongoose from "mongoose";
import { userLogin } from "../controllers/auth.controller.js";

const transactionSchema = new mongoose.Schema({
    fromAccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'account',
        required:[true,"transaction must be associated with to a from account"],
        index:true    
    },
    toAccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'account',
        required:[true,'transaction must be associated with to a from account']
    },
    status:{
        type:String,
        enum:{
            values:["PENDING","FAILED","COMPLETED","REVERSED"],
            message:"transation must be PENDING OR FAILED OR COMPLETED OR REVERSED"
    },
    default:"PENDING"
    }, 
    amounts:{
        type:Number,
        required:[0,"amount cant be a negative "]
    } ,
    idempotencyKey:{
        type:String,
        requried:[true,"idempotency key is required for creating transaction"],
        index:true,
        unique:true
    }

    },{
     timestamps:true
})

const transactionModel = mongoose.Model('transaction',transactionSchema)
export default transactionModel;

