import express from "express";
import AuthController from "../controllers/auth.controller.js";

const router = express.Router();

router.post("", (req, res) => AuthController.register(req, res));


export default router;