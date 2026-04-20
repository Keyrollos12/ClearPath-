import Joi from 'joi';

export const destinationSchema = {
    body: Joi.object().required().keys({
        name: Joi.string().min(3).max(100).required(),
        country: Joi.string().required(), 
        city: Joi.string().required(),    
        description: Joi.string().min(10).max(1000).required()
    })
};

export const getByIdSchema = {
    params: Joi.object().required().keys({
        destinationId: Joi.string().hex().length(24).required()
    })
};