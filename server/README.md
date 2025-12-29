# FoodSwipe Backend Server

Backend server for FoodSwipe application using Express, MongoDB, and TypeScript.

## Quick Start

### 1. Install Dependencies (if not already done)
```bash
npm install
```

### 2. Create Environment File

Create a `.env` file in the `server` directory with:

```env
PORT=5000
MONGODB_URI=mongodb+srv://client001:Client001%40Mongo2025@cluster0.jpkxeoj.mongodb.net/foodswipe?appName=Cluster0
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2025
NODE_ENV=development
```

**Note:** The MongoDB connection is already configured as a fallback in `src/config/database.ts`, so the server will work even without the .env file.

### 3. Seed Database (Optional but Recommended)

This creates sample data:
- 4-5 restaurants with 15 items each (75 total items)
- Admin user: admin@foodswipe.com / admin123
- Owner users: [restaurantname]@foodswipe.com / owner123

```bash
npm run seed
```

### 4. Start Server

**Development mode (with hot reload):**
```bash
npm run dev
```

**Or use the batch file (Windows):**
```bash
start.bat
```

**Production mode:**
```bash
npm run build
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

Base URL: `http://localhost:5000/api`

### Health Check
- `GET /api/health` - Check server status

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth token)

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
- `POST /api/items` - Create item (owner/admin, requires auth)
- `PUT /api/items/:id` - Update item (owner/admin, requires auth)
- `DELETE /api/items/:id` - Delete item (owner/admin, requires auth)

### Reviews
- `GET /api/reviews/restaurant/:id` - Get restaurant reviews
- `GET /api/reviews/item/:id` - Get item reviews
- `POST /api/reviews` - Create review (requires auth)

### Orders
- `GET /api/orders/me` - Get user orders (requires auth)
- `POST /api/orders` - Create order (requires auth)

### Notifications
- `GET /api/notifications` - Get user notifications (requires auth)
- `PATCH /api/notifications/:id/read` - Mark notification as read (requires auth)

## Default Login Credentials (after seeding)

### Admin
- Email: `admin@foodswipe.com`
- Password: `admin123`

### Restaurant Owner
- Email: `burgermanor@foodswipe.com` (or other restaurant name in lowercase)
- Password: `owner123`

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   └── database.ts          # MongoDB connection
│   ├── models/                  # Mongoose models
│   │   ├── User.ts
│   │   ├── Restaurant.ts
│   │   ├── Item.ts
│   │   ├── Review.ts
│   │   ├── Order.ts
│   │   └── Notification.ts
│   ├── routes/                  # API routes
│   │   ├── auth.ts
│   │   ├── restaurants.ts
│   │   ├── items.ts
│   │   ├── reviews.ts
│   │   ├── orders.ts
│   │   └── notifications.ts
│   ├── middleware/
│   │   └── auth.ts              # JWT authentication middleware
│   ├── scripts/
│   │   └── seed.ts              # Database seeding script
│   └── server.ts                # Express server setup
├── package.json
├── tsconfig.json
└── .env                         # Environment variables (create this)
```

## MongoDB Connection

The backend is configured to connect to:
```
mongodb+srv://client001:Client001%40Mongo2025@cluster0.jpkxeoj.mongodb.net/foodswipe?appName=Cluster0
```

This connection string is set as a fallback default in `src/config/database.ts`, so the server will connect even if the .env file is not present.

## Development

- The server uses `tsx` for TypeScript execution in development
- Hot reload is enabled with `tsx watch`
- TypeScript compilation is handled automatically

## Troubleshooting

1. **Port already in use**: Change PORT in .env file
2. **MongoDB connection error**: Check your internet connection and MongoDB Atlas whitelist
3. **Module not found**: Run `npm install` again
4. **TypeScript errors**: Ensure all dependencies are installed






