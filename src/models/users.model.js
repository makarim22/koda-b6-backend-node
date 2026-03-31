import db from '../db/index.js';

const UserModel = {
  /**
   * Creates a new user in the database
   * 
   * @param {Object} userData - User data object
   * @param {string} userData.name - User's full name
   * @param {string} userData.email - User's email address
   * @param {string} userData.password - User's password
   * @returns {Promise<Object>} The created user object with auto-generated id
   */
  async create(userData) {
    const { name, email, password } = userData;
    const result = await db.query(
      'INSERT INTO users (full_name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, password]
    );
    return result.rows[0];
  },

  /**
   * Retrieves all users with pagination support
   * 
   * @param {number} [page=1] - Page number (1-indexed)
   * @param {number} [limit=10] - Number of users per page
   * @returns {Promise<Object>} Paginated response object
   */
  async getAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const result = await db.query(
      'SELECT * FROM users ORDER BY id LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    
    const countResult = await db.query('SELECT COUNT(*) FROM users');
    const totalUser = parseInt(countResult.rows[0].count);
    
    return {
      data: result.rows,
      totalUser,
      currentPage: page,
      limit,
      totalPages: Math.ceil(totalUser / limit)
    };
  },

  /**
   * Retrieves a single user by their ID
   * 
   * @param {number} id - The user's unique identifier
   * @returns {Promise<Object|undefined>} The user object if found, undefined otherwise
   */
  async getById(id) {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  },

    /**
   * Retrieves a single user by their email
   * 
   * @param {string} email - The user's email
   * @returns {Promise<Object|undefined>} The user object if found, undefined otherwise
   */
  async getByEmail(email){
   const result = await db.query('select * from users where email= $1', [email]);
   return result.rows[0];
  },

  /**
   * Updates a user's information by ID
   * Only updates provided fields, preserves existing values for omitted fields
   * 
   * @param {number} id - The user's unique identifier
   * @param {Object} userData - Updated user data object
   * @returns {Promise<Object|null>} The updated user object if found, null if user doesn't exist
   */
  async update(id, userData) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (userData.name !== undefined) {
      fields.push(`name = $${paramCount++}`);
      values.push(userData.name);
    }
    if (userData.email !== undefined) {
      fields.push(`email = $${paramCount++}`);
      values.push(userData.email);
    }

    if (fields.length === 0) return null;

    values.push(id);
    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    
    const result = await db.query(sql, values);
    return result.rows[0] || null;
  },

  /**
   * Deletes a user by their ID
   * 
   * @param {number} id - The user's unique identifier
   * @returns {Promise<boolean>} True if user was deleted, false if user not found
   */
  async delete(id) {
    const result = await db.query('DELETE FROM users WHERE id = $1', [id]);
    return result.rowCount > 0;
  }
};

export default UserModel;