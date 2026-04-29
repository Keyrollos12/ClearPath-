import Joi from 'joi';

const objectId = Joi.string().hex().length(24);

export const createDestinationSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    location: Joi.string().required(), 
    city: Joi.string().required(),    
    description: Joi.string().min(10).max(1000).required()
}).required();

export const updateDestinationSchema = Joi.object({
    name: Joi.string().min(3).max(100),
    location: Joi.string(), 
    city: Joi.string(),    
    description: Joi.string().min(10).max(1000)
}).required();

export const destinationIdSchema = Joi.object({
    destinationId: objectId.required()
}).required();

