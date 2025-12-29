# ⚡ Quick Fix: Backend Not Running

## The Problem
```
ERR_CONNECTION_REFUSED
Failed to fetch http://localhost:5000/api/auth/register
```

**This means: Backend server is NOT running!**

## The Solution

### Step 1: Stop Everything
Press `Ctrl+C` in any running terminals

### Step 2: Start Both Servers
```bash
npm run dev
```

### Step 3: Wait for Both to Start

**You should see:**
```
Backend:
  🔗 Connecting to MongoDB...
  ✅ MongoDB connected successfully
  🚀 Server running on http://localhost:5000

Frontend:
  VITE v6.x.x  ready in xxx ms
  ➜  Local:   http://localhost:3000/
```

### Step 4: Try Again
Go to the frontend and try registering again. It should work now!

## Alternative: Start Separately

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
npm run dev:client
```

## Verify It's Working

1. **Check backend:** Open `http://localhost:5000/api/health`
   - Should show: `{"status":"OK","message":"FoodSwipe API is running"}`

2. **Check frontend console:**
   - Should see: `🔗 API Base URL: http://localhost:5000/api`
   - No connection errors

3. **Try registration** - Should work!

---

**TL;DR: Run `npm run dev` to start both servers!**






