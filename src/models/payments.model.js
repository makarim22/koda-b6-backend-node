import db from '../db/index.js';

const PaymentModel = {
  async create(paymentData) {
    const { orderId, userId, amount, status = 'pending' } = paymentData;
    const result = await db.query(
      'INSERT INTO payments (order_id, user_id, amount, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [orderId, userId, amount, status]
    );
    return result.rows[0];
  },

  async getAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const result = await db.query(
      'SELECT * FROM payments ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    
    const countResult = await db.query('SELECT COUNT(*) FROM payments');
    const totalPayments = parseInt(countResult.rows[0].count);
    
    return {
      data: result.rows,
      totalPayments,
      currentPage: page,
      limit,
      totalPages: Math.ceil(totalPayments / limit)
    };
  },

  async getById(id) {
    const result = await db.query('SELECT * FROM payments WHERE id = $1', [id]);
    return result.rows[0];
  },

  async getByOrderId(orderId) {
    const result = await db.query('SELECT * FROM payments WHERE order_id = $1 ORDER BY created_at DESC', [orderId]);
    return result.rows;
  },

  async getByUserId(userId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const result = await db.query(
      'SELECT * FROM payments WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [userId, limit, offset]
    );
    
    const countResult = await db.query('SELECT COUNT(*) FROM payments WHERE user_id = $1', [userId]);
    const totalPayments = parseInt(countResult.rows[0].count);
    
    return {
      data: result.rows,
      totalPayments,
      currentPage: page,
      limit,
      totalPages: Math.ceil(totalPayments / limit)
    };
  },

  async getByStatus(status, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const result = await db.query(
      'SELECT * FROM payments WHERE status = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [status, limit, offset]
    );
    
    const countResult = await db.query('SELECT COUNT(*) FROM payments WHERE status = $1', [status]);
    const totalPayments = parseInt(countResult.rows[0].count);
    
    return {
      data: result.rows,
      totalPayments,
      currentPage: page,
      limit,
      totalPages: Math.ceil(totalPayments / limit)
    };
  },

  async update(id, paymentData) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (paymentData.orderId !== undefined) {
      fields.push(`order_id = $${paramCount++}`);
      values.push(paymentData.orderId);
    }
    if (paymentData.userId !== undefined) {
      fields.push(`user_id = $${paramCount++}`);
      values.push(paymentData.userId);
    }
    if (paymentData.amount !== undefined) {
      fields.push(`amount = $${paramCount++}`);
      values.push(paymentData.amount);
    }
    if (paymentData.status !== undefined) {
      fields.push(`status = $${paramCount++}`);
      values.push(paymentData.status);
    }

    if (fields.length === 0) return null;

    values.push(id);
    const sql = `UPDATE payments SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramCount} RETURNING *`;
    
    const result = await db.query(sql, values);
    return result.rows[0] || null;
  },

  async delete(id) {
    const result = await db.query('DELETE FROM payments WHERE id = $1', [id]);
    return result.rowCount > 0;
  }
};

export default PaymentModel;