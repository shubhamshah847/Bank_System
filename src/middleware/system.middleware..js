import userModel from "../models/user.model.js"
import jwt from 'jsonwebtoken'
import config from "../config/config.js"
const systemMiddleware =async(req,res,next)=>{
    const {token} = req.cookies
    if(!token){
        res.json(409).json({
            message:"unauthorized system user"
        })
    }
    const decoded = jwt.verify(token,config.JWT_SECRET_KEY)
    const User = await userModel.findOne({
        id:decoded._id
    })
    if(!User.systemUser){
      return  res.status(403).json({
            message:"forbidden access, you are not a admin"
        })
    }
    req.user=user;
    next()
}
export default systemMiddleware ;