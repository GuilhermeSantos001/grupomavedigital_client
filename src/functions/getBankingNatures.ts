/**
 * @description Efetuada uma chamada para a API para retornar as
 * naturezas bancarias
 * @author GuilhermeSantos001
 * @update 13/10/2021
 */

import { compressToEncodedURIComponent } from 'lz-string';

import Fetch from '@/src/utils/fetch';
import Variables from '@/src/db/variables';

export interface BankingNatures {
  id: string
  filial: string
  description: string
  account: string
}

const getBankingNatures = async (_fetch: Fetch, cache: boolean, id?: string): Promise<BankingNatures[]> => {
  const variables = new Variables(1, 'IndexedDB'),
    auth = await variables.get<string>('auth'),
    token = await variables.get<string>('token'),
    signature = await variables.get<string>('signature')

  const req = await _fetch.exec<{
    data: {
      response: BankingNatures[]
    }
    errors: Error[]
  }>(
    {
      query: `
        query comunicateAPI($id: String, $cache: Boolean!) {
          response: dataBankingNatures(
            id: $id,
            cache: $cache
          ) {
            id
            filial
            description
            account
          }
        }
      `,
      variables: {
        id,
        cache,
      },
    },
    {
      authorization: 'HrqFw3EvjvrRQVkMGgKJYgTW9KY2ePDUbrzZaer9TRu5pQxyaUyakbgRUVtFXUvT',
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
    throw new Error('Não foi possível retornar as informações das naturezas bancarias.')
  }

  return data.response;
}

export default getBankingNatures;