#!/bin/bash
echo "Setting up environment..."
export NODE_PATH=$NODE_PATH:./node_modules/.bin
export PATH=$PATH:./node_modules/.bin

echo "Installing dependencies..."
npm install

echo "Building the application..."
npm run build

echo "Build complete!"
echo "Output directory: dist"