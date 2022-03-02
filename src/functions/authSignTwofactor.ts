import { compressToEncodedURIComponent } from 'lz-string';

import Fetch from '@/src/utils/fetch';

declare type AuthSignTwofactorResponse = {
  qrcode: string
}

const authSignTwofactor = async (
  _fetch: Fetch,
  auth: string,
  authSignTwofactorAuthorization: string
): Promise<AuthSignTwofactorResponse> => {
  const req = await _fetch.exec<{
    data: {
      response: AuthSignTwofactorResponse
    }
    errors: Error[]
  }>(
    {
      query: `
        mutation comunicateAPI($auth: String!) {
          response: authSignTwofactor(
            auth: $auth
          ) {
            qrcode
          }
        }
      `,
      variables: {
        auth: compressToEncodedURIComponent(auth),
      },
    },
    {
      authorization: authSignTwofactorAuthorization,
      encodeuri: 'true',
    }
  ),
    {
      errors,
      data,
    } = req

  if (errors)
    throw new Error("Não foi possível retornar o QRCode");

  return data.response;
}

export default authSignTwofactor;