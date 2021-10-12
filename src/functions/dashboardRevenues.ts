/**
 * @description Efetuada uma chamada para a API para retornar as
 * informações da dashboard: "Faturamento"
 * @author @GuilhermeSantos001
 * @update 08/10/2021
 */

import { compressToEncodedURIComponent } from 'lz-string';

import Fetch from '@/src/utils/fetch';
import Variables from '@/src/db/variables';

export interface Revenues {
  client: string
  store: string
  value: string
  released: string
}

const dashboardRevenues = async (_fetch: Fetch, filial: string | null, client: string | null, store: string | null, period: string[], cache: boolean): Promise<Revenues[]> => {
  const variables = new Variables(1, 'IndexedDB'),
    auth = await variables.get<string>('auth'),
    token = await variables.get<string>('token'),
    signature = await variables.get<string>('signature')

  const req = await _fetch.exec<{
    data: {
      response: Revenues[]
    }
    errors: Error[]
  }>(
    {
      query: `
        query comunicateAPI($filial: String, $client: String, $store: String, $period: [String!]!, $cache: Boolean!) {
          response: dashboardRevenues(
            filial: $filial
            client: $client
            store: $store
            period: $period
            cache: $cache
          ) {
            client
            store
            value
            released
          }
        }
      `,
      variables: {
        filial,
        client,
        store,
        period: period.map(date => date.replaceAll('-', '')),
        cache,
      },
    },
    {
      authorization: 'tfbCBnLCNhfdkWbvEvYWQYg2Ye9JnjP7J78mBwR95NHU6CTSFcKxgnkW2xYcpz2r',
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
    throw new Error('Não foi possível retornar as informações do painel: Pedidos de Venda.')
  }

  return data.response;
}

export default dashboardRevenues;