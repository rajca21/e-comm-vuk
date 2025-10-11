import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  COOKIE_NAME: process.env.COOKIE_NAME || 'velora_token',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
};

if (!env.JWT_SECRET) {
  console.warn('[WARN] JWT_SECRET is not set. Set it in .env for security.');
}
