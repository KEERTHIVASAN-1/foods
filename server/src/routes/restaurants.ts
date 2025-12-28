import express from 'express';
import Restaurant from '../models/Restaurant.js';
import Item from '../models/Item.js';
import { authenticate, authorize, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// Get all approved restaurants (for users)
router.get('/', async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ status: 'approved' }).populate('ownerId', 'name email');
    res.json(restaurants);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get all restaurants (for admin)
router.get('/all', authenticate, authorize('admin'), async (req, res) => {
  try {
    const restaurants = await Restaurant.find().populate('ownerId', 'name email');
    res.json(restaurants);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get owner's restaurant (must be before /:id route)
router.get('/owner/me', authenticate, authorize('owner'), async (req: AuthRequest, res) => {
  try {
    const restaurant = await Restaurant.findOne({ ownerId: req.userId }).populate('ownerId', 'name email');
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get restaurant items (must be before /:id route)
router.get('/:id/items', async (req, res) => {
  try {
    const items = await Item.find({ restaurantId: req.params.id });
    res.json(items);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get single restaurant
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate('ownerId', 'name email');
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create restaurant (owner)
router.post('/', authenticate, authorize('owner'), async (req: AuthRequest, res) => {
  try {
    const restaurant = new Restaurant({
      ...req.body,
      ownerId: req.userId,
      status: 'pending'
    });
    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Update restaurant status (admin)
router.patch('/:id/status', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete restaurant (admin) - cascade delete items
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    await Item.deleteMany({ restaurantId: req.params.id });
    await Restaurant.findByIdAndDelete(req.params.id);
    res.json({ message: 'Restaurant deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

