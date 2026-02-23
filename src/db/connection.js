import mongoose from "mongoose";
import { devConfig } from "../config/env/dev.config.js"; 

export const connectDB = async () => {
  try {
    await mongoose.connect(devConfig.DB_URL); 
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Database connection error:", error);
  }
};