import { Router } from 'express';
const router = Router();
import * as bookingController from './booking.controller.js';
import * as schema from './booking.validation.js';
import { isValid } from '../../middleware/validation.middleware.js'; 
import { authMiddleware } from '../../middleware/auth.middleware.js';

// إنشاء حجز جديد
router.post('/', 
    authMiddleware, 
    isValid(schema.createBookingSchema), 
    bookingController.createBooking
);

// عرض حجوزات المستخدم
router.get('/', 
    authMiddleware, 
    bookingController.getUserBookings
);

// عرض حجز واحد
router.get('/:bookingId', 
    authMiddleware, 
    isValid(schema.bookingIdSchema), 
    bookingController.getOneBooking
);

// إلغاء حجز
router.patch('/:bookingId/cancel', 
    authMiddleware, 
    isValid(schema.bookingIdSchema), 
    bookingController.cancelBooking
);

// حذف حجز
router.delete('/:bookingId', 
    authMiddleware, 
    isValid(schema.bookingIdSchema), 
    bookingController.deleteBooking
);

export default router;
