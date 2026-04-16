import mongoose from "mongoose";
import { Experience } from "./experience.model.js";
import { User } from "./user.model.js";

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  experience: { type: mongoose.Schema.Types.ObjectId, ref: "Experience", required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
  isVerifiedBooking: { type: Boolean, default: false } 
}, { timestamps: true });

export const Review = mongoose.model("Review", reviewSchema);