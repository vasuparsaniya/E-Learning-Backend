import { Request, Response, NextFunction } from 'express';
import { logError } from '../../../../packages/logs';
import {
  generalResponse,
  RESPONSE_STATUS_CODE,
} from '../../../../packages/ResponseHandle';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../../../packages/sequelize/config/env.config';
import {
  createUserRepo,
  getUserRepo,
  updateUserRepo,
} from '../../../../packages/sequelize/repository/users.repository';
import { AUTH_MESSAGES } from '../messages';
import db from '../../../../packages/sequelize/database/connection';
import {
  bcryptPassword,
  compareHashPassword,
  uuidGenerateHelper,
} from '../../../../packages/helper';

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { body } = req;
    const { firstName, lastName, email: userEmail, password } = body;

    // ** Bcrypt Password
    const hashPassword = await bcryptPassword({ password });

    const createdUser = await createUserRepo({
      first_name: firstName,
      last_name: lastName,
      email: userEmail,
      password: hashPassword,
      uuid: uuidGenerateHelper(),
    });

    const { id, first_name, last_name, email } = createdUser.get({
      plain: true,
    });

    generalResponse(res, {
      data: { id, first_name, last_name, email },
      statusCode: RESPONSE_STATUS_CODE.SUCCESS,
      message: AUTH_MESSAGES.SIGN_UP_SUCCESS,
    });
  } catch (error) {
    logError(error);
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { body } = req;
    const { email, password } = body;

    const user = await getUserRepo({
      where: {
        email,
      },
      attributes: { exclude: ['created_at', 'updated_at', 'deleted_at'] },
    });
    if (!user) {
      generalResponse(res, {
        data: null,
        statusCode: RESPONSE_STATUS_CODE.NOT_FOUND,
        message: AUTH_MESSAGES.SIGN_UP_SUCCESS,
      });
      return;
    }
    const isPasswordMatch = await compareHashPassword({
      password,
      hashPassword: user.password,
    });
    if (!isPasswordMatch) {
      generalResponse(res, {
        data: null,
        statusCode: RESPONSE_STATUS_CODE.NOT_FOUND,
        message: AUTH_MESSAGES.INVALID_LOGIN_CREDENTIALS,
      });
      return;
    }
    /* update last_login time
     */
    await db.sequelize.transaction(async (transaction) => {
      await updateUserRepo(
        { last_login: new Date() },
        { where: { id: user.id }, transaction },
      );
    });

    const token = jwt.sign(
      {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        uuid: user.uuid,
      },
      JWT_SECRET,
      {
        expiresIn: '24h',
      },
    );

    res
      .status(RESPONSE_STATUS_CODE.SUCCESS)
      .cookie('jwt-token', token, {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        httpOnly: true,
      })
      .json({
        data: {},
        message: AUTH_MESSAGES.LOGIN_SUCCESS,
      });
  } catch (error) {
    logError(error);
    next(error);
  }
};
