@echo off

REM Install backend dependencies if node_modules doesn't exist
if not exist server\node_modules (
    echo Installing dependencies...
    call npm install
)

REM Install frontend dependencies if client/node_modules doesn't exist
if not exist client\node_modules (
    echo Installing frontend dependencies...
    cd client
    call npm install
    cd ..

REM start both servers
echo Starting Todo App with Mongoose...
echo Backend will run on http://localhost:5500
echo Frontend will run on http://localhost:3000
start cmd /k "cd server && npm start"
start cmd /k "cd client && npm start"
