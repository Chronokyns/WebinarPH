Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Starting WebinarMatch (Full-Stack AI Capstone Server)" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Application URL: http://localhost:8000" -ForegroundColor Green
Write-Host "Role Accounts:" -ForegroundColor Yellow
Write-Host "  - Student: student@university.edu (Password: student123)" -ForegroundColor Yellow
Write-Host "  - Admin:   admin@webinarmatch.org (Password: admin123)" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan

& "$PSScriptRoot\.tools\python\python.exe" -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000
