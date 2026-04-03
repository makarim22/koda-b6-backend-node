import express from "express";
import UserController from "../controllers/users.controller.js";

const router = express.Router();

/**
 * @swagger
 * /admin/users:
 *  post:
 *   summary: create new user
 *   tags:
 *     - admin/users
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
 */
router.post("/", (req, res) => UserController.createUser(req, res));

/**
 * @swagger
 * /admin/users:
 *  get:
 *   summary: get all users
 *   tags:
 *     - admin/users
 *   responses:
 *    200:
 *     description: successfully retreived users
 */
router.get("/", (req, res) => UserController.getAllUsers(req, res));
router.get("/:id", (req, res) => UserController.getUserById(req, res));
router.put("/:id", (req, res) => UserController.updateUser(req, res));
router.delete("/:id", (req, res) => UserController.deleteUser(req, res));

export default router;