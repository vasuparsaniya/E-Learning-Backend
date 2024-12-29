import 'ts-node/register';
import {
  DB_DATABASE,
  DB_HOST,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
  MIGRATION_LOG_ENABLE,
} from './env.config';

/**require for migration run
 * when migration run then config file by default sequelize find form build folder
 * we can manually also do that with out build folder
 */
export const username: string = DB_USER;
export const password: string = DB_PASSWORD;
export const database: string = DB_DATABASE;
export const port: number = +DB_PORT;
export const host: string = DB_HOST;
export const dialect: string = 'postgres';
export const logging: boolean = +MIGRATION_LOG_ENABLE === 1 ? true : false;
