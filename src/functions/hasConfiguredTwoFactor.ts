import { compressToEncodedURIComponent } from 'lz-string';

import Fetch from '@/src/utils/fetch';

const hasConfiguredTwoFactor = async (
  _fetch: Fetch,
  auth: string,
  hasConfiguredTwoFactorAuthorization: string,
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
          response: hasConfiguredTwoFactor(
            auth: $auth
          )
        }
      `,
      variables: {
        auth: compressToEncodedURIComponent(auth),
      },
    },
    {
      authorization: hasConfiguredTwoFactorAuthorization,
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

export default hasConfiguredTwoFactor;