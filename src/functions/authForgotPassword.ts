import { compressToEncodedURIComponent } from 'lz-string';

import Fetch from '@/src/utils/fetch';

const authForgotPassword = async (
  _fetch: Fetch,
  auth: string,
  authForgotPasswordAuthorization: string,
): Promise<boolean> => {
  const req = await _fetch.exec<{
    data: {
      response: boolean
    }
    errors: Error[]
  }>(
    {
      query: `
        query comunicateAPI($auth: String!) {
          response: authForgotPassword(
            auth: $auth
          )
        }
      `,
      variables: {
        auth: compressToEncodedURIComponent(auth)
      },
    },
    {
      authorization: authForgotPasswordAuthorization,
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

export default authForgotPassword;