import express from "express";
import userReviewsController from "../controllers/user-reviews.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User Reviews
 *   description: API untuk mengelola review produk dari pengguna
 */

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Dapatkan semua review dengan paginasi
 *     description: Mengambil daftar semua review produk dengan dukungan paginasi
 *     tags:
 *       - User Reviews
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Nomor halaman untuk paginasi (dimulai dari 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Jumlah review per halaman
 *     responses:
 *       200:
 *         description: Daftar review berhasil diambil
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
 *                   userId:
 *                     type: integer
 *                     example: 5
 *                   productId:
 *                     type: integer
 *                     example: 3
 *                   orderId:
 *                     type: integer
 *                     example: 12
 *                   message:
 *                     type: string
 *                     example: "Produk sangat memuaskan, kualitas bagus dan pengiriman cepat"
 *                   rating:
 *                     type: integer
 *                     description: Rating dari 1 sampai 5
 *                     example: 5
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-01-15T10:30:00Z"
 *       500:
 *         description: Gagal mengambil review
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to retreive reviews"
 */

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Buat review produk baru
 *     description: Membuat review untuk produk yang telah dibeli melalui order. Setiap user hanya dapat membuat satu review per produk per order.
 *     tags:
 *       - User Reviews
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - productId
 *               - orderId
 *               - rating
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID pengguna yang membuat review
 *                 example: 5
 *               productId:
 *                 type: integer
 *                 description: ID produk yang di-review
 *                 example: 3
 *               orderId:
 *                 type: integer
 *                 description: ID order dimana produk dibeli
 *                 example: 12
 *               message:
 *                 type: string
 *                 description: Isi review/deskripsi pengalaman dengan produk
 *                 example: "Produk sangat memuaskan, kualitas bagus dan pengiriman cepat"
 *               rating:
 *                 type: integer
 *                 description: Rating produk dari 1 sampai 5 (wajib diantara 1-5)
 *                 example: 5
 *     responses:
 *       201:
 *         description: Review berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 userId:
 *                   type: integer
 *                   example: 5
 *                 productId:
 *                   type: integer
 *                   example: 3
 *                 orderId:
 *                   type: integer
 *                   example: 12
 *                 message:
 *                   type: string
 *                   example: "Produk sangat memuaskan, kualitas bagus dan pengiriman cepat"
 *                 rating:
 *                   type: integer
 *                   example: 5
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-01-15T10:30:00Z"
 *       400:
 *         description: Request tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             examples:
 *               invalidRating:
 *                 value:
 *                   error: "Rating must be between 1 and 5"
 *               productNotInOrder:
 *                 value:
 *                   error: "Product was not purchased in this order"
 *       404:
 *         description: Order tidak ditemukan atau tidak milik user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Order not found or does not belong to this user"
 *       409:
 *         description: User sudah pernah membuat review untuk produk ini
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "You have already reviewed this product"
 *       500:
 *         description: Gagal membuat review
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to create review"
 */
router.get("", (req, res) => userReviewsController.getAllReviews(req, res));
router.post("",(req, res) => userReviewsController.createReview(req, res));
export default router;