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
    const { restaurantId, items, totalAmount, deliveryAddress } = req.body;

    if (!restaurantId || !items || items.length === 0 || !totalAmount) {
      return res.status(400).json({ error: 'Missing required order fields' });
    }

    const order = new Order({
      userId: req.userId,
      restaurantId,
      items,
      totalAmount,
      deliveryAddress: deliveryAddress || 'Not specified',
      status: 'pending'
    });
    
    await order.save();
    res.status(201).json(order);
  } catch (error: any) {
    console.error('Error creating order:', error);
    res.status(400).json({ error: error.message });
  }
});

export default router;


