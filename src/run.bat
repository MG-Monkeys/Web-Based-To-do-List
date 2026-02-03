@echo off

REM Install dependencies if node_modules doesn't exist
if not exist node_modules (
    echo Installing dependencies...
    call npm install
)

REM Run the application
echo Starting Todo App with Mongoose...
npm start
