import express from 'express';
import { addToCart, getCartByUserId, clearCart, updateCartItem } from '../controller/cart.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/add', addToCart);
router.get('/:userId', getCartByUserId);
router.post('/clear', requireAuth, clearCart);
router.put('/update', requireAuth, updateCartItem);

export default router;