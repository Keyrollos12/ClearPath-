import { Payment } from '../../db/models/payment.model.js';
import { Booking } from '../../db/models/booking.model.js';
import { devConfig } from '../../config/env/dev.config.js';
import * as AppError from '../../utils/error/index.js';

const PAYPAL_BASE_URL =
    devConfig.PAYPAL_MODE === 'live'
        ? 'https://api-m.paypal.com'
        : 'https://api-m.sandbox.paypal.com';

// ─── Internal helper ────────────────────────────────────────────────────────

const getAccessToken = async () => {
    const credentials = Buffer.from(
        `${devConfig.PAYPAL_CLIENT_ID}:${devConfig.PAYPAL_CLIENT_SECRET}`
    ).toString('base64');

    const res = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
    });

    if (!res.ok) throw new AppError.internalServerError('Failed to authenticate with PayPal');

    const data = await res.json();
    return data.access_token;
};

// ─── 1. Create PayPal Order ──────────────────────────────────────────────────

export const createPayPalOrder = async (userId, bookingId) => {
    const booking = await Booking.findOne({ _id: bookingId, user: userId, status: 'Pending' });
    if (!booking) throw new AppError.BadRequestException('Booking not found or already processed');

    const existing = await Payment.findOne({ booking: bookingId, status: { $ne: 'Failed' } });
    if (existing) throw new AppError.conflictException('A payment has already been initiated for this booking');

    const token = await getAccessToken();

    const res = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            intent: 'CAPTURE',
            purchase_units: [
                {
                    reference_id: bookingId.toString(),
                    amount: {
                        currency_code: 'USD',
                        value: booking.total_amount.toFixed(2),
                    },
                    description: `ClearPath Booking #${bookingId}`,
                },
            ],
            application_context: {
                brand_name: 'ClearPath',
                landing_page: 'BILLING',
                user_action: 'PAY_NOW',
                return_url: `${devConfig.CLIENT_URL}/payment/success`,
                cancel_url: `${devConfig.CLIENT_URL}/payment/cancel`,
            },
        }),
    });

    if (!res.ok) throw new AppError.internalServerError('Failed to create PayPal order');

    const order = await res.json();

    const payment = await Payment.create({
        user: userId,
        booking: bookingId,
        amount: booking.total_amount,
        method: 'PayPal',
        status: 'Pending',
        paypalOrderId: order.id,
    });

    const approvalUrl = order.links.find((l) => l.rel === 'approve')?.href;

    return { orderId: order.id, approvalUrl, payment };
};

// ─── 2. Capture Payment After User Approves ──────────────────────────────────

export const capturePayPalOrder = async (userId, orderId) => {
    const payment = await Payment.findOne({ paypalOrderId: orderId, user: userId });
    if (!payment) throw new AppError.BadRequestException('Payment record not found');
    if (payment.status === 'Completed') throw new AppError.conflictException('Payment already completed');

    const token = await getAccessToken();

    const res = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    const captureData = await res.json();

    if (!res.ok || captureData.status !== 'COMPLETED') {
        await Payment.findByIdAndUpdate(payment._id, { status: 'Failed' });
        throw new AppError.BadRequestException(captureData.message || 'Payment capture failed');
    }

    const captureId = captureData.purchase_units?.[0]?.payments?.captures?.[0]?.id;

    const updatedPayment = await Payment.findByIdAndUpdate(
        payment._id,
        { status: 'Completed', paypalCaptureId: captureId, payment_date: new Date() },
        { new: true }
    );

    await Booking.findByIdAndUpdate(payment.booking, { status: 'Confirmed' });

    return { captureId, status: 'COMPLETED', payment: updatedPayment };
};

// ─── 3. Handle PayPal Webhooks ───────────────────────────────────────────────

export const handleWebhook = async (headers, body) => {
    const token = await getAccessToken();

    // Verify the webhook signature with PayPal before trusting any data
    const verifyRes = await fetch(`${PAYPAL_BASE_URL}/v1/notifications/verify-webhook-signature`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            auth_algo: headers['paypal-auth-algo'],
            cert_url: headers['paypal-cert-url'],
            transmission_id: headers['paypal-transmission-id'],
            transmission_sig: headers['paypal-transmission-sig'],
            transmission_time: headers['paypal-transmission-time'],
            webhook_id: devConfig.PAYPAL_WEBHOOK_ID,
            webhook_event: body,
        }),
    });

    const verifyData = await verifyRes.json();
    if (verifyData.verification_status !== 'SUCCESS') {
        throw new AppError.forbiddenException('Invalid webhook signature');
    }

    const { event_type, resource } = body;

    if (event_type === 'PAYMENT.CAPTURE.COMPLETED') {
        const captureId = resource.id;
        const orderId = resource.supplementary_data?.related_ids?.order_id;
        if (orderId) {
            const payment = await Payment.findOne({ paypalOrderId: orderId });
            if (payment && payment.status !== 'Completed') {
                await Payment.findByIdAndUpdate(payment._id, {
                    status: 'Completed',
                    paypalCaptureId: captureId,
                    payment_date: new Date(),
                });
                await Booking.findByIdAndUpdate(payment.booking, { status: 'Confirmed' });
            }
        }
    }

    if (event_type === 'PAYMENT.CAPTURE.DENIED') {
        const orderId = resource.supplementary_data?.related_ids?.order_id;
        if (orderId) {
            await Payment.findOneAndUpdate({ paypalOrderId: orderId }, { status: 'Failed' });
        }
    }

    if (event_type === 'CHECKOUT.ORDER.CANCELLED') {
        await Payment.findOneAndUpdate({ paypalOrderId: resource.id }, { status: 'Failed' });
    }

    return { received: true };
};

// ─── 4. Payment History ──────────────────────────────────────────────────────

export const getUserPaymentHistory = async (userId) => {
    return await Payment.find({ user: userId })
        .populate('booking')
        .sort({ createdAt: -1 });
};

