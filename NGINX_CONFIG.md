# Nginx Proxy Configurations for HestiaCP

These are the nginx configurations to add to each subdomain in HestiaCP.
Go to: HestiaCP → Web → Edit Domain → Advanced Options → Proxy Template → Custom

---

## luminor.solutions (Frontend)

Add this to the Nginx template or create a custom proxy config:

```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
    proxy_read_timeout 86400;
}

# Static files optimization
location /_next/static {
    proxy_pass http://127.0.0.1:3000;
    proxy_cache_valid 365d;
    add_header Cache-Control "public, immutable";
}
```

---

## api.luminor.solutions (Backend API)

```nginx
location / {
    proxy_pass http://127.0.0.1:5000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
    
    # For file uploads
    client_max_body_size 50M;
}

# Serve uploaded files directly
location /uploads {
    alias /var/www/luminor/luminor-backend/uploads;
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

---

## admin.luminor.solutions (Admin Panel)

```nginx
location / {
    proxy_pass http://127.0.0.1:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

---

## How to Apply in HestiaCP

1. SSH into your server
2. Create proxy template files:

```bash
# Create proxy template for each app
sudo nano /usr/local/hestia/data/templates/web/nginx/luminor-frontend.tpl
sudo nano /usr/local/hestia/data/templates/web/nginx/luminor-api.tpl
sudo nano /usr/local/hestia/data/templates/web/nginx/luminor-admin.tpl
```

3. Or simply add the proxy_pass configuration via HestiaCP's Web Domain settings → Proxy Template
