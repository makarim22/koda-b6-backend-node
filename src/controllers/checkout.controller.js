import cartModel from "../models/cart.model.js";
import productsModel from "../models/products.model.js";
import ordersModel from "../models/orders.model.js";
import db from "../db/index.js";

const checkoutController = {
  async validateCart(req, res) {
    try {
      const { customerId } = req.body;
      console.log("customer id", customerId);
      if (!customerId) {
        return res.status(400).json({ error: "customer ID diperlukan" });
      }

      const cartItems = await cartModel.getByCustomerId(customerId);
      if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ error: "cart kosong" });
      }
      console.log("cart items", cartItems);

      let subtotal = 0;
      const validatedItems = [];

      for (const item of cartItems) {
        const product = await productsModel.getById(item.product_id);
        console.log("product", product);
        console.log("itemnya", item);

        if (!product) {
          return res.status(404).json({
            error: `Produk dengan ID ${item.product_id} tidak ditemukan`,
          });
        }

        if (product.stock < item.quantity) {
          return res.status(400).json({
            error: `stock tidak cukup untuk ${product.name}`,
          });
        }

        const itemTotal = product.base_price * item.quantity;

        subtotal += itemTotal;

        validatedItems.push({
          cart_id: item.id,
          product_id: item.product_id,
          product_name: product.name,
          quantity: item.quantity,
          price: product.price,
          item_total: itemTotal,
          variant_id: item.variant_id,
          size_id: item.size_id,
        });
      }

      const tax = subtotal * 0.1;
      const shipping = 10000;
      const total = subtotal + tax + shipping;

      res.json({
        subtotal,
        tax,
        shipping,
        total,
        items: validatedItems,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Gagal validasi cart" });
    }
  },
  async createOrder(req, res) {
    try {
      const { customerId, paymentMethod, shippingAddress } = req.body;
      if (!customerId || !paymentMethod || !shippingAddress) {
        return res.status(400).json({ error: "Field required tidak lengkap" });
      }

      const client = await db.getClient();

      try {
        await client.query("BEGIN");

        // Get cart items
        const cartItems = await cartModel.getByCustomerId(customerId);
        console.log("cart items", cartItems);

        if (!cartItems || cartItems.length === 0) {
          return res.status(400).json({ error: "Cart kosong" });
        }

        let subtotal = 0;

        // Check stock and calculate subtotal
        for (const item of cartItems) {
          const product = await productsModel.getById(item.product_id);
          console.log("product", product);
          if (!product || product.stock < item.quantity) {
            throw new Error(`Stok tidak cukup untuk ${product.product_name}`);
          }
          subtotal += product.base_price * item.quantity;
        }

        const tax = subtotal * 0.1;
        const deliveryFee = 10000;

        // Create order with calculated amounts
        const order = await ordersModel.create(
          customerId,
          subtotal,
          tax,
          deliveryFee,
          shippingAddress,
          paymentMethod,
          "pending",
        );

        // Create order items and reduce stock
        for (const item of cartItems) {
          const product = await productsModel.getById(item.product_id);
          const itemSubtotal = product.base_price * item.quantity;
          await ordersModel.addItem(
            order.id,
            item.product_id,
            item.quantity,
            product.base_price,
            itemSubtotal,
          );
          await ordersModel.reduceStock(item.product_id, item.quantity);
        }

        // Clear cart
        await cartModel.clearCart(customerId);

        await client.query("COMMIT");

        res.status(201).json({
          message: "Order berhasil dibuat",
          order,
        });
      } catch (err) {
        await client.query("ROLLBACK");
        throw err;
      } finally {
        client.release();
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Gagal membuat order" });
    }
  },
  /**
   * Get order by ID with items
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  async getOrderById(req, res) {
    try {
      const order = await ordersModel.getById(parseInt(req.params.id));

      if (!order) {
        return res.status(404).json({ error: "Order tidak ditemukan" });
      }

      res.json(order);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Gagal mengambil order" });
    }
  },

  /**
   * Get all orders for a customer with pagination
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  async getUserOrders(req, res) {
    try {
      const customerId = parseInt(req.params.customerId);
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const orders = await ordersModel.getByCustomerId(customerId, page, limit);

      if (!orders || orders.length === 0) {
        return res.json([]);
      }

      res.json(orders);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Gagal mengambil order customer" });
    }
  },

  /**
   * Cancel order and restore stock
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  async cancelOrder(req, res) {
    try {
      const orderId = parseInt(req.params.id);
      const client = await db.getClient();

      try {
        await client.query("BEGIN");

        const order = await ordersModel.getById(orderId);

        if (!order) {
          return res.status(404).json({ error: "Order tidak ditemukan" });
        }

        if (order.status === "cancelled") {
          return res.status(400).json({ error: "Order sudah dibatalkan" });
        }

        if (order.status === "completed") {
          return res.status(400).json({ error: "Order tidak bisa dibatalkan" });
        }

        // Get order items
        const orderItems = await ordersModel.getOrderItems(orderId);

        // Restore stock
        for (const item of orderItems) {
          await productsModel.increaseStock(
            item.product_id,
            item.quantity,
            client,
          );
        }

        // Update order status
        await ordersModel.update(orderId, { status: "cancelled" }, client);

        await client.query("COMMIT");

        res.json({
          message: "Order berhasil dibatalkan",
          status: "cancelled",
        });
      } catch (err) {
        await client.query("ROLLBACK");
        throw err;
      } finally {
        client.release();
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Gagal membatalkan order" });
    }
  },
};

export default checkoutController;
