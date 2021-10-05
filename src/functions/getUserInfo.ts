/**
 * @description Efetuada uma chamada para a API para retornar as informações
 * do usuário
 * @author @GuilhermeSantos001
 * @update 05/10/2021
 */

import { compressToEncodedURIComponent } from 'lz-string';

import Fetch from '@/src/utils/fetch';
import Variables from '@/src/db/variables';

interface User {
  privileges: string[]
  photoProfile: string
  username: string
  email: string
  name: string
  surname: string
  cnpj: string
  location: Location
}

interface Location {
  street: string
  number: number
  complement: string
  district: string
  state: string
  city: string
  zipcode: string
}

const getUserInfo = async (_fetch: Fetch): Promise<User> => {
  const variables = new Variables(1, 'IndexedDB'),
    auth = await variables.get<string>('auth'),
    token = await variables.get<string>('token'),
    signature = await variables.get<string>('signature')

  const req = await _fetch.exec<{
    data: {
      response: {
        privileges: string[]
        photoProfile: string
        username: string
        email: string
        name: string
        surname: string
        cnpj: string
        location: Location
      }
    }
    errors: Error[]
  }>(
    {
      query: `
        query comunicateAPI($auth: String!) {
          response: getUserInfo(
            auth: $auth
          ) {
            privileges
            photoProfile
            username
            email
            name
            surname
            cnpj
            location {
              street
              number
              complement
              district
              state
              city
              zipcode
            }
          }
        }
      `,
      variables: {
        auth: compressToEncodedURIComponent(auth)
      },
    },
    {
      authorization: 'NoZjIRxH*miT4xs!$sR&oOdBxk6*1x!lcXDDwf#d!XuJ#hyHAVpIFrnAI@T9pIFr',
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

  if (errors) {
    console.error(errors);
    throw new Error('Não foi possível retornar as informações do usuário.')
  }

  return data.response;
}

export default getUserInfo;