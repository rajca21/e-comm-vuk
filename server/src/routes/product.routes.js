import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import { upload } from '../middleware/upload.js';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  listProducts,
  getProduct,
} from '../controllers/product.controller.js';

const router = Router();

// public
router.get('/', listProducts);
router.get('/:id', getProduct);

// admin only
router.post(
  '/',
  requireAuth,
  requireRole('ADMIN'),
  upload.single('image'),
  createProduct
);
router.put(
  '/:id',
  requireAuth,
  requireRole('ADMIN'),
  upload.single('image'),
  updateProduct
);
router.delete('/:id', requireAuth, requireRole('ADMIN'), deleteProduct);

export default router;
