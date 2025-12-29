# 🚨 CRITICAL: Backend Server Must Be Running

## Current Error
```
ERR_CONNECTION_REFUSED
Failed to fetch http://localhost:5000/api/auth/register
```

## ✅ SOLUTION: Start the Backend Server

### Step 1: Open Terminal
Open a terminal in the project root directory (`d:\foodswipe`)

### Step 2: Start Backend Server

**Option A - Start Both Together:**
```bash
npm run dev
```

**Option B - Start Backend Only:**
```bash
cd server
npm run dev
```

### Step 3: Wait for Backend to Start

**You MUST see these messages:**
```
🔗 Connecting to MongoDB...
✅ MongoDB connected successfully
📊 Database: foodswipe
🚀 Server running on http://localhost:5000
📡 API endpoints available at http://localhost:5000/api
💚 Health check: http://localhost:5000/api/health
```

### Step 4: Verify Backend is Running

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

### Step 5: Now Try Registration Again

Once backend is running, registration will work!

---

## ⚠️ Important Notes

1. **Backend MUST be running** before frontend can work
2. **Keep the backend terminal open** - don't close it
3. **If you see MongoDB errors** - check your internet connection
4. **If port 5000 is in use** - stop other services or change port in `server/.env`

## Troubleshooting

### Backend won't start?
- Check for errors in terminal
- Ensure MongoDB connection string is correct
- Verify internet connection for MongoDB Atlas

### Still getting connection refused?
- Make sure backend terminal shows "🚀 Server running"
- Try accessing `http://localhost:5000/api/health` in browser
- Check Windows Firewall isn't blocking port 5000

---

**🚀 Once backend shows "Server running", everything will work!**



