# 🚨 Backend Server is NOT Running

## Error: ERR_CONNECTION_REFUSED

```
POST http://localhost:5000/api/auth/register net::ERR_CONNECTION_REFUSED
```

**This means the backend server is NOT running on port 5000!**

## ✅ Solution: Start the Backend Server

### Step 1: Check if Backend is Running

**Option A - Start Both Together (Recommended):**
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend server on `http://localhost:3000`

**Option B - Start Backend Separately:**

In a terminal, run:
```bash
cd server
npm run dev
```

### Step 2: Verify Backend is Running

**Look for these messages in the terminal:**
```
🔗 Connecting to MongoDB...
✅ MongoDB connected successfully
📊 Database: foodswipe
🚀 Server running on http://localhost:5000  ← MUST see this!
📡 API endpoints available at http://localhost:5000/api
💚 Health check: http://localhost:5000/api/health
```

### Step 3: Test Backend

**Open in browser:**
```
http://localhost:5000/api/health
```

**Should see:**
```json
{
  "status": "OK",
  "message": "FoodSwipe API is running",
  "timestamp": "..."
}
```

### Step 4: Try Registration Again

Once the backend is running and shows "Server running on port 5000", try registration again - it will work!

## Quick Checklist

- [ ] Backend terminal shows "✅ MongoDB connected successfully"
- [ ] Backend terminal shows "🚀 Server running on http://localhost:5000"
- [ ] `http://localhost:5000/api/health` works in browser
- [ ] Frontend console shows "🔗 API Base URL: http://localhost:5000/api"
- [ ] No more ERR_CONNECTION_REFUSED errors

## Common Issues

### Backend won't start?
- Check for errors in terminal
- Ensure MongoDB connection string is correct
- Verify internet connection for MongoDB Atlas

### Port 5000 already in use?
- Stop the process using port 5000
- Or change port in `server/.env` to 5001 and update frontend `.env`

### Backend starts but on wrong port?
- Check `server/.env` - should have `PORT=5000`
- Restart backend after changing .env

---

**🚀 Start the backend server and everything will work!**





