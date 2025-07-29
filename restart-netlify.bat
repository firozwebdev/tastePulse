@echo off
echo Restarting Netlify Dev Server...
echo.
echo Stopping any existing Netlify processes...
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo Starting Netlify Dev Server...
echo.
netlify dev

pause