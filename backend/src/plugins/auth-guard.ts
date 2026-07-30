import { Elysia } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import { cookie } from '@elysiajs/cookie';

interface JwtPayload {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
}

export const authGuard = (app: Elysia) =>
  app
    .use(
      jwt({
        name: 'jwt',
        secret: process.env.JWT_SECRET!,
      })
    )
    .use(cookie())

    .derive(async ({ jwt, cookie, set }) => {
      const token = cookie.auth_token?.value;

      console.log('Auth Cookie:', token);

      if (!token) {
        set.status = 401;
        throw new Error('Unauthorized');
      }

      const payload = (await jwt.verify(token as string)) as JwtPayload | false;

      console.log('JWT Payload:', payload);

      if (!payload) {
        set.status = 401;
        throw new Error('Invalid token');
      }

      const { id, name, email, role } = payload;

      if (
        typeof id !== 'string' ||
        typeof name !== 'string' ||
        typeof email !== 'string' ||
        (role !== 'customer' && role !== 'admin')
      ) {
        set.status = 401;
        throw new Error('Invalid token payload');
      }

      return {
        user: {
          id,
          name,
          email,
          role,
        },
      };
    });