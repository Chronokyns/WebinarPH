@echo off
echo ========================================================
echo Starting WebinarMatch (Full-Stack AI Capstone Server)
echo ========================================================
echo URL: http://localhost:8000
echo Role Accounts:
echo   - Student: student@university.edu (Password: student123)
echo   - Admin:   admin@webinarmatch.org (Password: admin123)
echo ========================================================
"%~dp0.tools\python\python.exe" -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000
pause
