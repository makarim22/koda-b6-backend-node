import express from "express";
import productsController from "../controllers/products.controller.js";
import variantsController from "../controllers/variants.controller.js";
import sizesController from "../controllers/sizes.controller.js";
import productImagesController from "../controllers/product-images.controller.js";
import productDiscountsController from "../controllers/product-discounts.controller.js";
import { uploadProductImage } from '../config/multer.js';

const router = express.Router();

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     description: Creates a new product with name, description, stock, and price
 *     tags:
 *       - Products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - desc
 *               - stock
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Laptop Pro"
 *               desc:
 *                 type: string
 *                 example: "High-performance laptop with 16GB RAM"
 *               stock:
 *                 type: integer
 *                 example: 50
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 1299.99
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "Laptop Pro"
 *                 desc:
 *                   type: string
 *                   example: "High-performance laptop with 16GB RAM"
 *                 stock:
 *                   type: integer
 *                   example: 50
 *                 price:
 *                   type: number
 *                   format: float
 *                   example: 1299.99
 *       500:
 *         description: Failed to create product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to create product"
 *
 *   get:
 *     summary: Get all products
 *     description: Retrieves all products with pagination support or search by name
 *     tags:
 *       - Products
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Search product by name
 *         example: "Laptop"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of products per page
 *         example: 10
 *     responses:
 *       200:
 *         description: List of products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "Laptop Pro"
 *                   desc:
 *                     type: string
 *                     example: "High-performance laptop with 16GB RAM"
 *                   stock:
 *                     type: integer
 *                     example: 50
 *                   price:
 *                     type: number
 *                     format: float
 *                     example: 1299.99
 *       500:
 *         description: Failed to retrieve products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to retreive products"
 *
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     description: Retrieves a single product by its ID
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "Laptop Pro"
 *                 desc:
 *                   type: string
 *                   example: "High-performance laptop with 16GB RAM"
 *                 stock:
 *                   type: integer
 *                   example: 50
 *                 price:
 *                   type: number
 *                   format: float
 *                   example: 1299.99
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Product not found"
 *       500:
 *         description: Failed to fetch product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch product"
 *
 *   put:
 *     summary: Update a product
 *     description: Updates an existing product by ID
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Laptop Pro Max"
 *               desc:
 *                 type: string
 *                 example: "Updated description"
 *               stock:
 *                 type: integer
 *                 example: 45
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 1399.99
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "Laptop Pro Max"
 *                 desc:
 *                   type: string
 *                   example: "Updated description"
 *                 stock:
 *                   type: integer
 *                   example: 45
 *                 price:
 *                   type: number
 *                   format: float
 *                   example: 1399.99
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Product not found"
 *       500:
 *         description: Failed to update product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to update product"
 *
 *   delete:
 *     summary: Delete a product
 *     description: Deletes a product by ID
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product deleted successfully"
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Product not found"
 *       500:
 *         description: Failed to delete product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to delete product"
 */
router.post("", (req, res) => productsController.createProduct(req, res))
router.get("", (req, res) => productsController.getAllProducts(req,res))
router.get("/:id", (req, res) => productsController.getProductById(req, res));
router.put("/:id", (req, res) => productsController.updateProduct(req, res));
router.delete("/:id", (req, res) => productsController.deleteProduct(req, res));

