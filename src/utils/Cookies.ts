// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextResponse } from 'next/server';
import { cookieOptions } from '@/constants/cookieOptions';

import { jwtVerify } from 'jose'
import { compressToUint8Array } from 'lz-string'

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

export async function readyCookie(cookie: string) {
  try {
    const verified = await jwtVerify(
      cookie,
      compressToUint8Array(process.env.SIGNED_COOKIE_SECRET!)
    );

    return verified.payload.value as string;
  } catch {
    return false;
  }
}