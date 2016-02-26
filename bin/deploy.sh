#!/usr/bin/env bash
echo "Pulling from git..."
git pull
echo "Installing dependencies..."
npm install
echo "Building JS bundle..."
webpack -p
echo "Building CSS..."
grunt css
echo "Restarting APP..."
pm2 restart API