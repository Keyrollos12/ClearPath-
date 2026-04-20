import Joi from 'joi';

export const updateProfileSchema = {
    body: Joi.object().keys({
        username: Joi.string().min(3).max(20),
        phone: Joi.string(),
        // Image is usually handled via Multer, but we validate the string path if needed
        image: Joi.string() 
    })
};

export const changePasswordSchema = {
    body: Joi.object().keys({
        oldPassword: Joi.string().required(),
        newPassword: Joi.string().min(8).required()
    })
};

export const userIdSchema = {
    params: Joi.object().keys({
        userId: Joi.string().hex().length(24).required()
    })
};