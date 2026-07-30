import { Elysia } from 'elysia';

const store = new Map<string, { count: number; resetAt: number }>();

export const rateLimit = (options: { max: number; windowMs: number }) =>
  new Elysia().derive(({ request, set }) => {
    const ip = request.headers.get('x-forwarded-for') || 'anonymous';
    const key = `rate:${ip}`;
    const now = Date.now();

    const entry = store.get(key);
    if (entry) {
      if (now > entry.resetAt) {
        // reset
        store.set(key, { count: 1, resetAt: now + options.windowMs });
      } else if (entry.count >= options.max) {
        set.status = 429;
        throw new Error('Too many requests, please try again later.');
      } else {
        entry.count++;
      }
    } else {
      store.set(key, { count: 1, resetAt: now + options.windowMs });
    }
  });