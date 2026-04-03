import db from '../db/index.js';

const SizeModel =  {
  async create(name, additionalPrice) {
    const result = await db.query(
      `INSERT INTO sizes (name, additional_price) 
       VALUES ($1, $2) 
       RETURNING *`,
      [name, additionalPrice]
    );
    return result.rows[0];
  },

  async getAll() {
    const result = await db.query(
      `SELECT * FROM sizes ORDER BY name`
    );
    return result.rows;
  },

  async getById(id) {
    const result = await db.query(
      `SELECT * FROM sizes WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  },

  async getByProductId(productId) {
    const result = await db.query(
      `SELECT s.id, s.name, s.additional_price
       FROM sizes s
       INNER JOIN product_sizes ps ON s.id = ps.size_id
       WHERE ps.product_id = $1
       ORDER BY s.name`,
      [productId]
    );
    return result.rows;
  },

  async addToProduct(productId, sizeId) {
    const result = await db.query(
      `INSERT INTO product_sizes (product_id, size_id) 
       VALUES ($1, $2) 
       ON CONFLICT (product_id, size_id) DO NOTHING
       RETURNING *`,
      [productId, sizeId]
    );
    return result.rows[0];
  },

  async removeFromProduct(productId, sizeId) {
    const result = await db.query(
      `DELETE FROM product_sizes 
       WHERE product_id = $1 AND size_id = $2
       RETURNING *`,
      [productId, sizeId]
    );
    return result.rows[0];
  },

  async getProductsBySizeId(sizeId) {
    const result = await db.query(
      `SELECT p.id, p.name, p.description, p.price
       FROM products p
       INNER JOIN product_sizes ps ON p.id = ps.product_id
       WHERE ps.size_id = $1
       ORDER BY p.name`,
      [sizeId]
    );
    return result.rows;
  },

  async update(id, name, additionalPrice) {
    const result = await db.query(
      `UPDATE sizes 
       SET name = $1, additional_price = $2
       WHERE id = $3
       RETURNING *`,
      [name, additionalPrice, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await db.query(
      `DELETE FROM sizes WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  },

  async validateSizeExists(sizeId) {
    const result = await db.query(
      `SELECT id FROM sizes WHERE id = $1`,
      [sizeId]
    );
    return result.rows.length > 0;
  },

  async isAssignedToProduct(productId, sizeId) {
    const result = await db.query(
      `SELECT id FROM product_sizes 
       WHERE product_id = $1 AND size_id = $2`,
      [productId, sizeId]
    );
    return result.rows.length > 0;
  }
}

export default SizeModel();
