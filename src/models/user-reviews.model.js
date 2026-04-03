import db from '../db/index.js';

const userReviewsModel = {
async getAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const result = await db.query(
      'SELECT * FROM user_review ORDER BY id LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    
    const countResult = await db.query('SELECT COUNT(*) FROM user_review');
    const totalReviews = parseInt(countResult.rows[0].count);
    
    return {
      data: result.rows,
      totalReviews,
      currentPage: page,
      limit,
      totalPages: Math.ceil(totalReviews / limit)
    };
  },
}

export default userReviewsModel;