import { Dispatch, SetStateAction } from 'react';
import { compressToBase64 } from 'lz-string';
import axios from 'axios'

export function fetcherAxiosGet(url: string, setLoading: Dispatch<SetStateAction<boolean>>) {
  setLoading(true);
  return axios.get(url, { headers: { 'key': compressToBase64(process.env.NEXT_PUBLIC_EXPRESS_AUTHORIZATION!) } })
    .then(res => res.data)
    .finally(() => {
      setLoading(false);
    });
}