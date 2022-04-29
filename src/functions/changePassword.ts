import { compressToEncodedURIComponent } from 'lz-string';

import Fetch from '@/src/utils/fetch';

const changePassword = async (
  _fetch: Fetch,
  auth: string,
  pwd: string,
  new_pwd: string,
  changePasswordAuthorization: string
): Promise<boolean> => {
  const req = await _fetch.exec<{
    data: {
      response: boolean
    }
    errors: Error[]
  }>(
    {
      query: `
        mutation comunicateAPI($auth: String!, $pwd: String!, $new_pwd: String!) {
          response: changePassword(
            auth: $auth,
            pwd: $pwd,
            new_pwd: $new_pwd,
          )
        }
      `,
      variables: {
        auth: compressToEncodedURIComponent(auth),
        pwd: compressToEncodedURIComponent(pwd),
        new_pwd: compressToEncodedURIComponent(new_pwd),
      },
    },
    {
      authorization: changePasswordAuthorization,
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

export default changePassword;