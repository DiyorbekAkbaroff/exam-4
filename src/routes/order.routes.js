import express from 'express';
import { createOrder, getUserOrders } from '../controller/order.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/create', requireAuth, createOrder);
router.get('/user', requireAuth, getUserOrders);

export default router; 