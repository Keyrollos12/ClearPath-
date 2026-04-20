import { Experience } from "../../db/models/experience.model.js";

class ExperienceService {

  // ➕ Create (Admin)
  async create(data) {
    return await Experience.create(data);
  }

  // 📋 Get All (SEARCH + FILTER + PAGINATION)
  async getAll(query) {
    const filter = {};

    // 🟢 Search by name
    if (query.search) {
      filter.name = {
        $regex: query.search,
        $options: "i",
      };
    }

    // 🟢 Filter by destination
    if (query.destination) {
      filter.destination = query.destination;
    }

    // 🟢 Filter by type (Trip / Package)
    if (query.type) {
      filter.type = query.type;
    }

    // 🟢 Filter by number of people (capacity لازم تكون في model)
    if (query.people) {
      filter.capacity = { $gte: Number(query.people) };
    }

    // 🟢 Filter by days (duration)
    if (query.days) {
      filter.duration_days = { $gte: Number(query.days) };
    }

    // 🔵 Pagination
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    // 🔵 Sort (optional)
    const sort = query.sort || "-createdAt"; // newest default

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

  // 🔍 Get One
  async getOne(id) {
    return await Experience.findById(id)
      .populate("destination")
      .populate("itinerary.activities.activity");
  }

  // ✏️ Update (Admin)
  async update(id, data) {
    return await Experience.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  // ❌ Delete
  async delete(id) {
    return await Experience.findByIdAndDelete(id);
  }
}

export default new ExperienceService();