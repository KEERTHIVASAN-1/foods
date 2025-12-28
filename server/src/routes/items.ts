import express from 'express';
import Item from '../models/Item.js';
import Restaurant from '../models/Restaurant.js';
import { authenticate, authorize, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// Get all items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find().populate('restaurantId', 'name');
    res.json(items);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get top-selling items for swipe
router.get('/swipe', async (req, res) => {
  try {
    // Get approved restaurants only
    const approvedRestaurants = await Restaurant.find({ status: 'approved' }).select('_id');
    const restaurantIds = approvedRestaurants.map(r => r._id);
    
    const items = await Item.find({
      restaurantId: { $in: restaurantIds },
      available: true
    })
    .sort({ orderCount: -1, rating: -1 })
    .limit(50)
    .populate('restaurantId', 'name');
    
    res.json(items);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get single item
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('restaurantId');
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create item (owner)
router.post('/', authenticate, authorize('owner', 'admin'), async (req: AuthRequest, res) => {
  try {
    // Verify restaurant ownership (unless admin)
    if (req.userRole === 'owner') {
      const restaurant = await Restaurant.findOne({ ownerId: req.userId });
      if (!restaurant) {
        return res.status(403).json({ error: 'No restaurant found for owner' });
      }
      if (restaurant.status !== 'approved') {
        return res.status(403).json({ error: 'Restaurant must be approved to add items' });
      }
      req.body.restaurantId = restaurant._id;
    }

    // Validate image URL (should be Unsplash URL)
    if (req.body.imageUrl && !req.body.imageUrl.includes('unsplash.com')) {
      return res.status(400).json({ error: 'Image URL must be from Unsplash' });
    }

    const item = new Item(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Update item (owner)
router.put('/:id', authenticate, authorize('owner', 'admin'), async (req: AuthRequest, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Verify ownership (unless admin)
    if (req.userRole === 'owner') {
      const restaurant = await Restaurant.findOne({ ownerId: req.userId });
      if (restaurant?._id.toString() !== item.restaurantId.toString()) {
        return res.status(403).json({ error: 'Not authorized' });
      }
    }

    // Validate image URL if provided
    if (req.body.imageUrl && !req.body.imageUrl.includes('unsplash.com')) {
      return res.status(400).json({ error: 'Image URL must be from Unsplash' });
    }

    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete item (owner)
router.delete('/:id', authenticate, authorize('owner', 'admin'), async (req: AuthRequest, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Verify ownership (unless admin)
    if (req.userRole === 'owner') {
      const restaurant = await Restaurant.findOne({ ownerId: req.userId });
      if (restaurant?._id.toString() !== item.restaurantId.toString()) {
        return res.status(403).json({ error: 'Not authorized' });
      }
    }

    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

