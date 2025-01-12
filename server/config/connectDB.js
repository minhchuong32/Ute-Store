import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.MONGODB_URI) {
    throw new Error("Vui lòng cung cấp chuỗi kết nối MongoDB");
}

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Kết nối MongoDB thành công");
    } catch (error) {
        console.log("Kết nối MongoDB thất bại", error);
        process.exit(1);
    }
}

export default connectDB;
