import Joi from "joi";

const objectId = Joi.string().length(24).hex();

export const createCustomTripSchema = Joi.object({
  experienceId: objectId.required()
});

export const idSchema = Joi.object({
  id: objectId.required(),
});

export const addActivitySchema = Joi.object({
  day_number: Joi.number().integer().positive().required(),
  activity: objectId.required(),
  provider: objectId.required(),
  price: Joi.number().positive().required()
});

export const removeActivitySchema = Joi.object({
  activityId: objectId.required(),
  day_number: Joi.number().integer().positive().required()
});

export const addDaySchema = Joi.object({
  day_number: Joi.number().integer().positive().required(),
  activities: Joi.array().items(Joi.object({
    activity: objectId.required(),
    provider: objectId.required(),
    price: Joi.number().positive().required()
  })).optional()
});

export const removeDaySchema = Joi.object({
  day_number: Joi.number().integer().positive().required()
});

export const addExtraSchema = Joi.object({
  activity: objectId.required(),
  provider: objectId.required(),
  price: Joi.number().positive().required(),
  day: Joi.number().integer().positive().optional()
});

export const removeExtraSchema = Joi.object({
  activityId: objectId.required()
});

export const experienceIdSchema = Joi.object({
  experienceId: objectId.required(),
});

