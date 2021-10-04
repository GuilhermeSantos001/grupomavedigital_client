/**
 * @description Efetuada uma chamada para a API para verificar se a autenticação
 * de duas etapas está configurada
 * @author @GuilhermeSantos001
 * @update 01/10/2021
 */

import { compressToEncodedURIComponent } from 'lz-string';

import Fetch from '@/src/utils/fetch';
import Variables from '@/src/db/variables';

const hasConfiguredTwoFactor = async (_fetch: Fetch): Promise<boolean> => {
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
      authorization: '0bvNnE1JZN0d9hFVWgVpCrWa8ZhvgE8w',
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

  if (errors) return false;

  return data.response;
}

export default hasConfiguredTwoFactor;