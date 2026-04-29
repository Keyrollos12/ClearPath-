import * as paymentService from './payment.service.js';

// POST /payment/create-order
export const createOrder = async (req, res, next) => {
    try {
        const result = await paymentService.createPayPalOrder(req.user._id, req.body.bookingId);
        return res.status(201).json({
            message: 'PayPal order created successfully',
            orderId: result.orderId,
            approvalUrl: result.approvalUrl,
            payment: result.payment,
        });
    } catch (error) {
        return next(error);
    }
};

// POST /payment/capture/:orderId
export const captureOrder = async (req, res, next) => {
    try {
        const result = await paymentService.capturePayPalOrder(req.user._id, req.params.orderId);
        return res.status(200).json({
            message: 'Payment captured successfully',
            captureId: result.captureId,
            status: result.status,
            payment: result.payment,
        });
    } catch (error) {
        return next(error);
    }
};

// POST /payment/webhook  (no auth — PayPal calls this directly)
export const webhook = async (req, res, next) => {
    try {
        const result = await paymentService.handleWebhook(req.headers, req.body);
        return res.status(200).json(result);
    } catch (error) {
        return next(error);
    }
};

// GET /payment/history
export const getPaymentHistory = async (req, res, next) => {
    try {
        const payments = await paymentService.getUserPaymentHistory(req.user._id);
        return res.status(200).json({ message: 'Done', payments });
    } catch (error) {
        return next(error);
    }
};

