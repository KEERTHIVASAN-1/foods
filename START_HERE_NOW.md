# ⚠️ IMPORTANT: Start Backend Server First!

## Current Problem

You're seeing: `ERR_CONNECTION_REFUSED`  
**Reason:** The backend server on port 5000 is NOT running!

## Fix It Now

### Quick Start (Recommended)

**In your terminal, run:**
```bash
npm run dev
```

**This ONE command starts BOTH:**
- ✅ Backend server (port 5000)
- ✅ Frontend server (port 3000)

### What You Should See

**Backend output:**
```
🔗 Connecting to MongoDB...
✅ MongoDB connected successfully
📊 Database: foodswipe
🚀 Server running on http://localhost:5000
📡 API endpoints available at http://localhost:5000/api
💚 Health check: http://localhost:5000/api/health
```

**Frontend output:**
```
VITE v6.x.x  ready in xxx ms
➜  Local:   http://localhost:3000/
```

### After Both Start

1. ✅ No more connection errors
2. ✅ Registration will work
3. ✅ Login will work
4. ✅ Everything will work!

## Test It Works

1. **Backend health check:**
   - Open: `http://localhost:5000/api/health`
   - Should see JSON response

2. **Frontend console:**
   - Should see: `🔗 API Base URL: http://localhost:5000/api`
   - No connection errors

3. **Try registration:**
   - Should work now!

---

## 🎯 TL;DR

**Just run:** `npm run dev`  
**Wait for:** Both servers to start  
**Then:** Everything works!



