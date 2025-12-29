# 🚨 URGENT: Backend Server Must Be Running

## Current Error

```
ERR_CONNECTION_REFUSED
POST http://localhost:5000/api/auth/register
```

**The backend server is NOT running!**

## ✅ IMMEDIATE FIX

### Option 1: Start Both Servers (Easiest)

**In your terminal, run:**
```bash
npm run dev
```

**You should see:**
```
[0] 🔗 Connecting to MongoDB...
[0] ✅ MongoDB connected successfully
[0] 🚀 Server running on http://localhost:5000
[1] VITE ready in xxx ms
[1] ➜  Local:   http://localhost:3000/
```

### Option 2: Start Backend Separately

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Wait for:**
```
✅ MongoDB connected successfully
🚀 Server running on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
npm run dev:client
```

## Verify It's Working

1. **Check backend terminal** - Should show "🚀 Server running on http://localhost:5000"

2. **Test in browser** - Open: `http://localhost:5000/api/health`
   - Should see: `{"status":"OK","message":"FoodSwipe API is running"}`

3. **Check frontend console** - Should show: `🔗 API Base URL: http://localhost:5000/api`

4. **Try registration** - Should work now!

## Important Notes

- ⚠️ **Both servers must be running** for the app to work
- ⚠️ **Backend must be on port 5000** (check `server/.env`)
- ⚠️ **Keep the backend terminal open** - don't close it while using the app

---

**🚀 Start the backend server now with `npm run dev`!**



