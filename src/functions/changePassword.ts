/**
 * @description Efetuada uma chamada para a API para alterar a
 * senha do usuario
 * @author GuilhermeSantos001
 * @update 16/12/2021
 */

import { compressToEncodedURIComponent } from 'lz-string';

import Fetch from '@/src/utils/fetch';
import { Variables } from '@/src/db/variables';

import { CommonResponse } from '@/pages/_app'

declare type Response = CommonResponse & { success: boolean }

const changePassword = async (_fetch: Fetch, pwd: string, new_pwd: string): Promise<Response> => {
  const variables = new Variables(1, 'IndexedDB'),
    auth = await variables.get<string>('auth'),
    token = await variables.get<string>('token'),
    refreshToken = await variables.get<{ signature: string, value: string }>('refreshToken'),
    signature = await variables.get<string>('signature')

  const req = await _fetch.exec<{
    data: {
      response: Response
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
          ) {
            success
            updatedToken {
              signature
              token
            }
          }
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
      refreshToken: compressToEncodedURIComponent(JSON.stringify(refreshToken)),
      signature: compressToEncodedURIComponent(signature),
      encodeuri: 'true',
    }
  ),
    {
      errors,
      data,
    } = req

  if (errors)
    return { success: false, updatedToken: null };

  return data.response;
}

export default changePassword;