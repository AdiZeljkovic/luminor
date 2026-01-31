const cors = require('cors');

// Helper to safely parse env vars
const getEnvOrigins = (envVar) => {
    if (!envVar) return [];
    return envVar.split(',').map(url => url.trim()).filter(url => url.length > 0);
};

// 1. Define Static Origins (Hardcoded for safety)
const staticOrigins = [
    'https://luminor.solutions',
    'https://www.luminor.solutions',
    'https://admin.luminor.solutions',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001'
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, server-to-server)
        if (!origin) return callback(null, true);

        // 2. Build dynamic list from environment
        const dynamicOrigins = [
            ...getEnvOrigins(process.env.FRONTEND_URL),
            ...getEnvOrigins(process.env.ADMIN_URL)
        ];

        // 3. Combine and Deduplicate
        const allowedOrigins = [...new Set([...staticOrigins, ...dynamicOrigins])];

        // 4. Check Origin
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            // LOGGING FOR DEBUGGING
            console.log('---------------------------------');
            console.log('🚨 CORS BLOCKED ORIGIN:', origin);
            console.log('✅ ALLOWED ORIGINS:', allowedOrigins);
            console.log('---------------------------------');

            return callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    preflightContinue: false,
    optionsSuccessStatus: 204
};

module.exports = cors(corsOptions);
