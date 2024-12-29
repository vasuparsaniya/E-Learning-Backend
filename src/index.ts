import express, { Application, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { dbConnection } from '../packages/sequelize/database/connection';
import { logError, logger } from '../packages/logs';
import { SERVER_PORT } from '../packages/sequelize/config/env.config';

const app: Application = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

// app.use(router);

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
