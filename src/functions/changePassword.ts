/**
 * @description Efetuada uma chamada para a API para alterar a
 * senha do usuario
 * @author @GuilhermeSantos001
 * @update 01/10/2021
 */

import { compressToEncodedURIComponent } from 'lz-string';

import Fetch from '@/src/utils/fetch';
import Variables from '@/src/db/variables';

const changePassword = async (_fetch: Fetch, pwd: string, new_pwd: string): Promise<boolean> => {
  const variables = new Variables(1, 'IndexedDB'),
    auth = await variables.get<string>('auth'),
    token = await variables.get<string>('token'),
    signature = await variables.get<string>('signature')

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
      authorization: 'Re94FUC3phicraR94Tuq5@0Sto16sp4swa7I1As5uChEmUhExuvATrovic5lfic',
      auth: compressToEncodedURIComponent(auth),
      token: compressToEncodedURIComponent(token),
      signature: compressToEncodedURIComponent(signature),
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