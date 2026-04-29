import Joi from "joi";

const objectId = Joi.string().length(24).hex();

export const createProviderSchema = Joi.object({
  name: Joi.string().min(2).required(),
  type: Joi.string().valid("Guide", "Transport", "Equipment", "TourOperator").required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^\d{10,15}$/).required(),
  address: Joi.string().optional(),
  description: Joi.string().optional(),
  isVerified: Joi.boolean().optional()
});

export const updateProviderSchema = Joi.object({
  name: Joi.string().min(2),
  type: Joi.string().valid("Guide", "Transport", "Equipment", "TourOperator"),
  email: Joi.string().email(),
  phone: Joi.string().pattern(/^\d{10,15}$/),
  address: Joi.string(),
  description: Joi.string(),
  isVerified: Joi.boolean()
});

export const idSchema = Joi.object({
  id: objectId.required(),
});

export const providerQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  search: Joi.string().optional(),
  type: Joi.string().valid("Guide", "Transport", "Equipment", "TourOperator").optional(),
  isVerified: Joi.boolean().optional()
});