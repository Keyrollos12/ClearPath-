import mongoose from "mongoose";

const destinationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  location: { type: String },
  
  description: { type: String }
}, { timestamps: true });

export const Destination = mongoose.model("Destination", destinationSchema);