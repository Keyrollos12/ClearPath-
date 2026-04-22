import Joi from 'joi';

export const addToWishlistSchema = Joi.object({
    experienceId: Joi.string().hex().length(24).required()
});

export const experienceIdSchema = Joi.object({
    experienceId: Joi.string().hex().length(24).required()
});