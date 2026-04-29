import Joi from 'joi';

export const createBookingSchema = {
    body: Joi.object({
        customTrip: Joi.string().hex().length(24),
        experienceId: Joi.string().hex().length(24),
        travel_date: Joi.date().optional()
    }).or('customTrip', 'experienceId').required()
};

export const bookingIdSchema = {
    params: Joi.object({
        bookingId: Joi.string().hex().length(24).required()
    }).required()
};
