import { Router } from 'express';
import { validationMiddleware } from '../../../../packages/validation';
import { loginSchema, signUpValidationSchema } from '../validation';
import { login, loginUser, signUp } from '../controller';
import { authMiddleware } from '../middleware/auth.middleware';

export const AuthRoutes = () => {
  const router = Router();
  const basePath = '/auth';

  router.post(
    `${basePath}/signup`,
    validationMiddleware(signUpValidationSchema),
    signUp,
  );
  router.post(`${basePath}/login`, validationMiddleware(loginSchema), login);
  router.post(`${basePath}/login-user`, authMiddleware, loginUser);

  return router;
};
