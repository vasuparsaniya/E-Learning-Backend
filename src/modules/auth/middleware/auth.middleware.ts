import { Request, Response, NextFunction } from 'express';
import { logger } from '../../../../packages/logs';
import Jwt, { StrategyOptionsWithoutRequest } from 'passport-jwt';
import Extract from 'passport-jwt';
import passport, { DoneCallback, PassportStatic } from 'passport';
import { JWT_SECRET } from '../../../../packages/sequelize/config/env.config';
import { getUserPkIdRepo } from '../../../../packages/sequelize/repository/users.repository';
import {
  generalResponse,
  RESPONSE_STATUS_CODE,
} from '../../../../packages/ResponseHandle';
import { AUTH_MESSAGES } from '../messages';
import { LoginUserTokenDataType } from '../../../../packages/types/auth';

const cookieExtractor = (req: Request) => {
  var token = null;
  if (req && req.cookies) {
    token = req.cookies['jwt-token'];
  }
  return token;
};

export const auth = (passport: PassportStatic) => {
  const JwtStrategy = Jwt.Strategy;
  const ExtractJwt = Extract.ExtractJwt;

  const option: StrategyOptionsWithoutRequest = {
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: JWT_SECRET,
  };

  passport.use(
    new JwtStrategy(option, async (jwtPayload, done: DoneCallback) => {
      logger.info('===========jwtPayload======= %o', jwtPayload);
      const user = await getUserPkIdRepo(jwtPayload.id, {
        attributes: ['id', 'uuid', 'email', 'first_name', 'last_name'],
      });
      //**uuid maintain for token block listing */
      if (user && jwtPayload.uuid === user.uuid) {
        return done(null, {
          id: user.id,
          uuid: user.uuid,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
        });
      } else {
        return done(null, false);
      }
    }),
  );
};

/**
 * Middleware to authenticate JWT tokens.
 * It extracts the token from cookies and verifies it against the JWT secret.
 * If the token is valid and matches the user UUID, it allows the request to proceed.
 * Otherwise, it denies access.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 */
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  auth(passport);

  /** passport.authenticate returns a middleware function.
   * By immediately invoking it with (req, res, next), we execute the authentication logic
   * using our custom callback to handle success or failure cases manually. */
  passport.authenticate(
    'jwt',
    { session: false },
    (error: any, user: LoginUserTokenDataType) => {
      if (error) {
        logger.error('[Error:authMiddleware] %o', error);
        return generalResponse(res, {
          data: {},
          statusCode: RESPONSE_STATUS_CODE.INTERNAL_SERVER_ERROR,
          message: 'Internal server error',
        });
      }
      if (!user) {
        logger.warn('[Warning:authMiddleware] Unauthorized access attempt');
        return generalResponse(res, {
          data: {},
          statusCode: RESPONSE_STATUS_CODE.UN_AUTHORIZED,
          message: AUTH_MESSAGES.UN_AUTHORIZED,
        });
      }
      // Attach user to request if needed
      req.user = user;
      next();
    },
  )(req, res, next);
};
