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
import cookieParser from 'cookie-parser';

const app: Application = express();

// Log every API hit
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`[API-HIT] ${req.method} ${req.originalUrl}`);
  next();
});

// Log success and failed responses
app.use((req: Request, res: Response, next: NextFunction) => {
  res.on('finish', () => {
    if (res.statusCode >= 200 && res.statusCode < 400) {
      logger.info(
        `[API-SUCCESS] ${req.method} ${req.originalUrl} - ${res.statusCode}`,
      );
    } else {
      logger.error(
        `[API-FAILED] ${req.method} ${req.originalUrl} - ${res.statusCode}`,
      );
    }
  });
  next();
});

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
app.use(cookieParser());

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
    logError({ message: 'Server Lister Error ', err });
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

// Error-handling middleware for uncaught errors
app.use((err: any, req: Request, res: Response) => {
  logger.error(`[ERROR] ${req.method} ${req.originalUrl} - ${err.message}`);
  res.status(500).json({ message: 'Internal Server Error' });
});
