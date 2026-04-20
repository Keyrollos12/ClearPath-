import { Activity } from "../../db/models/Activity.model.js";

class ActivityService {
  // Create Activity
  async create(data) {
    return await Activity.create(data);
  }

  // Get All Activities (search + filters)
  async getAll(query) {
    const { search, type, destination, provider, price } = query;

    let filter = {};

    // Search by name
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    // Filters
    if (type) filter.type = type;
    if (destination) filter.destination = destination;
    if (provider) filter.provider = provider;

    if (price) {
      filter.price = Number(price);
    }

    return await Activity.find(filter)
      .populate("destination")
      .populate("provider");
  }

  // Get One Activity
  async getOne(id) {
    return await Activity.findById(id)
      .populate("destination")
      .populate("provider");
  }

  // Update Activity
  async update(id, data) {
    return await Activity.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  // Delete Activity
  async delete(id) {
    return await Activity.findByIdAndDelete(id);
  }
}

export default new ActivityService();