/**
 * @description Efetuada uma chamada para a API para retornar as filiais
 * @author GuilhermeSantos001
 * @update 07/10/2021
 */

import { compressToEncodedURIComponent } from 'lz-string';

import Fetch from '@/src/utils/fetch';
import Variables from '@/src/db/variables';

export interface Filial {
  id: string
  name: string
  cnpj: string
}

const getFilial = async (_fetch: Fetch, cache: boolean): Promise<Filial[]> => {
  const variables = new Variables(1, 'IndexedDB'),
    auth = await variables.get<string>('auth'),
    token = await variables.get<string>('token'),
    signature = await variables.get<string>('signature')

  const req = await _fetch.exec<{
    data: {
      response: Filial[]
    }
    errors: Error[]
  }>(
    {
      query: `
        query comunicateAPI($cache: Boolean!) {
          response: dataFilial(
            cache: $cache
          ) {
            id
            name
            cnpj
          }
        }
      `,
      variables: {
        cache
      },
    },
    {
      authorization: 'EEcDrRbDe6Vd2METYWWNuHpE7DbQt8S7nNzgFfyXkfFbZ2WgS9kvP2svxc7RXXFA',
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
    throw new Error('Não foi possível retornar as informações das filiais.')
  }

  return data.response;
}

export default getFilial;