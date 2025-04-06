import { Router } from 'express';
import { validationMiddleware } from '../../../../packages/validation';
import { loginSchema, signUpValidationSchema } from '../validation';
import { login, signUp } from '../controller';

export const AuthRoutes = () => {
  const router = Router();
  const basePath = '/auth';

  router.post(
    `${basePath}/signup`,
    validationMiddleware(signUpValidationSchema),
    signUp,
  );
  router.post(`${basePath}/login`, validationMiddleware(loginSchema), login);
  return router;
};
