import type { Response } from 'express';

export const setCookie = <T>(res: Response, name: string, value: T, lifetime: number) => {
  const expiresAt = new Date(Date.now() + lifetime);
  res.cookie(name, value, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    expires: expiresAt,
    path: '/',
  });
};

export const clearCookie = (res: Response, name: string) => {
  res.clearCookie(name, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    path: '/',
  });
};
