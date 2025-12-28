@echo off
echo Starting FoodSwipe Backend Server...
echo.

REM Check if .env file exists
if not exist .env (
    echo Creating .env file...
    (
        echo PORT=5000
        echo MONGODB_URI=mongodb+srv://client001:Client001%%40Mongo2025@cluster0.jpkxeoj.mongodb.net/foodswipe?appName=Cluster0
        echo JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2025
        echo NODE_ENV=development
    ) > .env
    echo .env file created!
    echo.
)

echo Starting server...
npm run dev


