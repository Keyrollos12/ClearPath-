import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ["Credit Card", "PayPal", "Bank Transfer"], required: true },
  status: { type: String, enum: ["Pending", "Completed", "Failed"], default: "Pending" },
  payment_date: { type: Date, default: Date.now },
  paypalOrderId: { type: String },
  paypalCaptureId: { type: String },

}, { timestamps: true });

export const Payment = mongoose.model("Payment", paymentSchema);
