# 🚀 How to Start the Application

## The Error You're Seeing

```
ERR_CONNECTION_REFUSED
Failed to fetch http://localhost:5000/api/auth/register
```

**This means the backend server is NOT running!**

## ✅ Solution: Start the Backend Server

### Method 1: Start Both Together (Easiest)

In your terminal, run:
```bash
npm run dev
```

**This will start:**
- Backend server on `http://localhost:5000`
- Frontend server on `http://localhost:3000`

**Wait until you see:**
```
Backend terminal shows:
  ✅ MongoDB connected successfully
  🚀 Server running on http://localhost:5000

Frontend terminal shows:
  VITE ready in xxx ms
  ➜  Local: http://localhost:3000/
```

### Method 2: Start Separately (If Method 1 doesn't work)

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Wait for:**
- ✅ MongoDB connected successfully
- 🚀 Server running on http://localhost:5000

**Terminal 2 - Frontend (NEW terminal window):**
```bash
npm run dev:client
```

## Verify Backend is Running

1. **Open your browser** and go to:
   ```
   http://localhost:5000/api/health
   ```

2. **You should see:**
   ```json
   {
     "status": "OK",
     "message": "FoodSwipe API is running"
   }
   ```

3. **If you see an error or "can't connect":**
   - The backend is NOT running
   - Go back to terminal and check for errors
   - Make sure you see "✅ MongoDB connected" message

## After Backend Starts

1. ✅ Backend terminal shows "Server running"
2. ✅ Frontend can connect (no more ERR_CONNECTION_REFUSED)
3. ✅ Registration/login should work

## Common Issues

### Issue: "Port 5000 already in use"
**Solution:** Another process is using port 5000. Either:
- Stop the other process
- Or change port in `server/.env` to 5001

### Issue: "MongoDB connection error"
**Solution:** 
- Check your internet connection
- Verify MongoDB Atlas IP whitelist allows all IPs (0.0.0.0/0)

### Issue: "npm run dev" only starts frontend
**Solution:** Use Method 2 - start backend separately first, then frontend

## Quick Checklist

- [ ] Backend terminal shows "✅ MongoDB connected"
- [ ] Backend terminal shows "🚀 Server running on port 5000"
- [ ] `http://localhost:5000/api/health` works in browser
- [ ] Frontend console shows "🔗 API Base URL: http://localhost:5000/api"
- [ ] No more ERR_CONNECTION_REFUSED errors

## Still Having Issues?

1. **Check backend terminal** - Look for error messages
2. **Check MongoDB connection** - Should see "✅ MongoDB connected"
3. **Try starting backend separately** - Use Method 2 above
4. **Check if port 5000 is free** - Run `netstat -ano | findstr :5000`

---

**Remember: You need BOTH servers running for the app to work!**




