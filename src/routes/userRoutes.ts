import { Router } from 'express';
import { listUsers } from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/users', authMiddleware, listUsers); // Protect route with authMiddleware

export default router;
