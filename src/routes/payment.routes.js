import express from "express";
import paymentController from "../controllers/payments.controller.js";

const router = express.Router();

/**
 * POST /api/payments/create
 * Create payment record for order
 * Body: { orderId, paymentMethod, amount }
 */
router.post("/create", paymentController.createPayment);

/**
 * POST /api/payments/:paymentId/complete
 * Mark payment as completed and confirm order
 * Body: { none }
 */
router.post("/:paymentId/complete", paymentController.completePayment);

/**
 * POST /api/payments/:paymentId/fail
 * Mark payment as failed
 * Body: { reason }
 */
router.post("/:paymentId/fail", paymentController.failPayment);

/**
 * POST /api/payments/:paymentId/cancel
 * Cancel pending payment
 * Body: { reason }
 */
router.post("/:paymentId/cancel", paymentController.cancelPayment);

/**
 * GET /api/payments/:paymentId
 * Get single payment details
 */
router.get("/:paymentId", paymentController.getPaymentById);

/**
 * GET /api/payments/order/:orderId
 * Get all payments for an order
 */
router.get("/order/:orderId", paymentController.getPaymentsByOrderId);

/**
 * GET /api/payments/user/:userId/history
 * Get user's payment history with pagination
 * Query: page, limit
 */
router.get("/user/:userId/history", paymentController.getUserPaymentHistory);

export default router;