import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  destination: { type: mongoose.Schema.Types.ObjectId, ref: "Destination", required: true },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: "Provider", required: true },
  price: { type: Number, required: true },

}, { timestamps: true });

export const Activity = mongoose.model("Activity", activitySchema);