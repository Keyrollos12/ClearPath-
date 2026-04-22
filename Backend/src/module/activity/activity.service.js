import { Activity } from "../../db/models/Activity.model.js";
import { Destination } from "../../db/models/destination.model.js";
import { Provider } from "../../db/models/provider.model.js";
import * as AppError from "../../utils/error/index.js";
import "../../db/models/destination.model.js";
import "../../db/models/provider.model.js";

class ActivityService {
  async validateRelations({ destination, provider }) {
    if (destination) {
      const destinationExists = await Destination.exists({ _id: destination });
      if (!destinationExists) {
        throw new AppError.BadRequestException("Destination not found");
      }
    }

    if (provider) {
      const providerExists = await Provider.exists({ _id: provider });
      if (!providerExists) {
        throw new AppError.BadRequestException("Provider not found");
      }
    }
  }

  // Create Activity
  async create(data) {
    await this.validateRelations(data);
    return await Activity.create(data);
  }

  // Get All Activities (search + filters)
  async getAll(query) {
    const { search, type, destination, provider, minPrice, maxPrice } = query;

    const filter = {};

    // Search by name
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    // Filters
    if (type) filter.type = type;
    if (destination) filter.destination = destination;
    if (provider) filter.provider = provider;

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
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
    await this.validateRelations(data);
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