import { Elysia, t } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import { cookie } from '@elysiajs/cookie';
import { AuthService } from './auth.service';

interface JwtPayload {
  id: string;
  email: string;
  role: 'customer' | 'admin';
}

export const authRoutes = new Elysia({ prefix: '/auth' })
  .use(
    jwt({
      name: 'jwt',
      secret: process.env.JWT_SECRET!,
    })
  )
  .use(cookie())

  .post(
    '/register',
    async ({ body, set, jwt, cookie }) => {
      const { name, email, password } = body;

      try {
        const user = await AuthService.register(name, email, password);

        const token = await jwt.sign({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});

        cookie.auth_token.set({
          value: token,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7,
        });

        return { user };
      } catch (error) {
        console.error(error);
        set.status = 400;
        return { error: 'Registration failed' };
      }
    },
    {
      body: t.Object({
        name: t.String(),
        email: t.String({ format: 'email' }),
        password: t.String({ minLength: 6 }),
      }),
    }
  )

  .post(
    '/login',
    async ({ body, set, jwt, cookie }) => {
      const { email, password } = body;

      const user = await AuthService.login(email, password);

      if (!user) {
        set.status = 401;
        return { error: 'Invalid credentials' };
      }

     const token = await jwt.sign({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});

      cookie.auth_token.set({
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
      });

      return { user };
    },
    {
      body: t.Object({
        email: t.String({ format: 'email' }),
        password: t.String(),
      }),
    }
  )

  .post('/logout', ({ cookie }) => {
    cookie.auth_token.remove();
    return { success: true };
  })

  .get('/me', async ({ jwt, cookie, set }) => {
    const token = cookie.auth_token?.value as string | undefined;

    if (!token) {
      set.status = 401;
      return { error: 'Not authenticated' };
    }

    const payload = (await jwt.verify(token)) as JwtPayload | false;

    if (!payload) {
      set.status = 401;
      return { error: 'Invalid token' };
    }

    const user = await AuthService.getUserById(payload.id);

    if (!user) {
      set.status = 404;
      return { error: 'User not found' };
    }

    return { user };
  });