import 'dotenv/config';
import mongoose from "mongoose";
import { initGridFS } from "../utils/gridfs.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully");
    
    // Initialize GridFS
    initGridFS(conn.connection);
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;