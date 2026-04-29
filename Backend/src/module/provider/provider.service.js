import { Provider } from "../../db/models/provider.model.js";

// Create provider
export const createProvider = async (data) => {
  return await Provider.create(data);
};

// Get all providers with pagination and filters
export const getAllProviders = async (query) => {
  const { page = 1, limit = 10, search, type, isVerified } = query;
  const skip = (page - 1) * limit;

  let filter = {};
  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }
  if (type) {
    filter.type = type;
  }
  if (isVerified !== undefined) {
    filter.isVerified = isVerified;
  }

  const providers = await Provider.find(filter).skip(skip).limit(limit);
  const total = await Provider.countDocuments(filter);

  return {
    results: providers.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: providers
  };
};

// Get provider by id
export const getProviderById = async (id) => {
  return await Provider.findById(id);
};

// Update provider
export const updateProvider = async (id, data) => {
  return await Provider.findByIdAndUpdate(id, data, { new: true });
};

// Delete provider
export const deleteProvider = async (id) => {
  return await Provider.findByIdAndDelete(id);
};