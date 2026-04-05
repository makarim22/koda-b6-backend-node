import express from "express";
import checkoutController from "../controllers/checkout.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/checkout/validate:
 *   post:
 *     summary: Validate cart items and calculate totals
 *     description: Validates all items in the customer's cart and returns calculated totals
 *     tags:
 *       - Checkout
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *             properties:
 *               customerId:
 *                 type: string
 *                 description: The customer ID
 *                 example: "cust_12345"
 *     responses:
 *       200:
 *         description: Cart validation successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productId:
 *                         type: string
 *                       quantity:
 *                         type: number
 *                       price:
 *                         type: number
 *                 subtotal:
 *                   type: number
 *                 tax:
 *                   type: number
 *                 total:
 *                   type: number
 *       400:
 *         description: Invalid request or cart validation failed
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Server error
 */
router.post("/validate", checkoutController.validateCart);

/**
 *   @swagger
 *   /api/checkout/create-order:
 *   post:
 *     summary: Convert validated cart to order
 *     description: Creates an order from the customer's validated cart
 *     tags:
 *       - Checkout
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *               - shippingAddress
 *               - shippingMethod
 *             properties:
 *               customerId:
 *                 type: string
 *                 description: The customer ID
 *                 example: "cust_12345"
 *               shippingAddress:
 *                 type: object
 *                 description: Shipping address details
 *                 required:
 *                   - street
 *                   - city
 *                   - state
 *                   - zipCode
 *                   - country
 *                 properties:
 *                   street:
 *                     type: string
 *                     example: "123 Main St"
 *                   city:
 *                     type: string
 *                     example: "New York"
 *                   state:
 *                     type: string
 *                     example: "NY"
 *                   zipCode:
 *                     type: string
 *                     example: "10001"
 *                   country:
 *                     type: string
 *                     example: "USA"
 *               shippingMethod:
 *                 type: string
 *                 description: Shipping method selected by customer
 *                 enum:
 *                   - standard
 *                   - express
 *                   - overnight
 *                 example: "standard"
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 orderId:
 *                   type: string
 *                 customerId:
 *                   type: string
 *                 total:
 *                   type: number
 *                 status:
 *                   type: string
 *                   example: "pending"
 *       400:
 *         description: Invalid request or validation failed
 *       404:
 *         description: Customer or cart not found
 *       500:
 *         description: Server error
 *
 */
router.post("/create-order", checkoutController.createOrder);

/**
*    @swagger 
*    /api/checkout/orders/{orderId}:
 *   get:
 *     summary: Get single order with items
 *     description: Retrieves a specific order and all its associated items
 *     tags:
 *       - Checkout
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: The order ID
 *         example: "ord_12345"
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orderId:
 *                   type: string
 *                 customerId:
 *                   type: string
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productId:
 *                         type: string
 *                       quantity:
 *                         type: number
 *                       price:
 *                         type: number
 *                 shippingAddress:
 *                   type: object
 *                 total:
 *                   type: number
 *                 status:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.get("/orders/:orderId", checkoutController.getOrderById);

/**
 *   @swagger
 *   /api/checkout/user/{userId}/orders:
 *   get:
 *     summary: Get user's orders with pagination
 *     description: Retrieves all orders for a specific user with pagination support
 *     tags:
 *       - Checkout
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *         example: "user_12345"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of orders per page
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       orderId:
 *                         type: string
 *                       total:
 *                         type: number
 *                       status:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/user/:userId/orders", checkoutController.getUserOrders);

/** 
 *   @swagger
 *   /api/checkout/orders/{orderId}/cancel:
 *   post:
 *     summary: Cancel order and restore stock
 *     description: Cancels an existing order and restores inventory stock for all items
 *     tags:
 *       - Checkout
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: The order ID to cancel
 *         example: "ord_12345"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *                 description: Reason for cancellation
 *                 example: "Customer requested cancellation"
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 orderId:
 *                   type: string
 *                 status:
 *                   type: string
 *                   example: "cancelled"
 *                 message:
 *                   type: string
 *       400:
 *         description: Cannot cancel order (invalid state)
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.post("/orders/:orderId/cancel", checkoutController.cancelOrder);

export default router;