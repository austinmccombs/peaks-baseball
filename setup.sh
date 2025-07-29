#!/bin/bash

echo "Setting up Peaks Baseball Team Website..."

# Check if Ruby is installed
if ! command -v ruby &> /dev/null; then
    echo "Error: Ruby is not installed. Please install Ruby 2.5.0 or higher."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js 14 or higher."
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "Warning: PostgreSQL is not installed. Please install PostgreSQL before proceeding."
    echo "You can install it from: https://www.postgresql.org/download/"
fi

echo "Installing Ruby dependencies..."
bundle install

echo "Setting up database..."
rails db:create
rails db:migrate

echo "Setting up React frontend..."
cd client
npm install

echo "Setup complete!"
echo ""
echo "To start the application:"
echo "1. Start the Rails server: rails server -p 3001"
echo "2. In another terminal, start the React app: cd client && npm start"
echo ""
echo "The application will be available at:"
echo "- Frontend: http://localhost:3000"
echo "- API: http://localhost:3001" 