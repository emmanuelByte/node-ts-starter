import dotenv from 'dotenv';

dotenv.config();

export default {
  db: {
    url: process.env.MONGODB_URI || '',
  },
  jwt: {
    secret: process.env.JWT_SECRET || '',
    expiresIn: process.env.JWT_EXPIRES_IN || '',
  },
  app: {
    port: process.env.PORT || 3000,
  },
};
