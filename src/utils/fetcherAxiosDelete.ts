import { Dispatch, SetStateAction } from 'react';
import { compressToBase64 } from 'lz-string';
import axios from 'axios'

export function fetcherAxiosDelete<Response>(url: string, setLoading: Dispatch<SetStateAction<boolean>>): Promise<Response> {
  setLoading(true);
  return axios.delete(url, { headers: { 'key': compressToBase64(process.env.NEXT_PUBLIC_EXPRESS_AUTHORIZATION!) } })
    .then(res => res.data)
    .finally(() => setLoading(false));
}