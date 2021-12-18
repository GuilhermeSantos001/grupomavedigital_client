/**
 * @description Efetuada uma chamada para a API para habilitar a autenticação
 * de duas etapas
 * @author @GuilhermeSantos001
 * @update 01/10/2021
 */

import { compressToEncodedURIComponent } from 'lz-string';

import Fetch from '@/src/utils/fetch';

const authForgotPassword = async (_fetch: Fetch, auth: string): Promise<boolean> => {
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
      authorization: '8VV8srQhf2HcHujsqK2V2p9CDNeENa5RUzNaXFJeTCLnBtNPERgUxAM5bYLjFups',
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