import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  experiences: [{ type: mongoose.Schema.Types.ObjectId, ref: "Experience" }],
  created_at: { type: Date, default: Date.now }
});

export const Wishlist = mongoose.model("Wishlist", wishlistSchema);