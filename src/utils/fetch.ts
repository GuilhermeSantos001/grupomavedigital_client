export type Method = "POST";

export type Body = {
  query: string;
  variables?: object;
}

export default class Fetch {
  private readonly url: string;

  constructor(url: string) {
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
}