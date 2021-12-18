/**
 * @description Efetuada uma chamada para a API (Front-End) para obter uma
 * url assinada
 * @author @GuilhermeSantos001
 * @update 19/10/2021
 */

const signURL = async (): Promise<string> => {
  const sign = await fetch(`/api/signURL`),
    { url } = await sign.json();

  return url;
}

export default signURL;