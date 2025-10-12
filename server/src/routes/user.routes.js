import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import {
  listUsers,
  getUserById,
  updateUserRole,
} from '../controllers/user.controller.js';

const router = Router();

router.get('/', requireAuth, requireRole('ADMIN'), listUsers);
router.get('/:id', requireAuth, requireRole('ADMIN'), getUserById);
router.patch('/:id/role', requireAuth, requireRole('ADMIN'), updateUserRole);

export default router;
