#!/bin/bash

# Luminor Deployment Script for HestiaCP
# Run this on the server in /home/Luminor/web/luminor.solutions

set -e  # Exit on error

echo "🚀 Starting Luminor Deployment..."

# Configuration - HestiaCP path structure
APP_DIR="/home/Luminor/web/luminor.solutions"
REPO_URL="https://github.com/AdiZeljkovic/luminor.git"
BRANCH="main"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Pull latest code (assuming we're already in the repo)
echo -e "${YELLOW}⬇️ Pulling latest changes...${NC}"
cd $APP_DIR
git pull origin $BRANCH || echo "First time setup or not a git repo yet"

# Step 2: Backend setup
echo -e "${YELLOW}🔧 Setting up Backend...${NC}"
cd $APP_DIR/luminor-backend

# Create .env file
cat > .env << 'EOF'
PORT=5000
NODE_ENV=production

# MySQL Database (HestiaCP)
DB_HOST=localhost
DB_USER=Luminor_admin
DB_PASSWORD=BubaZeljkovic2112!
DB_NAME=Luminor_db
DB_PORT=3306

# JWT Configuration
JWT_SECRET=LuminorSuperSecret2026ProductionKey!@#$%^
JWT_REFRESH_SECRET=LuminorRefreshSecret2026ProductionKey!@#$%^
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

# CORS - Production URLs
FRONTEND_URL=https://luminor.solutions
ADMIN_URL=https://admin.luminor.solutions

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=noreply@luminor.solutions
EMAIL_TO=contact@luminor.solutions
EOF

npm install --production
echo -e "${GREEN}✅ Backend ready${NC}"

# Step 3: Frontend setup
echo -e "${YELLOW}🔧 Setting up Frontend...${NC}"
cd $APP_DIR/luminor-frontend

# Create .env.local for Next.js
echo "NEXT_PUBLIC_API_URL=https://api.luminor.solutions" > .env.local

npm install
npm run build
echo -e "${GREEN}✅ Frontend built${NC}"

# Step 4: Admin setup
echo -e "${YELLOW}🔧 Setting up Admin Panel...${NC}"
cd $APP_DIR/luminor-admin

# Create .env.local for Next.js
echo "NEXT_PUBLIC_API_URL=https://api.luminor.solutions" > .env.local

npm install
npm run build
echo -e "${GREEN}✅ Admin built${NC}"

# Step 5: Start/Restart with PM2
echo -e "${YELLOW}🔄 Starting PM2 processes...${NC}"
cd $APP_DIR

# Stop existing processes if any
pm2 delete luminor-backend luminor-frontend luminor-admin 2>/dev/null || true

# Start all apps
pm2 start ecosystem.config.js

# Save PM2 process list
pm2 save

echo -e "${GREEN}✅ All services started!${NC}"
echo ""
echo "📊 PM2 Status:"
pm2 status

echo ""
echo -e "${GREEN}🎉 Deployment complete!${NC}"
echo ""
echo "Your apps are now running at:"
echo "  - Frontend: https://luminor.solutions (port 3000)"
echo "  - Backend API: https://api.luminor.solutions (port 5000)"
echo "  - Admin Panel: https://admin.luminor.solutions (port 3001)"
echo ""
echo "Next step: Configure Nginx proxy in HestiaCP for each subdomain!"
