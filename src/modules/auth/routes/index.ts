import { Router } from 'express';
import { validationMiddleware } from '../../../../packages/validation';
import { signUpValidationSchema } from '../validation';
import { signUp } from '../controller';

export const AuthRoutes = () => {
  const router = Router();
  const basePath = '/auth';

  router.post(
    `${basePath}/signup`,
    validationMiddleware(signUpValidationSchema),
    signUp,
  );
  return router;
};
