import { CustomTrip } from "../../db/models/customtrip.model.js";
import { Experience } from "../../db/models/experience.model.js";

class CustomTripService {
  toCustomDayFromExperience(day) {
    return {
      day_number: day.day_number,
      isRemoved: false,
      activities: (day.activities || []).map((act) => ({
        activity: act.activity,
        provider: act.provider,
        price: act.price,
        isAdded: false,
        isRemoved: false,
      })),
    };
  }

  getActiveDayActivities(day) {
    return (day.activities || []).filter((act) => !act.isRemoved);
  }

  getActiveExtraActivities(trip) {
    return (trip.added_activities || []).filter((act) => !act.isRemoved);
  }

  getBookingTypeByDays(daysCount) {
    return daysCount > 1 ? "Package" : "Trip";
  }

  hasCustomChanges(trip) {
    const hasDayRemoved = (trip.customized_itinerary || []).some((day) => day.isRemoved);
    const hasDayActivityChanges = (trip.customized_itinerary || []).some((day) =>
      (day.activities || []).some((act) => act.isAdded || act.isRemoved)
    );
    const hasExtraChanges = (trip.added_activities || []).some(
      (act) => act.isAdded || act.isRemoved
    );

    return hasDayRemoved || hasDayActivityChanges || hasExtraChanges;
  }

