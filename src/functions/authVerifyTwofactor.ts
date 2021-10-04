/**
 * @description Efetuada uma chamada para a API para verificar o codigo da
 * autenticação de duas etapas
 * @author @GuilhermeSantos001
 * @update 01/10/2021
 */

import { compressToEncodedURIComponent } from 'lz-string';

import Fetch from '@/src/utils/fetch';
import Variables from '@/src/db/variables';

const authVerifyTwofactor = async (_fetch: Fetch, qrcode: string): Promise<boolean> => {
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
        mutation comunicateAPI($auth: String!, $qrcode: String!) {
          response: authVerifyTwofactor(
            auth: $auth,
            qrcode: $qrcode
          )
        }
      `,
      variables: {
        auth: compressToEncodedURIComponent(auth),
        qrcode: compressToEncodedURIComponent(qrcode)
      },
    },
    {
      authorization: 'duhoHU4o#3!oCHogLw*6WUbrE2radr2CrlpLD+P7Ka*R-veSEB75lsT6PeblPuko',
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

export default authVerifyTwofactor;