import { compressToBase64, compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string'

import axios from 'axios';
import { setSessionCookies, readyCookie } from '@/src/utils/Cookies';
import Cookies from 'js-cookie';

import {
  UploadType
} from '@/types/UploadType';

export async function uploadDownload(filename: string, filetype: string, fileId: string): Promise<boolean> {
  const
    uri = process.env.NEXT_PUBLIC_EXPRESS_HOST!,
    auth = await readyCookie(Cookies.get('auth') as string),
    token = await readyCookie(Cookies.get('token') as string),
    signature = await readyCookie(Cookies.get('signature') as string),
    refreshTokenValue = await readyCookie(Cookies.get('refreshTokenValue') as string),
    refreshTokenSignature = await readyCookie(Cookies.get('refreshTokenSignature') as string);

  if (
    auth
    && token
    && signature
    && refreshTokenValue
    && refreshTokenSignature
  ) {
    const uploadResponse = await axios.get(`${uri}/files/uploads/raw/${filename}${filetype}?fileId=${compressToEncodedURIComponent(fileId)}`, {
      headers: {
        'key': compressToBase64(process.env.NEXT_PUBLIC_EXPRESS_AUTHORIZATION!),
        'auth': compressToEncodedURIComponent(auth),
        'token': compressToEncodedURIComponent(token),
        'signature': compressToEncodedURIComponent(signature),
        'refreshTokenValue': compressToEncodedURIComponent(refreshTokenValue),
        'refreshTokenSignature': compressToEncodedURIComponent(refreshTokenSignature)
      },
      withCredentials: true,
      responseType: 'blob', // ! Important
    })

    const { data, status, request } = uploadResponse;

    console.log(request);

    if (status === 200) {
      const url = window.URL.createObjectURL(new Blob([data]));

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${filename}${filetype}`);
      document.body.appendChild(link);
      link.click();

      const clear = setTimeout(() => {
        document.body.removeChild(link);

        clearTimeout(clear);
      });

      return true;
    } else {
      throw new Error(`Não foi possível recuperar o arquivo. Tente novamente, mais tarde!`);
    }
  } else {
    throw new Error('Credenciais inválidas!');
  }
}

export async function uploadRaw(filename: string, filetype: string, fileId: string): Promise<string> {
  const
    uri = process.env.NEXT_PUBLIC_EXPRESS_HOST!,
    auth = await readyCookie(Cookies.get('auth') as string),
    token = await readyCookie(Cookies.get('token') as string),
    signature = await readyCookie(Cookies.get('signature') as string),
    refreshTokenValue = await readyCookie(Cookies.get('refreshTokenValue') as string),
    refreshTokenSignature = await readyCookie(Cookies.get('refreshTokenSignature') as string);

  if (
    auth
    && token
    && signature
    && refreshTokenValue
    && refreshTokenSignature
  ) {
    const uploadResponse = await axios.get(`${uri}/files/uploads/raw/${filename}${filetype}?fileId=${compressToEncodedURIComponent(fileId)}`, {
      headers: {
        'key': compressToBase64(process.env.NEXT_PUBLIC_EXPRESS_AUTHORIZATION!),
        'auth': compressToEncodedURIComponent(auth),
        'token': compressToEncodedURIComponent(token),
        'signature': compressToEncodedURIComponent(signature),
        'refreshTokenValue': compressToEncodedURIComponent(refreshTokenValue),
        'refreshTokenSignature': compressToEncodedURIComponent(refreshTokenSignature)
      },
      withCredentials: true,
      responseType: 'blob', // ! Important
    });

    const { data, status, request } = uploadResponse;

    console.log(request);

    if (status === 200) {
      const url = window.URL.createObjectURL(new Blob([data]));

      return url;
    } else {
      throw new Error(`Não foi possível recuperar o arquivo. Tente novamente, mais tarde!`);
    }
  } else {
    throw new Error('Credenciais inválidas!');
  }
}

// TODO: Devolver o UploadType do Hercules Storage
export async function uploadsAll(): Promise<UploadType[]> {
  const
    uri = process.env.NEXT_PUBLIC_EXPRESS_HOST!,
    auth = await readyCookie(Cookies.get('auth') as string),
    token = await readyCookie(Cookies.get('token') as string),
    signature = await readyCookie(Cookies.get('signature') as string),
    refreshTokenValue = await readyCookie(Cookies.get('refreshTokenValue') as string),
    refreshTokenSignature = await readyCookie(Cookies.get('refreshTokenSignature') as string);

  if (
    auth
    && token
    && signature
    && refreshTokenValue
    && refreshTokenSignature
  ) {
    const uploadResponse = await axios.get(`${uri}/files/uploads/all`, {
      headers: {
        'key': compressToBase64(process.env.NEXT_PUBLIC_EXPRESS_AUTHORIZATION!),
        'auth': compressToEncodedURIComponent(auth),
        'token': compressToEncodedURIComponent(token),
        'signature': compressToEncodedURIComponent(signature),
        'refreshTokenValue': compressToEncodedURIComponent(refreshTokenValue),
        'refreshTokenSignature': compressToEncodedURIComponent(refreshTokenSignature)
      },
      withCredentials: true,
    });

    const { data, status, request } = uploadResponse;

    console.log(request);

    if (status === 200) {
      const uploads = JSON.parse(decompressFromEncodedURIComponent(data) || '[]');

      return uploads;
    } else {
      throw new Error(`Não foi possível recuperar os arquivos. Tente novamente, mais tarde!`);
    }
  } else {
    throw new Error('Credenciais inválidas!');
  }
}