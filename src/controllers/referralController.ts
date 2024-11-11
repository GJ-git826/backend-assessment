import { Request, Response } from 'express';
import { generateReferralCode } from '../services/referralService';

export const createReferralCode = async (req: Request, res: Response) => {
  const { userId } = (req as any).user; // Assuming authMiddleware has added `userId` to req.user
  try {
    const referralCode = await generateReferralCode(userId);
    res.json({ referralCode });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
