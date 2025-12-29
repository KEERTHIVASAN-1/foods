# Quick Start Guide

## Start Both Servers

### Option 1: Using npm (Recommended)
```bash
npm run dev
```

This will start both frontend and backend servers concurrently.

### Option 2: Using Batch File (Windows)
```bash
start-dev.bat
```

This will open two separate command windows - one for backend and one for frontend.

### Option 3: Manual (If above don't work)

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev:client
```

## Server URLs

- **Backend API**: http://localhost:5000
- **Frontend**: http://localhost:3000 (or check the console for the actual port)

## Troubleshooting

### If `concurrently` is not recognized:
1. Make sure you've run: `npm install`
2. Try using: `npx concurrently "npm run dev:server" "npm run dev:client"`
3. Or use the `start-dev.bat` file instead

### If port is already in use:
- Backend: Change PORT in `server/.env` file
- Frontend: Vite will automatically use the next available port

### If MongoDB connection fails:
- Check your internet connection
- Verify MongoDB Atlas IP whitelist allows all IPs (0.0.0.0/0)
- Check the connection string in `server/.env`

## First Time Setup

1. **Install dependencies:**
   ```bash
   npm install
   cd server
   npm install
   cd ..
   ```

2. **Seed database (optional):**
   ```bash
   cd server
   npm run seed
   ```

3. **Start servers:**
   ```bash
   npm run dev
   ```

4. **Open browser:**
   - Go to the frontend URL (usually http://localhost:3000)
   - Register or login to start using the app

## Default Login (after seeding)

- **Admin**: admin@foodswipe.com / admin123
- **Owner**: burgermanor@foodswipe.com / owner123





