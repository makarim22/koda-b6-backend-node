import paymentsModel from "../models/payments.model.js";
import ordersModel from "../models/orders.model.js";

const paymentController = {
  /**
   * Create payment record for order
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  async createPayment(req, res) {
    try {
      const { orderId, userId, amount } = req.body;
      console.log("order id nya", orderId);
      console.log("amount nya", amount);

      const order = await ordersModel.getById(orderId);
      if (!order) {
        return res.status(404).json({ error: "Pesanan tidak ditemukan" });
      }

      if (order.total_amount !== amount) {
        return res.status(400).json({
          error: "Jumlah pembayaran tidak sesuai dengan total pesanan",
        });
      }

      const payment = await paymentsModel.create({
        orderId,
        userId,
        amount,
        status: "pending",
        created_at: new Date(),
      });

      await ordersModel.update(orderId, { status: "awaiting_payment" });

      res.status(201).json(payment);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Gagal membuat pembayaran" });
    }
  },

  /**
   * Mark payment as completed (simulate payment confirmation)
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  async completePayment(req, res) {
    try {
      const { paymentId } = req.params;

      const payment = await paymentsModel.getById(paymentId);
      if (!payment) {
        return res.status(404).json({ error: "Pembayaran tidak ditemukan" });
      }

      if (payment.status === "completed") {
        return res.status(400).json({
          error: "Pembayaran sudah selesai",
        });
      }

      const updated = await paymentsModel.update(paymentId, {
        status: "completed",
        paid_at: new Date(),
      });

      await ordersModel.update(payment.order_id, { status: "confirmed" });

      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Gagal menyelesaikan pembayaran" });
    }
  },

  /**
   * Mark payment as failed
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  async failPayment(req, res) {
    try {
      const { paymentId } = req.params;
      const { reason } = req.body;

      const payment = await paymentsModel.getById(paymentId);
      if (!payment) {
        return res.status(404).json({ error: "Pembayaran tidak ditemukan" });
      }

      if (["completed", "failed", "cancelled"].includes(payment.status)) {
        return res.status(400).json({
          error: "Pembayaran tidak dapat diubah",
        });
      }

      const updated = await paymentsModel.update(paymentId, {
        status: "failed",
        failure_reason: reason || null,
      });

      await ordersModel.update(payment.order_id, { status: "payment_failed" });

      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Gagal menandai pembayaran gagal" });
    }
  },

  /**
   * Get payment by ID
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  async getPaymentById(req, res) {
    try {
      const payment = await paymentsModel.getById(parseInt(req.params.id));
      if (!payment) {
        return res.status(404).json({ error: "Pembayaran tidak ditemukan" });
      }
      res.json(payment);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Gagal mengambil pembayaran" });
    }
  },

  /**
   * Get payments by order ID
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  async getPaymentsByOrderId(req, res) {
    try {
      const { orderId } = req.params;

      const order = await ordersModel.getById(parseInt(orderId));
      if (!order) {
        return res.status(404).json({ error: "Pesanan tidak ditemukan" });
      }

      const payments = await paymentsModel.getByOrderId(parseInt(orderId));
      res.json(payments);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Gagal mengambil pembayaran" });
    }
  },

  /**
   * Request refund
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  async requestRefund(req, res) {
    try {
      const { paymentId } = req.params;
      const { reason } = req.body;

      const payment = await paymentsModel.getById(paymentId);
      if (!payment) {
        return res.status(404).json({ error: "Pembayaran tidak ditemukan" });
      }

      if (payment.status !== "completed") {
        return res.status(400).json({
          error: "Hanya pembayaran yang selesai dapat direfund",
        });
      }

      const updated = await paymentsModel.update(paymentId, {
        status: "refund_requested",
        refund_reason: reason || null,
      });

      const order = await ordersModel.getById(payment.order_id);
      if (order) {
        await ordersModel.update(payment.order_id, { status: "refund_requested" });
      }

      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Gagal membuat permintaan refund" });
    }
  },

  /**
   * Approve and process refund
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  async processRefund(req, res) {
    try {
      const { paymentId } = req.params;

      const payment = await paymentsModel.getById(paymentId);
      if (!payment) {
        return res.status(404).json({ error: "Pembayaran tidak ditemukan" });
      }

      if (payment.status !== "refund_requested") {
        return res.status(400).json({
          error: "Pembayaran tidak memiliki permintaan refund yang pending",
        });
      }

      const updated = await paymentsModel.update(paymentId, {
        status: "refunded",
        refunded_at: new Date(),
      });

      await ordersModel.update(payment.order_id, { status: "refunded" });

      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Gagal memproses refund" });
    }
  },

  /**
   * Cancel payment
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  async cancelPayment(req, res) {
    try {
      const { paymentId } = req.params;

      const payment = await paymentsModel.getById(paymentId);
      if (!payment) {
        return res.status(404).json({ error: "Pembayaran tidak ditemukan" });
      }

      if (payment.status !== "pending") {
        return res.status(400).json({
          error: "Hanya pembayaran pending yang dapat dibatalkan",
        });
      }

      const updated = await paymentsModel.update(paymentId, {
        status: "cancelled",
        cancelled_at: new Date(),
      });

      await ordersModel.update(payment.order_id, { status: "cancelled" });

      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Gagal membatalkan pembayaran" });
    }
  },

  /**
   * Get payment history for a user
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  async getUserPaymentHistory(req, res) {
    try {
      const { userId } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const payments = await paymentsModel.getByUserId(userId, page, limit);
      res.json(payments);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Gagal mengambil riwayat pembayaran" });
    }
  },
};

export default paymentController;