  // Helper: Calculate final trip representation
  buildFinalTrip(trip) {
    let total = trip.base_price || 0;
    const finalItinerary = [];

    (trip.customized_itinerary || []).forEach(day => {
      if (day.isRemoved) return;
      const activities = [];
      (day.activities || []).forEach(act => {
        if (!act.isRemoved) {
          activities.push(act);
          total += act.price || 0;
        }
      });
      if (activities.length > 0 || !day.isRemoved) {
        finalItinerary.push({
          day_number: day.day_number,
          activities,
        });
      }
    });

    const extras = [];
    (trip.added_activities || []).forEach(act => {
      if (!act.isRemoved) {
        extras.push(act);
        total += act.price || 0;
      }
    });

    const bookingType = this.getBookingTypeByDays(finalItinerary.length);

    return {
      _id: trip._id,
      user: trip.user,
      experience: trip.experience,
      base_price: trip.base_price,
      final_itinerary: finalItinerary,
      extra_activities: extras,
      total_price: total,
      booking_type: bookingType,
      createdAt: trip.createdAt,
      updatedAt: trip.updatedAt,
    };
  }

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
      base_price: exp.base_price || 0,
      customized_itinerary: (exp.itinerary || []).map((day) =>
        this.toCustomDayFromExperience(day)
      ),
      added_activities: [],
      total_price: exp.base_price || 0,
    });
  }

  // =========================
  // 👁️ PREVIEW TRIP WITH ALL CHANGES
  // بتعرض كل حاجة: المحذوفة والمضافة والمعدلة
  // =========================
  buildPreview(trip) {
    const itinerary = (trip.customized_itinerary || []).map(day => ({
      day_number: day.day_number,
      isRemoved: day.isRemoved,
      activities: (day.activities || []).map(act => ({
        activity: act.activity,
        provider: act.provider,
        price: act.price,
        isAdded: act.isAdded,
        isRemoved: act.isRemoved,
      })),
    }));

    const extras = (trip.added_activities || []).map(act => ({
      activity: act.activity,
      provider: act.provider,
      price: act.price,
      isAdded: act.isAdded,
      isRemoved: act.isRemoved,
    }));

    // إحصائيات التعديلات
    const removedDays = (trip.customized_itinerary || []).filter(d => d.isRemoved).length;
    const addedDays = (trip.customized_itinerary || []).filter(d =>
      (d.activities || []).some(a => a.isAdded)
    ).length;
    const removedActivities = (trip.customized_itinerary || []).reduce((acc, day) =>
      acc + (day.activities || []).filter(a => a.isRemoved).length, 0
    );
    const addedActivities = (trip.customized_itinerary || []).reduce((acc, day) =>
      acc + (day.activities || []).filter(a => a.isAdded).length, 0
    );
    const extraActivities = (trip.added_activities || []).filter(a => !a.isRemoved).length;

    return {
      _id: trip._id,
      user: trip.user,
      experience: trip.experience,
      base_price: trip.base_price,
      customized_itinerary: itinerary,
      added_activities: extras,
      total_price: trip.total_price,
      changes_summary: {
        removed_days: removedDays,
        added_days: addedDays,
        removed_activities: removedActivities,
        added_activities: addedActivities,
        extra_activities: extraActivities,
      },
      createdAt: trip.createdAt,
      updatedAt: trip.updatedAt,
    };
  }

  async getPreview(id) {
    const trip = await CustomTrip.findById(id)
      .populate("experience")
      .populate("experience.destination")
      .populate("customized_itinerary.activities.activity")
      .populate("added_activities.activity");

    if (!trip) return null;

    return this.buildPreview(trip);
  }

  // =========================
  // 📋 GET USER TRIPS (FINAL)
  // =========================
  async getUserTrips(userId) {
    const trips = await CustomTrip.find({ user: userId })
      .populate("experience")
      .populate("experience.destination")
      .populate("customized_itinerary.activities.activity")
      .populate("added_activities.activity");

    return trips.map(trip => this.buildFinalTrip(trip));
  }

  // =========================
  // 🔍 GET ONE TRIP (FINAL)
  // =========================
  async getOne(id) {
    const trip = await CustomTrip.findById(id)
      .populate("experience")
      .populate("experience.destination")
      .populate("customized_itinerary.activities.activity")
      .populate("added_activities.activity");

    if (!trip) return null;

    return this.buildFinalTrip(trip);
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
      .populate("experience.destination")
      .populate("customized_itinerary.activities.activity")
      .populate("added_activities.activity");

    // 🔵 NO CUSTOM TRIP DOC → return experience
    if (!custom) {
      const exp = await Experience.findById(experienceId)
        .populate("destination")
        .populate("itinerary.activities.activity");

      if (!exp) throw new Error("Experience not found");

      const daysCount = (exp.itinerary || []).length;
      const bookingType = this.getBookingTypeByDays(daysCount);

      return {
        source: "experience",
        data: {
          ...exp.toObject(),
          booking_type: bookingType,
        },
      };
    }

    // لو فيه CustomTrip لكن بدون أي تعديل حقيقي، نرجّع Experience كما هي للحجز
    if (!this.hasCustomChanges(custom)) {
      const exp = await Experience.findById(experienceId)
        .populate("destination")
        .populate("itinerary.activities.activity");

      if (!exp) throw new Error("Experience not found");

      const daysCount = (exp.itinerary || []).length;
      const bookingType = this.getBookingTypeByDays(daysCount);

      return {
        source: "experience",
        data: {
          ...exp.toObject(),
          booking_type: bookingType,
        },
      };
    }

    // 🔥 CUSTOM TRIP → calculate final result
    let total = custom.base_price || 0;

    const finalItinerary = [];

    custom.customized_itinerary.forEach(day => {
      if (day.isRemoved) return;

      const activities = [];

      (day.activities || []).forEach(act => {
        if (!act.isRemoved) {
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

    (custom.added_activities || []).forEach(act => {
      if (!act.isRemoved) {
        extras.push(act);
        total += act.price;
      }
    });

    const bookingType = this.getBookingTypeByDays(finalItinerary.length);

    return {
      source: "customTrip",
      data: {
        _id: custom._id,
        user: custom.user,
        experience: custom.experience,
        base_price: custom.base_price,
        itinerary: finalItinerary,
        extra_activities: extras,
        total_price: total,
        booking_type: bookingType,
      },
    };
  }

  // =========================
  // ➕ ADD ACTIVITY TO DAY
  // =========================
  async addActivity(tripId, dayNumber, activityObj) {
    const trip = await CustomTrip.findById(tripId);

    if (!trip) throw new Error("Trip not found");

    let day = trip.customized_itinerary.find((d) => d.day_number === dayNumber);

    if (!day) {
      day = {
        day_number: dayNumber,
        activities: [],
        isRemoved: false,
      };
      trip.customized_itinerary.push(day);
    }

    day.activities.push({
      activity: activityObj.activity,
      provider: activityObj.provider,
      price: activityObj.price,
      isAdded: true,
      isRemoved: false,
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

    const day = trip.customized_itinerary.find((d) => d.day_number === dayNumber);

    if (!day) return trip;

    const activity = day.activities.find(
      a => a.activity.toString() === activityId.toString()
    );

    if (activity) {
      activity.isRemoved = true;
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

    const day = trip.customized_itinerary.find((d) => d.day_number === dayNumber);

    if (day) {
      day.isRemoved = true;
    }

    await trip.save();
    return trip;
  }

  // =========================
  // ➕ ADD DAY
  // =========================
  async addDay(tripId, dayNumber, activities = []) {
    const trip = await CustomTrip.findById(tripId);

    if (!trip) throw new Error("Trip not found");

    // Check if day already exists
    const existingDay = trip.customized_itinerary.find((d) => d.day_number === dayNumber);
    if (existingDay && !existingDay.isRemoved) {
      throw new Error("Day already exists");
    }

    if (existingDay) {
      existingDay.isRemoved = false;
      existingDay.activities = activities.map(act => ({
        activity: act.activity,
        provider: act.provider,
        price: act.price,
        isAdded: true,
        isRemoved: false,
      }));
    } else {
      trip.customized_itinerary.push({
        day_number: dayNumber,
        activities: activities.map(act => ({
          activity: act.activity,
          provider: act.provider,
          price: act.price,
          isAdded: true,
          isRemoved: false,
        })),
        isRemoved: false,
      });
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

    trip.added_activities.push({
      activity: activityObj.activity,
      provider: activityObj.provider,
      price: activityObj.price,
      isAdded: true,
      isRemoved: false,
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

    const act = trip.added_activities.find(
      a => a.activity.toString() === activityId.toString()
    );

    if (act) {
      act.isRemoved = true;
    }

    await trip.save();
    return trip;
  }

  // =========================
  // ❌ DELETE CUSTOM TRIP
  // =========================
  async delete(tripId, userId) {
    const trip = await CustomTrip.findOneAndDelete({ _id: tripId, user: userId });

    if (!trip) throw new Error("Trip not found or unauthorized");

    return trip;
  }

  // =========================
  // 🔄 RESTORE DAY
  // =========================
  async restoreDay(tripId, dayNumber) {
    const trip = await CustomTrip.findById(tripId);

    if (!trip) throw new Error("Trip not found");

    const day = trip.customized_itinerary.find((d) => d.day_number === dayNumber);

    if (day) {
      day.isRemoved = false;
    }

    await trip.save();
    return trip;
  }

  // =========================
  // 🔄 RESTORE ACTIVITY
  // =========================
  async restoreActivity(tripId, dayNumber, activityId) {
    const trip = await CustomTrip.findById(tripId);

    if (!trip) throw new Error("Trip not found");

    const day = trip.customized_itinerary.find((d) => d.day_number === dayNumber);

    if (!day) return trip;

    const activity = day.activities.find(
      a => a.activity.toString() === activityId.toString()
    );

    if (activity) {
      activity.isRemoved = false;
    }

    await trip.save();
    return trip;
  }

  // =========================
  // 🔄 RESTORE EXTRA ACTIVITY
  // =========================
  async restoreExtraActivity(tripId, activityId) {
    const trip = await CustomTrip.findById(tripId);

    if (!trip) throw new Error("Trip not found");

    const act = trip.added_activities.find(
      a => a.activity.toString() === activityId.toString()
    );

    if (act) {
      act.isRemoved = false;
    }

    await trip.save();
    return trip;
  }
}

export default new CustomTripService();
