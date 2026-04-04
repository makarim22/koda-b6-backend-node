import express from "express";
import productsController from "../controllers/products.controller.js";

import variantsController from "../controllers/variants.controller.js";
import sizesController from "../controllers/sizes.controller.js";

const router = express.Router();

router.post("", (req, res) => productsController.createProduct(req, res))
router.get("", (req, res) => productsController.getAllProducts(req,res))
router.get("/:id", (req, res) => productsController.getProductById(req, res));
router.put("/:id", (req, res) => productsController.updateProduct(req, res));
router.delete("/:id", (req, res) => productsController.deleteProduct(req, res));


// Variants routes
router.get("/:id/variants", (req, res) => variantsController.getVariantsByProduct(req, res));
router.post("/:id/variants", (req, res) => variantsController.addVariantToProduct(req, res));
router.delete("/:id/variants/:variantId", (req, res) => variantsController.removeVariantFromProduct(req, res));

// Sizes routes
router.get("/:id/sizes", (req, res) => sizesController.getSizesByProduct(req, res));
router.post("/:id/sizes", (req, res) => sizesController.addSizeToProduct(req, res));
router.delete("/:id/sizes/:sizeId", (req, res) => sizesController.removeSizeFromProduct(req, res));

export default router;