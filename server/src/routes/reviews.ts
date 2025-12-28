import express from 'express';
import Review from '../models/Review.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// Get reviews for restaurant (includes both restaurant and item reviews)
router.get('/restaurant/:id', async (req, res) => {
  try {
    const reviews = await Review.find({ 
      $or: [
        { restaurantId: req.params.id },
        { restaurantId: req.params.id } // This will get all reviews for items in this restaurant via populate
      ]
    })
      .populate('itemId', 'name')
      .sort({ createdAt: -1 });
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
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { itemId, restaurantId, rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    if (!comment || comment.trim().length === 0) {
      return res.status(400).json({ error: 'Comment is required' });
    }

    const review = new Review({
      itemId,
      restaurantId,
      userId: req.userId,
      userName: user.name,
      rating: parseInt(rating),
      comment: comment.trim()
    });
    
    await review.save();
    res.status(201).json(review);
  } catch (error: any) {
    console.error('Error creating review:', error);
    res.status(400).json({ error: error.message });
  }
});

export default router;


