import {
  DB_DATABASE,
  DB_PASSWORD,
  DB_USER,
  QUERY_LOG_ENABLE,
} from './env.config';

export default {
  development: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    host: '127.0.0.1',
    dialect: 'postgres',
    logging: +QUERY_LOG_ENABLE === 0 ? false : true,
  },
  // test: {
  //   username: 'root',
  //   password: null,
  //   database: 'database_test',
  //   host: '127.0.0.1',
  //   dialect: 'postgres',
  // },
  // production: {
  //   username: 'root',
  //   password: null,
  //   database: 'database_production',
  //   host: '127.0.0.1',
  //   dialect: 'postgres',
  // },
};
