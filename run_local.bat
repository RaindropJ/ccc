@echo off
cd /d "%~dp0"

python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not added to PATH.
    pause
    exit /b 1
)

echo ============================================================
echo   [Welfare Compass] Local Web Server (http://localhost:8080)
echo   - Local URL : http://localhost:8080
echo   - To stop   : Press Ctrl + C in this window
echo ============================================================

start "" http://localhost:8080
python -X utf8 -m http.server 8080
