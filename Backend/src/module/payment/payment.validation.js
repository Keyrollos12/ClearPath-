import Joi from 'joi';

export const createOrderSchema = Joi.object({
    bookingId: Joi.string().hex().length(24).required().messages({
        'string.hex': 'bookingId must be a valid MongoDB ObjectId',
        'string.length': 'bookingId must be 24 characters',
        'any.required': 'bookingId is required',
    }),
});

export const captureOrderSchema = Joi.object({
    orderId: Joi.string().required().messages({
        'any.required': 'orderId is required',
    }),
});

export const paymentIdSchema = Joi.object({
    paymentId: Joi.string().hex().length(24).required().messages({
        'string.hex': 'paymentId must be a valid MongoDB ObjectId',
        'string.length': 'paymentId must be 24 characters',
        'any.required': 'paymentId is required',
    }),
});

