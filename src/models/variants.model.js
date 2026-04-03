import db from '../db/index.js';

const VariantModel = {
  async create(name, additionalPrice) {
    const result = await db.query(
      `INSERT INTO variants (name, additional_price) 
       VALUES ($1, $2) 
       RETURNING *`,
      [name, additionalPrice]
    );
    return result.rows[0];
  },

  async getAll() {
    const result = await db.query(
      `SELECT * FROM variants ORDER BY name`
    );
    return result.rows;
  },

  async getById(id) {
    const result = await db.query(
      `SELECT * FROM variants WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  },

  async getByProductId(productId) {
    const result = await db.query(
      `SELECT v.id, v.name, v.additional_price
       FROM variants v
       INNER JOIN product_variants pv ON v.id = pv.variant_id
       WHERE pv.product_id = $1
       ORDER BY v.name`,
      [productId]
    );
    return result.rows;
  },

  async addToProduct(productId, variantId) {
    const result = await db.query(
      `INSERT INTO product_variants (product_id, variant_id) 
       VALUES ($1, $2) 
       ON CONFLICT (product_id, variant_id) DO NOTHING
       RETURNING *`,
      [productId, variantId]
    );
    return result.rows[0];
  },

  async removeFromProduct(productId, variantId) {
    const result = await db.query(
      `DELETE FROM product_variants 
       WHERE product_id = $1 AND variant_id = $2
       RETURNING *`,
      [productId, variantId]
    );
    return result.rows[0];
  },

  async getProductsByVariantId(variantId) {
    const result = await db.query(
      `SELECT p.id, p.name, p.description, p.price
       FROM products p
       INNER JOIN product_variants pv ON p.id = pv.product_id
       WHERE pv.variant_id = $1
       ORDER BY p.name`,
      [variantId]
    );
    return result.rows;
  },

  async update(id, name, additionalPrice) {
    const result = await db.query(
      `UPDATE variants 
       SET name = $1, additional_price = $2
       WHERE id = $3
       RETURNING *`,
      [name, additionalPrice, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await db.query(
      `DELETE FROM variants WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  },

  async validateVariantExists(variantId) {
    const result = await db.query(
      `SELECT id FROM variants WHERE id = $1`,
      [variantId]
    );
    return result.rows.length > 0;
  },

  async isAssignedToProduct(productId, variantId) {
    const result = await db.query(
      `SELECT id FROM product_variants 
       WHERE product_id = $1 AND variant_id = $2`,
      [productId, variantId]
    );
    return result.rows.length > 0;
  }
}

export default VariantModel();
