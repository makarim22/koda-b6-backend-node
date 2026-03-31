import express from "express";
import productsController from "../controllers/products.controller.js";

const router = express.Router();

router.post("", (req, res) => productsController.createProduct(req, res))

export default router;
