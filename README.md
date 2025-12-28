# FoodSwipe - Food Delivery Platform

A modern, Swiggy/Zomato-inspired food delivery platform with Tinder-like swiping interface, built with React, TypeScript, Express, and MongoDB.

## Features

- 🍔 **Food Swiping**: Tinder-like interface to discover food items
- 🏪 **Restaurant Management**: Admin approval system for restaurants
- 👨‍🍳 **Owner Dashboard**: Restaurant owners can manage their menu items
- 👤 **User Features**: Cart, favorites, reviews, and more
- 🎨 **Premium UI/UX**: Beautiful, responsive design inspired by Swiggy/Zomato
- 🎬 **Smooth Animations**: GSAP and Framer Motion animations throughout
- 🔐 **Role-Based Authentication**: Separate registration for Users, Restaurant Owners, and Admins
- 🖼️ **Unsplash Integration**: All images stored as Unsplash URLs in MongoDB

## Tech Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Vite
- Framer Motion (animations)
- GSAP (animations)
- Three.js (3D backgrounds)
- React Router (routing)

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JWT Authentication
- bcrypt (password hashing)

## Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account (connection string provided)
- npm or yarn

### Installation

1. **Install all dependencies** (root + server):
```bash
npm run install:all
```

Or manually:
```bash
npm install
cd server
npm install
cd ..
```

### Configuration

The backend MongoDB connection is already configured:
- Connection: `mongodb+srv://client001:Client001%40Mongo2025@cluster0.jpkxeoj.mongodb.net/foodswipe`
- Database: `foodswipe`

### Run Both Frontend and Backend Together

**Start both servers concurrently:**
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend server on `http://localhost:3000` (or Vite's assigned port)

### Run Separately (Optional)

**Backend only:**
```bash
npm run dev:server
# or
cd server
npm run dev
```

**Frontend only:**
```bash
npm run dev:client
# or
npm run dev
```

### Seed Database (Optional but Recommended)

To populate with sample data:
```bash
cd server
npm run seed
```

This creates:
- 4-5 restaurants with 15 items each (75 total items)
- Admin user (admin@foodswipe.com / admin123)
- Owner users for each restaurant

## Authentication & Registration

### User Registration
- **Name** (required)
- **Email** (required)
- **Password** (required, min 6 characters)
- **Phone Number** (optional)
- **Delivery Address** (optional)

### Restaurant Owner Registration
- **Name** (required)
- **Email** (required)
- **Password** (required, min 6 characters)
- **Restaurant Name** (required)
- **Restaurant Address** (required)
- **Cuisine Type** (required)
- **Restaurant Description** (required)
- **Opening Hours** (optional, default: "10:00 AM - 10:00 PM")
- **Delivery Time** (optional, default: "30-40 min")

**Note:** Restaurant owners need admin approval before their restaurant appears in the app.

### Admin Registration
- **Name** (required)
- **Email** (required)
- **Password** (required, min 6 characters)
- **Admin Code** (required: `ADMIN2025`)

## Default Login Credentials (after seeding)

### Admin
- Email: `admin@foodswipe.com`
- Password: `admin123`

### Restaurant Owner
- Email: `burgermanor@foodswipe.com` (or other restaurant name in lowercase)
- Password: `owner123`

### User
- Register a new account from the auth page

## Project Structure

```
foodswipe/
├── client/                 # Frontend React app
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── context/          # React Context (state management)
│   ├── utils/            # Utility functions (API, transformers)
│   └── types.ts          # TypeScript types
├── server/               # Backend Express app
│   ├── src/
│   │   ├── models/       # Mongoose models
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Express middleware
│   │   ├── config/       # Configuration files
│   │   └── scripts/      # Utility scripts (seed)
│   └── package.json
└── package.json          # Root package.json (with concurrently)
```

## API Endpoints

Base URL: `http://localhost:5000/api`

### Authentication
- `POST /api/auth/register` - Register new user (user/owner/admin)
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Restaurants
- `GET /api/restaurants` - Get all approved restaurants
- `GET /api/restaurants/all` - Get all restaurants (admin only)
- `GET /api/restaurants/:id` - Get single restaurant
- `GET /api/restaurants/:id/items` - Get restaurant items
- `PATCH /api/restaurants/:id/status` - Update restaurant status (admin)
- `DELETE /api/restaurants/:id` - Delete restaurant (admin)

### Items
- `GET /api/items` - Get all items
- `GET /api/items/swipe` - Get top-selling items for swipe
- `GET /api/items/:id` - Get single item
- `POST /api/items` - Create item (owner/admin)
- `PUT /api/items/:id` - Update item (owner/admin)
- `DELETE /api/items/:id` - Delete item (owner/admin)

### Reviews
- `GET /api/reviews/restaurant/:id` - Get restaurant reviews
- `GET /api/reviews/item/:id` - Get item reviews
- `POST /api/reviews` - Create review

### Orders
- `GET /api/orders/me` - Get user orders
- `POST /api/orders` - Create order

### Notifications
- `GET /api/notifications` - Get user notifications
- `PATCH /api/notifications/:id/read` - Mark notification as read

## Key Features

### Swipe Page
- Tinder-like swipe interface
- Animated background with bubbles
- Smooth card physics
- Add to favorites or cart

### Admin Dashboard
- Approve/reject restaurants
- View all restaurants with status badges
- Manage menu items
- Delete restaurants (cascades to items)

### Owner Dashboard
- Add/edit/delete menu items
- Must provide Unsplash image URLs
- View restaurant items

### User Features
- Browse approved restaurants
- Search and filter food items
- Add items to cart
- Save favorites
- View restaurant details

## Development

### Scripts

**Root directory:**
- `npm run dev` - Run both frontend and backend concurrently
- `npm run dev:client` - Run frontend only
- `npm run dev:server` - Run backend only
- `npm run install:all` - Install all dependencies
- `npm run build` - Build frontend for production

**Server directory:**
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript
- `npm run start` - Start production server
- `npm run seed` - Seed database

## Production Deployment

### Backend
1. Build the TypeScript code:
```bash
cd server
npm run build
```

2. Set production environment variables
3. Start with: `npm start`

### Frontend
1. Build for production:
```bash
npm run build
```

2. Serve the `dist` folder with a static file server

## Notes

- All images must be Unsplash URLs (stored in MongoDB, not as files)
- Restaurant owners need admin approval before their restaurant is visible
- Items are associated with restaurants
- Top-selling items (based on orderCount and rating) appear in the swipe feed
- Admin registration requires code: `ADMIN2025`

## License

MIT
"# foods" 
