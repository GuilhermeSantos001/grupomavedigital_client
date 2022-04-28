import { compressToEncodedURIComponent } from 'lz-string';

import Fetch from '@/src/utils/fetch';

const mailConfirm = async (
  _fetch: Fetch,
  token: string,
  mailConfirmAuthorization: string,
): Promise<boolean> => {
  const req = await _fetch.exec<{
    data: {
      response: boolean
    }
    errors: Error[]
  }>(
    {
      query: `
        query comunicateAPI($token: String!) {
          response: mailConfirm(
            token: $token
          )
        }
      `,
      variables: {
        token: compressToEncodedURIComponent(token)
      },
    },
    {
      authorization: mailConfirmAuthorization,
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

export default mailConfirm;