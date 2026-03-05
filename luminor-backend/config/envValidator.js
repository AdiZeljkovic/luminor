/**
 * Environment Variables Validator
 * Validates that all required environment variables are present at startup
 * CRITICAL: This prevents the application from starting with missing credentials
 */

const validateEnv = () => {
    const requiredEnvVars = {
        // JWT Security
        JWT_SECRET: 'JWT signing secret',
        JWT_REFRESH_SECRET: 'JWT refresh token secret',
        CLIENT_JWT_SECRET: 'Client portal JWT signing secret',

        // Database (already validated in database.js for production)
        DB_NAME: 'Database name',
        DB_USER: 'Database user',
        DB_HOST: 'Database host',

        // CORS
        FRONTEND_URL: 'Frontend URL for CORS',
        ADMIN_URL: 'Admin panel URL for CORS'
    };

    // Production-only required variables
    const productionOnlyVars = {
        DB_PASSWORD: 'Database password'
    };

    const missingVars = [];
    const weakSecrets = [];

    // Check required variables
    for (const [varName, description] of Object.entries(requiredEnvVars)) {
        if (!process.env[varName]) {
            missingVars.push(`${varName} (${description})`);
        }
    }

    // Check production-only variables
    if (process.env.NODE_ENV === 'production') {
        for (const [varName, description] of Object.entries(productionOnlyVars)) {
            if (!process.env[varName]) {
                missingVars.push(`${varName} (${description})`);
            }
        }
    }

    // Validate JWT secrets are not default/weak values
    const defaultSecrets = [
        'your-super-secret-jwt-key-change-in-production',
        'your-refresh-secret-key-change-in-production',
        'secret',
        'jwt-secret',
        '12345',
        'password'
    ];

    if (process.env.JWT_SECRET && defaultSecrets.includes(process.env.JWT_SECRET)) {
        weakSecrets.push('JWT_SECRET is using a default/weak value');
    }

    if (process.env.JWT_REFRESH_SECRET && defaultSecrets.includes(process.env.JWT_REFRESH_SECRET)) {
        weakSecrets.push('JWT_REFRESH_SECRET is using a default/weak value');
    }

    // Check minimum secret length (32 characters recommended)
    if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
        weakSecrets.push('JWT_SECRET should be at least 32 characters long');
    }

    if (process.env.JWT_REFRESH_SECRET && process.env.JWT_REFRESH_SECRET.length < 32) {
        weakSecrets.push('JWT_REFRESH_SECRET should be at least 32 characters long');
    }

    // Report errors
    if (missingVars.length > 0) {
        console.error('\n❌ CRITICAL: Missing required environment variables:\n');
        missingVars.forEach(varInfo => console.error(`   - ${varInfo}`));
        console.error('\n💡 Please create a .env file based on .env.example\n');

        if (process.env.NODE_ENV === 'production') {
            throw new Error('Cannot start in production mode with missing environment variables');
        } else {
            console.warn('⚠️  Starting in development mode with missing variables (NOT RECOMMENDED)\n');
        }
    }

    if (weakSecrets.length > 0 && process.env.NODE_ENV === 'production') {
        console.error('\n❌ CRITICAL: Weak or default secrets detected:\n');
        weakSecrets.forEach(issue => console.error(`   - ${issue}`));
        console.error('\n🔐 Generate strong secrets with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"\n');
        throw new Error('Cannot start in production mode with weak secrets');
    } else if (weakSecrets.length > 0) {
        console.warn('\n⚠️  WARNING: Weak or default secrets detected:\n');
        weakSecrets.forEach(issue => console.warn(`   - ${issue}`));
        console.warn('\n🔐 Please update secrets before deploying to production\n');
    }

    if (missingVars.length === 0 && weakSecrets.length === 0) {
        console.log('✅ Environment validation passed\n');
    }
};

module.exports = { validateEnv };
