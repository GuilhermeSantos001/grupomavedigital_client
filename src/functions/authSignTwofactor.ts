/**
 * @description Efetuada uma chamada para a API para ativar e retornar o
 * QRCode da verificação de duas etapas
 * @author @GuilhermeSantos001
 * @update 30/09/2021
 */

import { compressToEncodedURIComponent } from 'lz-string';

import Fetch from '@/src/utils/fetch';
import Variables from '@/src/db/variables';

const authSignTwofactor = async (_fetch: Fetch): Promise<string> => {
  const variables = new Variables(1, 'IndexedDB'),
    auth = await variables.get<string>('auth'),
    token = await variables.get<string>('token'),
    signature = await variables.get<string>('signature')

  const req = await _fetch.exec<{
    data: {
      response: string
    }
    errors: Error[]
  }>(
    {
      query: `
        mutation comunicateAPI($auth: String!) {
          response: authSignTwofactor(
            auth: $auth
          )
        }
      `,
      variables: {
        auth: compressToEncodedURIComponent(auth),
      },
    },
    {
      authorization: 'bu9Tix&1amuqihiXeHa*ajucRav6b5p7frOTRan6BLn!R27Wo*rlNA?Huf38riKo',
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
    throw new Error("Não foi possível retornar o QRCode");

  return data.response;
}

export default authSignTwofactor;