/**
 * @swagger
 * /api/variants:
 *   get:
 *     summary: Get all variants
 *     description: Retrieve a list of all product variants
 *     tags:
 *       - Variants
 *     responses:
 *       200:
 *         description: List of variants retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Variant'
 *       500:
 *         description: Failed to retrieve variants
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   post:
 *     summary: Create a new variant
 *     description: Create a new product variant with name and optional additional price
 *     tags:
 *       - Variants
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Variant name
 *                 example: Red Color
 *               additionalPrice:
 *                 type: number
 *                 description: Additional price for this variant
 *                 example: 50000
 *     responses:
 *       201:
 *         description: Variant created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Variant'
 *       400:
 *         description: Missing required field (name)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Failed to create variant
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/variants/{id}:
 *   get:
 *     summary: Get variant by ID
 *     description: Retrieve a specific variant by its ID
 *     tags:
 *       - Variants
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Variant ID
 *     responses:
 *       200:
 *         description: Variant retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Variant'
 *       404:
 *         description: Variant not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Failed to retrieve variant
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   put:
 *     summary: Update a variant
 *     description: Update an existing variant's name and/or additional price
 *     tags:
 *       - Variants
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Variant ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated variant name
 *                 example: Blue Color
 *               additionalPrice:
 *                 type: number
 *                 description: Updated additional price
 *                 example: 75000
 *     responses:
 *       200:
 *         description: Variant updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Variant'
 *       404:
 *         description: Variant not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Failed to update variant
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   delete:
 *     summary: Delete a variant
 *     description: Delete an existing variant by ID
 *     tags:
 *       - Variants
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Variant ID
 *     responses:
 *       200:
 *         description: Variant deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Varian berhasil dihapus
 *       404:
 *         description: Variant not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Failed to delete variant
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/products/{id}/variants:
 *   get:
 *     summary: Get variants by product ID
 *     description: Retrieve all variants associated with a specific product
 *     tags:
 *       - Product Variants
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product variants retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Variant'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Failed to retrieve product variants
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   post:
 *     summary: Add variant to product
 *     description: Associate an existing variant with a product
 *     tags:
 *       - Product Variants
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - variantId
 *             properties:
 *               variantId:
 *                 type: integer
 *                 description: Variant ID to add to product
 *                 example: 1
 *     responses:
 *       201:
 *         description: Variant added to product successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Varian berhasil ditambahkan ke produk
 *       400:
 *         description: Bad request - missing variantId or variant already assigned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Product or variant not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Failed to add variant to product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/products/{id}/variants/{variantId}:
 *   delete:
 *     summary: Remove variant from product
 *     description: Disassociate a variant from a product
 *     tags:
 *       - Product Variants
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *       - in: path
 *         name: variantId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Variant ID to remove
 *     responses:
 *       200:
 *         description: Variant removed from product successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Varian berhasil dihapus dari produk
 *       404:
 *         description: Variant not found in product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Failed to remove variant from product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * components:
 *   schemas:
 *     Variant:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Red Color
 *         additionalPrice:
 *           type: number
 *           example: 50000
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-15T10:30:00Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-15T10:30:00Z
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: error
 *         message:
 *           type: string
 *           example: Varian tidak ditemukan
 *         error:
 *           type: string
 *           description: Error details (optional)
 */
// Variants routes
router.get("/:id/variants", (req, res) => variantsController.getVariantsByProduct(req, res));
router.post("/:id/variants", (req, res) => variantsController.addVariantToProduct(req, res));
router.delete("/:id/variants/:variantId", (req, res) => variantsController.removeVariantFromProduct(req, res));

/**
 * @swagger
 * /api/products/{id}/sizes:
 *   get:
 *     summary: Get all sizes for a product
 *     description: Retrieve all sizes associated with a specific product
 *     tags:
 *       - Product Sizes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Successfully retrieved product sizes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "Large"
 *                       additionalPrice:
 *                         type: number
 *                         example: 5000
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Produk tidak ditemukan"
 *       500:
 *         description: Failed to retrieve product sizes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Gagal mengambil ukuran produk"
 *                 error:
 *                   type: string
 *
 *   post:
 *     summary: Add size to product
 *     description: Associate an existing size with a product
 *     tags:
 *       - Product Sizes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sizeId
 *             properties:
 *               sizeId:
 *                 type: integer
 *                 example: 2
 *                 description: Size ID to add to product
 *     responses:
 *       201:
 *         description: Size successfully added to product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: "Ukuran berhasil ditambahkan ke produk"
 *       400:
 *         description: Bad request - invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   oneOf:
 *                     - example: "size_id diperlukan"
 *                     - example: "Ukuran sudah ditambahkan ke produk ini"
 *       404:
 *         description: Product or size not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   oneOf:
 *                     - example: "Produk tidak ditemukan"
 *                     - example: "Ukuran tidak ditemukan"
 *       500:
 *         description: Failed to add size to product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Gagal menambahkan ukuran ke produk"
 *                 error:
 *                   type: string
 *
 * /api/products/{id}/sizes/{sizeId}:
 *   delete:
 *     summary: Remove size from product
 *     description: Disassociate a size from a product
 *     tags:
 *       - Product Sizes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *       - in: path
 *         name: sizeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Size ID to remove from product
 *     responses:
 *       200:
 *         description: Size successfully removed from product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: "Ukuran berhasil dihapus dari produk"
 *       404:
 *         description: Size not found in product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Ukuran tidak ditemukan di produk ini"
 *       500:
 *         description: Failed to remove size from product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Gagal menghapus ukuran dari produk"
 *                 error:
 *                   type: string
 */
