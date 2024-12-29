import { Sequelize } from 'sequelize-typescript';
import { Dialect } from 'sequelize';
import config from '../config/config';
import allModels from '../models/index';
import { logError, logger } from '../../logs';
import { NODE_ENV } from '../config/env.config';

// const env: string = NODE_ENV || 'development';
const dbConfig = config.development; //use config[env]

//connect to database
let sequelize: Sequelize;

sequelize = new Sequelize(
  dbConfig.database as string,
  dbConfig.username as string,
  dbConfig.password as string,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect as Dialect,
    logging: dbConfig.logging,
  },
);

const db = { sequelize, Sequelize, ...allModels };
sequelize.addModels(Object.values(allModels));

export default db;

const dbConnection = async () => {
  try {
    await db.sequelize.authenticate();
    logger.info(`=============== 🛢️ Database Connect 🛢️ ===============`);
  } catch (error) {
    logError('Database Connection Error: ' + error);
  }
};

export { dbConnection };
