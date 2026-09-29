@echo off
cd /d "%~dp0backend"
echo Starting VisionTrace AI Backend API on http://127.0.0.1:8001...
python main.py
pause
