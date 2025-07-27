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
import UsersModel from '../../../../packages/sequelize/models/users.model';

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { body } = req;
    const { firstName, lastName, email: userEmail, password } = body;

    /**Case:-1) Handle user email already exist or not */
    const isUserExist = await getUserRepo({
      where: { email: userEmail },
      attributes: ['id'],
    });
    if (isUserExist) {
      generalResponse(res, {
        data: null,
        statusCode: RESPONSE_STATUS_CODE.ALREADY_EXISTS,
        message: AUTH_MESSAGES.USER_ALREADY_EXIST,
      });
      return;
    }
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
    logError({ err: error, message: 'Error in signUp controller' });
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

    const responseData: { user: UsersModel | null; isPasswordMatch: boolean } =
      await db.sequelize.transaction(async (transaction) => {
        let isPasswordMatch = false;

        const user = await getUserRepo({
          where: {
            email,
          },
          attributes: { exclude: ['created_at', 'updated_at', 'deleted_at'] },
        });
        if (!user) {
          return { user: null, isPasswordMatch };
        }
        isPasswordMatch = await compareHashPassword({
          password,
          hashPassword: user.password,
        });
        if (!isPasswordMatch) {
          return { user, isPasswordMatch };
        }
        /* update last_login time
         */
        await updateUserRepo(
          { last_login: new Date() },
          { where: { id: user.id }, transaction },
        );
        return { user, isPasswordMatch };
      });
    const { user, isPasswordMatch } = responseData;

    if (!user) {
      generalResponse(res, {
        data: null,
        statusCode: RESPONSE_STATUS_CODE.NOT_FOUND,
        message: AUTH_MESSAGES.USER_NOT_FOUND,
      });
      return;
    }

    if (!isPasswordMatch) {
      generalResponse(res, {
        data: null,
        statusCode: RESPONSE_STATUS_CODE.BAD_REQUEST,
        message: AUTH_MESSAGES.INVALID_LOGIN_CREDENTIALS,
      });
      return;
    }

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
    logError({ err: error, message: 'Error in login controller' });
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user } = req;

    console.log('=======tokenData', { user });
    generalResponse(res, {
      data: {},
      statusCode: RESPONSE_STATUS_CODE.SUCCESS,
      message: AUTH_MESSAGES.LOGIN_USER_DATA_GET_SUCCESS,
    });
    return;
  } catch (error) {
    logError({ err: error, message: 'Error in loginUser controller' });
    next(error);
  }
};
