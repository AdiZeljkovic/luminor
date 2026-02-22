module.exports = {
    apps: [
        {
            name: 'luminor-backend',
            cwd: '/home/Luminor/web/luminor.solutions/luminor-backend',
            script: 'server.js',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '500M',
            env: {
                NODE_ENV: 'production',
                PORT: 5000
            }
        },
        {
            name: 'luminor-frontend',
            cwd: '/home/Luminor/web/luminor.solutions/luminor-frontend',
            script: 'node_modules/next/dist/bin/next',
            args: 'start',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '500M',
            env: {
                NODE_ENV: 'production',
                PORT: 3002,
                NEXT_PUBLIC_API_URL: 'https://api.luminor.solutions'
            }
        },
        {
            name: 'luminor-admin',
            cwd: '/home/Luminor/web/luminor.solutions/luminor-admin',
            script: 'node_modules/next/dist/bin/next',
            args: 'start -p 3001',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '500M',
            env: {
                NODE_ENV: 'production',
                PORT: 3001,
                NEXT_PUBLIC_API_URL: 'https://api.luminor.solutions',
                NEXT_PUBLIC_FRONTEND_URL: 'https://luminor.solutions'
            }
        }
    ]
};
