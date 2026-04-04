import express from "express";
import checkoutController from "../controllers/checkout.controller.js";

const router = express.Router();

/**
 * POST /api/checkout/validate
 * Validate cart items and calculate totals
 * Body: { customerId }
 */
router.post("/validate", checkoutController.validateCart);

/**
 * POST /api/checkout/create-order
 * Convert validated cart to order
 * Body: { customerId, shippingAddress, shippingMethod }
 */
router.post("/create-order", checkoutController.createOrder);

/**
 * GET /api/checkout/orders/:orderId
 * Get single order with items
 */
router.get("/orders/:orderId", checkoutController.getOrderById);

/**
 * GET /api/checkout/user/:userId/orders
 * Get user's orders with pagination
 * Query: page, limit
 */
router.get("/user/:userId/orders", checkoutController.getUserOrders);

/**
 * POST /api/checkout/orders/:orderId/cancel
 * Cancel order and restore stock
 * Body: { reason }
 */
router.post("/orders/:orderId/cancel", checkoutController.cancelOrder);

export default router;