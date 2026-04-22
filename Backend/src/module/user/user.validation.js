import Joi from 'joi';

export const updateProfileSchema = Joi.object({
    firstName: Joi.string().min(3).max(20),
    lastName: Joi.string().min(3).max(20),
    phoneNumber: Joi.string().pattern(/^\d{10,15}$/),
    gender: Joi.string().valid('male', 'female'),
}).min(1);

export const changePasswordSchema = Joi.object({
        oldPassword: Joi.string().required(),
        newPassword: Joi.string().min(8).required()
});

export const userIdSchema = Joi.object({
        userId: Joi.string().hex().length(24).required()
});