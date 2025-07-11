import express from 'express';
import { addToCart, getCartByUserId } from '../controller/cart.controller.js';

const router = express.Router();

router.post('/add', addToCart);
router.get('/:userId', getCartByUserId);

export default router;