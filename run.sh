#!/bin/bash

# Install backend dependencies if node_modules doesn't exist
if [ ! -d "/server/node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Install frontend dependencies if client/node_modules doesn't exist
if [ ! -d "/client/node_modules" ]; then
    echo "Installing frontend dependencies..."
    cd client
    npm install
    cd ..
fi

# Run the application
echo "Starting Todo App with Mongoose..."
echo "Starting Todo App..."
echo "Backend will run on http://localhost:5500"
echo "Frontend will run on http://localhost:3000"

cd server && npm start &
cd client && npm start &

wait