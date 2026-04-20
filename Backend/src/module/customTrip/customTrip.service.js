import { CustomTrip } from "../../db/models/customtrip.model.js";
import { Experience } from "../../db/models/experience.model.js";

class CustomTripService {

  // =========================
  // ➕ CREATE FROM EXPERIENCE
  // =========================
  async create(userId, experienceId) {
    const exp = await Experience.findById(experienceId);

    if (!exp) throw new Error("Experience not found");

    // prevent duplicate
    const existing = await CustomTrip.findOne({
      user: userId,
      experience: experienceId,
    });

    if (existing) return existing;

    return await CustomTrip.create({
      user: userId,
      experience: experienceId,
      itinerary: exp.itinerary,
      extra_activities: [],
    });
  }

  // =========================
  // 📋 GET USER TRIPS
  // =========================
  async getUserTrips(userId) {
    return await CustomTrip.find({ user: userId })
      .populate("experience")
      .populate("itinerary.activities.activity")
      .populate("extra_activities.activity");
  }

  // =========================
  // 🔍 GET ONE TRIP
  // =========================
  async getOne(id) {
    return await CustomTrip.findById(id)
      .populate("experience")
      .populate("itinerary.activities.activity")
      .populate("extra_activities.activity");
  }

  // =========================
  // 🧠 GET FINAL TRIP (IMPORTANT 🔥)
  // لو مفيش تعديل → Experience
  // لو فيه تعديل → CustomTrip
  // =========================
  async getFinalTrip(userId, experienceId) {

    const custom = await CustomTrip.findOne({
      user: userId,
      experience: experienceId,
    })
      .populate("experience")
      .populate("itinerary.activities.activity")
      .populate("extra_activities.activity");

    // 🔵 NO CUSTOMIZATION → return experience
    if (!custom) {
      const exp = await Experience.findById(experienceId)
        .populate("destination")
        .populate("itinerary.activities.activity");

      if (!exp) throw new Error("Experience not found");

      return {
        source: "experience",
        data: exp,
      };
    }

    // 🔥 CUSTOM TRIP → calculate final result
    let total = 0;

    const finalItinerary = [];

    custom.itinerary.forEach(day => {

      if (day.status === "removed") return;

      const activities = [];

      day.activities.forEach(act => {
        if (act.status === "active") {
          activities.push(act);
          total += act.price;
        }
      });

      finalItinerary.push({
        day_number: day.day_number,
        activities,
      });
    });

    const extras = [];

    custom.extra_activities.forEach(act => {
      if (act.status === "active") {
        extras.push(act);
        total += act.price;
      }
    });

    return {
      source: "customTrip",
      data: {
        _id: custom._id,
        user: custom.user,
        experience: custom.experience,
        itinerary: finalItinerary,
        extra_activities: extras,
        total_price: total,
      },
    };
  }

  // =========================
  // ➕ ADD ACTIVITY TO DAY
  // =========================
  async addActivity(tripId, dayNumber, activityObj) {
    const trip = await CustomTrip.findById(tripId);

    if (!trip) throw new Error("Trip not found");

    let day = trip.itinerary.find(d => d.day_number === dayNumber);

    if (!day) {
      day = {
        day_number: dayNumber,
        activities: [],
        status: "active",
      };
      trip.itinerary.push(day);
    }

    day.activities.push({
      ...activityObj,
      status: "active",
    });

    await trip.save();
    return trip;
  }

  // =========================
  // ❌ REMOVE ACTIVITY
  // =========================
  async removeActivity(tripId, dayNumber, activityId) {
    const trip = await CustomTrip.findById(tripId);

    if (!trip) throw new Error("Trip not found");

    const day = trip.itinerary.find(d => d.day_number === dayNumber);

    if (!day) return trip;

    const activity = day.activities.find(
      a => a.activity.toString() === activityId.toString()
    );

    if (activity) {
      activity.status = "removed";
    }

    await trip.save();
    return trip;
  }

  // =========================
  // ❌ REMOVE DAY
  // =========================
  async removeDay(tripId, dayNumber) {
    const trip = await CustomTrip.findById(tripId);

    if (!trip) throw new Error("Trip not found");

    const day = trip.itinerary.find(d => d.day_number === dayNumber);

    if (day) {
      day.status = "removed";
    }

    await trip.save();
    return trip;
  }

  // =========================
  // ➕ ADD EXTRA ACTIVITY
  // =========================
  async addExtraActivity(tripId, activityObj) {
    const trip = await CustomTrip.findById(tripId);

    if (!trip) throw new Error("Trip not found");

    trip.extra_activities.push({
      ...activityObj,
      status: "active",
    });

    await trip.save();
    return trip;
  }

  // =========================
  // ❌ REMOVE EXTRA ACTIVITY
  // =========================
  async removeExtraActivity(tripId, activityId) {
    const trip = await CustomTrip.findById(tripId);

    if (!trip) throw new Error("Trip not found");

    const act = trip.extra_activities.find(
      a => a.activity.toString() === activityId.toString()
    );

    if (act) {
      act.status = "removed";
    }

    await trip.save();
    return trip;
  }
}

export default new CustomTripService();