#!/bin/bash

# Luminor Diagnostics Script
# Run this on the server: ./diagnose_server.sh

echo "============================================"
echo "🔍 STATING DIAGNOSTICS FOR LUMINOR"
echo "============================================"
echo "Date: $(date)"
echo ""

# 1. Check if processes are running
echo "📊 PM2 SETTINGS:"
pm2 status
echo ""

# 2. Check Port 5000 (Backend)
echo "🔌 CHECKING PORT 5000 (BACKEND):"
if lsof -i :5000 > /dev/null; then
    echo "✅ Port 5000 is ACTIVE and listening."
else
    echo "❌ Port 5000 is CLOSED. Backend is NOT running."
fi
echo ""

# 3. Check Local API Response (Bypassing Nginx)
echo "📞 TESTING LOCAL API CONNECTIVITY:"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/health)
if [ "$HTTP_CODE" == "200" ]; then
    echo "✅ Local Backend responded with 200 OK."
else
    echo "❌ Local Backend FAILED with code: $HTTP_CODE"
    echo "   (If 000, server is down)"
fi
echo ""

# 4. Check Public API Response (Through Nginx)
echo "🌍 TESTING PUBLIC API (NGINX):"
PUBLIC_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://api.luminor.solutions/api/health)
if [ "$PUBLIC_CODE" == "200" ]; then
    echo "✅ Public API responded with 200 OK."
else
    echo "❌ Public API FAILED with code: $PUBLIC_CODE"
    echo "   (If 502, Nginx cannot talk to Backend)"
    echo "   (If 522/524, Connection Timeout)"
fi
echo ""

# 5. Check Recent Logs for Errors
echo "📜 RECENT ERROR LOGS (Last 20 lines):"
echo "-------------------------------------"
pm2 logs luminor-backend --lines 20 --nostream
echo "-------------------------------------"

echo ""
echo "诊断 COMPLETE."
echo "============================================"
