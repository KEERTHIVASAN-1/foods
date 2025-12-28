import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Restaurant from '../models/Restaurant.js';
import Item from '../models/Item.js';
import Review from '../models/Review.js';
import { connectDB } from '../config/database.js';

dotenv.config();

const restaurantsData = [
  {
    name: 'Burger Manor',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: 'The best gourmet burgers in town, made with fresh, locally sourced ingredients. Our secret sauce is a must-try!',
    address: '123 Burger Lane, Foodie City',
    cuisine: 'American',
    rating: 4.5,
    deliveryTime: '25-30 min',
    offers: '50% OFF',
    openingHours: '11:00 AM - 11:00 PM',
    items: [
      { name: 'Truffle Mushroom Burger', price: 14.99, rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80', description: 'Juicy beef patty topped with truffle oil, swiss cheese, and sautéed mushrooms.', tags: ['Burger', 'Gourmet'], isVeg: false, calories: 850, preparationTime: '20 min', orderCount: 452 },
      { name: 'Classic Cheeseburger', price: 11.99, rating: 4.3, imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80', description: 'Double beef patty, cheddar cheese, lettuce, tomato, onions, and house secret sauce.', tags: ['Burger', 'American'], isVeg: false, calories: 900, preparationTime: '20 min', orderCount: 578 },
      { name: 'BBQ Bacon Burger', price: 15.99, rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=800&q=80', description: 'Premium beef with crispy bacon, cheddar, BBQ sauce, and onion rings.', tags: ['Burger', 'BBQ'], isVeg: false, calories: 1100, preparationTime: '25 min', orderCount: 389 },
      { name: 'Veggie Delight Burger', price: 12.99, rating: 4.4, imageUrl: 'https://images.unsplash.com/photo-1525059696034-4967a729002e?auto=format&fit=crop&w=800&q=80', description: 'Grilled vegetable patty with avocado, sprouts, and herb mayo.', tags: ['Burger', 'Vegetarian'], isVeg: true, calories: 550, preparationTime: '18 min', orderCount: 267 },
      { name: 'Spicy Jalapeño Burger', price: 13.99, rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80', description: 'Beef patty with jalapeños, pepper jack cheese, and chipotle sauce.', tags: ['Burger', 'Spicy'], isVeg: false, calories: 950, preparationTime: '22 min', orderCount: 423 },
      { name: 'Chicken Burger', price: 12.49, rating: 4.2, imageUrl: 'https://images.unsplash.com/photo-1599974579688-8dbdd1363e6e?auto=format&fit=crop&w=800&q=80', description: 'Crispy chicken fillet with lettuce, tomato, and special sauce.', tags: ['Burger', 'Chicken'], isVeg: false, calories: 650, preparationTime: '20 min', orderCount: 512 },
      { name: 'Loaded Fries', price: 7.99, rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80', description: 'Crispy fries topped with cheese, bacon bits, and jalapeños.', tags: ['Sides', 'Snacks'], isVeg: false, calories: 520, preparationTime: '12 min', orderCount: 678 },
      { name: 'Onion Rings', price: 6.99, rating: 4.3, imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80', description: 'Golden crispy onion rings served with tangy dipping sauce.', tags: ['Sides', 'Vegetarian'], isVeg: true, calories: 380, preparationTime: '10 min', orderCount: 445 },
      { name: 'Classic Milkshake', price: 5.99, rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80', description: 'Creamy vanilla milkshake topped with whipped cream and cherry.', tags: ['Beverages', 'Dessert'], isVeg: true, calories: 450, preparationTime: '5 min', orderCount: 567 },
      { name: 'Chocolate Shake', price: 6.49, rating: 4.9, imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80', description: 'Rich chocolate milkshake with chocolate chips and whipped cream.', tags: ['Beverages', 'Dessert'], isVeg: true, calories: 520, preparationTime: '5 min', orderCount: 623 },
      { name: 'Buffalo Wings', price: 10.99, rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=800&q=80', description: 'Spicy buffalo wings served with blue cheese dip and celery sticks.', tags: ['Appetizers', 'Spicy'], isVeg: false, calories: 680, preparationTime: '18 min', orderCount: 389 },
      { name: 'Caesar Salad', price: 9.99, rating: 4.4, imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=800&q=80', description: 'Fresh romaine lettuce with caesar dressing, croutons, and parmesan.', tags: ['Salad', 'Healthy'], isVeg: true, calories: 320, preparationTime: '10 min', orderCount: 334 },
      { name: 'Fish Burger', price: 13.99, rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80', description: 'Grilled fish fillet with tartar sauce, lettuce, and lemon.', tags: ['Burger', 'Seafood'], isVeg: false, calories: 580, preparationTime: '22 min', orderCount: 278 },
      { name: 'Sweet Potato Fries', price: 7.49, rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80', description: 'Crispy sweet potato fries with a hint of sea salt.', tags: ['Sides', 'Vegetarian'], isVeg: true, calories: 380, preparationTime: '15 min', orderCount: 456 },
      { name: 'Mushroom Swiss Burger', price: 14.49, rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80', description: 'Beef patty with sautéed mushrooms, swiss cheese, and aioli.', tags: ['Burger', 'Gourmet'], isVeg: false, calories: 920, preparationTime: '23 min', orderCount: 445 }
    ]
  },
  {
    name: 'Spice Route',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80',
    description: 'Authentic Indian flavors with a modern twist. Known for hygienic preparation, fast service, and rich regional flavors.',
    address: 'T. Nagar, Chennai',
    cuisine: 'Indian',
    rating: 4.7,
    deliveryTime: '35-45 min',
    offers: 'Buy 1 Get 1',
    openingHours: '12:00 PM - 11:00 PM',
    items: [
      { name: 'Butter Chicken Bowl', price: 16.50, rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80', description: 'Rich and creamy tomato curry with tender chicken pieces, served with basmati rice.', tags: ['Indian', 'Curry', 'Spicy'], isVeg: false, calories: 700, preparationTime: '30 min', orderCount: 589 },
      { name: 'Paneer Tikka Masala', price: 14.50, rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80', description: 'Grilled cottage cheese cubes simmered in a spicy onion-tomato gravy.', tags: ['Indian', 'Curry', 'Veg'], isVeg: true, calories: 650, preparationTime: '30 min', orderCount: 634 },
      { name: 'Biryani Deluxe', price: 18.99, rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1563379091339-03246963d96a?auto=format&fit=crop&w=800&q=80', description: 'Fragrant basmati rice cooked with aromatic spices and choice of chicken or vegetables.', tags: ['Indian', 'Rice', 'Spicy'], isVeg: false, calories: 850, preparationTime: '35 min', orderCount: 712 },
      { name: 'Dal Makhani', price: 12.99, rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80', description: 'Creamy black lentils slow-cooked with butter and spices.', tags: ['Indian', 'Vegetarian', 'Comfort'], isVeg: true, calories: 450, preparationTime: '25 min', orderCount: 523 },
      { name: 'Chicken Tikka', price: 15.99, rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80', description: 'Marinated chicken pieces grilled to perfection in a tandoor.', tags: ['Indian', 'Grilled', 'Spicy'], isVeg: false, calories: 520, preparationTime: '28 min', orderCount: 678 },
      { name: 'Palak Paneer', price: 13.50, rating: 4.4, imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80', description: 'Cottage cheese cubes in a creamy spinach curry.', tags: ['Indian', 'Vegetarian', 'Healthy'], isVeg: true, calories: 480, preparationTime: '25 min', orderCount: 445 },
      { name: 'Naan Bread', price: 4.99, rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80', description: 'Freshly baked fluffy naan bread brushed with butter.', tags: ['Bread', 'Vegetarian'], isVeg: true, calories: 280, preparationTime: '8 min', orderCount: 856 },
      { name: 'Garlic Naan', price: 5.99, rating: 4.9, imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80', description: 'Buttery naan topped with fresh garlic and cilantro.', tags: ['Bread', 'Vegetarian'], isVeg: true, calories: 320, preparationTime: '10 min', orderCount: 934 },
      { name: 'Samosas (2pc)', price: 6.99, rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80', description: 'Crispy pastry filled with spiced potatoes and peas.', tags: ['Snacks', 'Vegetarian'], isVeg: true, calories: 280, preparationTime: '12 min', orderCount: 745 },
      { name: 'Mango Lassi', price: 5.99, rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80', description: 'Refreshing yogurt drink with sweet mango pulp.', tags: ['Beverages', 'Vegetarian'], isVeg: true, calories: 320, preparationTime: '5 min', orderCount: 667 },
      { name: 'Lamb Curry', price: 19.99, rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80', description: 'Tender lamb pieces cooked in a rich, spicy curry.', tags: ['Indian', 'Curry', 'Spicy'], isVeg: false, calories: 780, preparationTime: '40 min', orderCount: 456 },
      { name: 'Chana Masala', price: 11.99, rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80', description: 'Spiced chickpeas cooked in a tangy tomato gravy.', tags: ['Indian', 'Vegetarian', 'Protein'], isVeg: true, calories: 420, preparationTime: '25 min', orderCount: 512 },
      { name: 'Roti (2pc)', price: 3.99, rating: 4.4, imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80', description: 'Whole wheat flatbread, freshly made.', tags: ['Bread', 'Vegetarian'], isVeg: true, calories: 240, preparationTime: '6 min', orderCount: 789 },
      { name: 'Gulab Jamun (2pc)', price: 6.99, rating: 4.9, imageUrl: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=800&q=80', description: 'Sweet milk dumplings soaked in rose-scented syrup.', tags: ['Dessert', 'Vegetarian'], isVeg: true, calories: 380, preparationTime: '10 min', orderCount: 623 },
      { name: 'Chicken Vindaloo', price: 17.50, rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80', description: 'Spicy and tangy chicken curry with potatoes.', tags: ['Indian', 'Curry', 'Spicy'], isVeg: false, calories: 720, preparationTime: '35 min', orderCount: 478 }
    ]
  },
  {
    name: 'Tokyo Drift',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
    description: 'Exquisite sushi and Japanese cuisine. Fresh seafood flown in daily.',
    address: '789 Sushi Street, Downtown',
    cuisine: 'Japanese',
    rating: 4.9,
    deliveryTime: '30-40 min',
    offers: '10% OFF',
    openingHours: '11:00 AM - 10:00 PM',
    items: [
      { name: 'Dragon Roll', price: 16.00, rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1558985250-27a406d64cb3?auto=format&fit=crop&w=800&q=80', description: 'Eel and cucumber topped with thin avocado slices and eel sauce.', tags: ['Sushi', 'Japanese', 'Seafood'], isVeg: false, calories: 500, preparationTime: '20 min', orderCount: 567 },
      { name: 'Salmon Sashimi', price: 18.99, rating: 4.9, imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=800&q=80', description: 'Fresh salmon slices, expertly cut and served with wasabi and soy.', tags: ['Sushi', 'Raw', 'Seafood'], isVeg: false, calories: 280, preparationTime: '15 min', orderCount: 712 },
      { name: 'California Roll', price: 12.99, rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=800&q=80', description: 'Crab, avocado, and cucumber roll with sesame seeds.', tags: ['Sushi', 'Japanese'], isVeg: false, calories: 320, preparationTime: '15 min', orderCount: 845 },
      { name: 'Chicken Teriyaki', price: 15.99, rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80', description: 'Grilled chicken glazed with sweet teriyaki sauce, served with rice.', tags: ['Japanese', 'Grilled'], isVeg: false, calories: 580, preparationTime: '25 min', orderCount: 634 },
      { name: 'Miso Soup', price: 5.99, rating: 4.4, imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80', description: 'Traditional Japanese soup with tofu, seaweed, and scallions.', tags: ['Soup', 'Vegetarian'], isVeg: true, calories: 80, preparationTime: '8 min', orderCount: 934 },
      { name: 'Beef Ramen', price: 16.99, rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80', description: 'Rich beef broth with ramen noodles, soft-boiled egg, and beef slices.', tags: ['Ramen', 'Noodles'], isVeg: false, calories: 650, preparationTime: '20 min', orderCount: 789 },
      { name: 'Spicy Tuna Roll', price: 14.99, rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1558985250-27a406d64cb3?auto=format&fit=crop&w=800&q=80', description: 'Tuna mixed with spicy mayo, rolled in rice and seaweed.', tags: ['Sushi', 'Spicy'], isVeg: false, calories: 380, preparationTime: '18 min', orderCount: 678 },
      { name: 'Vegetable Tempura', price: 11.99, rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80', description: 'Assorted vegetables lightly battered and deep-fried to perfection.', tags: ['Tempura', 'Vegetarian'], isVeg: true, calories: 420, preparationTime: '15 min', orderCount: 512 },
      { name: 'Shrimp Tempura Roll', price: 15.99, rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1558985250-27a406d64cb3?auto=format&fit=crop&w=800&q=80', description: 'Crispy shrimp tempura with avocado and eel sauce.', tags: ['Sushi', 'Tempura'], isVeg: false, calories: 520, preparationTime: '20 min', orderCount: 756 },
      { name: 'Chicken Katsu Curry', price: 16.99, rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80', description: 'Breaded chicken cutlet served with Japanese curry and rice.', tags: ['Japanese', 'Curry'], isVeg: false, calories: 780, preparationTime: '28 min', orderCount: 623 },
      { name: 'Edamame', price: 6.99, rating: 4.3, imageUrl: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80', description: 'Steamed soybeans sprinkled with sea salt.', tags: ['Appetizers', 'Vegetarian'], isVeg: true, calories: 180, preparationTime: '8 min', orderCount: 745 },
      { name: 'Tuna Poke Bowl', price: 17.99, rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=800&q=80', description: 'Fresh tuna, rice, avocado, and vegetables in a delicious bowl.', tags: ['Poke', 'Healthy'], isVeg: false, calories: 520, preparationTime: '18 min', orderCount: 634 },
      { name: 'Green Tea Ice Cream', price: 7.99, rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=800&q=80', description: 'Refreshing matcha ice cream with a delicate, earthy flavor.', tags: ['Dessert', 'Vegetarian'], isVeg: true, calories: 280, preparationTime: '5 min', orderCount: 567 },
      { name: 'Sushi Platter (12pc)', price: 28.99, rating: 4.9, imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=800&q=80', description: 'Assorted premium sushi selection with nigiri and rolls.', tags: ['Sushi', 'Combo'], isVeg: false, calories: 720, preparationTime: '25 min', orderCount: 489 },
      { name: 'Yakitori (4 skewers)', price: 13.99, rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80', description: 'Grilled chicken skewers glazed with teriyaki sauce.', tags: ['Japanese', 'Grilled'], isVeg: false, calories: 480, preparationTime: '22 min', orderCount: 578 }
    ]
  },
  {
    name: 'Fresh & Green',
    image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=800&q=80',
    description: 'Healthy bowls, salads, and smoothies for the health-conscious foodie.',
    address: '555 Green Way, Eco Park',
    cuisine: 'Healthy',
    rating: 4.5,
    deliveryTime: '15-25 min',
    offers: '20% OFF',
    openingHours: '08:00 AM - 08:00 PM',
    items: [
      { name: 'Acai Superfood Bowl', price: 12.00, rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=800&q=80', description: 'Organic acai blend topped with granola, banana, strawberries, and honey.', tags: ['Healthy', 'Breakfast', 'Vegan'], isVeg: true, calories: 350, preparationTime: '10 min', orderCount: 634 },
      { name: 'Berry Smoothie Bowl', price: 9.50, rating: 4.4, imageUrl: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=800&q=80', description: 'Mixed berry smoothie topped with chia seeds, coconut flakes, and fresh berries.', tags: ['Healthy', 'Breakfast', 'Vegan'], isVeg: true, calories: 300, preparationTime: '10 min', orderCount: 756 },
      { name: 'Quinoa Power Bowl', price: 13.99, rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80', description: 'Quinoa, roasted vegetables, chickpeas, and tahini dressing.', tags: ['Healthy', 'Vegan', 'Protein'], isVeg: true, calories: 420, preparationTime: '15 min', orderCount: 678 },
      { name: 'Mediterranean Bowl', price: 14.99, rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80', description: 'Hummus, falafel, olives, feta, and fresh vegetables.', tags: ['Healthy', 'Mediterranean'], isVeg: true, calories: 480, preparationTime: '18 min', orderCount: 623 },
      { name: 'Kale Caesar Salad', price: 11.99, rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=800&q=80', description: 'Fresh kale with caesar dressing, croutons, and parmesan.', tags: ['Salad', 'Healthy'], isVeg: true, calories: 320, preparationTime: '12 min', orderCount: 712 },
      { name: 'Green Goddess Bowl', price: 12.99, rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80', description: 'Avocado, spinach, broccoli, edamame, and green goddess dressing.', tags: ['Healthy', 'Vegan'], isVeg: true, calories: 380, preparationTime: '14 min', orderCount: 589 },
      { name: 'Protein Smoothie', price: 8.99, rating: 4.4, imageUrl: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=800&q=80', description: 'Vanilla protein powder, banana, almond milk, and peanut butter.', tags: ['Smoothie', 'Protein'], isVeg: true, calories: 420, preparationTime: '5 min', orderCount: 845 },
      { name: 'Tropical Smoothie', price: 9.99, rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=800&q=80', description: 'Mango, pineapple, coconut, and banana blend.', tags: ['Smoothie', 'Vegan'], isVeg: true, calories: 320, preparationTime: '5 min', orderCount: 934 },
      { name: 'Avocado Toast', price: 10.50, rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=800&q=80', description: 'Sourdough bread topped with smashed avocado, poached egg, and microgreens.', tags: ['Breakfast', 'Healthy'], isVeg: true, calories: 400, preparationTime: '15 min', orderCount: 812 },
      { name: 'Chia Pudding', price: 7.99, rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=800&q=80', description: 'Chia seeds soaked in coconut milk with berries and granola.', tags: ['Breakfast', 'Vegan'], isVeg: true, calories: 280, preparationTime: '8 min', orderCount: 667 },
      { name: 'Detox Green Juice', price: 6.99, rating: 4.3, imageUrl: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=800&q=80', description: 'Kale, spinach, cucumber, celery, and lemon.', tags: ['Juice', 'Detox'], isVeg: true, calories: 80, preparationTime: '5 min', orderCount: 756 },
      { name: 'Grilled Chicken Salad', price: 13.99, rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=800&q=80', description: 'Mixed greens with grilled chicken, vegetables, and balsamic vinaigrette.', tags: ['Salad', 'Protein'], isVeg: false, calories: 450, preparationTime: '18 min', orderCount: 634 },
      { name: 'Buddha Bowl', price: 12.99, rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80', description: 'Brown rice, roasted sweet potato, black beans, and tahini.', tags: ['Healthy', 'Vegan'], isVeg: true, calories: 520, preparationTime: '20 min', orderCount: 589 },
      { name: 'Energy Bites (3pc)', price: 5.99, rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=800&q=80', description: 'Dates, nuts, and coconut rolled into nutritious bites.', tags: ['Snacks', 'Vegan'], isVeg: true, calories: 240, preparationTime: '5 min', orderCount: 823 },
      { name: 'Superfood Wrap', price: 11.99, rating: 4.4, imageUrl: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80', description: 'Whole wheat wrap with hummus, vegetables, and sprouts.', tags: ['Wrap', 'Vegan'], isVeg: true, calories: 380, preparationTime: '12 min', orderCount: 712 }
    ]
  },
  {
    name: 'Slice of Italy',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: 'Authentic Italian pizzas wood-fired to perfection. Taste the tradition in every slice.',
    address: '456 Pizza Plaza, Little Italy',
    cuisine: 'Italian',
    rating: 4.2,
    deliveryTime: '40-50 min',
    offers: 'Free Delivery',
    openingHours: '12:00 PM - 10:00 PM',
    items: [
      { name: 'Pepperoni Pizza', price: 17.00, rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80', description: 'New York style pizza loaded with crispy pepperoni slices and mozzarella.', tags: ['Pizza', 'Italian', 'Fast Food'], isVeg: false, calories: 1300, preparationTime: '25 min', orderCount: 912 },
      { name: 'Margherita Pizza', price: 14.99, rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80', description: 'Classic pizza with fresh mozzarella, basil, and tomato sauce.', tags: ['Pizza', 'Vegetarian'], isVeg: true, calories: 950, preparationTime: '22 min', orderCount: 856 },
      { name: 'BBQ Chicken Pizza', price: 18.99, rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80', description: 'Grilled chicken, red onions, and BBQ sauce on our signature crust.', tags: ['Pizza', 'BBQ'], isVeg: false, calories: 1150, preparationTime: '28 min', orderCount: 745 },
      { name: 'Veggie Supreme Pizza', price: 16.99, rating: 4.4, imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80', description: 'Loaded with peppers, mushrooms, onions, olives, and cheese.', tags: ['Pizza', 'Vegetarian'], isVeg: true, calories: 980, preparationTime: '25 min', orderCount: 689 },
      { name: 'Hawaiian Pizza', price: 17.99, rating: 4.3, imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80', description: 'Ham, pineapple, and mozzarella on a perfect crust.', tags: ['Pizza', 'Sweet'], isVeg: false, calories: 1100, preparationTime: '26 min', orderCount: 634 },
      { name: 'Four Cheese Pizza', price: 18.50, rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80', description: 'Mozzarella, cheddar, parmesan, and gorgonzola blend.', tags: ['Pizza', 'Vegetarian'], isVeg: true, calories: 1200, preparationTime: '24 min', orderCount: 789 },
      { name: 'Garlic Bread', price: 6.99, rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80', description: 'Toasted bread with garlic butter and herbs.', tags: ['Sides', 'Vegetarian'], isVeg: true, calories: 320, preparationTime: '8 min', orderCount: 1023 },
      { name: 'Caesar Salad', price: 10.99, rating: 4.4, imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=800&q=80', description: 'Fresh romaine with caesar dressing, croutons, and parmesan.', tags: ['Salad', 'Vegetarian'], isVeg: true, calories: 320, preparationTime: '10 min', orderCount: 856 },
      { name: 'Chicken Alfredo Pasta', price: 16.99, rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=80', description: 'Creamy alfredo sauce with grilled chicken and fettuccine.', tags: ['Pasta', 'Italian'], isVeg: false, calories: 850, preparationTime: '22 min', orderCount: 712 },
      { name: 'Spaghetti Carbonara', price: 15.99, rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=80', description: 'Classic pasta with eggs, bacon, parmesan, and black pepper.', tags: ['Pasta', 'Italian'], isVeg: false, calories: 780, preparationTime: '20 min', orderCount: 789 },
      { name: 'Meat Lovers Pizza', price: 19.99, rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80', description: 'Pepperoni, sausage, ham, and bacon on one perfect pizza.', tags: ['Pizza', 'Meat'], isVeg: false, calories: 1450, preparationTime: '28 min', orderCount: 834 },
      { name: 'Bruschetta', price: 8.99, rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80', description: 'Toasted bread topped with fresh tomatoes, basil, and mozzarella.', tags: ['Appetizers', 'Vegetarian'], isVeg: true, calories: 280, preparationTime: '10 min', orderCount: 756 },
      { name: 'Chicken Parmesan', price: 18.99, rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80', description: 'Breaded chicken breast with marinara sauce and melted mozzarella.', tags: ['Italian', 'Chicken'], isVeg: false, calories: 920, preparationTime: '30 min', orderCount: 678 },
      { name: 'Tiramisu', price: 8.99, rating: 4.9, imageUrl: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=800&q=80', description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone.', tags: ['Dessert', 'Vegetarian'], isVeg: true, calories: 420, preparationTime: '10 min', orderCount: 912 },
      { name: 'Caprese Salad', price: 11.99, rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=800&q=80', description: 'Fresh mozzarella, tomatoes, and basil with balsamic glaze.', tags: ['Salad', 'Vegetarian'], isVeg: true, calories: 320, preparationTime: '8 min', orderCount: 689 }
    ]
  },
  {
    name: 'Dragon Palace',
    image: 'https://images.unsplash.com/photo-1563379091339-03246963d96a?auto=format&fit=crop&w=800&q=80',
    description: 'Authentic Chinese cuisine with traditional flavors and modern presentation.',
    address: '321 Dragon Street, Chinatown',
    cuisine: 'Chinese',
    rating: 4.6,
    deliveryTime: '30-35 min',
    offers: '15% OFF',
    openingHours: '11:00 AM - 10:00 PM',
    items: [
      { name: 'Kung Pao Chicken', price: 15.99, rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1563379091339-03246963d96a?auto=format&fit=crop&w=800&q=80', description: 'Spicy stir-fried chicken with peanuts, vegetables, and chili peppers.', tags: ['Chinese', 'Spicy', 'Chicken'], isVeg: false, calories: 680, preparationTime: '25 min', orderCount: 812 },
      { name: 'Sweet and Sour Pork', price: 16.50, rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1563379091339-03246963d96a?auto=format&fit=crop&w=800&q=80', description: 'Crispy pork pieces in a tangy sweet and sour sauce with bell peppers.', tags: ['Chinese', 'Pork'], isVeg: false, calories: 720, preparationTime: '28 min', orderCount: 756 },
      { name: 'Mapo Tofu', price: 13.99, rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80', description: 'Spicy Sichuan dish with soft tofu, ground pork, and fermented beans.', tags: ['Chinese', 'Spicy', 'Tofu'], isVeg: false, calories: 480, preparationTime: '20 min', orderCount: 689 },
      { name: 'Peking Duck', price: 28.99, rating: 4.9, imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80', description: 'Crispy duck served with pancakes, hoisin sauce, and scallions.', tags: ['Chinese', 'Duck', 'Premium'], isVeg: false, calories: 850, preparationTime: '45 min', orderCount: 445 },
      { name: 'Spring Rolls (4pc)', price: 7.99, rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80', description: 'Crispy vegetable spring rolls served with sweet and sour sauce.', tags: ['Appetizers', 'Vegetarian'], isVeg: true, calories: 280, preparationTime: '12 min', orderCount: 1023 },
      { name: 'General Tso\'s Chicken', price: 16.99, rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80', description: 'Deep-fried chicken in a sweet and slightly spicy sauce.', tags: ['Chinese', 'Chicken', 'Popular'], isVeg: false, calories: 780, preparationTime: '25 min', orderCount: 934 },
      { name: 'Fried Rice', price: 12.99, rating: 4.4, imageUrl: 'https://images.unsplash.com/photo-1563379091339-03246963d96a?auto=format&fit=crop&w=800&q=80', description: 'Wok-fried rice with eggs, vegetables, and your choice of protein.', tags: ['Chinese', 'Rice'], isVeg: false, calories: 520, preparationTime: '18 min', orderCount: 967 },
      { name: 'Chow Mein', price: 13.99, rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80', description: 'Stir-fried noodles with vegetables and your choice of protein.', tags: ['Chinese', 'Noodles'], isVeg: false, calories: 580, preparationTime: '20 min', orderCount: 856 },
      { name: 'Orange Chicken', price: 16.50, rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80', description: 'Crispy chicken glazed with orange sauce and sesame seeds.', tags: ['Chinese', 'Chicken'], isVeg: false, calories: 720, preparationTime: '24 min', orderCount: 823 },
      { name: 'Hot and Sour Soup', price: 8.99, rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80', description: 'Spicy and tangy soup with tofu, mushrooms, and bamboo shoots.', tags: ['Soup', 'Spicy'], isVeg: true, calories: 120, preparationTime: '15 min', orderCount: 789 },
      { name: 'Beef with Broccoli', price: 17.99, rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1563379091339-03246963d96a?auto=format&fit=crop&w=800&q=80', description: 'Tender beef slices stir-fried with fresh broccoli in brown sauce.', tags: ['Chinese', 'Beef'], isVeg: false, calories: 650, preparationTime: '22 min', orderCount: 712 },
      { name: 'Dim Sum Platter (8pc)', price: 18.99, rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80', description: 'Assorted steamed dumplings with pork, shrimp, and vegetables.', tags: ['Chinese', 'Dim Sum'], isVeg: false, calories: 520, preparationTime: '20 min', orderCount: 634 },
      { name: 'Mongolian Beef', price: 18.50, rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80', description: 'Sautéed beef with scallions and onions in a savory sauce.', tags: ['Chinese', 'Beef'], isVeg: false, calories: 680, preparationTime: '25 min', orderCount: 689 },
      { name: 'Vegetable Lo Mein', price: 12.50, rating: 4.4, imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80', description: 'Soft noodles stir-fried with mixed vegetables in soy sauce.', tags: ['Chinese', 'Vegetarian'], isVeg: true, calories: 420, preparationTime: '18 min', orderCount: 756 },
      { name: 'Egg Drop Soup', price: 7.99, rating: 4.3, imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80', description: 'Light chicken broth with silky egg ribbons and green onions.', tags: ['Soup', 'Comfort'], isVeg: false, calories: 90, preparationTime: '10 min', orderCount: 912 }
    ]
  },
  {
    name: 'Taco Fiesta',
    image: 'https://images.unsplash.com/photo-1565299585323-38174c94b60c?auto=format&fit=crop&w=800&q=80',
    description: 'Vibrant Mexican street food with fresh ingredients and bold flavors.',
    address: '789 Fiesta Avenue, Market Square',
    cuisine: 'Mexican',
    rating: 4.4,
    deliveryTime: '20-30 min',
    offers: '30% OFF',
    openingHours: '11:00 AM - 11:00 PM',
    items: [
      { name: 'Carnitas Tacos (3pc)', price: 13.99, rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1565299585323-38174c94b60c?auto=format&fit=crop&w=800&q=80', description: 'Slow-cooked pork, onions, cilantro, and lime on corn tortillas.', tags: ['Tacos', 'Mexican', 'Pork'], isVeg: false, calories: 450, preparationTime: '15 min', orderCount: 912 },
      { name: 'Beef Birria Tacos (3pc)', price: 15.99, rating: 4.9, imageUrl: 'https://images.unsplash.com/photo-1565299585323-38174c94b60c?auto=format&fit=crop&w=800&q=80', description: 'Braised beef, cheese, onions, and cilantro with consommé for dipping.', tags: ['Tacos', 'Mexican', 'Beef'], isVeg: false, calories: 580, preparationTime: '20 min', orderCount: 1023 },
      { name: 'Chicken Quesadilla', price: 12.99, rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1565299585323-38174c94b60c?auto=format&fit=crop&w=800&q=80', description: 'Grilled chicken, cheese, and peppers in a crispy tortilla.', tags: ['Mexican', 'Chicken'], isVeg: false, calories: 620, preparationTime: '18 min', orderCount: 856 },
      { name: 'Vegetarian Burrito', price: 11.99, rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80', description: 'Rice, beans, vegetables, cheese, and sour cream wrapped in a flour tortilla.', tags: ['Burrito', 'Vegetarian'], isVeg: true, calories: 680, preparationTime: '16 min', orderCount: 789 },
      { name: 'Beef Burrito', price: 14.99, rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80', description: 'Seasoned beef, rice, beans, cheese, and salsa in a large tortilla.', tags: ['Burrito', 'Beef'], isVeg: false, calories: 780, preparationTime: '18 min', orderCount: 934 },
      { name: 'Guacamole & Chips', price: 8.99, rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80', description: 'Fresh avocados, lime, cilantro, and tomatoes with crispy tortilla chips.', tags: ['Appetizers', 'Vegetarian'], isVeg: true, calories: 380, preparationTime: '8 min', orderCount: 1112 },
      { name: 'Chicken Enchiladas (2pc)', price: 15.99, rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80', description: 'Rolled tortillas filled with chicken, cheese, and smothered in red sauce.', tags: ['Mexican', 'Chicken'], isVeg: false, calories: 720, preparationTime: '25 min', orderCount: 756 },
      { name: 'Nachos Supreme', price: 13.99, rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80', description: 'Tortilla chips loaded with cheese, jalapeños, beans, and your choice of protein.', tags: ['Snacks', 'Mexican'], isVeg: false, calories: 850, preparationTime: '15 min', orderCount: 967 },
      { name: 'Fish Tacos (3pc)', price: 14.99, rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1565299585323-38174c94b60c?auto=format&fit=crop&w=800&q=80', description: 'Beer-battered fish, cabbage slaw, and chipotle aioli.', tags: ['Tacos', 'Seafood'], isVeg: false, calories: 520, preparationTime: '20 min', orderCount: 712 },
      { name: 'Churros (4pc)', price: 6.99, rating: 4.9, imageUrl: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=800&q=80', description: 'Crispy fried dough dusted with cinnamon sugar, served with chocolate sauce.', tags: ['Dessert', 'Vegetarian'], isVeg: true, calories: 380, preparationTime: '12 min', orderCount: 1123 },
      { name: 'Elote (Mexican Corn)', price: 7.99, rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80', description: 'Grilled corn on the cob with mayo, cheese, lime, and chili powder.', tags: ['Street Food', 'Vegetarian'], isVeg: true, calories: 280, preparationTime: '10 min', orderCount: 834 },
      { name: 'Queso Fundido', price: 10.99, rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80', description: 'Melted cheese dip with chorizo, served with warm tortillas.', tags: ['Appetizers', 'Mexican'], isVeg: false, calories: 520, preparationTime: '12 min', orderCount: 689 },
      { name: 'Chicken Fajitas', price: 16.99, rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80', description: 'Sizzling chicken with bell peppers and onions, served with tortillas and sides.', tags: ['Mexican', 'Chicken'], isVeg: false, calories: 680, preparationTime: '22 min', orderCount: 823 },
      { name: 'Taco Salad', price: 13.99, rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=800&q=80', description: 'Crispy tortilla bowl filled with lettuce, beans, cheese, and your choice of protein.', tags: ['Salad', 'Mexican'], isVeg: false, calories: 580, preparationTime: '15 min', orderCount: 756 },
      { name: 'Horchata', price: 4.99, rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80', description: 'Sweet rice milk drink with cinnamon and vanilla.', tags: ['Beverages', 'Vegetarian'], isVeg: true, calories: 240, preparationTime: '5 min', orderCount: 1123 }
    ]
  },
  {
    name: 'Mediterranean Breeze',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    description: 'Fresh Mediterranean cuisine with authentic flavors from the coast.',
    address: '654 Olive Grove, Riverside',
    cuisine: 'Mediterranean',
    rating: 4.8,
    deliveryTime: '25-35 min',
    offers: '25% OFF',
    openingHours: '10:00 AM - 9:00 PM',
    items: [
      { name: 'Chicken Shawarma Wrap', price: 13.99, rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80', description: 'Marinated chicken, tahini, pickles, and fresh vegetables in pita bread.', tags: ['Wrap', 'Chicken', 'Mediterranean'], isVeg: false, calories: 580, preparationTime: '18 min', orderCount: 945 },
      { name: 'Falafel Plate', price: 12.99, rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80', description: 'Crispy falafel balls with hummus, tahini, salad, and pita bread.', tags: ['Mediterranean', 'Vegetarian'], isVeg: true, calories: 520, preparationTime: '20 min', orderCount: 856 },
      { name: 'Greek Salad', price: 11.99, rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=800&q=80', description: 'Fresh tomatoes, cucumbers, olives, feta cheese, and red onion with olive oil.', tags: ['Salad', 'Vegetarian'], isVeg: true, calories: 320, preparationTime: '10 min', orderCount: 1023 },
      { name: 'Lamb Gyro', price: 15.99, rating: 4.9, imageUrl: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80', description: 'Spiced lamb, tzatziki, tomatoes, and onions in warm pita.', tags: ['Wrap', 'Lamb'], isVeg: false, calories: 620, preparationTime: '20 min', orderCount: 789 },
      { name: 'Hummus & Pita', price: 8.99, rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80', description: 'Creamy chickpea dip served with warm pita bread and olive oil.', tags: ['Appetizers', 'Vegetarian'], isVeg: true, calories: 380, preparationTime: '8 min', orderCount: 1234 },
      { name: 'Grilled Halloumi', price: 13.99, rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=800&q=80', description: 'Grilled Cypriot cheese with olive oil, herbs, and lemon.', tags: ['Mediterranean', 'Vegetarian'], isVeg: true, calories: 420, preparationTime: '15 min', orderCount: 712 },
      { name: 'Moussaka', price: 16.99, rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80', description: 'Layers of eggplant, spiced meat, and béchamel sauce baked to perfection.', tags: ['Mediterranean', 'Lamb'], isVeg: false, calories: 680, preparationTime: '35 min', orderCount: 634 },
      { name: 'Spanakopita', price: 9.99, rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80', description: 'Spinach and feta cheese wrapped in flaky phyllo pastry.', tags: ['Mediterranean', 'Vegetarian'], isVeg: true, calories: 320, preparationTime: '18 min', orderCount: 823 },
      { name: 'Tabbouleh', price: 8.99, rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=800&q=80', description: 'Fresh parsley, bulgur, tomatoes, mint, and lemon dressing.', tags: ['Salad', 'Vegetarian'], isVeg: true, calories: 180, preparationTime: '12 min', orderCount: 756 },
      { name: 'Baklava (3pc)', price: 7.99, rating: 4.9, imageUrl: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=800&q=80', description: 'Layered pastry with honey, nuts, and spices.', tags: ['Dessert', 'Vegetarian'], isVeg: true, calories: 420, preparationTime: '10 min', orderCount: 1123 },
      { name: 'Lamb Kebab', price: 17.99, rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80', description: 'Marinated lamb skewers grilled to perfection with rice and salad.', tags: ['Mediterranean', 'Lamb'], isVeg: false, calories: 720, preparationTime: '25 min', orderCount: 689 },
      { name: 'Baba Ganoush', price: 8.99, rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80', description: 'Roasted eggplant dip with tahini, lemon, and garlic.', tags: ['Appetizers', 'Vegetarian'], isVeg: true, calories: 280, preparationTime: '15 min', orderCount: 856 },
      { name: 'Chicken Souvlaki', price: 14.99, rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80', description: 'Marinated chicken skewers with tzatziki, fries, and pita.', tags: ['Mediterranean', 'Chicken'], isVeg: false, calories: 650, preparationTime: '22 min', orderCount: 945 },
      { name: 'Stuffed Grape Leaves', price: 9.99, rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80', description: 'Rice and herbs wrapped in grape leaves, served with lemon.', tags: ['Appetizers', 'Vegetarian'], isVeg: true, calories: 240, preparationTime: '20 min', orderCount: 712 },
      { name: 'Turkish Delight', price: 6.99, rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=800&q=80', description: 'Sweet confectionery with rosewater and pistachios.', tags: ['Dessert', 'Vegetarian'], isVeg: true, calories: 320, preparationTime: '5 min', orderCount: 823 }
    ]
  }
];

async function seed() {
  try {
    await connectDB();
    
    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🗑️  Clearing existing data...');
    await Item.deleteMany({});
    await Review.deleteMany({});
    await Restaurant.deleteMany({});
    await User.deleteMany({ role: { $ne: 'admin' } }); // Keep admin users
    
    console.log('✅ Cleared existing data');
    
    // Create admin user if doesn't exist
    let admin = await User.findOne({ email: 'admin@foodswipe.com' });
    if (!admin) {
      const adminPassword = await bcrypt.hash('admin123', 10);
      admin = await User.create({
        name: 'Admin User',
        email: 'admin@foodswipe.com',
        password: adminPassword,
        role: 'admin'
      });
      console.log('✅ Created admin user');
    } else {
      console.log('✅ Admin user already exists');
    }
    
    // Create restaurants and items
    const password = await bcrypt.hash('owner123', 10);
    let totalItems = 0;
    
    for (let i = 0; i < restaurantsData.length; i++) {
      const restData = restaurantsData[i];
      const ownerNumber = i + 1;
      
      // Create owner with owner1@gmail.com, owner2@gmail.com, etc.
      const ownerEmail = `owner${ownerNumber}@gmail.com`;
      let owner = await User.findOne({ email: ownerEmail });
      
      if (!owner) {
        owner = await User.create({
          name: `Owner ${ownerNumber}`,
          email: ownerEmail,
          password,
          role: 'owner'
        });
        console.log(`✅ Created owner: ${ownerEmail}`);
      } else {
        console.log(`✅ Owner already exists: ${ownerEmail}`);
      }
      
      // Create restaurant
      const restaurant = await Restaurant.create({
        name: restData.name,
        image: restData.image,
        description: restData.description,
        address: restData.address,
        cuisine: restData.cuisine,
        rating: restData.rating,
        deliveryTime: restData.deliveryTime,
        offers: restData.offers,
        openingHours: restData.openingHours,
        ownerId: owner._id,
        status: 'approved' // Auto-approve for seed data
      });
      
      owner.restaurantId = restaurant._id;
      await owner.save();
      
      // Create items
      for (const itemData of restData.items) {
        await Item.create({
          name: itemData.name,
          restaurantId: restaurant._id,
          price: itemData.price,
          imageUrl: itemData.imageUrl,
          description: itemData.description,
          rating: itemData.rating,
          tags: itemData.tags,
          isVeg: itemData.isVeg,
          calories: itemData.calories,
          preparationTime: itemData.preparationTime,
          available: true,
          orderCount: itemData.orderCount
        });
        totalItems++;
      }
      
      console.log(`✅ Created restaurant: ${restData.name} with ${restData.items.length} items`);
    }
    
    console.log(`\n✅ Total items created: ${totalItems}`);
    console.log('✅ All restaurants created successfully!');
    console.log('\n📝 Login credentials:');
    console.log('   Admin: admin@foodswipe.com / admin123');
    console.log('   Owners:');
    for (let i = 1; i <= restaurantsData.length; i++) {
      console.log(`     Owner ${i}: owner${i}@gmail.com / owner123`);
    }
    console.log('\n🎉 Seeding completed successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seed();
