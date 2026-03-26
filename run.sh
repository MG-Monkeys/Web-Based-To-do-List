#!/bin/bash

# Install backend dependencies
echo "Installing server dependencies..."
(cd server && npm install)

# Install frontend dependencies
echo "Installing client dependencies..."
(cd client && npm install)

# Run the application
echo "Starting Todo App with Mongoose..."
echo "Starting Todo App..."
echo "Backend will run on http://localhost:5500"
echo "Frontend will run on http://localhost:3000"

(cd server && npm start) &
(cd client && npm start) &

wait