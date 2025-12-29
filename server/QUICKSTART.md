# Quick Start Guide

## 1. Install Dependencies
```bash
cd server
npm install
```

## 2. Start the Server

The MongoDB connection is already configured in the code, so you can start immediately:

```bash
npm run dev
```

Or on Windows:
```bash
start.bat
```

The server will start on `http://localhost:5000`

## 3. Seed the Database (Optional)

To populate with sample data:

```bash
npm run seed
```

This creates:
- 4-5 restaurants with 15 items each
- Admin user (admin@foodswipe.com / admin123)
- Owner users (restaurantname@foodswipe.com / owner123)

## 4. Test the API

Open your browser and go to:
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

## MongoDB Connection

The server is already configured to connect to your MongoDB Atlas cluster:
- Database: `foodswipe`
- Cluster: `cluster0.jpkxeoj.mongodb.net`

The connection string is embedded in the code as a fallback, so no .env file is required to start.

## Next Steps

1. Start the frontend (in the root directory): `npm run dev`
2. Make sure the frontend's API URL points to `http://localhost:5000/api`
3. Login with admin credentials after seeding



