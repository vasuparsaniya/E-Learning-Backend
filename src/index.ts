import express, { Application, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { dbConnection } from '../packages/sequelize/database/connection';
import { logError, logger } from '../packages/logs';
import {
  FRONTEND_URL,
  SERVER_PORT,
} from '../packages/sequelize/config/env.config';
import { routers } from './server';
import cors from 'cors';

const app: Application = express();

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }),
);

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

routers().forEach((route) => {
  app.use('/api', route);
});

app.listen(SERVER_PORT, async () => {
  try {
    logger.info(
      `============= 🚀 Server Listen At ${SERVER_PORT} 🚀 ============`,
    );
    await dbConnection();
  } catch (err) {
    logError('Server Lister Error ' + err);
  }
});

// app.use('*', (req: Request, res: Response) => {
//   return res.send('Router Not Found');
// });

// Explicitly handle unmatched routes
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.path === '*') {
    res.status(404).send('Router Not Found');
  } else {
    next();
  }
});
