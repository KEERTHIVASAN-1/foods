# 🚨 Backend Server Not Running

## Error: ERR_CONNECTION_REFUSED

This error means the **backend server is not running** on port 5000.

## Solution: Start the Backend Server

You have 3 options:

### Option 1: Start Both Together (Recommended)
```bash
npm run dev
```

This starts both frontend and backend in one command.

### Option 2: Start Backend Separately

**Open a NEW terminal window and run:**
```bash
cd server
npm run dev
```

You should see:
```
🔗 Connecting to MongoDB...
✅ MongoDB connected successfully
📊 Database: foodswipe
🚀 Server running on http://localhost:5000
```

**Then in another terminal, start frontend:**
```bash
npm run dev:client
```

### Option 3: Use the Batch File (Windows)
```bash
start-dev.bat
```

This opens two separate windows for backend and frontend.

## Verify Backend is Running

1. **Check the terminal** - You should see:
   - ✅ MongoDB connected successfully
   - 🚀 Server running on port 5000

2. **Test in browser:**
   - Open: `http://localhost:5000/api/health`
   - Should see: `{"status":"OK","message":"FoodSwipe API is running"}`

3. **Check frontend console:**
   - Should see: `🔗 API Base URL: http://localhost:5000/api`
   - No more connection refused errors

## Quick Fix Steps

1. **Stop current frontend** (if running) - Press `Ctrl+C`

2. **Start both servers:**
   ```bash
   npm run dev
   ```

3. **Wait for both to start:**
   - Backend: `✅ MongoDB connected` and `🚀 Server running`
   - Frontend: `VITE ready` message

4. **Try registration again** - Should work now!

## Troubleshooting

**If backend still won't start:**

1. Check if port 5000 is already in use:
   ```bash
   netstat -ano | findstr :5000
   ```

2. Change port in `server/.env`:
   ```env
   PORT=5001
   ```
   Then update frontend `.env`:
   ```env
   VITE_API_URL=http://localhost:5001/api
   ```

3. Check MongoDB connection:
   - Ensure internet connection
   - Check MongoDB Atlas IP whitelist

## Remember

**You need BOTH servers running:**
- ✅ Backend (port 5000) - Handles API requests
- ✅ Frontend (port 3000) - The web interface

Start both with: `npm run dev`


