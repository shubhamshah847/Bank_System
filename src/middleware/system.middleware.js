import userModel from "../models/user.model.js"
import jwt from 'jsonwebtoken'
import config from "../config/config.js"
const systemMiddleware =async(req,res,next)=>{
    const {token} = req.cookies
    if(!token){
        res.json(401).json({
            message:"unauthorized system user"
        })
    }
    try{
    const decoded = jwt.verify(token,config.JWT_SECRET_KEY)
    console.log(decoded)
    const user = await userModel.findOne({
        _id:decoded.id
    }).select('+systemUser')
    console.log("user",user)
    if(!user){
        return res.status(403).json({
            message:"user not exist"
        })
    }
    console.log("user:",user)

    if(!user.systemUser){
      return  res.status(403).json({
            message:"forbidden access, you are not a admin"
        })
    }

    req.user=user;
    next()
    }
    catch(err){
        console.log(err)
        res.status(500).json({
            message:"unauthorized system user"
        })
    }
}
export default systemMiddleware ;