import transactionModel from "../models/transaction.model.js"
import accountModel from "../models/account.model.js"
import authMiddleware from "../middleware/auth.middleware.js"
import mongoose from "mongoose"
import ledgerModel from "../models/ledger.model.js"
import emailService from "../service/email.service.js"
import userModel from "../models/user.model.js"
import config from "../config/config.js"

/*

Step 1: Validate request
Step 2: Validate idempotency key
Step 3: Check account status
Step 4: Derive sender balance from ledger
Step 5: Create transaction (PENDING)
Step 6: Create DEBIT ledger entry
Step 7: Create CREDIT ledger entry
Step 8: Mark transaction COMPLETED
Step 9: Commit MongoDB session
Step 10: Send email notification

*/
const transactionController = async()=>{

    /**
     * validate reqruest
     */

    const {fromAccount,toAccount,amount,idempotencyKey} = req.body
    if(!fromAccount || !toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message:"fromAccount , toAccount , amount , idempotencyKey all are required"
        })
    }
    const fromUserAccount = await accountModel.findOne({
        _id:fromAccount
    })
     const toUserAccount = await accountModel.findOne({
        _id:toAccount
    })
    if(!fromUserAccount || !toUserAccount){
        return res.json(400).json({
            message:"fromUserAccount and fromToAccount Invalid"
        })
    }
    /**
     * Validate idempotency key
     */
    const ifTransactionExist = await transactionModel.findOne({
        idempotencyKey:idempotencyKey
    })
    if(ifTransactionExist.status=="PENDING"){
        return res.status(200).json({
            message:"transcation is processing"
        })
    }
    if(ifTransactionExist.status=="COMPLETED"){
        return res.status(200).json({
            message:"trasaction is completed",
            ifTransactionExist
        })
    }
    if(ifTransactionExist.status=="FAILED"){
      return  res.status(500).json({
            message:"previous message is failed ,plz try again"
        })
    }
    if(ifTransactionExist.status=="REVERSED"){
       return res.status(500).json({
            message:"trasaction is reversed "
        })
    }


    /**
     * Check account status
     */
    // userEmail, name, amount, toAccount

    if(fromUserAccount.status!=="ACTIVE" || toUserAccount.status!=="ACTIVE"){
    res.status(400).json({
    message:"one of them acount is not active"
   })

   /**
    * Derive sender balance from ledger
    */

   const balance = await fromUserAccount.getBalance()
   if(balance<amount){
     res.status(400).json({
        message:` insufficient balance , your balance is ${balance} and your transfer amount is ${amount} `
    })
   }
   const session = await mongoose.startSession()
   session.startTransaction()
   const transaction = await mongoose.transactionModel({
        fromAccount,toAccount,amount,idempotencyKey
   },{session})
   const creditLedgerEntry = await ledgerModel.create({
    account:toAccount,
    amount:amount,
    transaction:transaction._id,
    type:"CREDIT"
   },{session})
   const debitLedgerEntry = await ledgerModel.create({
    account:fromAccount,
    amount:amount,
    transaction:transaction._id,
    type:"DEBIT"
   },{session})

   transaction.status="COMPLETED"
   await transaction.save({session})
   await transaction.commitTransaction()
   session.endSession()

   /**
    *  end email notification
    */
                         // userEmail, name, amount, toAccount
   
   try{
    await emailService.sendTransactionEmail(req.user.email,req.user.name,transaction.amount,toUserAccount)
    res.status(201).json({
        message:"transaction successfully",
        transaction:transaction
    })
   }
   catch(err){
      await emailService.sendTransactionFailureEmail(req.user.email,req.user.name,transaction.amount,toUserAccount)
      res.status(500).json({
        message:"transcation faileed"
      })
   }

}
}
const createInitialFundTransfer = async(req,res)=>{
    console.log("MONGO URI:", config.MONGO_URI);
    const {toAccount, amount , idempotencyKey} = req.body
    if(!toAccount || !amount || !idempotencyKey){
      return  res.status(400).json({
            message:"amount,toAccount  and idempotency key reqruiered"
        })
    }
    
    const toUserAccount = await accountModel.findOne({
        _id:toAccount
    })
console.log("toAccount received:", toAccount);
console.log("toUserAccount:", toUserAccount);

    if(!toUserAccount){
       return res.status(400).json({
            message:"invalid account"
       
        })
    }
    const fromUserAccount =await accountModel.findOne({
        user:req.user._id
    })
    console.log("toAccount received:", toAccount);
console.log("toUserAccount2:", toUserAccount);

    if(!fromUserAccount){
       return res.status(400).json({
            message:"system user not found"
        })
    }
 
    const transaction = await transactionModel.create({
        fromAccount: fromUserAccount._id,
        toAccount,
        amount: Number(amount),
        idempotencyKey,
        status: "COMPLETED"
    });

    await ledgerModel.create({
        account: fromUserAccount._id,
        amount,
        transaction: transaction._id,
        type: "DEBIT"
    });

    await ledgerModel.create({
        account: toUserAccount._id,
        amount,
        transaction: transaction._id,
        type: "CREDIT"
    });

    res.status(200).json({
        message: `initial fund transferred, ${amount}`
    });
    
}

export default {
    transactionController,
    createInitialFundTransfer
};
