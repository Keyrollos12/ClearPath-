import mongoose from "mongoose";

const activityItemSchema = new mongoose.Schema(
  {
    activity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Activity",
      required: true,
    },

    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider",
    },

    price: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const itineraryDaySchema = new mongoose.Schema(
  {
    day_number: {
      type: Number,
      required: true,
    },

    activities: [activityItemSchema],
  },
  { _id: false }
);

const experienceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["Trip", "Package"],
      required: true,
    },

    description: {
      type: String,
      trim: true,
    },

    duration_days: {
      type: Number,
      required: true,
    },

    base_price: {
      type: Number,
      required: true,
    },

    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination",
      required: true,
    },

    // 💣 جديد (للسيرش والحجز)
    capacity: {
      type: Number,
      default: 10,
    },

    availableDates: [
      {
        date: Date,
        availableSeats: Number,
      },
    ],

    itinerary: [itineraryDaySchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);



// calculatedPrice (محسن)

experienceSchema.virtual("calculatedPrice").get(function () {
  let total = this.base_price;

  if (!this.itinerary) return total;

  this.itinerary.forEach((day) => {
    if (day.activities) {
      day.activities.forEach((act) => {
        total += act.price || 0;
      });
    }
  });

  return total;
});

export const Experience = mongoose.model("Experience", experienceSchema);