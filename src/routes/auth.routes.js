import express from "express";
import AuthController from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", (req, res) => AuthController.register(req, res));
router.post("/login", (req, res) => AuthController.login(req, res));


export default router;