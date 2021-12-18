/**
 * @description Efetuada uma chamada para a API para retornar os
 * tipos de titulos
 * @author @GuilhermeSantos001
 * @update 13/10/2021
 */

import { compressToEncodedURIComponent } from 'lz-string';

import Fetch from '@/src/utils/fetch';
import Variables from '@/src/db/variables';

export interface BillsType {
  filial: string
  key: string
  description: string
}

const getBillsType = async (_fetch: Fetch, cache: boolean): Promise<BillsType[]> => {
  const variables = new Variables(1, 'IndexedDB'),
    auth = await variables.get<string>('auth'),
    token = await variables.get<string>('token'),
    signature = await variables.get<string>('signature')

  const req = await _fetch.exec<{
    data: {
      response: BillsType[]
    }
    errors: Error[]
  }>(
    {
      query: `
        query comunicateAPI($cache: Boolean!) {
          response: dataBillsType(
            cache: $cache
          ) {
            filial
            key
            description
          }
        }
      `,
      variables: {
        cache,
      },
    },
    {
      authorization: 'zf4M4cYmEYDzrWwLG6kgUUpS2CuQmDsDqPV9FQxth5KT3y3EdTrsargJvN3bpjHM',
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
    throw new TypeError('Não foi possível retornar as informações dos tipos de titulos.')
  }

  return data.response;
}

export default getBillsType;