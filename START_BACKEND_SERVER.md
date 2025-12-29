# 🚨 URGENT: Start Backend Server NOW

## The Error
```
ERR_CONNECTION_REFUSED
POST http://localhost:5000/api/auth/register
```

**This means: YOUR BACKEND SERVER IS NOT RUNNING!**

## ✅ Fix It Right Now

### Open Terminal and Run:

```bash
cd server
npm run dev
```

### You MUST See This Output:

```
🔗 Connecting to MongoDB...
✅ MongoDB connected successfully
📊 Database: foodswipe
🚀 Server running on http://localhost:5000
```

### Test It Works:

1. **Open browser:** `http://localhost:5000/api/health`
2. **Should see:** `{"status":"OK","message":"FoodSwipe API is running"}`
3. **Then:** Registration will work!

---

## ⚠️ Critical Points

- ❌ **Frontend alone won't work** - needs backend
- ✅ **Backend must be running** on port 5000
- ✅ **Keep backend terminal open** while using app
- ✅ **Start backend FIRST**, then use frontend

## Quick Start Both Servers

If you want both running together:

```bash
npm run dev
```

This starts backend AND frontend together.

---

**🎯 DO THIS NOW:**
1. Open terminal
2. Run: `cd server && npm run dev`
3. Wait for "🚀 Server running"
4. Then try registration again






