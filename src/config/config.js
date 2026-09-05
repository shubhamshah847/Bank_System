import dotenv from "dotenv";
dotenv.config()
if(!process.env.MONGO_URI){
    throw new Error("MONGO_URI is required")
}
if(!process.env.JWT_SECRET_KEY){
    throw new Error("JWT_SECRET_KEY is required")
}

const config ={
    MONGO_URI:process.env.MONGO_URI,
    JWT_SECRET_KEY:process.env.JWT_SECRET_KEY
}
export default config ;