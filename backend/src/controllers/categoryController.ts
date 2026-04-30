import { Request, Response } from "express";
import { CategoryService } from "../services/CategoryService";

const categoryService = new CategoryService();

export const getCategories = async (req: Request, res: Response) => {
  const categories = await categoryService.getAllCategories();
  res.json(categories);
};

export const getCategoryById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const category = await categoryService.getCategoryById(id);
  res.json(category);
};

export const createCategory = async (req: Request, res: Response) => {
  const category = await categoryService.createCategory(req.body);
  res.status(201).json(category);
};

export const updateCategory = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const category = await categoryService.updateCategory(id, req.body);
  res.json(category);
};

export const deleteCategory = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await categoryService.deleteCategory(id);
  res.json({ message: "Category deleted successfully" });
};