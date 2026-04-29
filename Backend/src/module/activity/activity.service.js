import { Activity } from "../../db/models/Activity.model.js";
import { Destination } from "../../db/models/destination.model.js";
import { Provider } from "../../db/models/provider.model.js";
import * as AppError from "../../utils/error/index.js";

class ActivityService {

  // =========================
  // Validate Relations
  // =========================
  async validateRelations({ destination, provider }) {
    let destinationId = destination;
    let providerId = provider;

    // ===== Destination =====
    if (destination && typeof destination === "object" && !Array.isArray(destination)) {
      const existingDest = await Destination.findOne({
        name: destination.name,
      });

      if (existingDest) {
        destinationId = existingDest._id;
      } else {
        const dest = await Destination.create(destination);
        destinationId = dest._id;
      }
    } else if (destination) {
      const exists = await Destination.exists({ _id: destination });

      if (!exists) {
        throw new AppError.BadRequestException("Destination not found");
      }
    }

    // ===== Provider =====
    if (provider && typeof provider === "object" && !Array.isArray(provider)) {
      const existingProv = await Provider.findOne({
        $or: [
          { email: provider.email },
          { name: provider.name }
        ]
      });

      if (existingProv) {
        providerId = existingProv._id;
      } else {
        const prov = await Provider.create(provider);
        providerId = prov._id;
      }
    } else if (provider) {
      const exists = await Provider.exists({ _id: provider });

      if (!exists) {
        throw new AppError.BadRequestException("Provider not found");
      }
    }

    return { destinationId, providerId };
  }

  // =========================
  // CREATE (with duplicate check)
  // =========================
  async create(data) {
    const { destinationId, providerId } =
      await this.validateRelations(data);

    // 🔴 Duplicate Check
    const existingActivity = await Activity.findOne({
      name: data.name,
      type: data.type,
      destination: destinationId,
      provider: providerId,
    });

    if (existingActivity) {
      throw new AppError.BadRequestException(
        "Activity already exists"
      );
    }

    // ✅ Create
    return await Activity.create({
      ...data,
      destination: destinationId,
      provider: providerId,
    });
  }

  // =========================
  // GET ALL (with pagination + filters)
  // =========================
  async getAll(query) {
    const {
      search,
      type,
      destination,
      provider,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
    } = query;

    const filter = {};

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (type) filter.type = type;
    if (destination) filter.destination = destination;
    if (provider) filter.provider = provider;

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const skip = (page - 1) * limit;

    return await Activity.find(filter)
      .skip(skip)
      .limit(Number(limit))
      .populate("destination")
      .populate("provider");
  }

  // =========================
  // GET ONE
  // =========================
  async getOne(id) {
    return await Activity.findById(id)
      .populate("destination")
      .populate("provider");
  }

  // =========================
  // UPDATE (fixed safe update)
  // =========================
  async update(id, data) {
    let destinationId, providerId;

    if (data.destination || data.provider) {
      const result = await this.validateRelations(data);
      destinationId = result.destinationId;
      providerId = result.providerId;
    }

    if (data.destination) data.destination = destinationId;
    if (data.provider) data.provider = providerId;

    return await Activity.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  // =========================
  // DELETE
  // =========================
  async delete(id) {
    return await Activity.findByIdAndDelete(id);
  }
}

export default new ActivityService();