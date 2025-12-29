@echo off
echo Starting FoodSwipe Frontend and Backend...
echo.

start "FoodSwipe Backend" cmd /k "cd server && npm run dev"
timeout /t 3 /nobreak >nul
start "FoodSwipe Frontend" cmd /k "npm run dev:client"

echo.
echo ✅ Both servers are starting in separate windows
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000 (check the frontend window for actual port)
echo.
pause




