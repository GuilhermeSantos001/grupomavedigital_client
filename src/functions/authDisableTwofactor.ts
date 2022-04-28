import { compressToEncodedURIComponent } from 'lz-string';

import Fetch from '@/src/utils/fetch';

const authDisableTwofactor = async (
  _fetch: Fetch,
  auth: string,
  authDisableTwofactorAuthorization: string
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
          response: authDisableTwofactor(
            auth: $auth
          )
        }
      `,
      variables: {
        auth: compressToEncodedURIComponent(auth)
      },
    },
    {
      authorization: authDisableTwofactorAuthorization,
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

export default authDisableTwofactor;