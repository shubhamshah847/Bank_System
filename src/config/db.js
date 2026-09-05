import mongoose from "mongoose";
import config from "./config.js";
const connectToDb =async () => {
    try {
        await mongoose.connect(config.MONGO_URI)
        console.log("connected to db")
    } catch (error) {
        console.log("db connection error:",error)
        process.exit(1)
    }
    
}
export default connectToDb;
