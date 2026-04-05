import express from "express";
import paymentController from "../controllers/payments.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/payments/create:
 *   post:
 *     summary: Create payment record for order
 *     description: Create a new payment record and set order status to awaiting_payment. Validates that payment amount matches order subtotal and checks for existing payments.
 *     tags:
 *       - Payments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - userId
 *               - amount
 *             properties:
 *               orderId:
 *                 type: integer
 *                 description: ID of the order
 *                 example: 1
 *               userId:
 *                 type: integer
 *                 description: ID of the user making the payment
 *                 example: 5
 *               amount:
 *                 type: number
 *                 format: decimal
 *                 description: Payment amount (must match order subtotal)
 *                 example: 150000
 *     responses:
 *       201:
 *         description: Payment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 orderId:
 *                   type: integer
 *                   example: 1
 *                 userId:
 *                   type: integer
 *                   example: 5
 *                 amount:
 *                   type: number
 *                   format: decimal
 *                   example: 150000
 *                 status:
 *                   type: string
 *                   enum: [pending, completed, failed, cancelled]
 *                   example: pending
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-04-05T10:30:00Z"
 *       400:
 *         description: Bad request - invalid payment or order state
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Jumlah pembayaran tidak sesuai dengan total pesanan"
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Pesanan tidak ditemukan"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Gagal membuat pembayaran"
 */
router.post("/create", paymentController.createPayment);

/**
 *   @swagger
 *   /api/payments/{paymentId}/complete:
 *   post:
 *     summary: Mark payment as completed
 *     description: Complete a pending payment and update order status to confirmed
 *     tags:
 *       - Payments
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Payment ID to complete
 *         example: 1
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Payment completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 orderId:
 *                   type: integer
 *                   example: 1
 *                 userId:
 *                   type: integer
 *                   example: 5
 *                 amount:
 *                   type: number
 *                   format: decimal
 *                   example: 150000
 *                 status:
 *                   type: string
 *                   enum: [pending, completed, failed, cancelled]
 *                   example: completed
 *                 paid_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-04-05T10:35:00Z"
 *       400:
 *         description: Cannot complete payment - already completed or invalid state
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Pembayaran sudah selesai"
 *       404:
 *         description: Payment not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Pembayaran tidak ditemukan"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Gagal menyelesaikan pembayaran"
 */
router.post("/:paymentId/complete", paymentController.completePayment);

/**
 *   @swagger
 *   /api/payments/{paymentId}/fail:
 *   post:
 *     summary: Mark payment as failed
 *     description: Fail a payment and update order status to payment_failed
 *     tags:
 *       - Payments
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Payment ID to mark as failed
 *         example: 1
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 description: Reason for payment failure
 *                 example: "Insufficient funds"
 *     responses:
 *       200:
 *         description: Payment marked as failed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 orderId:
 *                   type: integer
 *                   example: 1
 *                 amount:
 *                   type: number
 *                   format: decimal
 *                   example: 150000
 *                 status:
 *                   type: string
 *                   enum: [pending, completed, failed, cancelled]
 *                   example: failed
 *                 failure_reason:
 *                   type: string
 *                   example: "Insufficient funds"
 *       400:
 *         description: Cannot fail payment in current state
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Pembayaran tidak dapat diubah"
 *       404:
 *         description: Payment not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Pembayaran tidak ditemukan"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Gagal menandai pembayaran gagal"
 */
router.post("/:paymentId/fail", paymentController.failPayment);

/**
 *   @swagger
 *   /api/payments/{paymentId}/cancel:
 *   post:
 *     summary: Cancel pending payment
 *     description: Cancel a pending payment and update order status to cancelled
 *     tags:
 *       - Payments
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Payment ID to cancel
 *         example: 1
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 description: Reason for cancellation
 *                 example: "User requested cancellation"
 *     responses:
 *       200:
 *         description: Payment cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 orderId:
 *                   type: integer
 *                   example: 1
 *                 amount:
 *                   type: number
 *                   format: decimal
 *                   example: 150000
 *                 status:
 *                   type: string
 *                   enum: [pending, completed, failed, cancelled]
 *                   example: cancelled
 *                 cancelled_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-04-05T10:40:00Z"
 *       400:
 *         description: Only pending payments can be cancelled
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Hanya pembayaran pending yang dapat dibatalkan"
 *       404:
 *         description: Payment not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Pembayaran tidak ditemukan"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Gagal membatalkan pembayaran"
 */
router.post("/:paymentId/cancel", paymentController.cancelPayment);

/**
 *   @swagger
 *   /api/payments/{paymentId}:
 *   get:
 *     summary: Get payment by ID
 *     description: Retrieve detailed information about a specific payment
 *     tags:
 *       - Payments
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Payment ID to retrieve
 *         example: 1
 *     responses:
 *       200:
 *         description: Payment details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 orderId:
 *                   type: integer
 *                   example: 1
 *                 userId:
 *                   type: integer
 *                   example: 5
 *                 amount:
 *                   type: number
 *                   format: decimal
 *                   example: 150000
 *                 status:
 *                   type: string
 *                   enum: [pending, completed, failed, cancelled]
 *                   example: completed
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-04-05T10:30:00Z"
 *                 paid_at:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *                   example: "2026-04-05T10:35:00Z"
 *                 failure_reason:
 *                   type: string
 *                   nullable: true
 *       404:
 *         description: Payment not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Pembayaran tidak ditemukan"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Gagal mengambil pembayaran"
 */
router.get("/:paymentId", paymentController.getPaymentById);

/**
 *   @swagger
 *   /api/payments/order/{orderId}:
 *   get:
 *     summary: Get all payments for an order
 *     description: Retrieve all payment records associated with a specific order
 *     tags:
 *       - Payments
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID to retrieve payments for
 *         example: 1
 *     responses:
 *       200:
 *         description: Payments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   orderId:
 *                     type: integer
 *                     example: 1
 *                   userId:
 *                     type: integer
 *                     example: 5
 *                   amount:
 *                     type: number
 *                     format: decimal
 *                     example: 150000
 *                   status:
 *                     type: string
 *                     enum: [pending, completed, failed, cancelled]
 *                     example: completed
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Pesanan tidak ditemukan"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Gagal mengambil pembayaran"
 */
router.get("/order/:orderId", paymentController.getPaymentsByOrderId);

/**
 *   @swagger
 *   /api/payments/user/{userId}/history:
 *   get:
 *     summary: Get user payment history
 *     description: Retrieve paginated payment history for a specific user
 *     tags:
 *       - Payments
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID to retrieve payment history for
 *         example: 5
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *         example: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of records per page
 *         example: 10
 *     responses:
 *       200:
 *         description: Payment history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       orderId:
 *                         type: integer
 *                         example: 1
 *                       userId:
 *                         type: integer
 *                         example: 5
 *                       amount:
 *                         type: number
 *                         format: decimal
 *                         example: 150000
 *                       status:
 *                         type: string
 *                         enum: [pending, completed, failed, cancelled]
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     total:
 *                       type: integer
 *                       example: 25
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Gagal mengambil riwayat pembayaran"
 */
router.get("/user/:userId/history", paymentController.getUserPaymentHistory);

export default router;