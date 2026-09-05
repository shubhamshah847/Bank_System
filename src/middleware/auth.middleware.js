import jwt from 'jsonwebtoken'
import userModel from '../models/user.model.js'
import config from '../config/config.js'

const authMiddleware = async(req,res,next)=>{
    
    const token = req.cookies?.token;    /* If req.cookies exists, give me 
                                            its token. If it doesn't exist, just 
                                           return undefined instead of 
                                              throwing an error.
                                              */
    if(!token){
        return res.status(401).json({
            message:"user not unauthorized "
        })
    }
    try{
        const decoded = jwt.verify(token,config.JWT_SECRET_KEY)
        const user = await userModel.findById(decoded.id)
        req.user=user
        return next()
    }
    catch(err){
        res.status(401).json({
           message:"unauthorized access"
        })
    }
}
export default authMiddleware ;