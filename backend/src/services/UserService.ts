import bcrypt from "bcryptjs";
import { prisma } from "../prisma/client";

export class UserService {
  async updateMe(userId: number, data: any) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getPublicUserProfile(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        bio: true,
        avatarUrl: true,
        projects: {
          select: {
            id: true,
            title: true,
            description: true,
            imageUrl: true,
            toolsUsed: true,
            createdAt: true,
            updatedAt: true,
            category: {
              select: {
                id: true,
                name: true
              }
            },
            _count: {
              select: {
                likes: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }
}