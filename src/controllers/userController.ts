import { Request, Response } from 'express';
import { getAllUsers } from '../services/userService';

export const listUsers = async (req: Request, res: Response) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10
  try {
    const users = await getAllUsers(Number(page), Number(limit));
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
