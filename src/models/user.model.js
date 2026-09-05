import mongoose from "mongoose";
import bcrypt from 'bcrypt'
const userSchema =new mongoose.Schema({
    name:{
        type:String,
        required:[true,"name is required"],
    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:[true,"email already exists "],
        trim:true,
        lowercase:true,
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"email is not valid"]
    },
    password:{
        type:String,
        required:[true,"password is required"],
        minlength:[6,"password should contain 6 letters"],
        select:true
    },
    systemUser:{
        type:Boolean,
        default:false,
        select:false,
        immutable:true
    }
},{
    timestamps:true
})
userSchema.pre('save',async function () {
    if(!this.isModified('password')){
        return 
    }
    const hashPassword = await bcrypt.hash(this.password,10)
    this.password=hashPassword;
})
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password,this.password)
}
const userModel = mongoose.model("user",userSchema)

export default userModel;