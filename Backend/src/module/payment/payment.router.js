import { Router } from 'express';
const router = Router();
import * as paymentController from './payment.controller.js';
import * as schema from './payment.validation.js';
import { isValid } from '../../middleware/validation.middleware.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

// Create a PayPal order for a pending booking
router.post(
    '/create-order',
    authMiddleware,
    isValid(schema.createOrderSchema),
    paymentController.createOrder
);

// Capture the payment after user approves on PayPal
router.post(
    '/capture/:orderId',
    authMiddleware,
    isValid(schema.captureOrderSchema, 'params'),
    paymentController.captureOrder
);

// PayPal webhook — no auth, PayPal calls this directly
router.post('/webhook', paymentController.webhook);

// Get logged-in user's payment history
router.get('/history', authMiddleware, paymentController.getPaymentHistory);

export default router;

