import 'express';
import { LoginUserTokenDataType } from './auth/index';

declare global {
  namespace Express {
    interface Request {
      user?: LoginUserTokenDataType;
    }
  }
}
