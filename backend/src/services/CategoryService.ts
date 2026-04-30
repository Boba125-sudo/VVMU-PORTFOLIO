import { prisma } from "../prisma/client";

export class CategoryService {
  async getAllCategories() {
    return await prisma.category.findMany({
      include: {
        projects: true
      }
    });
  }

  async getCategoryById(id: number) {
    return await prisma.category.findUnique({
      where: { id },
      include: {
        projects: true
      }
    });
  }

  async createCategory(data: any) {
    return await prisma.category.create({
      data
    });
  }

  async updateCategory(id: number, data: any) {
    return await prisma.category.update({
      where: { id },
      data
    });
  }

  async deleteCategory(id: number) {
    return await prisma.category.delete({
      where: { id }
    });
  }
}