import { Request, Response, NextFunction } from 'express';
import { logError } from '../../../../packages/logs';
import { generalResponse } from '../../../../packages/ResponseHandle';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../../../packages/sequelize/config/env.config';

export const signUp = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body } = req;
    const {} = body;
    generalResponse(res, {
      data: {},
      statusCode: 200,
      message: 'Signup successfully',
    });
  } catch (error) {
    logError(error);
    next(error);
  }
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body } = req;
    const {} = body;

    /**Update uuid_token
     * update last_login time
     */

    const token = jwt.sign({}, JWT_SECRET, {
      expiresIn: '24h',
    });
    res.cookie('jwt-token', token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
    });
  } catch (error) {
    logError(error);
    next(error);
  }
};
