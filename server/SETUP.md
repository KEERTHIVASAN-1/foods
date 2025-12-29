# Backend Setup Instructions

## Environment Variables

Create a `.env` file in the `server` directory with the following content:

```env
PORT=5000
MONGODB_URI=mongodb+srv://client001:Client001%40Mongo2025@cluster0.jpkxeoj.mongodb.net/foodswipe?appName=Cluster0
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2025
NODE_ENV=development
```

## Installation

1. Install dependencies:
```bash
cd server
npm install
```

2. Seed the database (optional but recommended):
```bash
npm run seed
```

This will create:
- 4-5 restaurants with 15 items each (75 total items)
- Admin user (admin@foodswipe.com / admin123)
- Owner users for each restaurant

3. Start the development server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

## API Endpoints

### Health Check
- `GET /api/health` - Check if server is running

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

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





