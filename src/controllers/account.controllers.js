import accountModel from "../models/account.model.js";

const accountController = async(req,res)=>{
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
export default accountController ;