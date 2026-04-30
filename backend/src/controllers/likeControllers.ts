import { Request, Response } from "express";
import { LikeService } from "../services/LikeService";

const likeService = new LikeService();

export const getProjectLikes = async (req: Request, res: Response) => {
  const projectId = Number(req.params.projectId);

  const count = await likeService.countProjectLikes(projectId);

  res.json({
    likesCount: count
  });
};

export const likeProject = async (req: Request, res: Response) => {
  const projectId = Number(req.params.projectId);
  const user = (req as any).user;

  const like = await likeService.likeProject(user.userId, projectId);

  res.status(201).json(like);
};

export const unlikeProject = async (req: Request, res: Response) => {
  const projectId = Number(req.params.projectId);
  const user = (req as any).user;

  await likeService.unlikeProject(user.userId, projectId);

  res.json({
    message: "Project unliked successfully"
  });
};