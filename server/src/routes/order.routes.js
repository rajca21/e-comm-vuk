import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import {
  createOrder,
  listOrders,
  getOrder,
  updateOrderStatus,
  cancelMyOrder,
} from '../controllers/order.controller.js';

const router = Router();

router.post('/', requireAuth, createOrder);
router.get('/', requireAuth, listOrders);
router.get('/:id', requireAuth, getOrder);
router.patch(
  '/:id/status',
  requireAuth,
  requireRole('ADMIN'),
  updateOrderStatus
);
router.post('/:id/cancel', requireAuth, cancelMyOrder);

export default router;
