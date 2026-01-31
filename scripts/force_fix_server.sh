#!/bin/bash

# FORCE FIX SERVER SCRIPT
# This script nukes local changes and forces a sync with origin/main
# Use this when the server refuses to pick up the latest code.

echo "============================================"
echo "🚑 STARTING EMERGENCY FIX PROCEDURE"
echo "============================================"
echo "Date: $(date)"
echo ""

APP_DIR="/home/Luminor/web/luminor.solutions/luminor-backend"

echo "📍 Navigating to $APP_DIR"
cd $APP_DIR || { echo "❌ Failed to navigate to backend dir"; exit 1; }

echo "🔄 Resetting Git (Discarding local changes)..."
git reset --hard origin/main
git clean -fd

echo "⬇️ Pulling latest code..."
git pull origin main

echo "📦 Reinstalling Dependencies (Ensure clean slate)..."
rm -rf node_modules package-lock.json
npm install

echo "🔄 Restarting Server Process..."
pm2 delete luminor-backend 2>/dev/null || true
pm2 start server.js --name luminor-backend

echo "💾 Saving PM2 List..."
pm2 save

echo ""
echo "⏳ Waiting 5 seconds for server to initialize..."
sleep 5

echo ""
echo "🔍 RUNNING DIAGNOSTICS..."
cd ../  # Go back to root to find the diagnostic script
if [ -f "scripts/diagnose_server.sh" ]; then
    chmod +x scripts/diagnose_server.sh
    ./scripts/diagnose_server.sh
else
    echo "⚠️ Diagnostic script not found. Please pull root repo."
fi

echo ""
echo "✅ FIX PROCEDURE COMPLETE."
echo "============================================"
