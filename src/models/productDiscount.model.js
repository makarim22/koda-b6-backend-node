import db from '../db/index.js';

const ProductDiscount = {
  async create(productId, discountRate, description, isFlashSale = false) {
    const result = await db.query(
      `INSERT INTO product_discount (product_id, discount_rate, description, is_flash_sale) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [productId, discountRate, description, isFlashSale]
    );
    return result.rows[0];
  },

  async getById(discountId) {
    const result = await db.query(
      `SELECT * FROM product_discount WHERE id = $1`,
      [discountId]
    );
    return result.rows[0];
  },

  async getByProductId(productId) {
    const result = await db.query(
      `SELECT * FROM product_discount WHERE product_id = $1`,
      [productId]
    );
    return result.rows;
  },

  async getAll() {
    const result = await db.query(
      `SELECT * FROM product_discount ORDER BY id DESC`
    );
    return result.rows;
  },

  async getFlashSales() {
    const result = await db.query(
      `SELECT * FROM product_discount WHERE is_flash_sale = true ORDER BY id DESC`
    );
    return result.rows;
  },

  async getActiveDiscounts() {
    const result = await db.query(
      `SELECT * FROM product_discount WHERE discount_rate > 0 ORDER BY discount_rate DESC`
    );
    return result.rows;
  },

  async update(discountId, productId, discountRate, description, isFlashSale) {
    const result = await db.query(
      `UPDATE product_discount 
       SET product_id = $1, discount_rate = $2, description = $3, is_flash_sale = $4
       WHERE id = $5 
       RETURNING *`,
      [productId, discountRate, description, isFlashSale, discountId]
    );
    return result.rows[0];
  },

  async updateDiscountRate(discountId, discountRate) {
    const result = await db.query(
      `UPDATE product_discount SET discount_rate = $1 WHERE id = $2 RETURNING *`,
      [discountRate, discountId]
    );
    return result.rows[0];
  },

  async updateFlashSaleStatus(discountId, isFlashSale) {
    const result = await db.query(
      `UPDATE product_discount SET is_flash_sale = $1 WHERE id = $2 RETURNING *`,
      [isFlashSale, discountId]
    );
    return result.rows[0];
  },

  async delete(discountId) {
    const result = await db.query(
      `DELETE FROM product_discount WHERE id = $1 RETURNING *`,
      [discountId]
    );
    return result.rows[0];
  },

  async deleteByProductId(productId) {
    const result = await db.query(
      `DELETE FROM product_discount WHERE product_id = $1 RETURNING *`,
      [productId]
    );
    return result.rows;
  },

  async validateDiscountExists(discountId) {
    const result = await db.query(
      `SELECT id FROM product_discount WHERE id = $1`,
      [discountId]
    );
    return result.rows.length > 0;
  },

  async getDiscountByProductId(productId) {
    const result = await db.query(
      `SELECT * FROM product_discount WHERE product_id = $1 LIMIT 1`,
      [productId]
    );
    return result.rows[0];
  }
}

export default ProductDiscount;
