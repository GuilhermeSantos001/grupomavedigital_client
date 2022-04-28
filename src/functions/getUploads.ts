import { compressToBase64, decompressFromEncodedURIComponent } from 'lz-string'

import axios from 'axios';

import {
  UploadType
} from '@/types/UploadType';

export async function uploadDownload(filename: string, filetype: string, fileId: string, options?: BlobPropertyBag): Promise<boolean> {
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
    let url = '';

    if (!options) {
      url = window.URL.createObjectURL(new Blob([data]));
    } else {
      url = window.URL.createObjectURL(new Blob([data], options));
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

    return true;
  } else {
    throw new Error(`Não foi possível recuperar o arquivo. Tente novamente, mais tarde!`);
  }
}

export async function uploadTempDownload(filePath: string, filename: string, filetype: string, options?: BlobPropertyBag): Promise<boolean> {
  const
    uri = process.env.NEXT_PUBLIC_EXPRESS_HOST!,
    uploadResponse = await axios.get(`${uri}/files/temp/raw/${filename}${filetype}?filePath=${filePath}`, {
      headers: {
        'key': compressToBase64(process.env.NEXT_PUBLIC_EXPRESS_AUTHORIZATION!)
      },
      withCredentials: true,
      responseType: 'blob', // ! Important
    })

  const { data, status, headers } = uploadResponse;

  if (status === 200) {
    let url = '';

    if (!options) {
      url = window.URL.createObjectURL(new Blob([data]));
    } else {
      url = window.URL.createObjectURL(new Blob([data], options));
    }

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${headers.filename}${headers.filetype}`);
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

export async function uploadRaw(filename: string, filetype: string, fileId: string, options?: BlobPropertyBag): Promise<string> {
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
    let url = '';

    if (!options) {
      url = window.URL.createObjectURL(new Blob([data]));
    } else {
      url = window.URL.createObjectURL(new Blob([data], options));
    }

    return url;
  } else {
    throw new Error(`Não foi possível recuperar o arquivo. Tente novamente, mais tarde!`);
  }
}

export async function uploadStaticRaw(filename: string, filetype: string, fileId: string): Promise<boolean> {
  const
    uri = process.env.NEXT_PUBLIC_EXPRESS_HOST!,
    uploadResponse = await axios.get(`${uri}/files/uploads/static/raw/${filename}${filetype}?fileId=${fileId}`);

  const { status } = uploadResponse;

  if (status === 200) {
    return true;
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