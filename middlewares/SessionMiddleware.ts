import { NextRequest, NextResponse } from 'next/server'
import { verifyCookie } from '@/lib/verifyCookie';
import { setSessionCookies } from '@/src/utils/Cookies';

export async function SessionMiddleware(req: NextRequest, res: NextResponse) {
  try {
    const auth = await verifyCookie(req.cookies.auth),
      token = await verifyCookie(req.cookies.token),
      signature = await verifyCookie(req.cookies.signature),
      refreshTokenValue = await verifyCookie(req.cookies.refreshTokenValue),
      refreshTokenSignature = await verifyCookie(req.cookies.refreshTokenSignature);

    const
      pageName = req.page.name,
      url = req.nextUrl.clone();

    if (!auth || !signature || !refreshTokenValue || !refreshTokenSignature) {
      if (pageName === '/auth/login')
        return NextResponse.next();

      throw new Error('Invalid auth, refresh token or signature');
    }

    if (pageName?.includes('auth') && !pageName?.includes('password')) {
      url.pathname = '/system';
      return NextResponse.redirect(url);
    }

    const
      validate = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_HOST}/utils/auth/revalidate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          key: process.env.NEXT_PUBLIC_EXPRESS_AUTHORIZATION!
        },
        body: JSON.stringify({
          auth,
          token,
          signature,
          refreshTokenValue,
          refreshTokenSignature,
        })
      }),
      data = await validate.json();

    if (validate.status !== 200 || !data.success)
      throw new Error('Session is invalid');

    if (data.auth && data.token && data.refreshToken && data.signature)
      await setSessionCookies({
        authorization: data.auth,
        token: data.token,
        signature: data.signature,
        refreshTokenValue: data.refreshTokenValue,
        refreshTokenSignature: data.refreshTokenSignature,
      }, res);

    return res;
  } catch (error) {
    const url = req.nextUrl.clone();
    url.pathname = '/auth/logout';
    return NextResponse.redirect(url);
  }
}