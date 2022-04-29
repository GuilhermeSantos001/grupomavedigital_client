import { compressToEncodedURIComponent } from 'lz-string';

import Fetch from '@/src/utils/fetch';

const authLogout = async (
  _fetch: Fetch,
  auth: string,
  token: string,
  signature: string,
  authLogoutAuthorization: string
): Promise<boolean> => {
  const req = await _fetch.exec<{
    data: {
      response: boolean
    }
    errors: Error[]
  }>(
    {
      query: `
         query comunicateAPI($auth: String!, $token: String!, $signature: String!) {
           response: authLogout(
             auth: $auth,
             token: $token,
             signature: $signature
           )
         }
       `,
      variables: {
        auth: compressToEncodedURIComponent(auth),
        token: compressToEncodedURIComponent(token),
        signature: compressToEncodedURIComponent(signature)
      },
    },
    {
      authorization: authLogoutAuthorization,
      encodeuri: 'true',
    }
  ),
    {
      errors,
      data,
    } = req

  if (errors) {
    console.error(errors);
    throw new Error(`Não foi possível desconectar sua sessão no momento. Contacte o administrador do sistema!`);
  }

  return data.response;
}

export default authLogout;