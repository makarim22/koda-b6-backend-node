import express from "express";
import UserController from "../controllers/users.controller.js";

const router = express.Router();

router.post("/", (req, res) => UserController.createUser(req, res));
router.get("/", (req, res) => UserController.getAllUsers(req, res));
router.get("/:id", (req, res) => UserController.getUserById(req, res));
router.put("/:id", (req, res) => UserController.updateUser(req, res));
router.delete("/:id", (req, res) => UserController.deleteUser(req, res));

export default router;