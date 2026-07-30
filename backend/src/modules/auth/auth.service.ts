import { prisma } from '../../db/client';
import { User } from '../../types';

const toSafeUser = (user: {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  joinDate: Date;
}): Omit<User, 'password'> => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role as 'customer' | 'admin',
  avatar: user.avatar ?? undefined,
  joinDate: user.joinDate.toISOString().split('T')[0],
});

export const AuthService = {
  async register(
    name: string,
    email: string,
    passwordPlain: string
  ): Promise<Omit<User, 'password'>> {
    const hashedPassword = await Bun.password.hash(passwordPlain);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'customer',
      },
    });

    return toSafeUser(user);
  },

  async login(
    email: string,
    passwordPlain: string
  ): Promise<Omit<User, 'password'> | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    const validPassword = await Bun.password.verify(
      passwordPlain,
      user.password
    );

    if (!validPassword) return null;

    return toSafeUser(user);
  },

  async getUserById(
    id: string
  ): Promise<Omit<User, 'password'> | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return toSafeUser(user);
  },
};