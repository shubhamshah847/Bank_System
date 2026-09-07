import config from "../config/config.js"
import userModel from "../models/user.model.js"
import emailService from "../service/email.service.js"
import jwt from 'jsonwebtoken'
export const userRegister = async(req,res)=>{
    const {name,email,password} = req.body
    const isExist = await userModel.findOne({
        email
    }).select("+password")
    if(isExist){
      return  res.status(422).json({
            message:"user already exist",
            status:"failed"
        })
    }
    try{
   const user = await userModel.create({
        name,email,password
    })
    const token = jwt.sign({
        id:user._id
    },config.JWT_SECRET_KEY,{
        expiresIn: "7d"
    })
    res.cookie('token',token)
   
   try{
    await emailService.sendRegisterationEmail(user.email,user.name)
    console.log("email is send")
   }
   catch(err){
    console.log(err)
   }
    res.status(201).json({
    message:"user created successfully"
   })

   
}
    catch(err){
    console.log(err)
    res.status(400).json({
        message:err
    })
}

}
export const userLogin = async(req,res)=>{
    const {email,password} = req.body

    if(!email || !password){
        return res.status(400).json({
            message:"email and password required"
        })
    }
    try {
        const user = await userModel.findOne({
        email
    })
    if(!user){
        return res.status(400).json({
            message:"email or password wrong"
        })
    }

  //  const isPasswordValid = await user.comparePassword(password)
   /* if(!isPasswordValid){
        return res.status(404).json({
            message:"password wrong"
        })
    }
    */

    const token = jwt.sign({
        id:user._id
    },config.JWT_SECRET_KEY,{
        expiresIn:"7d"
    })
    res.cookie('token',token)
    res.status(200).json({
        message:"user login successfully"
    
    })
    } catch (error) {
        console.log(error)
        return res.status(404).json({
           messgae:"something went wrong"
        }) 
    }
    

}
