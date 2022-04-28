import { compressToEncodedURIComponent } from 'lz-string';

import Fetch from '@/src/utils/fetch';

const authEnabledTwofactor = async (
  _fetch: Fetch,
  auth:string,
  authEnabledTwofactorAuthorization: string,
  ): Promise<boolean> => {
  const req = await _fetch.exec<{
    data: {
      response: boolean
    }
    errors: Error[]
  }>(
    {
      query: `
        mutation comunicateAPI($auth: String!) {
          response: authEnabledTwofactor(
            auth: $auth
          )
        }
      `,
      variables: {
        auth: compressToEncodedURIComponent(auth)
      },
    },
    {
      authorization: authEnabledTwofactorAuthorization,
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

export default authEnabledTwofactor;