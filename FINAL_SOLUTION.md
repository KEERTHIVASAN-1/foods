# ✅ Final Solution: Backend Not Running

## Error Analysis

**Error:** `ERR_CONNECTION_REFUSED` on `http://localhost:5000/api/auth/register`

**Root Cause:** The backend server is NOT running on port 5000.

## ✅ Configuration Verified

- ✅ `server/.env` exists with `PORT=5000`
- ✅ `server/src/server.ts` configured correctly
- ✅ Frontend `.env` configured with `VITE_API_URL=http://localhost:5000/api`
- ✅ API client configured correctly
- ❌ **Backend server process is NOT listening on port 5000**

## 🔧 Solution

### Start the Backend Server

**Run this command:**
```bash
npm run dev
```

This will start:
- ✅ Backend server on `http://localhost:5000`
- ✅ Frontend server on `http://localhost:3000`

### What to Look For

**In the terminal, you should see:**
```
[0] 🔗 Connecting to MongoDB...
[0] ✅ MongoDB connected successfully
[0] 📊 Database: foodswipe
[0] 🚀 Server running on http://localhost:5000
[0] 📡 API endpoints available at http://localhost:5000/api
[0] 💚 Health check: http://localhost:5000/api/health

[1] VITE v6.x.x  ready in xxx ms
[1] ➜  Local:   http://localhost:3000/
```

### Verify Backend is Running

1. **Open in browser:** `http://localhost:5000/api/health`
   - Should see: `{"status":"OK","message":"FoodSwipe API is running"}`

2. **Check frontend console:**
   - Should see: `🔗 API Base URL: http://localhost:5000/api`
   - No more connection errors

3. **Try registration:**
   - Should work now!

## Important Notes

- ⚠️ **Keep the terminal open** - Don't close it while using the app
- ⚠️ **Backend must be running** - Frontend cannot work without backend
- ⚠️ **Port 5000 must be free** - Make sure nothing else is using it

---

**🚀 Run `npm run dev` now to start both servers!**






