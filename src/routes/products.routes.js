import express from "express";
import productsController from "../controllers/products.controller.js";

const router = express.Router();

router.post("", (req, res) => productsController.createProduct(req, res))
router.get("", (req, res) => productsController.getAllProducts(req,res))
router.get("/:id", (req, res) => productsController.getProductById(req, res));
router.put("/:id", (req, res) => productsController.updateProduct(req, res));
router.delete("/:id", (req, res) => productsController.deleteProduct(req, res));

export default router;