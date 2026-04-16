import mongoose from "mongoose";

const providerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, enum: ["Guide","Transport","Equipment","TourOperator"], required: true },
}, { timestamps: true });

export const Provider = mongoose.model("Provider", providerSchema);