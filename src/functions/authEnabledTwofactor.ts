/**
 * @description Efetuada uma chamada para a API para habilitar a autenticação
 * de duas etapas
 * @author @GuilhermeSantos001
 * @update 01/10/2021
 */

import { compressToEncodedURIComponent } from 'lz-string';

import Fetch from '@/src/utils/fetch';
import Variables from '@/src/db/variables';

const authEnabledTwofactor = async (_fetch: Fetch): Promise<boolean> => {
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
          response: authEnabledTwofactor(
            auth: $auth
          )
        }
      `,
      variables: {
        auth: compressToEncodedURIComponent(auth)
      },
    },
    {
      authorization: 'TH6021Mufr&0$B&?&-op&i-L-6p4ATH31h+?*m&dRACAc7e0Osw9$4E3oWRawE8h',
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

export default authEnabledTwofactor;