import Joi from "joi";

const objectId = Joi.string().length(24).hex();

// Accept ObjectId, string name, or full object
const destinationField = Joi.alternatives().try(
  objectId,
  Joi.string().min(1),
  Joi.object({
    name: Joi.string().required(),
    location: Joi.string().optional(),
    city: Joi.string().optional(),
    description: Joi.string().optional()
  })
);

const activityField = Joi.alternatives().try(
  objectId,
  Joi.string().min(1),
  Joi.object({
    name: Joi.string().required(),
    type: Joi.string().valid("tour", "entertainment", "hiking", "hotel", "food").optional(),
    price: Joi.number().positive().optional()
  })
);

const providerField = Joi.alternatives().try(
  objectId,
  Joi.string().min(1),
  Joi.object({
    name: Joi.string().required(),
    type: Joi.string().valid("Guide", "Transport", "Equipment", "TourOperator").optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().optional()
  })
);

export const createExperienceSchema = Joi.object({
  name: Joi.string().min(2).optional(),
  type: Joi.string().optional(),
  description: Joi.string().optional(),
  duration_days: Joi.number().integer().positive().optional(),
  base_price: Joi.number().positive().optional(),
  destination: destinationField.optional(),
  capacity: Joi.number().integer().positive().optional(),
  availableDates: Joi.array().items(Joi.object({
    date: Joi.date().optional(),
    availableSeats: Joi.number().integer().positive().optional()
  })).optional(),
  itinerary: Joi.array().items(Joi.object({
    day_number: Joi.number().integer().positive().optional(),
    activities: Joi.array().items(Joi.object({
      activity: activityField.optional(),
      provider: providerField.optional(),
      price: Joi.number().positive().optional()
    })).optional()
  })).optional()
});

export const updateExperienceSchema = Joi.object({
  name: Joi.string().min(2),
  type: Joi.string().valid("Trip", "Package"),
  description: Joi.string(),
  duration_days: Joi.number().integer().positive(),
  base_price: Joi.number().positive(),
  destination: destinationField,
  capacity: Joi.number().integer().positive(),
  availableDates: Joi.array().items(Joi.object({
    date: Joi.date(),
    availableSeats: Joi.number().integer().positive()
  })),
  itinerary: Joi.array().items(Joi.object({
    day_number: Joi.number().integer().positive(),
    activities: Joi.array().items(Joi.object({
      activity: activityField,
      provider: providerField,
      price: Joi.number().positive()
    }))
  }))
});

export const idSchema = Joi.object({
  id: objectId.required(),
});

export const experienceQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  search: Joi.string().optional(),
  type: Joi.string().valid("Trip", "Package").optional(),
  destination: objectId.optional(),
  minPrice: Joi.number().positive().optional(),
  maxPrice: Joi.number().positive().optional(),
  sort: Joi.string().valid("name", "base_price", "createdAt").optional(),
  order: Joi.string().valid("asc", "desc").optional()
});
