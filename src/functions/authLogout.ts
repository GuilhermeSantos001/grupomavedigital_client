/**
 * @description Efetuada uma chamada para a API para habilitar a autenticação
 * de duas etapas
 * @author GuilhermeSantos001
 * @update 16/12/2021
 */

import { compressToEncodedURIComponent } from 'lz-string';

import Fetch from '@/src/utils/fetch';
import Variables from '@/src/db/variables';

const authLogout = async (_fetch: Fetch): Promise<boolean> => {
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
         query comunicateAPI($auth: String!, $token: String!, $signature: String!) {
           response: authLogout(
             auth: $auth,
             token: $token,
             signature: $signature
           )
         }
       `,
      variables: {
        auth: compressToEncodedURIComponent(auth),
        token: compressToEncodedURIComponent(token),
        signature: compressToEncodedURIComponent(signature)
      },
    },
    {
      authorization: 'vlta#eke08uf=48uCuFustLr3ChL9a1*wrE_ayi0L*oFl-UHidlST8moj9f8C5L4',
      encodeuri: 'true',
    }
  ),
    {
      errors,
      data,
    } = req

  if (errors) {
    console.error(errors);
    throw new Error(`Não foi possível desconectar sua sessão no momento. Contacte o administrador do sistema!`);
  }

  return data.response;
}

export default authLogout;