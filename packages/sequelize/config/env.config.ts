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
} = process.env as { [key: string]: string };
