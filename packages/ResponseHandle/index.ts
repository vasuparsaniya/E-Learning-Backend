import { logError } from '../logs';
import { Response } from 'express';

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
    return res.status(500).json({
      data: {},
      message: 'Something went wrong!',
      toast: true,
    });
  }
};
