@echo off
echo Starting Backend Server...
cd /d "%~dp0"
node server-with-fallback.js
pause
