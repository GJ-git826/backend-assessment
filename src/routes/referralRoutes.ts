import { Router } from 'express';
import { createReferralCode } from '../controllers/referralController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Protected route to generate a referral code
router.post('/generate', authMiddleware, createReferralCode);

export default router;
