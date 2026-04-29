import * as bookingService from './booking.service.js';

export const createBooking = async (req, res, next) => {
    try {
        const booking = await bookingService.createNewBooking(req.user._id, req.body);
        return res.status(201).json({ message: "Booking created successfully", booking });
    } catch (error) {
        return next(new Error(error.message, { cause: 400 }));
    }
};

export const getUserBookings = async (req, res, next) => {
    try {
        const bookings = await bookingService.getMyBookings(req.user._id);
        return res.status(200).json({ message: "Done", bookings });
    } catch (error) {
        return next(new Error(error.message, { cause: 500 }));
    }
};

export const getOneBooking = async (req, res, next) => {
    try {
        const booking = await bookingService.getBookingById(req.params.bookingId, req.user._id);
        return res.status(200).json({ message: "Done", booking });
    } catch (error) {
        return next(new Error(error.message, { cause: 404 }));
    }
};

export const cancelBooking = async (req, res, next) => {
    try {
        const booking = await bookingService.cancelBookingById(req.params.bookingId, req.user._id);
        return res.status(200).json({ message: "Booking has been cancelled", booking });
    } catch (error) {
        return next(new Error(error.message, { cause: 400 }));
    }
};

export const deleteBooking = async (req, res, next) => {
    try {
        const booking = await bookingService.deleteBookingById(req.params.bookingId, req.user._id);
        return res.status(200).json({ message: "Booking deleted successfully", booking });
    } catch (error) {
        return next(new Error(error.message, { cause: 400 }));
    }
};
