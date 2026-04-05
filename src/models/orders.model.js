import db from "../db/index.js";

const ordersModel = {
  async getAll() {
    const result = await db.query(`SELECT * FROM orders`);
    return result.rows.map((order) => ({
      ...order,
      shipping_address: JSON.parse(order.shipping_address),
    }));
  },

  async getById(id, userId) {
    const result = await db.query(`SELECT * FROM orders WHERE id = $1 and customer_id = $2`, [id, userId]);
    if (!result.rows[0]) return null;
    const order = result.rows[0];
    order.subtotal = parseFloat(order.subtotal);
    order.tax = parseFloat(order.tax);
    order.delivery_fee = parseFloat(order.delivery_fee);
    order.shipping_address = JSON.parse(order.shipping_address);
    return order;
  },

  async getByCustomerId(customerId) {
    const result = await db.query(
      `SELECT * FROM orders WHERE customer_id = $1 ORDER BY order_date DESC`,
      [customerId],
    );
    return result.rows.map((order) => ({
      ...order,
      shipping_address: JSON.parse(order.shipping_address),
    }));
  },

  async create(
    customerId,
    subtotal,
    tax,
    deliveryFee,
    shippingAddress,
    paymentMethod,
    status = "pending",
  ) {
    const query = `
      INSERT INTO orders (customer_id, subtotal, tax, delivery_fee, shipping_address, payment_method, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    const values = [
      customerId,
      subtotal,
      tax,
      deliveryFee,
      JSON.stringify(shippingAddress),
      paymentMethod,
      status,
    ];

    try {
      const result = await db.query(query, values);
      const order = result.rows[0];
      order.shipping_address = JSON.parse(order.shipping_address);
      return order;
    } catch (error) {
      console.error("Gagal membuat order:", error);
      throw error;
    }
  },

  async addItem(orderId, productId, quantity, price, subtotal) {
    const query = `
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    try {
      const result = await db.query(query, [
        orderId,
        productId,
        quantity,
        price,
        subtotal,
      ]);
      return result.rows[0];
    } catch (error) {
      console.error("Gagal menambah item ke order:", error);
      throw error;
    }
  },

  async getItems(orderId) {
    try {
      const result = await db.query(
        `SELECT * FROM order_items WHERE order_id = $1 ORDER BY id ASC`,
        [orderId],
      );
      return result.rows;
    } catch (error) {
      console.error("Gagal mengambil order items:", error);
      throw error;
    }
  },

  async getOrderWithItems(orderId) {
    const orderQuery = `SELECT * FROM orders WHERE id = $1`;
    const itemsQuery = `SELECT * FROM order_items WHERE order_id = $1 ORDER BY id ASC`;

    try {
      const orderResult = await db.query(orderQuery, [orderId]);
      const itemsResult = await db.query(itemsQuery, [orderId]);

      if (!orderResult.rows[0]) {
        return null;
      }

      const order = orderResult.rows[0];
      order.shipping_address = JSON.parse(order.shipping_address);
      order.items = itemsResult.rows;
      return order;
    } catch (error) {
      console.error("Gagal mengambil order dengan items:", error);
      throw error;
    }
  },

  async reduceStock(productId, quantity) {
    const query = `
      UPDATE products
      SET stock = stock - $1
      WHERE id = $2
      RETURNING stock;
    `;

    try {
      const result = await db.query(query, [quantity, productId]);
      return result.rows[0];
    } catch (error) {
      console.error("Gagal mengurangi stock:", error);
      throw error;
    }
  },

  async update(id, orderData) {
    const { status } = orderData;
    try {
      const result = await db.query(
        `UPDATE orders SET status = $1 WHERE id = $2 RETURNING *`,
        [status, id],
      );
      if (!result.rows[0]) return null;
      const order = result.rows[0];
      order.shipping_address = JSON.parse(order.shipping_address);
      return order;
    } catch (error) {
      console.error("Gagal update order:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      await db.query(`DELETE FROM orders WHERE id = $1`, [id]);
      return true;
    } catch (error) {
      console.error("Gagal menghapus order:", error);
      throw error;
    }
  },

  async validateOrderExists(orderId, customerId) {
    try {
      const result = await db.query(
        `SELECT id FROM orders WHERE id = $1 AND customer_id = $2`,
        [orderId, customerId],
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error("Gagal validasi order:", error);
      throw error;
    }
  },
};

export default ordersModel;
