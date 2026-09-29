@echo off
echo ===================================================================
echo   VisionTrace AI - AI-Based Deepfake Detection System
echo   Launching Backend (FastAPI) and Frontend (Vite + React)...
echo ===================================================================

cd /d "%~dp0"

start "VisionTrace AI - Backend" cmd /k "cd backend && python main.py"
timeout /t 2 /nobreak >nul
start "VisionTrace AI - Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting!
echo Backend:  http://127.0.0.1:8001 (API Docs: http://127.0.0.1:8001/docs)
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit this launcher window (servers will stay running).
pause >nul
