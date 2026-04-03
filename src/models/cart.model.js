import db from '../db/index.js';

const cartModel=  {
  async create(customerId, productId, sizeId, variantId, quantity) {
    const result = await db.query(
      `INSERT INTO cart (customer_id, product_id, size_id, variant_id, quantity)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [customerId, productId, sizeId, variantId, quantity]
    );
    return result.rows[0];
  },
  async getByCustomerId(customerId) {
    const result = await db.query(
      `SELECT * FROM cart WHERE customer_id = $1`,
      [customerId]
    );
    return result.rows;
  },
  async getByCustomerAndProduct(customerId, productId, sizeId, variantId) {
    const result = await db.query(
      `SELECT * FROM cart 
       WHERE customer_id = $1 AND product_id = $2 AND size_id = $3 AND variant_id = $4`,
      [customerId, productId, sizeId, variantId]
    );
    return result.rows[0];
  },
  async getById(cartId) {
    const result = await db.query(
      `SELECT * FROM cart WHERE id = $1`,
      [cartId]
    );
    return result.rows[0];
  },
  async updateQuantity(cartId, quantity) {
    const result = await db.query(
      `UPDATE cart SET quantity = $1 WHERE id = $2 RETURNING *`,
      [quantity, cartId]
    );
    return result.rows[0];
  },
  async delete(cartId) {
    const result = await db.query(
      `DELETE FROM cart WHERE id = $1 RETURNING *`,
      [cartId]
    );
    return result.rows[0];
  },
  async clearCart(customerId) {
    const result = await db.query(
      `DELETE FROM cart WHERE customer_id = $1 RETURNING *`,
      [customerId]
    );
    return result.rows;
  },
  async getCartCount(customerId) {
    const result = await db.query(
      `SELECT COUNT(*) as count FROM cart WHERE customer_id = $1`,
      [customerId]
    );
    return result.rows[0].count;
  }
}

export default cartModel;
