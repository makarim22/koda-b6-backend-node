import userReviewsModel from "../models/user-reviews.model.js"
import ordersModel from "../models/orders.model.js"
import orderItemsModel from "../models/order-items.model.js"

const userReviewsController = {
   async createReview(req, res) {
    try {
      const { userId, productId, orderId, message, rating } = req.body;

      const order = await ordersModel.validateOrderExists(orderId, userId);
      if (!order) {
        return res.status(404).json({ 
          error: "Order not found or does not belong to this user" 
        });
      }

      const orderItem = await orderItemsModel.getByOrderIdAndProductId(orderId, productId);
      if (!orderItem) {
        return res.status(400).json({ 
          error: "Product was not purchased in this order" 
        });
      }

      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ 
          error: "Rating must be between 1 and 5" 
        });
      }

      const existingReview = await userReviewsModel.getByUserandProduct(userId, productId, orderId);
      if (existingReview) {
        return res.status(409).json({ 
          error: "You have already reviewed this product" 
        });
      }

      const review = await userReviewsModel.create({
        userId,
        productId,
        orderId,
        message,
        rating
      });

      res.status(201).json(review);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create review" });
    }
  }
,
 async getAllReviews(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const reviews = await userReviewsModel.getAll(page, limit);
      res.json(reviews);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to retreive reviews" });
    }
  },
}

export default userReviewsController;