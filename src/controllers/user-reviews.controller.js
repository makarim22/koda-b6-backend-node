import userReviewsModel from "../models/user-reviews.model.js"

const userReviewsController = {
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