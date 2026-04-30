import { Request, Response } from "express";
import { ProjectService } from "../services/ProjectService";

const projectService = new ProjectService();

export const getProjects = async (req: Request, res: Response) => {
  const projects = await projectService.getAllProjects();
  res.json(projects);
};

export const createProject = async (req: Request, res: Response) => {
  const user = (req as any).user;

  const project = await projectService.createProject({
    ...req.body,
    userId: user.userId,
  });

  res.status(201).json(project);
};

export const getProjectById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const project = await projectService.getProjectById(id);
  res.json(project);
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const user = (req as any).user;

    const project = await projectService.updateProject(
      id,
      user.userId,
      req.body
    );

    res.json(project);
  } catch (error: any) {
    res.status(403).json({ message: error.message });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const user = (req as any).user;

    await projectService.deleteProject(id, user.userId);

    res.json({ message: "Project deleted successfully" });
  } catch (error: any) {
    res.status(403).json({ message: error.message });
  }
};
