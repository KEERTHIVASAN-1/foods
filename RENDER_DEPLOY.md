# Render Deployment Guide

## Frontend Deployment on Render

### Configuration

I've created a `render.yaml` file for your frontend deployment. Here's what you need to do:

### 1. Environment Variables

In your Render dashboard, make sure to set:
- `VITE_API_URL` = Your backend API URL (e.g., `https://your-backend.onrender.com/api`)

### 2. Build Settings

The `render.yaml` file is configured with:
- **Type**: Static Site
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `./dist`

### 3. Manual Configuration (Alternative)

If `render.yaml` doesn't work, configure manually in Render dashboard:

**Build Settings:**
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`
- **Environment**: Static Site

**Environment Variables:**
- `VITE_API_URL` = Your backend API URL

### 4. Important Notes

- The frontend is a **Static Site** on Render
- Make sure your backend is deployed separately (as a Web Service)
- Update `VITE_API_URL` to point to your deployed backend
- The build will create a `dist` folder with all static files

### 5. Backend Deployment

For the backend, deploy it as a separate **Web Service** on Render:

**Build Command**: `cd server && npm install && npm run build`
**Start Command**: `cd server && npm start`
**Environment Variables**:
- `PORT` (Render sets this automatically)
- `MONGODB_URI` = Your MongoDB connection string
- `JWT_SECRET` = Your JWT secret

### Troubleshooting

If you see errors during build:
1. Make sure Node.js version is 18+ in Render settings
2. Check that all dependencies are listed in `package.json`
3. Ensure `VITE_API_URL` is set correctly
4. Check the build logs for specific errors



