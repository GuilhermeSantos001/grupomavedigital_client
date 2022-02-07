/* eslint-disable no-async-promise-executor */
/**
 * @description Retorna o raw do arquivo hospedado
 * @author GuilhermeSantos001
 * @update 03/03/2022
 */

import { compressToBase64, compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string'

import axios from 'axios'
import Variables from '@/src/db/variables'
import { saveUpdatedToken } from '@/src/functions/tokenValidate'
import Cookies from 'js-cookie';

import {
  Upload
} from '@/app/features/system/system.slice';

export async function uploadDownload(filename: string, filetype: string, fileId: string): Promise<void> {
  return new Promise(async (resolve, reject) => {
    const
      variables = new Variables(1, 'IndexedDB'),
      auth = await variables.get<string>('auth'),
      token = await variables.get<string>('token'),
      refreshToken = await variables.get<{
        signature: string
        token: string
      }>('refreshToken'),
      signature = await variables.get<string>('signature'),
      uri = `${process.env.NEXT_PUBLIC_EXPRESS_HOST}`;

    axios
      .get(`${uri}/files/uploads/raw/${filename}${filetype}?fileId=${compressToEncodedURIComponent(fileId)}`, {
        headers: {
          'key': compressToBase64(process.env.NEXT_PUBLIC_EXPRESS_AUTHORIZATION || ""),
          'auth': compressToEncodedURIComponent(auth),
          'token': compressToEncodedURIComponent(token),
          'refreshToken': compressToEncodedURIComponent(JSON.stringify(refreshToken)),
          'signature': compressToEncodedURIComponent(signature)
        },
        withCredentials: true,
        responseType: 'blob', // ! Important
      })
      .then(async response => {
        if (response.status == 200) {
          const url = window.URL.createObjectURL(new Blob([response.data]));

          const updatedToken = Cookies.get('updatedToken');

          if (updatedToken) {
            const token = JSON.parse(decompressFromEncodedURIComponent(updatedToken) || "");

            await saveUpdatedToken(token.signature, token.token);
          }

          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `${filename}${filetype}`);
          document.body.appendChild(link);
          link.click();

          const clear = setTimeout(() => {
            document.body.removeChild(link);

            clearTimeout(clear);
          });

          resolve();
        }
        else
          reject(`Não foi possível recuperar o arquivo. Tente novamente, mais tarde!`)
      })
      .catch((error) => reject(error))
  });
}

export async function uploadRaw(filename: string, filetype: string, fileId: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const
      variables = new Variables(1, 'IndexedDB'),
      auth = await variables.get<string>('auth'),
      token = await variables.get<string>('token'),
      refreshToken = await variables.get<{
        signature: string
        token: string
      }>('refreshToken'),
      signature = await variables.get<string>('signature'),
      uri = `${process.env.NEXT_PUBLIC_EXPRESS_HOST}`;

    axios
      .get(`${uri}/files/uploads/raw/${filename}${filetype}?fileId=${compressToEncodedURIComponent(fileId)}`, {
        headers: {
          'key': compressToBase64(process.env.NEXT_PUBLIC_EXPRESS_AUTHORIZATION || ""),
          'auth': compressToEncodedURIComponent(auth),
          'token': compressToEncodedURIComponent(token),
          'refreshToken': compressToEncodedURIComponent(JSON.stringify(refreshToken)),
          'signature': compressToEncodedURIComponent(signature)
        },
        withCredentials: true,
        responseType: 'blob', // ! Important
      })
      .then(async response => {
        if (response.status == 200) {
          const url = window.URL.createObjectURL(new Blob([response.data]));

          const updatedToken = Cookies.get('updatedToken');

          if (updatedToken) {
            const token = JSON.parse(decompressFromEncodedURIComponent(updatedToken) || "");

            await saveUpdatedToken(token.signature, token.token);
          }

          resolve(url);
        }
        else
          reject(`Não foi possível recuperar o arquivo. Tente novamente, mais tarde!`)
      })
      .catch((error) => reject(error))
  });
}

export async function uploadsAll(): Promise<Upload[]> {
  return new Promise(async (resolve, reject) => {
    const
      variables = new Variables(1, 'IndexedDB'),
      auth = await variables.get<string>('auth'),
      token = await variables.get<string>('token'),
      refreshToken = await variables.get<{
        signature: string
        token: string
      }>('refreshToken'),
      signature = await variables.get<string>('signature'),
      uri = `${process.env.NEXT_PUBLIC_EXPRESS_HOST}`;

    axios
      .get(`${uri}/files/uploads/all`, {
        headers: {
          'key': compressToBase64(process.env.NEXT_PUBLIC_EXPRESS_AUTHORIZATION || ""),
          'auth': compressToEncodedURIComponent(auth),
          'token': compressToEncodedURIComponent(token),
          'refreshToken': compressToEncodedURIComponent(JSON.stringify(refreshToken)),
          'signature': compressToEncodedURIComponent(signature)
        },
        withCredentials: true,
      })
      .then(async response => {
        if (response.status == 200) {
          const uploads = JSON.parse(decompressFromEncodedURIComponent(response.data) || '[]');

          const updatedToken = Cookies.get('updatedToken');

          if (updatedToken) {
            const token = JSON.parse(decompressFromEncodedURIComponent(updatedToken) ||"");

            await saveUpdatedToken(token.signature, token.token);
          }

          resolve(uploads);
        }
        else
          reject(`Não foi possível recuperar os arquivos. Tente novamente, mais tarde!`)
      })
      .catch((error) => reject(error))
  });
}