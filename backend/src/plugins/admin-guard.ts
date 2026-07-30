import { Elysia } from 'elysia';
import { authGuard } from './auth-guard';

export const adminGuard = (app: Elysia) =>
  app.use(authGuard).derive(({ user, set }) => {
    if (user.role !== 'admin') {
      set.status = 403;
      throw new Error('Forbidden – Admin access required');
    }
    return { user };
  });