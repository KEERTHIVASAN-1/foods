import express from 'express';
import Order from '../models/Order.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// Get user orders
router.get('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const orders = await Order.find({ userId: req.userId })
      .populate('restaurantId', 'name')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create order
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const order = new Order({
      ...req.body,
      userId: req.userId
    });
    await order.save();
    res.status(201).json(order);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;


