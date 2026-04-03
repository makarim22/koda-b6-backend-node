import db from '../db/index.js';

const ordersModel = {
  async getAll() {
    const result = await db.query(`SELECT * FROM orders`);
    return result.rows;
  },

  async getById(id) {
    const result = await db.query(
      `SELECT * FROM orders WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  },

  async getByCustomerId(customerId) {
    const result = await db.query(
      `SELECT * FROM orders WHERE customer_id = $1 ORDER BY order_date DESC`,
      [customerId]
    );
    return result.rows;
  },

  async create(orderData) {
    const { customerId, subtotal, tax, deliveryFee, status } = orderData;
    const result = await db.query(
      `INSERT INTO orders (customer_id, subtotal, tax, delivery_fee, status, order_date)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING *`,
      [customerId, subtotal, tax, deliveryFee, status]
    );
    return result.rows[0];
  },

  async update(id, orderData) {
    const { status } = orderData;
    const result = await db.query(
      `UPDATE orders SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    await db.query(`DELETE FROM orders WHERE id = $1`, [id]);
    return true;
  },

  async validateOrderExists(orderId, customerId) {
    const result = await db.query(
      `SELECT id FROM orders WHERE id = $1 AND customer_id = $2`,
      [orderId, customerId]
    );
    return result.rows[0] || null;
  }
};

export default ordersModel;