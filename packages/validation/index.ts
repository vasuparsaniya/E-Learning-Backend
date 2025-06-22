import { Request, Response, NextFunction } from 'express';
import { logError, logger } from '../logs';
import { generalResponse } from '../ResponseHandle';
import Joi from 'joi';

// Validation Middleware
export const validationMiddleware = (
  validationSchema: Joi.ObjectSchema<any>,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error } = await validationSchema.validateAsync(req.body);
      // If validation failed, respond with an error message
      if (error) {
        logger.info('=======errors validationMiddleware====== %o', error);
        generalResponse(res, {
          data: {},
          statusCode: 422,
          message: error.message,
          toast: true,
        });
        return;
      }

      // If validation passed, continue to the next middleware
      next();
    } catch (error: any) {
      // Handle Joi validation errors
      logError(error);
      if (error.isJoi) {
        generalResponse(res, {
          data: {},
          statusCode: 422,
          message: error.message,
          toast: true,
        });
        return;
      }

      generalResponse(res, {
        data: {},
        statusCode: 500,
        message: 'Internal Server Error',
        toast: true,
      });
      return;
    }
  };
};
