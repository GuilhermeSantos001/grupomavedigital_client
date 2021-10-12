/**
 * @description Efetuada uma chamada para a API para processar o pedido
 * de troca de senha, quando o usuario "esqueceu a senha"
 * @author @GuilhermeSantos001
 * @update 04/10/2021
 */

import { compressToEncodedURIComponent } from 'lz-string';

import Fetch from '@/src/utils/fetch';

const processOrderForgotPassword = async (_fetch: Fetch, signature: string, token: string, pwd: string): Promise<boolean> => {
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
      authorization: 'BkbcHMWNDyBqHn7GT8dzxB5KbAmhMSuKQFpPqtJmC6s94hrqqzRVdcSHf2uexRvm',
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