import Joi from "joi";

const objectId = Joi.string().length(24).hex();

const destinationSchema = Joi.alternatives().try(
  objectId,
  Joi.object({
    name: Joi.string().min(2).required(),
    location: Joi.string().optional(),
    description: Joi.string().optional()
  })
);

const providerSchema = Joi.alternatives().try(
  objectId,
  Joi.object({
    name: Joi.string().min(2).required(),
    type: Joi.string().valid("Guide", "Transport", "Equipment", "TourOperator").required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^\d{10,15}$/).required(),
    address: Joi.string().optional(),
    description: Joi.string().optional()
  })
);

export const createActivitySchema = Joi.object({
  name: Joi.string().min(2).required(),
  description: Joi.string().optional(),

  type: Joi.string()
    .valid("hotel", "hiking", "food", "tour", "entertainment")
    .required(),

  destination: destinationSchema.required(),
  provider: providerSchema.required(),

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

  destination: destinationSchema,
  provider: providerSchema,

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
}).custom((value, helpers) => {
  if (
    value.minPrice !== undefined &&
    value.maxPrice !== undefined &&
    value.minPrice > value.maxPrice
  ) {
    return helpers.error("any.invalid");
  }
  return value;
}, "price range validation");