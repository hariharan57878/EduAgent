@echo off
echo Starting EduAgent Backend...
start cmd /k "cd server && npm run dev"
echo Starting EduAgent Frontend...
start cmd /k "npm run dev"
echo Both servers are starting up. Please check the new terminal windows.
echo Access the application at http://localhost:5173
pause
