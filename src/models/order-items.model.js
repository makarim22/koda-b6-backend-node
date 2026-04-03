import db from '../db/index.js';

const orderItemsModel = {
  async create(itemData) {
    const { orderId, productId, variantId, sizeId, quantity, unitPrice, subtotal } = itemData;
    const result = await db.query(
      `INSERT INTO order_items(order_id, product_id, variant_id, size_id, quantity, unit_price, subtotal)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [orderId, productId, variantId, sizeId, quantity, unitPrice, subtotal]
    );
    return result.rows[0];
  },

  async getById(id) {
    const result = await db.query(
      `SELECT * FROM order_items WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  },

  async getByOrderId(orderId) {
    const result = await db.query(
      `SELECT * FROM order_items WHERE order_id = $1`,
      [orderId]
    );
    return result.rows;
  },

  async getByProductId(productId) {
    const result = await db.query(
      `SELECT * FROM order_items WHERE product_id = $1`,
      [productId]
    );
    return result.rows;
  },

  async getByOrderIdAndProductId(orderId, productId) {
    const result = await db.query(
      `SELECT * FROM order_items WHERE order_id = $1 AND product_id = $2`,
      [orderId, productId]
    );
    return result.rows[0];
  },

  async update(id, itemData) {
    const { orderId, productId, variantId, sizeId, quantity, unitPrice, subtotal } = itemData;
    const result = await db.query(
      `UPDATE order_items 
       SET order_id = $1, product_id = $2, variant_id = $3, size_id = $4, quantity = $5, unit_price = $6, subtotal = $7
       WHERE id = $8
       RETURNING *`,
      [orderId, productId, variantId, sizeId, quantity, unitPrice, subtotal, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await db.query(
      `DELETE FROM order_items WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  },

  async deleteByOrderId(orderId) {
    const result = await db.query(
      `DELETE FROM order_items WHERE order_id = $1 RETURNING *`,
      [orderId]
    );
    return result.rows;
  }
};

export default orderItemsModel;
