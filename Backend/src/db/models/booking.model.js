import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  customTrip: { type: mongoose.Schema.Types.ObjectId, ref: "CustomTrip", required: true },
  booking_date: { type: Date, default: Date.now },
  total_amount: { type: Number, required: true }, // هنا هيتحسب
  status: { type: String, enum: ["Confirmed","Pending","Cancelled"], default: "Pending" }
}, { timestamps: true });

// Middleware: قبل الحفظ، نحسب السعر
bookingSchema.pre("save", async function(next) {
  if (!this.total_amount) {
    // جلب الـ CustomTrip مع الـ Experience
    const customTrip = await mongoose.model("CustomTrip").findById(this.customTrip)
      .populate("experience");

    if (!customTrip) return next(new Error("CustomTrip not found"));

    // لو في تعديل، نستخدم السعر المحسوب
    this.total_amount = customTrip.total_price || customTrip.experience.base_price;
  }

  next();
});

export const Booking = mongoose.model("Booking", bookingSchema);