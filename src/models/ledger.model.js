import mongoose, { Schema } from "mongoose";

const ledgerSchema = new mongoose.Schema({
    account : {
        type:mongoose.Schema.Types.ObjectId,
        ref:'account',
        requried:[true,"ledger must be associated with an account"],
        index:true,
        immutable:true
    },
    amount:{
        type:Number,
        requried:[true, ' amount is reqruied for creating ledger entry'],
        immutable:true
    },
    transaction:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'transaction',
        requried:[true,"ledger mmust be associated wu=ith a transaction"],
        index:true,
        immutable:true
    },
    type:{
        type:String,
        enum:{
            values:["CREDIT","DEBIT"],
            message:"type can be either be CREDIT oR DEBIT "
        },
        requried:[true,"ledger type is required"],
        immutable:true
    }
},{
        timestamps:true
})
    function preventLedgerModification(){
    throw new Error("Ledger entries are immutable and cannot be modified or deleted")
}
ledgerSchema.pre('findOneAndUpdate',preventLedgerModification)
ledgerSchema.pre('deleteOne',preventLedgerModification)
ledgerSchema.pre('remove',preventLedgerModification)
ledgerSchema.pre('updateOne',preventLedgerModification)

const ledgerModel = mongoose.model('ledger',ledgerSchema)

export default ledgerModel ;