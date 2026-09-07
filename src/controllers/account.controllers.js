import accountModel from "../models/account.model.js";

const accountCreateController = async(req,res)=>{
    const user = req.user
    try {
        const account = await accountModel.create({
            user:user._id

        })
        res.status(200).json({
            message:"account created",
            account
        })
    } catch (err) {
        console.log('account:',err)
        res.status(400).json({
            message:"account not created"

        })
    }
}
const userAcountGet = async(req,res)=>{
    try{
    const account = await accountModel.find({
        user:req.user._id
    })
    res.status(200).json({
        account
    })
  
}
catch(err){
    res.status(500).json({
        message:"something went wrong"
    })
}
}
const getAccountBalance = async(req,res)=>{
    const {accountId} = req.params
    if(!accountId){
       return res.status(401).json({
            message:"account id is missing"
        })
    }
    try{
    const account = await accountModel.findOne({
        _id:accountId,
        user:req.user._id
    })
    const balance = await account.getBalance()
    res.status(200).json({
       
        message:`your balance is ${balance}`
    })
}
catch(err){
    console.log(err)
    res.status(500).json({
        message:"sorry something went wrong"
        
    })
}

}
export default {
    accountCreateController,userAcountGet,getAccountBalance
}