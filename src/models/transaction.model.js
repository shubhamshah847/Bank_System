import mongoose from "mongoose";


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
    amount:{
        type:Number,
        required:[true,"amount is required"],
        min: [0, "Amount cannot be negative"]
    },
    idempotencyKey:{
        type:String,
        required:[true,"idempotency key is required for creating transaction"],
        index:true,
        unique:true
    }

    },{
     timestamps:true
})

const transactionModel = mongoose.model('transaction',transactionSchema)


export default transactionModel;

