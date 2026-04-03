import express from "express";
import userReviewsController from "../controllers/user-reviews.controller.js";

const router = express.Router();

router.get("", (req, res) => userReviewsController.getAllReviews(req,res));

export default router;