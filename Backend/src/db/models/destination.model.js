import mongoose from "mongoose";

const destinationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  location: { type: String, required: true },
  city: { type: String, required: true },
  description: { type: String }
}, { timestamps: true });

export const Destination = mongoose.model("Destination", destinationSchema);

