import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/authService';
import { registerWithReferral } from '../services/referralService';

export const register = async (req: Request, res: Response) => {
  const { email, password, referralCode } = req.body;
  try {
    const user = await registerWithReferral(email, password, referralCode);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const token = await loginUser(email, password);
  if (!token) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  res.json({ token });
};
