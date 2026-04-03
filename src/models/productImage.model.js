import db from '../db/index.js';

const ProductImage= {
  async create(productId, path, isPrimary = false) {
    const query = `
      INSERT INTO product_image (product_id, path, is_primary)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const result = await db.query(query, [productId, path, isPrimary]);
    return result.rows[0];
  },

  async getById(id) {
    const query = `SELECT * FROM product_image WHERE id = $1`;
    const result = await db.query(query, [id]);
    return result.rows[0];
  },

  async getByProductId(productId) {
    const query = `
      SELECT * FROM product_image 
      WHERE product_id = $1 
      ORDER BY is_primary DESC, created_at ASC
    `;
    const result = await db.query(query, [productId]);
    return result.rows;
  },

  async getPrimaryImage(productId) {
    const query = `
      SELECT * FROM product_image 
      WHERE product_id = $1 AND is_primary = true
      LIMIT 1
    `;
    const result = await db.query(query, [productId]);
    return result.rows[0];
  },

  async update(id, path, isPrimary) {
    const query = `
      UPDATE product_image 
      SET path = $2, is_primary = $3, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const result = await db.query(query, [id, path, isPrimary]);
    return result.rows[0];
  },

  async updatePath(id, path) {
    const query = `
      UPDATE product_image 
      SET path = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const result = await db.query(query, [id, path]);
    return result.rows[0];
  },

  async delete(id) {
    const query = `DELETE FROM product_image WHERE id = $1`;
    await db.query(query, [id]);
  },

  async deleteByProductId(productId) {
    const query = `DELETE FROM product_image WHERE product_id = $1`;
    await db.query(query, [productId]);
  },

  async validateImageExists(id) {
    const query = `SELECT id FROM product_image WHERE id = $1`;
    const result = await db.query(query, [id]);
    return result.rows.length > 0;
  },

  async hasImages(productId) {
    const count = await this.getImageCountByProductId(productId);
    return count > 0;
  }
}

export default ProductImage();