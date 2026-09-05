import mongoose from "mongoose";
import ledgerSchema from './ledger.model.js'
const accountSchema = new mongoose.Schema({
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:[true,"Account must be associated with an user"],
        index:true
    },
    status:{
        type:String,
        enum:{
            values:["ACTIVE","FROZEN","EXPIRE"],  //enum :- It restricts the possible values.
            message:"status can be either active or forzen or expire",
        },
        default:"ACTIVE"
    },
    currency:{
        type:String,
        required:[true,"currency is required"],
        default:"NPR"
    }
},{
    timestamps:true
})
accountSchema.index({ user: 1, status: 1 });

accountSchema.methods.getBalance = async function () {
    const balanceData = ledgerSchema.aggregate([
        {
            $match:{ account :this._id}
        },
        {
            $group:{
                _id:null,
                totalDebit:{
                    $sum:{
                        $cond:[
                            {$eq:["type","CREDIT"]},
                            "$amount",
                            0
                        ]
                    }
                },
                totalCredit:{
                    $sum:{
                        $cond:[
                            {$eq:["type","CREDIT"]},
                            "$amount",
                            0
                        ]
                    }
                }
            }
        },
        {
            $project:{
                _id:0,
                balance:{ $subtract:["$totalCredit","$totalDebit"]}
            }
        }


    ])
    if(balanceData.length===0){
        return 0 ;
    }
    return balanceData[0].balance
}

const accountModel = mongoose.model("account",accountSchema) 
export default accountModel ;