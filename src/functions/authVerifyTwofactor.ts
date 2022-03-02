import { compressToEncodedURIComponent } from 'lz-string';

import Fetch from '@/src/utils/fetch';

const authVerifyTwofactor = async (
  _fetch: Fetch,
  auth: string,
  qrcode: string,
  authVerifyTwofactorAuthorization: string
): Promise<boolean> => {
  const req = await _fetch.exec<{
    data: {
      response: boolean
    }
    errors: Error[]
  }>(
    {
      query: `
        mutation comunicateAPI($auth: String!, $qrcode: String!) {
          response: authVerifyTwofactor(
            auth: $auth,
            qrcode: $qrcode
          )
        }
      `,
      variables: {
        auth: compressToEncodedURIComponent(auth),
        qrcode: compressToEncodedURIComponent(qrcode)
      },
    },
    {
      authorization: authVerifyTwofactorAuthorization,
      encodeuri: 'true',
    }
  ),
    {
      errors,
      data,
    } = req

  if (errors)
    return false;

  return data.response;
}

export default authVerifyTwofactor;