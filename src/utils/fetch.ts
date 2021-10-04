import Variables from "@/src/db/variables";

export type Method = "POST";

export type Body = {
  query: string;
  variables: Record<string, string>;
}

export default class Fetch {
  private readonly url: string;

  constructor(url) {
    this.url = url;
  }

  public exec<Response>(body: Body, headers: Record<string, string>): Promise<Response> {
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

  public tokenValidate(): Promise<{
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
        auth = await variables.get<string>('auth'),
        token = await variables.get<string>('token'),
        signature = await variables.get<string>('signature'),
        refreshToken = await variables.get<{
          signature: string
          value: string
        }>('refreshToken')

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
            auth,
            token,
            signature,
            refreshToken: refreshToken ? refreshToken : null,
          },
        }),
      })
        .then((response) => response.json())
        .then((response) => resolve(response))
        .catch((error) => reject(error))
    });
  }
}