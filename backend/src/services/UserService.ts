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
}