// Sizes routes
router.get("/:id/sizes", (req, res) => sizesController.getSizesByProduct(req, res));
router.post("/:id/sizes", (req, res) => sizesController.addSizeToProduct(req, res));
router.delete("/:id/sizes/:sizeId", (req, res) => sizesController.removeSizeFromProduct(req, res));

/**
 * @swagger
 * /api/products/{id}/images:
 *   get:
 *     summary: Get all images for a product
 *     description: Retrieve all images associated with a specific product
 *     tags:
 *       - Product Images
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Successfully retrieved product images
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       product_id:
 *                         type: integer
 *                         example: 5
 *                       path:
 *                         type: string
 *                         example: /uploads/products/image1.jpg
 *                       is_primary:
 *                         type: boolean
 *                         example: true
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Produk tidak ditemukan
 *       500:
 *         description: Failed to retrieve product images
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Gagal mengambil gambar produk
 *                 error:
 *                   type: string
 *   post:
 *     summary: Add image to product
 *     description: Add a new image to a product
 *     tags:
 *       - Product Images
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - path
 *             properties:
 *               path:
 *                 type: string
 *                 example: /uploads/products/image1.jpg
 *                 description: Image file path
 *               is_primary:
 *                 type: boolean
 *                 example: false
 *                 description: Whether this is the primary image (optional, defaults to false)
 *     responses:
 *       201:
 *         description: Image successfully added to product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Gambar berhasil ditambahkan
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     product_id:
 *                       type: integer
 *                       example: 5
 *                     path:
 *                       type: string
 *                       example: /uploads/products/image1.jpg
 *                     is_primary:
 *                       type: boolean
 *                       example: false
 *       400:
 *         description: Missing required field (path)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Path gambar diperlukan
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Produk tidak ditemukan
 *       500:
 *         description: Failed to add image to product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Gagal menambahkan gambar produk
 *                 error:
 *                   type: string
 * /api/products/{id}/images/{imageId}:
 *   put:
 *     summary: Update product image
 *     description: Update image properties (path and/or is_primary)
 *     tags:
 *       - Product Images
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Image ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               path:
 *                 type: string
 *                 example: /uploads/products/image1-updated.jpg
 *                 description: New image file path (optional)
 *               is_primary:
 *                 type: boolean
 *                 example: true
 *                 description: Set as primary image (optional)
 *     responses:
 *       200:
 *         description: Image successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Gambar berhasil diperbarui
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     product_id:
 *                       type: integer
 *                       example: 5
 *                     path:
 *                       type: string
 *                       example: /uploads/products/image1-updated.jpg
 *                     is_primary:
 *                       type: boolean
 *                       example: true
 *       404:
 *         description: Product or image not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Gambar tidak ditemukan
 *       500:
 *         description: Failed to update image
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Gagal memperbarui gambar produk
 *                 error:
 *                   type: string
 *   delete:
 *     summary: Delete product image
 *     description: Remove an image from a product
 *     tags:
 *       - Product Images
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Image ID
 *     responses:
 *       200:
 *         description: Image successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Gambar berhasil dihapus
 *       404:
 *         description: Product or image not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Gambar tidak ditemukan
 *       500:
 *         description: Failed to delete image
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Gagal menghapus gambar produk
 *                 error:
 *                   type: string
 */
// Product Images routes

