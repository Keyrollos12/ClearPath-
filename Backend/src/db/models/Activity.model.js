import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
      type: String,
      enum: ["tour", "entertainment", "hiking", "hotel", "food"],
      required: true
    },
  destination: { type: mongoose.Schema.Types.ObjectId, ref: "Destination", required: true },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: "Provider", required: true },
  price: { type: Number, required: true },
  duration: Number,
   isAvailable: {
      type: Boolean,
      default: true,
    },

}, { timestamps: true });

export const Activity = mongoose.model("Activity", activitySchema);