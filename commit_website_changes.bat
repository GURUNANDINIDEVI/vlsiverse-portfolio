@echo off
echo =======================================================
echo   VLSIVerse - Committing Website Changes to GitHub
echo =======================================================
echo.
echo 1. Staging website features and content...
git add js/views/studio.js js/views/practice.js js/views/digital_practice.js js/views/projects.js js/views/protocols.js js/views/interviews.js js/views/dashboard.js js/views/admin.js js/data.js css/styles.css

echo.
echo 2. Committing website changes...
git commit -m "Update VLSIVerse platform features and content"

echo.
echo 3. Pushing to GitHub repository...
git push origin main

echo.
echo =======================================================
echo   Done! Website changes committed and pushed to GitHub.
echo =======================================================
pause
