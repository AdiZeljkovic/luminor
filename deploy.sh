#!/bin/bash

# Luminor Deployment Script
# Run this on the server after cloning from GitHub

set -e  # Exit on error

echo "🚀 Starting Luminor Deployment..."

# Configuration
APP_DIR="/var/www/luminor"
REPO_URL="https://github.com/AdiZeljkovic/luminor.git"
BRANCH="main"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Create directories if they don't exist
echo -e "${YELLOW}📁 Creating directories...${NC}"
mkdir -p $APP_DIR/{frontend,backend,admin}

# Step 2: Clone or pull from GitHub
if [ -d "$APP_DIR/.git" ]; then
    echo -e "${YELLOW}⬇️ Pulling latest changes...${NC}"
    cd $APP_DIR
    git pull origin $BRANCH
else
    echo -e "${YELLOW}⬇️ Cloning repository...${NC}"
    cd /var/www
    rm -rf luminor
    git clone $REPO_URL luminor
    cd $APP_DIR
fi

# Step 3: Backend setup
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

# Step 4: Frontend setup
echo -e "${YELLOW}🔧 Setting up Frontend...${NC}"
cd $APP_DIR/luminor-frontend

# Create .env.local for Next.js
echo "NEXT_PUBLIC_API_URL=https://api.luminor.solutions" > .env.local

npm install
npm run build
echo -e "${GREEN}✅ Frontend built${NC}"

# Step 5: Admin setup
echo -e "${YELLOW}🔧 Setting up Admin Panel...${NC}"
cd $APP_DIR/luminor-admin

# Create .env.local for Next.js
echo "NEXT_PUBLIC_API_URL=https://api.luminor.solutions" > .env.local

npm install
npm run build
echo -e "${GREEN}✅ Admin built${NC}"

# Step 6: Copy PM2 ecosystem config
echo -e "${YELLOW}📋 Copying PM2 config...${NC}"
cp $APP_DIR/ecosystem.config.js /var/www/luminor/

# Step 7: Start/Restart with PM2
echo -e "${YELLOW}🔄 Starting PM2 processes...${NC}"
cd /var/www/luminor

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
echo "  - Frontend: https://luminor.solutions"
echo "  - Backend API: https://api.luminor.solutions"
echo "  - Admin Panel: https://admin.luminor.solutions"
