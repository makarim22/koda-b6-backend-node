import db from '../db/index.js';

const productModel = {
 async create(productData) {
    const { name, desc, stock, price } = productData;
    const result = await db.query(
      'INSERT INTO products (product_name, description, stock, base_price) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, desc, stock, price]
    );
    return result.rows[0];
  },
}

export default productModel;