/**
 * @description Efetuada uma chamada para a API para confirmar
 * a conta do usuario
 * @author @GuilhermeSantos001
 * @update 04/10/2021
 */

import { compressToEncodedURIComponent } from 'lz-string';

import Fetch from '@/src/utils/fetch';

const mailConfirm = async (_fetch: Fetch, token: string): Promise<boolean> => {
  const req = await _fetch.exec<{
    data: {
      response: boolean
    }
    errors: Error[]
  }>(
    {
      query: `
        query comunicateAPI($token: String!) {
          response: mailConfirm(
            token: $token
          )
        }
      `,
      variables: {
        token: compressToEncodedURIComponent(token)
      },
    },
    {
      authorization: 'Pygj6FpZq2RpANJVRjgzJN6fR9FW5pDb7UX7BPJBgZrnXdNPgF7u4VAh2hgUyx9k',
      encodeuri: 'true'
    }
  ),
    {
      errors,
      data,
    } = req

  if (errors)
    return false;

  return data.response;
}

export default mailConfirm;