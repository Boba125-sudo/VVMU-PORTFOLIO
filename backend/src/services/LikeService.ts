import { prisma } from "../prisma/client";

export class LikeService {
  async getLikesByProject(projectId: number) {
    return await prisma.like.findMany({
      where: { projectId },
      include: {
        user: true,
      },
    });
  }

  async likeProject(userId: number, projectId: number) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new Error("Project not found");
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return await prisma.like.create({
      data: {
        userId,
        projectId,
      },
    });
  }

  async unlikeProject(userId: number, projectId: number) {
    return await prisma.like.delete({
      where: {
        userId_projectId: {
          userId,
          projectId,
        },
      },
    });
  }

  async countProjectLikes(projectId: number) {
  return await prisma.like.count({
    where: { projectId }
  });
}
}
