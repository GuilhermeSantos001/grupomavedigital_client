// eslint-disable-next-line @next/next/no-server-import-in-page
import { jwtVerify } from 'jose'
import { compressToUint8Array } from 'lz-string'

export async function verifyCookie(cookie: string) {
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