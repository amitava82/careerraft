#!/usr/bin/env bash
echo "Pulling from git..."
git pull
echo "Installing dependencies..."
npm install
bower install
echo "Building JS bundle..."
webpack -p
echo "Building CSS..."
grunt prod
echo "Restarting APP..."
pm2 restart API