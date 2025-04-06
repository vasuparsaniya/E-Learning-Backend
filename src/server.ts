import { AuthRoutes } from './modules/auth/routes';

export const routers = () => {
  const route = [AuthRoutes()];
  return route;
};
