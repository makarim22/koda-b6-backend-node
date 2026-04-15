import express from "express";
import UserController from "../controllers/users.controller.js";
import { authenticateJWT, authorizeRole } from "../middleware/auth-middleware.js";

const router = express.Router();

/**
 * @swagger
 * /admin/users:
 *  post:
 *   summary: create new user
 *   tags:
 *     - admin/users
 *   security:
 *     - BearerAuth: []
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        email:
 *         type: string
 *         example: john@example.com
 *        password:
 *         type: string
 *         example: password123
 *        phone:
 *         type: string
 *         example: 081529939012
 *        profile_image:
 *         type: string
 *         example: '/src/img/image1.png'
 *        name:
 *         type: string
 *         example: John Doe
 *   responses:
 *    200:
 *     description: successfully created user
 *    400:
 *     description: Invalid input or user already exists
 *    401:
 *     description: Unauthorized - missing or invalid JWT token
 *    403:
 *     description: Forbidden - only admin users can create users
 */
router.post(
  "/",
  authenticateJWT,
  authorizeRole("admin"),
  (req, res) => UserController.createUser(req, res)
);

/**
 * @swagger
 * /admin/users:
 *  get:
 *   summary: get all users
 *   tags:
 *     - admin/users
 *   security:
 *     - BearerAuth: []
 *   responses:
 *    200:
 *     description: successfully retrieved users
 *    401:
 *     description: Unauthorized - missing or invalid JWT token
 *    403:
 *     description: Forbidden - only admin users can view all users
 */
router.get(
  "/",
  authenticateJWT,
  authorizeRole("admin"),
  (req, res) => UserController.getAllUsers(req, res)
);

/**
 * @swagger
 * /admin/users/{id}:
 *  get:
 *   summary: get user by ID
 *   tags:
 *     - admin/users
 *   security:
 *     - BearerAuth: []
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *       description: User ID
 *   responses:
 *    200:
 *     description: successfully retrieved user
 *    401:
 *     description: Unauthorized - missing or invalid JWT token
 *    403:
 *     description: Forbidden - only admin users can view users
 *    404:
 *     description: User not found
 */
router.get(
  "/:id",
  authenticateJWT,
  authorizeRole("admin"),
  (req, res) => UserController.getUserById(req, res)
);

/**
 * @swagger
 * /admin/users/{id}:
 *  put:
 *   summary: update user
 *   tags:
 *     - admin/users
 *   security:
 *     - BearerAuth: []
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *       description: User ID
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        email:
 *         type: string
 *        password:
 *         type: string
 *        phone:
 *         type: string
 *        profile_image:
 *         type: string
 *        name:
 *         type: string
 *   responses:
 *    200:
 *     description: successfully updated user
 *    400:
 *     description: Invalid input
 *    401:
 *     description: Unauthorized - missing or invalid JWT token
 *    403:
 *     description: Forbidden - only admin users can update users
 *    404:
 *     description: User not found
 */
router.put(
  "/:id",
  authenticateJWT,
  authorizeRole("admin"),
  (req, res) => UserController.updateUser(req, res)
);

/**
 * @swagger
 * /admin/users/{id}:
 *  delete:
 *   summary: delete user
 *   tags:
 *     - admin/users
 *   security:
 *     - BearerAuth: []
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *       description: User ID
 *   responses:
 *    200:
 *     description: successfully deleted user
 *    401:
 *     description: Unauthorized - missing or invalid JWT token
 *    403:
 *     description: Forbidden - only admin users can delete users
 *    404:
 *     description: User not found
 */
router.delete(
  "/:id",
  authenticateJWT,
  authorizeRole("admin"),
  (req, res) => UserController.deleteUser(req, res)
);

export default router;