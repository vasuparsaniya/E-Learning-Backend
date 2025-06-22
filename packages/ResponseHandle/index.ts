import { logError } from '../logs';
import { Response } from 'express';

export const RESPONSE_STATUS_CODE = Object.freeze({
  SUCCESS: 200,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  ALREADY_EXISTS: 409, // Used when a resource (e.g., user) already exists
  BAD_REQUEST: 400,
  UN_AUTHORIZED: 401, // Used for unauthorized access
  FORBIDDEN: 403, // Used when access is forbidden
});

export const generalResponse = (
  res: Response,
  args: {
    data: any;
    statusCode: number;
    message?: string;
    toast?: boolean;
  },
) => {
  try {
    const { data, statusCode, message = '', toast = false } = args;

    return res.status(statusCode).json({
      data,
      message,
      toast,
    });
  } catch (error) {
    logError(error);
    return res.status(RESPONSE_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      data: {},
      message: 'Something went wrong!',
      toast: true,
    });
  }
};
