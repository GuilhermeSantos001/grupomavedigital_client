import { compressToBase64, decompressFromEncodedURIComponent } from 'lz-string'

import axios from 'axios';

import {
  UploadType
} from '@/types/UploadType';

export async function uploadDownload(filename: string, filetype: string, fileId: string): Promise<boolean> {
  const
    uri = process.env.NEXT_PUBLIC_EXPRESS_HOST!,
    uploadResponse = await axios.get(`${uri}/files/uploads/raw/${filename}${filetype}?fileId=${fileId}`, {
      headers: {
        'key': compressToBase64(process.env.NEXT_PUBLIC_EXPRESS_AUTHORIZATION!)
      },
      withCredentials: true,
      responseType: 'blob', // ! Important
    })

  const { data, status } = uploadResponse;

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
}

export async function uploadRaw(filename: string, filetype: string, fileId: string): Promise<string> {
  const
    uri = process.env.NEXT_PUBLIC_EXPRESS_HOST!,
    uploadResponse = await axios.get(`${uri}/files/uploads/raw/${filename}${filetype}?fileId=${fileId}`, {
      headers: {
        'key': compressToBase64(process.env.NEXT_PUBLIC_EXPRESS_AUTHORIZATION!)
      },
      withCredentials: true,
      responseType: 'blob', // ! Important
    });

  const { data, status } = uploadResponse;

  if (status === 200) {
    const url = window.URL.createObjectURL(new Blob([data]));

    return url;
  } else {
    throw new Error(`Não foi possível recuperar o arquivo. Tente novamente, mais tarde!`);
  }
}

// TODO: Devolver o UploadType do Hercules Storage
export async function uploadsAll(): Promise<UploadType[]> {
  const
    uri = process.env.NEXT_PUBLIC_EXPRESS_HOST!,
    uploadResponse = await axios.get(`${uri}/files/uploads/all`, {
      headers: {
        'key': compressToBase64(process.env.NEXT_PUBLIC_EXPRESS_AUTHORIZATION!)
      },
      withCredentials: true,
    });

  const { data, status } = uploadResponse;

  if (status === 200) {
    const uploads = JSON.parse(decompressFromEncodedURIComponent(data) || '[]');

    return uploads;
  } else {
    throw new Error(`Não foi possível recuperar os arquivos. Tente novamente, mais tarde!`);
  }
}