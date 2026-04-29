import { Experience } from "../../db/models/experience.model.js";
import { Destination } from "../../db/models/destination.model.js";
import { Activity } from "../../db/models/Activity.model.js";
import { Provider } from "../../db/models/provider.model.js";

class ExperienceService {

  isObjectIdString(value) {
    return typeof value === "string" && value.length === 24 && /^[a-fA-F0-9]+$/.test(value);
  }

  async resolveDestination(destValue) {
    if (!destValue) return null;

    if (typeof destValue === "string") {
      if (this.isObjectIdString(destValue)) return destValue;
      let dest = await Destination.findOne({ name: destValue });
      if (!dest) {
        dest = await Destination.create({
          name: destValue,
          location: destValue,
          city: destValue
        });
      }
      return dest._id;
    }

    if (typeof destValue === "object") {
      let dest = await Destination.findOne({ name: destValue.name });
      if (!dest) {
        dest = await Destination.create({
          name: destValue.name,
          location: destValue.location || destValue.name,
          city: destValue.city || destValue.name,
          description: destValue.description || ""
        });
      }
      return dest._id;
    }

    return destValue;
  }

  async resolveProvider(providerValue) {
    if (!providerValue) return null;

    if (typeof providerValue === "string") {
      if (this.isObjectIdString(providerValue)) return providerValue;
      let provider = await Provider.findOne({ name: providerValue });
      if (!provider) {
        provider = await Provider.create({
          name: providerValue,
          type: "Guide",
          email: `${Date.now()}@test.com`,
          phone: "0000000000"
        });
      }
      return provider._id;
    }

    if (typeof providerValue === "object") {
      let provider = await Provider.findOne({ name: providerValue.name });
      if (!provider) {
        provider = await Provider.create({
          name: providerValue.name,
          type: providerValue.type || "Guide",
          email: providerValue.email || `${Date.now()}@test.com`,
          phone: providerValue.phone || "0000000000"
        });
      }
      return provider._id;
    }

    return providerValue;
  }

  async resolveActivity(activityValue, destinationId, providerId, price) {
    if (!activityValue) return null;

    if (typeof activityValue === "string") {
      if (this.isObjectIdString(activityValue)) return activityValue;
      let activity = await Activity.findOne({ name: activityValue });
      if (!activity) {
        activity = await Activity.create({
          name: activityValue,
          type: "tour",
          destination: destinationId,
          provider: providerId,
          price: price || 0
        });
      }
      return activity._id;
    }

    if (typeof activityValue === "object") {
      let activity = await Activity.findOne({ name: activityValue.name });
      if (!activity) {
        activity = await Activity.create({
          name: activityValue.name,
          type: activityValue.type || "tour",
          destination: destinationId,
          provider: providerId,
          price: activityValue.price || price || 0
        });
      }
      return activity._id;
    }

    return activityValue;
  }

  async create(data) {
    data.destination = await this.resolveDestination(data.destination);

    if (data.itinerary) {
      for (const day of data.itinerary) {
        if (!day.activities) continue;
        for (const act of day.activities) {
          if (!act) continue;
          act.provider = await this.resolveProvider(act.provider);
          act.activity = await this.resolveActivity(
            act.activity,
            data.destination,
            act.provider,
            act.price
          );
        }
      }
    }

    return await Experience.create(data);
  }

  async getAll(query) {
    const filter = {};

    if (query.search) {
      filter.name = {
        $regex: query.search,
        $options: "i",
      };
    }

    if (query.destination) {
      filter.destination = query.destination;
    }

    if (query.type) {
      filter.type = query.type;
    }

    if (query.people) {
      filter.capacity = { $gte: Number(query.people) };
    }

    if (query.days) {
      filter.duration_days = { $gte: Number(query.days) };
    }

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const sort = query.sort || "-createdAt";

    const data = await Experience.find(filter)
      .populate("destination")
      .populate("itinerary.activities.activity")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Experience.countDocuments(filter);

    return {
      results: data.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data,
    };
  }

  async getOne(id) {
    return await Experience.findById(id)
      .populate("destination")
      .populate("itinerary.activities.activity");
  }

  async update(id, data) {
    if (data.destination) {
      data.destination = await this.resolveDestination(data.destination);
    }

    if (data.itinerary) {
      for (const day of data.itinerary) {
        if (!day.activities) continue;
        for (const act of day.activities) {
          if (!act) continue;
          act.provider = await this.resolveProvider(act.provider);
          act.activity = await this.resolveActivity(
            act.activity,
            data.destination,
            act.provider,
            act.price
          );
        }
      }
    }

    return await Experience.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id) {
    return await Experience.findByIdAndDelete(id);
  }
}

export default new ExperienceService();
