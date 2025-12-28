import express from 'express';
import Review from '../models/Review.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// Get reviews for restaurant
router.get('/restaurant/:id', async (req, res) => {
  try {
    const reviews = await Review.find({ restaurantId: req.params.id })
      .sort({ createdAt: -1 })
      .populate('userId', 'name');
    res.json(reviews);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get reviews for item
router.get('/item/:id', async (req, res) => {
  try {
    const reviews = await Review.find({ itemId: req.params.id })
      .sort({ createdAt: -1 })
      .populate('userId', 'name');
    res.json(reviews);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create review
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const review = new Review({
      ...req.body,
      userId: req.userId
    });
    await review.save();
    res.status(201).json(review);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;


