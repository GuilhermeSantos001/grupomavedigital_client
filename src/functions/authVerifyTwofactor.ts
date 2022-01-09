/**
 * @description Efetuada uma chamada para a API para verificar o codigo da
 * autenticação de duas etapas
 * @author GuilhermeSantos001
 * @update 16/12/2021
 */

import { compressToEncodedURIComponent } from 'lz-string';

import Fetch from '@/src/utils/fetch';
import Variables from '@/src/db/variables';

import { CommonResponse } from '@/pages/_app'

const authVerifyTwofactor = async (_fetch: Fetch, qrcode: string): Promise<CommonResponse> => {
  const variables = new Variables(1, 'IndexedDB'),
    auth = await variables.get<string>('auth'),
    token = await variables.get<string>('token'),
    refreshToken = await variables.get<{ signature: string, value: string }>('refreshToken'),
    signature = await variables.get<string>('signature')

  const req = await _fetch.exec<{
    data: {
      response: CommonResponse
    }
    errors: Error[]
  }>(
    {
      query: `
        mutation comunicateAPI($auth: String!, $qrcode: String!) {
          response: authVerifyTwofactor(
            auth: $auth,
            qrcode: $qrcode
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
        qrcode: compressToEncodedURIComponent(qrcode)
      },
    },
    {
      authorization: 'duhoHU4o#3!oCHogLw*6WUbrE2radr2CrlpLD+P7Ka*R-veSEB75lsT6PeblPuko',
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
    return { success: false, updatedToken: null }

  return data.response;
}

export default authVerifyTwofactor;