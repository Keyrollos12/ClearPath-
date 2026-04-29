import Joi from "joi";

const objectId = Joi.string().length(24).hex();

export const createReviewSchema = Joi.object({
  experience: objectId.required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().max(500).optional(),
});

export const updateReviewBodySchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5),
  comment: Joi.string().max(500),
}).or("rating", "comment");

export const reviewIdSchema = Joi.object({
  reviewId: objectId.required(),
});

export const experienceIdSchema = Joi.object({
  experienceId: objectId.required(),
});

export const reviewQuerySchema = Joi.object({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
  rating: Joi.number().integer().min(1).max(5),
  experienceId: objectId,
});

