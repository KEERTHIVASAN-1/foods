# 🚀 FoodSwipe Backend - Start Here!

## ✅ Setup Complete!

Your backend is fully configured and ready to use with MongoDB Atlas.

### MongoDB Connection
- **Database:** `foodswipe`
- **Cluster:** `cluster0.jpkxeoj.mongodb.net`
- **Status:** ✅ Connected and configured

### Quick Start (3 Steps)

#### 1. Start the Server
```bash
cd server
npm run dev
```

You should see:
```
🔗 Connecting to MongoDB...
✅ MongoDB connected successfully
📊 Database: foodswipe
🚀 Server running on port 5000
```

#### 2. Test the Server
Open your browser and visit:
```
http://localhost:5000/api/health
```

You should see:
```json
{
  "status": "OK",
  "message": "FoodSwipe API is running"
}
```

#### 3. Seed the Database (Optional)
To populate with sample data:
```bash
npm run seed
```

This creates:
- 4-5 restaurants with 15 items each (75 total items)
- Admin user: `admin@foodswipe.com` / `admin123`
- Owner users for each restaurant

### What's Included

✅ **6 Mongoose Models:**
- User (with role-based auth)
- Restaurant (with approval workflow)
- Item (with image URLs)
- Review
- Order
- Notification

✅ **6 API Route Groups:**
- `/api/auth` - Authentication
- `/api/restaurants` - Restaurant management
- `/api/items` - Item management
- `/api/reviews` - Reviews
- `/api/orders` - Orders
- `/api/notifications` - Notifications

✅ **Features:**
- JWT Authentication
- Role-based access control (user, owner, admin)
- Restaurant approval workflow
- Image URL validation (Unsplash only)
- Top-selling items algorithm
- Full CRUD operations

### Default Credentials (after seeding)

**Admin:**
- Email: `admin@foodswipe.com`
- Password: `admin123`

**Restaurant Owner:**
- Email: `burgermanor@foodswipe.com`
- Password: `owner123`

### API Base URL

All API endpoints are prefixed with:
```
http://localhost:5000/api
```

### Frontend Integration

Make sure your frontend API client uses:
```typescript
const API_BASE_URL = 'http://localhost:5000/api';
```

Or set in frontend `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### Troubleshooting

**Can't connect to MongoDB?**
- Check your internet connection
- Verify MongoDB Atlas IP whitelist (allow all IPs: 0.0.0.0/0)
- Check the connection string in `.env` file

**Port already in use?**
- Change PORT in `.env` file to another port (e.g., 5001)
- Update frontend API URL accordingly

**Module not found?**
```bash
npm install
```

### Documentation

- `README.md` - Full documentation
- `QUICKSTART.md` - Quick start guide
- `BACKEND_STATUS.md` - Current setup status
- `SETUP.md` - Detailed setup instructions

---

**🎉 You're all set! Start the server and begin developing!**





