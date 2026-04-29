import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  // يمكن الحجز على Experience مباشرة أو على CustomTrip معدل
  experience: { type: mongoose.Schema.Types.ObjectId, ref: "Experience" },
  customTrip: { type: mongoose.Schema.Types.ObjectId, ref: "CustomTrip" },
  booking_date: { type: Date, default: Date.now },
  travel_date: { type: Date },
  total_amount: { type: Number },
  status: { type: String, enum: ["Confirmed", "Pending", "Cancelled"], default: "Pending" },
  booking_type: { type: String, enum: ["Trip", "Package"] }
}, { timestamps: true });

// Validation: لازم يكون في experience أو customTrip على الأقل
bookingSchema.pre("validate", function(next) {
  if (!this.experience && !this.customTrip) {
    return next(new Error("Booking must have either an experience or a customTrip"));
  }
  next();
});

// Middleware: قبل الحفظ، نحسب السعر
bookingSchema.pre("save", async function(next) {
  if (this.isModified("total_amount") && this.total_amount > 0) {
    return next();
  }

  if (this.customTrip) {
    const customTrip = await mongoose.model("CustomTrip").findById(this.customTrip);
    if (!customTrip) return next(new Error("CustomTrip not found"));
    this.total_amount = customTrip.total_price || 0;
  } else if (this.experience) {
    const exp = await mongoose.model("Experience").findById(this.experience);
    if (!exp) return next(new Error("Experience not found"));
    this.total_amount = exp.calculatedPrice || exp.base_price || 0;
  }

  next();
});

export const Booking = mongoose.model("Booking", bookingSchema);
