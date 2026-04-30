import { Request, Response } from "express";
import { UserService } from "../services/UserService";

const userService = new UserService();

export const updateMe = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const updatedUser = await userService.updateMe(user.userId, req.body);

    res.json(updatedUser);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};