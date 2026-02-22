const { Sequelize } = require('sequelize');

// SECURITY: Validate required environment variables in production
if (process.env.NODE_ENV === 'production') {
    const requiredEnvVars = ['DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
        throw new Error(
            `Missing required environment variables in production: ${missingVars.join(', ')}\n` +
            'Please ensure all database credentials are set in .env file.'
        );
    }
}

const sequelize = new Sequelize(
    process.env.DB_NAME || 'luminor_db',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        retry: {
            max: 3,
            match: [
                /SequelizeConnectionError/,
                /SequelizeConnectionRefusedError/,
                /SequelizeHostNotFoundError/,
                /SequelizeHostNotReachableError/,
                /SequelizeInvalidConnectionError/,
                /SequelizeConnectionTimedOutError/,
                /ECONNREFUSED/,
                /ETIMEDOUT/,
                /ENOTFOUND/
            ]
        },
        define: {
            underscored: true,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
);

// Connection event handlers for better error handling and auto-reconnection
sequelize.beforeConnect(async (config) => {
    console.log('Attempting database connection...');
});

sequelize.afterConnect((connection, config) => {
    console.log('✓ Database connection established successfully');
});

// Handle connection errors and attempt reconnection
const handleConnectionError = (err) => {
    console.error('❌ Database connection error:', err.message);

    // Log detailed error in development
    if (process.env.NODE_ENV === 'development') {
        console.error('Error details:', err);
    }

    // Attempt reconnection after delay
    setTimeout(async () => {
        try {
            console.log('Attempting to reconnect to database...');
            await sequelize.authenticate();
            console.log('✓ Database reconnection successful');
        } catch (reconnectError) {
            console.error('Failed to reconnect:', reconnectError.message);
        }
    }, 5000); // Retry after 5 seconds
};

// Listen for connection pool errors
sequelize.connectionManager.pool.on('error', handleConnectionError);

module.exports = sequelize;
