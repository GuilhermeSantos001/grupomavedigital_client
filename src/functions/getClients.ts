/**
 * @description Efetuada uma chamada para a API para retornar as
 * informações dos clientes
 * @author GuilhermeSantos001
 * @update 07/10/2021
 */

import { compressToEncodedURIComponent } from 'lz-string';

import Fetch from '@/src/utils/fetch';
import Variables from '@/src/db/variables';

export interface Client {
  id: string
  name: string
  fullname: string
  store: string
}

const getClients = async (_fetch: Fetch, filial: string, cache: boolean): Promise<Client[]> => {
  const variables = new Variables(1, 'IndexedDB'),
    auth = await variables.get<string>('auth'),
    token = await variables.get<string>('token'),
    signature = await variables.get<string>('signature')

  const req = await _fetch.exec<{
    data: {
      response: Client[]
    }
    errors: Error[]
  }>(
    {
      query: `
        query comunicateAPI($filial: String!, $cache: Boolean!) {
          response: dataClients(
            filial: $filial
            cache: $cache
          ) {
            id
            name
            fullname
            store
          }
        }
      `,
      variables: {
        filial,
        cache,
      },
    },
    {
      authorization: 'Z7qK6RpqqYKYKaMXnsurANrBF4X6adkj3v3LXtdL6PNn2dgd2AYChDsPJxPe2L7J',
      auth: compressToEncodedURIComponent(auth),
      token: compressToEncodedURIComponent(token),
      signature: compressToEncodedURIComponent(signature),
      encodeuri: false,
    }
  ),
    {
      errors,
      data,
    } = req

  if (errors) {
    console.error(errors);
    throw new TypeError('Não foi possível retornar as informações dos clientes.')
  }

  return data.response;
}

export default getClients;