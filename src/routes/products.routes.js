import express from "express";
import productsController from "../controllers/products.controller.js";
import variantsController from "../controllers/variants.controller.js";
import sizesController from "../controllers/sizes.controller.js";
import productImagesController from "../controllers/product-images.controller.js";
import productDiscountsController from "../controllers/product-discounts.controller.js";

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

// Product Images routes
router.get("/:id/images", (req, res) => productImagesController.getImagesByProduct(req, res));
router.post("/:id/images", (req, res) => productImagesController.addImageToProduct(req, res));
router.put("/:id/images/:imageId", (req, res) => productImagesController.updateImage(req, res));
router.delete("/:id/images/:imageId", (req, res) => productImagesController.deleteImage(req, res));

// Product Discounts routes
router.get("/:id/discounts", (req, res) => productDiscountsController.getDiscountsByProduct(req, res));
router.post("/:id/discounts", (req, res) => productDiscountsController.createDiscount(req, res));
router.put("/:id/discounts/:discountId", (req, res) => productDiscountsController.updateDiscount(req, res));
router.delete("/:id/discounts/:discountId", (req, res) => productDiscountsController.deleteDiscount(req, res));

export default router;