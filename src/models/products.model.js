import db from '../db/index.js';

const ProductModel = {
  /**
   * Creates a new product in the database
   * 
   * @param {Object} productData - Product data object
   * @param {string} productData.name - Product name
   * @param {string} productData.desc - Product description
   * @param {number} productData.stock - Stock quantity
   * @param {number} productData.price - Base price
   * @returns {Promise<Object>} The created product object with auto-generated id
   */
  async create(productData) {
    const { name, desc, stock, price } = productData;
    const result = await db.query(
      'INSERT INTO products (product_name, description, stock, base_price) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, desc, stock, price]
    );
    return result.rows[0];
  },

  /**
   * Retrieves all products with pagination support
   * 
   * @param {number} [page=1] - Page number (1-indexed)
   * @param {number} [limit=10] - Number of products per page
   * @returns {Promise<Object>} Paginated response object
   */
  async getAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const result = await db.query(
      'SELECT * FROM products ORDER BY id LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    
    const countResult = await db.query('SELECT COUNT(*) FROM products');
    const totalProducts = parseInt(countResult.rows[0].count);
    
    return {
      data: result.rows,
      totalProducts,
      currentPage: page,
      limit,
      totalPages: Math.ceil(totalProducts / limit)
    };
  },

  /**
   * Retrieves a single product by its ID
   * 
   * @param {number} id - The product's unique identifier
   * @returns {Promise<Object|undefined>} The product object if found, undefined otherwise
   */
  async getById(id) {
    const result = await db.query('SELECT * FROM products WHERE id = $1', [id]);
    return result.rows[0];
  },

  async getByName(name) {
  const result = await db.query('SELECT * FROM products WHERE product_name ILIKE $1', [`%${name}%`]);
  return result.rows;
},

  /**
   * Updates a product's information by ID
   * Only updates provided fields, preserves existing values for omitted fields
   * 
   * @param {number} id - The product's unique identifier
   * @param {Object} productData - Updated product data object
   * @returns {Promise<Object|null>} The updated product object if found, null if product doesn't exist
   */
  async update(id, productData) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (productData.name !== undefined) {
      fields.push(`product_name = $${paramCount++}`);
      values.push(productData.name);
    }
    if (productData.desc !== undefined) {
      fields.push(`description = $${paramCount++}`);
      values.push(productData.desc);
    }
    if (productData.stock !== undefined) {
      fields.push(`stock = $${paramCount++}`);
      values.push(productData.stock);
    }
    if (productData.price !== undefined) {
      fields.push(`base_price = $${paramCount++}`);
      values.push(productData.price);
    }

    if (fields.length === 0) return null;

    values.push(id);
    const sql = `UPDATE products SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    
    const result = await db.query(sql, values);
    return result.rows[0] || null;
  },

  /**
   * Deletes a product by its ID
   * 
   * @param {number} id - The product's unique identifier
   * @returns {Promise<boolean>} True if product was deleted, false if product not found
   */
  async delete(id) {
    const result = await db.query('DELETE FROM products WHERE id = $1', [id]);
    return result.rowCount > 0;
  }
};

export default ProductModel;