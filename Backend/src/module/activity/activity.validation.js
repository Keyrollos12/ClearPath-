import Joi from "joi";

const objectId = Joi.string().length(24).hex();

export const createActivitySchema = Joi.object({
  name: Joi.string().min(2).required(),
  description: Joi.string().optional(),

  type: Joi.string()
    .valid("hotel", "hiking", "food", "tour", "entertainment")
    .required(),

  destination: objectId.required(),
  provider: objectId.required(),

  price: Joi.number().positive().required(),
  duration: Joi.number().optional(),

  images: Joi.array().items(Joi.string()).optional(),

  isAvailable: Joi.boolean().optional(),
});

export const updateActivitySchema = Joi.object({
  name: Joi.string().min(2),
  description: Joi.string(),
  type: Joi.string().valid(
    "hotel",
    "hiking",
    "food",
    "tour",
    "entertainment"
  ),

  destination: objectId,
  provider: objectId,

  price: Joi.number().positive(),
  duration: Joi.number(),

  images: Joi.array().items(Joi.string()),

  isAvailable: Joi.boolean(),
});

export const idSchema = Joi.object({
  id: objectId.required(),
});

export const activityQuerySchema = Joi.object({
  search: Joi.string(),
  type: Joi.string(),
  destination: objectId,
  provider: objectId,
  minPrice: Joi.number(),
  maxPrice: Joi.number(),
});