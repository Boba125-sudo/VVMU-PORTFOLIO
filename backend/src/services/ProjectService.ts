import { prisma } from "../prisma/client";

export class ProjectService {
  async getAllProjects() {
  return await prisma.project.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          bio: true,
          avatarUrl: true
        }
      },
      category: true
    }
  });
}

  async createProject(data: any) {
    return await prisma.project.create({
      data,
    });
  }

  async getProjectById(id: number) {
  return await prisma.project.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          bio: true,
          avatarUrl: true
        }
      },
      category: true
    }
  });
}

  async updateProject(id: number, userId: number, data: any) {
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new Error("Project not found");
    }

    if (project.userId !== userId) {
      throw new Error("You are not allowed to update this project");
    }

    return await prisma.project.update({
      where: { id },
      data,
    });
  }

  async deleteProject(id: number, userId: number) {
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new Error("Project not found");
    }

    if (project.userId !== userId) {
      throw new Error("You are not allowed to delete this project");
    }

    return await prisma.project.delete({
      where: { id },
    });
  }
}
