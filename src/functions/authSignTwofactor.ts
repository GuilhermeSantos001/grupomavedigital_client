/**
 * @description Efetuada uma chamada para a API para ativar e retornar o
 * QRCode da verificação de duas etapas
 * @author @GuilhermeSantos001
 * @update 16/12/2021
 */

import { compressToEncodedURIComponent } from 'lz-string';

import Fetch from '@/src/utils/fetch';
import Variables from '@/src/db/variables';

import { CommonResponse } from '@/pages/_app'

declare type AuthSignTwofactorResponse = CommonResponse & {
  qrcode: string
}

const authSignTwofactor = async (_fetch: Fetch): Promise<AuthSignTwofactorResponse> => {
  const variables = new Variables(1, 'IndexedDB'),
    auth = await variables.get<string>('auth'),
    token = await variables.get<string>('token'),
    refreshToken = await variables.get<{ signature: string, value: string }>('refreshToken'),
    signature = await variables.get<string>('signature')

  const req = await _fetch.exec<{
    data: {
      response: AuthSignTwofactorResponse
    }
    errors: Error[]
  }>(
    {
      query: `
        mutation comunicateAPI($auth: String!) {
          response: authSignTwofactor(
            auth: $auth
          ) {
            qrcode
            updatedToken {
              signature
              token
            }
          }
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
    throw new TypeError("Não foi possível retornar o QRCode");

  return data.response;
}

export default authSignTwofactor;