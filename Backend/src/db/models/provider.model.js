import mongoose from "mongoose";

const providerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, enum: ["Guide","Transport","Equipment","TourOperator"], required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true },
  address: { type: String },
  description: { type: String },
  image: { type: String }, // provider logo or image path
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

export const Provider = mongoose.model("Provider", providerSchema);