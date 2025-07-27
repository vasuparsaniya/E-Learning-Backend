import dotenv from 'dotenv';
dotenv.config();

export const {
  //database
  DB_USER,
  DB_PASSWORD,
  DB_DATABASE,
  DB_HOST,
  DB_PORT,
  //server
  NODE_ENV,
  SERVER_PORT,
  //
  FRONTEND_URL,
  // log
  MIGRATION_LOG_ENABLE,
  QUERY_LOG_ENABLE,
  // JWT Secret
  JWT_SECRET,

  // SMTP
  SMTP_USER,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_SECURE,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REFRESH_TOKEN,
} = process.env as { [key: string]: string };
