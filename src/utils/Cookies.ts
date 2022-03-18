// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextResponse } from 'next/server';
import { cookieOptions } from '@/constants/cookieOptions';

export type SessionCookies = {
  authorization: string;
  token: string;
  signature: string;
  refreshTokenValue: string;
  refreshTokenSignature: string;
}

export async function setSessionCookies(cookies: SessionCookies, res: NextResponse) {
  try {
    res.cookie('auth', cookies.authorization, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    res.cookie('token', cookies.token, cookieOptions);
    res.cookie('signature', cookies.signature, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    res.cookie('refreshTokenValue', cookies.refreshTokenValue, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    res.cookie('refreshTokenSignature', cookies.refreshTokenSignature, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
  } catch (error) {
    throw new Error(String(error));
  }
}

export async function clearSessionCookies(res: NextResponse) {
  try {
    res.clearCookie('auth');
    res.clearCookie('token');
    res.clearCookie('signature');
    res.clearCookie('refreshTokenValue');
    res.clearCookie('refreshTokenSignature');
  } catch (error) {
    throw new Error(String(error));
  }
}