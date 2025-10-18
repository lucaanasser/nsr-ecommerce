import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

export const config = {
  // Server
  env: process.env['NODE_ENV'] || 'development',
  port: parseInt(process.env['PORT'] || '4000', 10),
  
  // Database
  database: {
    url: process.env['DATABASE_URL'] || '',
  },
  
  // JWT
  jwt: {
    secret: process.env['JWT_SECRET'] || 'dev-secret-not-for-production',
    refreshSecret: process.env['JWT_REFRESH_SECRET'] || 'dev-refresh-secret-not-for-production',
    expiresIn: process.env['JWT_EXPIRES_IN'] || '15m',
    refreshExpiresIn: process.env['JWT_REFRESH_EXPIRES_IN'] || '7d',
  },
  
  // Cloudinary
  cloudinary: {
    cloudName: process.env['CLOUDINARY_CLOUD_NAME'] || '',
    apiKey: process.env['CLOUDINARY_API_KEY'] || '',
    apiSecret: process.env['CLOUDINARY_API_SECRET'] || '',
    url: process.env['CLOUDINARY_URL'] || '',
  },
  
  // Email
  email: {
    host: process.env['EMAIL_HOST'] || 'smtp.gmail.com',
    port: parseInt(process.env['EMAIL_PORT'] || '587', 10),
    secure: process.env['EMAIL_SECURE'] === 'true',
    user: process.env['EMAIL_USER'] || '',
    password: process.env['EMAIL_PASSWORD'] || '',
    from: process.env['EMAIL_FROM'] || 'NSR E-commerce <noreply@nsr.com>',
  },
  
  // CORS
  cors: {
    origin: process.env['CORS_ORIGIN']?.split(',') || ['http://localhost:3000'],
  },
  
  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env['RATE_LIMIT_WINDOW_MS'] || '60000', 10),
    max: parseInt(process.env['RATE_LIMIT_MAX_REQUESTS'] || '100', 10),
  },
  
  // Frontend
  frontend: {
    url: process.env['FRONTEND_URL'] || 'http://localhost:3000',
  },
  
  // Debug
  debug: process.env['DEBUG'] === 'true',
  
  // Seed
  seedDatabase: process.env['SEED_DATABASE'] === 'true',
} as const;

// Validar configurações essenciais
export function validateConfig(): void {
  const errors: string[] = [];
  
  if (!config.database.url) {
    errors.push('DATABASE_URL is required');
  }
  
  if (config.env === 'production') {
    if (config.jwt.secret.includes('dev-secret')) {
      errors.push('JWT_SECRET must be set in production');
    }
    if (config.jwt.refreshSecret.includes('dev-refresh')) {
      errors.push('JWT_REFRESH_SECRET must be set in production');
    }
  }
  
  if (errors.length > 0) {
    throw new Error(`Configuration errors:\n${errors.join('\n')}`);
  }
}
