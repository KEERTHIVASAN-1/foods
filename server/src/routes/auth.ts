import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Restaurant from '../models/Restaurant.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    console.log('📝 Registration request received:', { email: req.body.email, role: req.body.role });
    
    const { name, email, password, role, restaurantName, restaurantDetails, phone, address } = req.body;

    // Validate required fields FIRST
    if (!name || !email || !password) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      console.log('❌ Password too short');
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Normalize email
    const normalizedEmail = String(email).toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      console.log('❌ User already exists:', normalizedEmail);
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData: any = { 
      name: String(name).trim(), 
      email: normalizedEmail, 
      password: hashedPassword, 
      role: role || 'user' 
    };

    // Add optional fields for users
    if (role === 'user') {
      if (phone) userData.phone = phone;
      if (address) userData.address = address;
    }

    // Create user
    const user = new User(userData);
    await user.save();
    console.log('✅ User created:', user._id, user.email, user.role);

    // If owner, create restaurant
    if (role === 'owner') {
      if (!restaurantName || !restaurantDetails) {
        console.log('❌ Missing restaurant details');
        return res.status(400).json({ error: 'Restaurant name and details are required for owner registration' });
      }

      const restaurant = new Restaurant({
        ...restaurantDetails,
        name: restaurantName,
        ownerId: user._id,
        status: 'pending'
      });
      await restaurant.save();
      console.log('✅ Restaurant created:', restaurant._id, restaurant.name);
      
      user.restaurantId = restaurant._id;
      await user.save();
      console.log('✅ User linked to restaurant');
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id.toString(), role: user.role },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '7d' }
    );

    // Fetch user with populated fields
    const userResponse = await User.findById(user._id).select('-password').lean();
    
    console.log('✅ Registration successful:', user.email);
    res.status(201).json({ 
      token, 
      user: { 
        id: userResponse?._id.toString(), 
        _id: userResponse?._id.toString(),
        name: userResponse?.name, 
        email: userResponse?.email, 
        role: userResponse?.role,
        restaurantId: userResponse?.restaurantId?.toString() 
      } 
    });
  } catch (error: any) {
    console.error('❌ Registration error:', error);
    res.status(400).json({ error: error.message || 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    console.log('🔐 Login request received:', req.body?.email);
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const normalizedEmail = String(email).toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      console.log('❌ Invalid password for:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id.toString(), role: user.role },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '7d' }
    );

    const userResponse = await User.findById(user._id).select('-password').lean();
    
    console.log('✅ Login successful:', user.email, user.role);
    res.json({ 
      token, 
      user: { 
        id: userResponse?._id.toString(), 
        _id: userResponse?._id.toString(),
        name: userResponse?.name, 
        email: userResponse?.email, 
        role: userResponse?.role,
        restaurantId: userResponse?.restaurantId?.toString() 
      } 
    });
  } catch (error: any) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: error.message || 'Login failed' });
  }
});

router.get('/me', authenticate, async (req: any, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const user = await User.findById(req.userId).select('-password').lean();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error: any) {
    console.error('❌ Get me error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.patch('/profile', authenticate, async (req: any, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const { name, phone, address } = req.body;
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;

    await user.save();
    
    // Return user without password
    const userObj = user.toObject() as Record<string, any>;
    const { password: _, ...userWithoutPassword } = userObj;
    res.json(userWithoutPassword);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
