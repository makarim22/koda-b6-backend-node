import db from '../db/index.js';

const userReviewsModel = {
  async create(reviewData){
    const{ userId, productId, orderId, message, rating} = reviewData;
    const result = await db.query(`insert into user_review(user_id, product_id, order_id, message, rating) values ($1, $2, $3, $4, $5) RETURNING *`,
      [userId, productId, orderId, message, rating]
    )
    return result.rows[0];
  },

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
  async getByUserandProduct(userId, productId, orderId){
   const result = await db.query(`select * from user_review where user_id = $1 and product_id = $2 and order_id = $3`,[userId, productId, orderId])
   console.log("result", result);
   return result.rows[0]
  }
}

export default userReviewsModel;