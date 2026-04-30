import express from "express";
import { updateMe } from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.put("/me", authMiddleware, updateMe);

export default router;