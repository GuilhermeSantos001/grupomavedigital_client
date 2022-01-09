/**
 * @description Efetuada uma chamada para a API para retornar as
 * informações da dashboard: "Contas a Pagar"
 * @author GuilhermeSantos001
 * @update 14/10/2021
 */

import { compressToEncodedURIComponent } from 'lz-string';

import Fetch from '@/src/utils/fetch';
import Variables from '@/src/db/variables';

interface ReceiveClient {
  id: string
  name: string
  store: string
}

interface ReceiveTaxes {
  IRRF: string
  ISS: string
  INSS: string
  CSLL: string
  COFINS: string
  PIS: string
}

export interface Receive {
  prefix: string
  num: string
  parcel: string
  type: string
  bankingNature: string
  client: ReceiveClient
  released: string
  finished: string
  expectedExpiration: string
  realExpiration: string
  taxes: ReceiveTaxes
  grossValue: string
  liquidValue: string
  balanceValue: string
}

const dashboardReceive = async (_fetch: Fetch, filial: string | null, client: string | null, store: string | null, type: string | null, bankingNature: string | null, period: string[], cache: boolean): Promise<Receive[]> => {
  const variables = new Variables(1, 'IndexedDB'),
    auth = await variables.get<string>('auth'),
    token = await variables.get<string>('token'),
    signature = await variables.get<string>('signature')

  const req = await _fetch.exec<{
    data: {
      response: Receive[]
    }
    errors: Error[]
  }>(
    {
      query: `
        query comunicateAPI($filial: String, $client: String, $store: String, $type: String, $bankingNature: String, $period: [String!]!, $cache: Boolean!) {
          response: dashboardReceive(
            filial: $filial
            client: $client
            store: $store
            type: $type
            bankingNature: $bankingNature
            period: $period
            cache: $cache
          ) {
            prefix
            num
            parcel
            type
            bankingNature
            client {
              id
              name
              store
            }
            released
            finished
            expectedExpiration
            realExpiration
            taxes {
              IRRF
              ISS
              INSS
              CSLL
              COFINS
              PIS
            }
            grossValue
            liquidValue
            balanceValue
          }
        }
      `,
      variables: {
        filial,
        client,
        store,
        type,
        bankingNature,
        period: period.map(date => date.replaceAll('-', '')),
        cache,
      },
    },
    {
      authorization: 'SsPaTUXVfLTjnNm3XGQeYRFPGLS9N2c53e3vxtRTVD2b9VZBRmYqaANcyRp54SQP',
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
    throw new TypeError('Não foi possível retornar as informações do painel: Contas a Receber.')
  }

  return data.response;
}

export default dashboardReceive;