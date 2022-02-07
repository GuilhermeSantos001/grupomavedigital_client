import { Dispatch, SetStateAction } from 'react';
import { compressToBase64 } from 'lz-string';
import axios from 'axios'

export function fetcherAxiosPut<Data, Response>(url: string, setLoading: Dispatch<SetStateAction<boolean>>, data: Data): Promise<Response> {
  setLoading(true);
  return axios.put(url, data, { headers: { 'Content-Type': 'application/json', 'key': process.env.NEXT_PUBLIC_EXPRESS_AUTHORIZATION || "" } })
    .then(res => res.data)
    .finally(() => setLoading(false));
}