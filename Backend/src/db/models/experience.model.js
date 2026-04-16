import mongoose from "mongoose";

const activityItemSchema = new mongoose.Schema({
  activity: { type: mongoose.Schema.Types.ObjectId, ref: "Activity", required: true },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: "Provider", required: true },
  price: { type: Number, required: true },
}, { _id: false });

const itineraryDaySchema = new mongoose.Schema({
  day_number: { type: Number, required: true },
  activities: [activityItemSchema],
}, { _id: false });

const experienceSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, enum: ["Trip", "Package"], required: true },
  description: { type: String, trim: true },
  duration_days: { type: Number, required: true },
  base_price: { type: Number, required: true },
  destination: { type: mongoose.Schema.Types.ObjectId, ref: "Destination", required: true },
  itinerary: [itineraryDaySchema],
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

experienceSchema.virtual("calculatedPrice").get(function() {
  let total = this.base_price;
  this.itinerary.forEach(day => {
    day.activities.forEach(act => {
      total += act.price;
    });
  });
  return total;
});

export const Experience = mongoose.model("Experience", experienceSchema);