router.get("/:id/images", (req, res) => productImagesController.getImagesByProduct(req, res));
router.post("/:id/images", (req, res) => productImagesController.addImageToProduct(req, res));
router.put("/:id/images/:imageId", (req, res) => productImagesController.updateImage(req, res));
router.delete("/:id/images/:imageId", (req, res) => productImagesController.deleteImage(req, res));
router.post('/:id/images/upload', uploadProductImage.single('image'),(req, res) => productImagesController.uploadImage(req, res));
/**
 * @swagger
 * /api/products/{id}/discounts:
 *   get:
 *     summary: Get discounts by product
 *     description: Retrieve all discounts for a specific product
 *     tags:
 *       - Product Discounts
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Discounts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       product_id:
 *                         type: integer
 *                         example: 1
 *                       discount_rate:
 *                         type: number
 *                         format: float
 *                         example: 15.5
 *                       description:
 *                         type: string
 *                         nullable: true
 *                         example: Summer sale
 *                       is_flash_sale:
 *                         type: boolean
 *                         example: false
 *                       is_active:
 *                         type: boolean
 *                         example: true
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Produk tidak ditemukan
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Gagal mengambil diskon produk
 *                 error:
 *                   type: string
 *
 *   post:
 *     summary: Create discount for product
 *     description: Add a new discount to a product
 *     tags:
 *       - Product Discounts
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - discount_rate
 *             properties:
 *               discount_rate:
 *                 type: number
 *                 format: float
 *                 description: Discount percentage (0-100)
 *                 example: 15.5
 *               description:
 *                 type: string
 *                 description: Discount description (optional)
 *                 example: Summer sale
 *               is_flash_sale:
 *                 type: boolean
 *                 description: Is flash sale (optional, default false)
 *                 example: false
 *     responses:
 *       201:
 *         description: Discount created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Diskon berhasil ditambahkan
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     product_id:
 *                       type: integer
 *                       example: 1
 *                     discount_rate:
 *                       type: number
 *                       format: float
 *                       example: 15.5
 *                     description:
 *                       type: string
 *                       nullable: true
 *                       example: Summer sale
 *                     is_flash_sale:
 *                       type: boolean
 *                       example: false
 *                     is_active:
 *                       type: boolean
 *                       example: true
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   enum:
 *                     - Persentase diskon diperlukan
 *                     - Persentase diskon harus antara 0-100
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Produk tidak ditemukan
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Gagal menambahkan diskon produk
 *                 error:
 *                   type: string
 *
 * /api/products/{id}/discounts/{discountId}:
 *   put:
 *     summary: Update discount
 *     description: Update an existing discount for a product
 *     tags:
 *       - Product Discounts
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: discountId
 *         in: path
 *         required: true
 *         description: Discount ID
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               discount_rate:
 *                 type: number
 *                 format: float
 *                 description: Discount percentage (0-100, optional)
 *                 example: 20.5
 *               description:
 *                 type: string
 *                 description: Discount description (optional)
 *                 example: Updated summer sale
 *               is_flash_sale:
 *                 type: boolean
 *                 description: Is flash sale (optional)
 *                 example: true
 *               is_active:
 *                 type: boolean
 *                 description: Is active (optional)
 *                 example: true
 *     responses:
 *       200:
 *         description: Discount updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Diskon berhasil diperbarui
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     product_id:
 *                       type: integer
 *                       example: 1
 *                     discount_rate:
 *                       type: number
 *                       format: float
 *                       example: 20.5
 *                     description:
 *                       type: string
 *                       nullable: true
 *                       example: Updated summer sale
 *                     is_flash_sale:
 *                       type: boolean
 *                       example: true
 *                     is_active:
 *                       type: boolean
 *                       example: true
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Persentase diskon harus antara 0-100
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   enum:
 *                     - Produk tidak ditemukan
 *                     - Diskon tidak ditemukan
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Gagal memperbarui diskon produk
 *                 error:
 *                   type: string
 *
 *   delete:
 *     summary: Delete discount
 *     description: Remove a discount from a product
 *     tags:
 *       - Product Discounts
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: discountId
 *         in: path
 *         required: true
 *         description: Discount ID
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Discount deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Diskon berhasil dihapus
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   enum:
 *                     - Produk tidak ditemukan
 *                     - Diskon tidak ditemukan
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Gagal menghapus diskon produk
 *                 error:
 *                   type: string
 */
// Product Discounts routes
router.get("/:id/discounts", (req, res) => productDiscountsController.getDiscountsByProduct(req, res));
router.post("/:id/discounts", (req, res) => productDiscountsController.createDiscount(req, res));
router.put("/:id/discounts/:discountId", (req, res) => productDiscountsController.updateDiscount(req, res));
router.delete("/:id/discounts/:discountId", (req, res) => productDiscountsController.deleteDiscount(req, res));

export default router;