import express from "express";
import { updateMe, getPublicUserProfile } from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/:id", getPublicUserProfile);

router.put("/me", authMiddleware, updateMe);

export default router;