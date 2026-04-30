import express from "express";
import {
  getProjectLikes,
  likeProject,
  unlikeProject
} from "../controllers/likeControllers";

import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/projects/:projectId/likes", getProjectLikes);
router.post("/projects/:projectId/likes", authMiddleware, likeProject);
router.delete("/projects/:projectId/likes", authMiddleware, unlikeProject);

export default router;