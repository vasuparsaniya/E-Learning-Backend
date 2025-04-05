import { Request, Response, NextFunction } from 'express';
import { logger } from '../../../../packages/logs';
import Jwt, { StrategyOptionsWithoutRequest } from 'passport-jwt';
import Extract from 'passport-jwt';
import passport from 'passport';
import { JWT_SECRET } from '../../../../packages/sequelize/config/env.config';
import { getUserPkIdRepo } from '../../../../packages/sequelize/repository/users.repository';

const cookieExtractor = (req: Request) => {
  var token = null;
  if (req && req.cookies) {
    token = req.cookies['jwt-token'];
  }
  return token;
};

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const JwtStrategy = Jwt.Strategy;
    const ExtractJwt = Extract.ExtractJwt;

    const option: StrategyOptionsWithoutRequest = {
      jwtFromRequest: ExtractJwt.fromExtractors(cookieExtractor(req)),
      secretOrKey: JWT_SECRET,
    };
    passport.use(
      new JwtStrategy(option, async (jwtPayload, done) => {
        logger.info('===========jwtPayload======= %o', jwtPayload);
        const user = await getUserPkIdRepo(jwtPayload.id, {
          attributes: ['id'],
        });
        if (user) {
          next();
          return done(null, true);
        } else {
          return done(null, false);
        }
      }),
    );
  } catch (error) {
    logger.error('[Error:authMiddleware] %o', error);
    throw error;
  }
};
