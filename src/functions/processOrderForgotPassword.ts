import { compressToEncodedURIComponent } from 'lz-string';

import Fetch from '@/src/utils/fetch';

const processOrderForgotPassword = async (
  _fetch: Fetch,
  signature: string,
  token: string,
  pwd: string,
  processOrderForgotPasswordAuthorization: string
): Promise<boolean> => {
  const req = await _fetch.exec<{
    data: {
      response: boolean
    }
    errors: Error[]
  }>(
    {
      query: `
        query comunicateAPI($signature: String!, $token: String!, $pwd: String!) {
          response: processOrderForgotPassword(
            signature: $signature,
            token: $token,
            pwd: $pwd,
          )
        }
      `,
      variables: {
        signature: compressToEncodedURIComponent(signature),
        token: compressToEncodedURIComponent(token),
        pwd: compressToEncodedURIComponent(pwd),
      },
    },
    {
      authorization: processOrderForgotPasswordAuthorization,
      encodeuri: 'true'
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

export default processOrderForgotPassword;