import dotenv from 'dotenv';

dotenv.config();

export default {
  port: process.env.PORT || 3000,
  dbUrl: process.env.DATABASE_URL,
  secretKey: process.env.SECRET_KEY,
};
