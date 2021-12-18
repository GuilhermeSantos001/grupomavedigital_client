/* eslint-disable no-async-promise-executor */
import Variables from "@/src/db/variables";

export type Method = "POST";

export type Body = {
  query: string;
  variables: Record<string, string | string[] | boolean | FormData>;
}

export default class Fetch {
  private readonly url: string;

  constructor(url) {
    this.url = url;
  }

  public exec<Response>(body: Body, headers: Record<string, string | boolean>): Promise<Response> {
    return new Promise((resolve, reject) => {
      fetch(`${this.url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify(body),
      })
        .then((response) => response.json())
        .then((response) => resolve(response))
        .catch((error) => reject(error))
    });
  }

  public upload<Response>(body: FormData): Promise<Response> {
    return new Promise((resolve, reject) => {
      fetch(`${this.url}`, {
        method: 'POST',
        body,
      })
        .then((response) => response.json())
        .then((response) => resolve(response))
        .catch((error) => reject(error))
    });
  }

  public async tokenValidate(): Promise<{
    data: {
      response: {
        success: boolean
        signature?: string
        token?: string
      }
    },
    errors: Error[]
  }> {
    return new Promise(async (resolve, reject) => {
      const variables = new Variables(1, 'IndexedDB'),
        keys = await variables.getAllKeys();

      if (keys.length <= 0)
        return reject(`Nenhuma credencial encontrada.`);

      Promise.all([
        variables.get<string>('auth'),
        variables.get<string>('token'),
        variables.get<string>('signature'),
        variables.get<{
          signature: string
          value: string
        }>('refreshToken')
      ])
        .then(values => {
          fetch(this.url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              authorization:
                '4VMYcqF77yRfA9dmzVcD9JPZFycmN5dZdtDZww49ENHW4H97nY7RuzWa6jTkAMY3',
              encodeuri: 'false',
            },
            body: JSON.stringify({
              query: `
                query authUserFromSystem($auth: String!, $token: String!, $signature: String!, $refreshToken: InputRefreshToken) {
                  response: authValidate(
                    auth: $auth,
                    token: $token,
                    signature: $signature
                    refreshToken: $refreshToken
                  ) {
                    success
                    signature
                    token
                  }
                }
               `,
              variables: {
                auth: values[0],
                token: values[1],
                signature: values[2],
                refreshToken: values[3] ? values[3] : null,
              },
            }),
          })
            .then((response) => response.json())
            .then((response) => resolve(response))
            .catch((error) => reject(error))
        })
        .catch((error) => reject(error))
    });
  }
}