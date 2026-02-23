// db/token.model.js
import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  type: { type: String, enum: ["access", "refresh"], required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 } // ينتهي بعد 24 ساعة تلقائي
});

const Token = mongoose.model("Token", tokenSchema);
export default Token;