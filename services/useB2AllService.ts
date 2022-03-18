import { useState } from 'react';

import useSWR from 'swr'
import { SWRConfig } from '@/services/config/SWRConfig';

import { fetcherAxiosGet } from '@/src/utils/fetcherAxiosGet';
import { fetcherAxiosPut } from '@/src/utils/fetcherAxiosPut';
import { fetcherAxiosDelete } from '@/src/utils/fetcherAxiosDelete';
import { ApiResponseSuccessType } from '@/types/ApiResponseSuccessType';
import { ApiResponseErrorType } from '@/types/ApiResponseErrorType';
import { ApiResponseSuccessOrErrorType } from '@/types/ApiResponseSuccessOrErrorType';

import type {
  DataB2
} from '@/types/B2ServiceType';

import type {
  B2Type
} from '@/types/B2Type';

import Alerting from '@/src/utils/alerting';

export function useB2AllService(take: number = 10) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [uri, setURI] = useState<string>(`${process.env.NEXT_PUBLIC_API_HOST}/b2a?take=${take}`);
  const [lastCursorId, setLastCursorId] = useState<number>(0);

  const skip = 1;

  const { data, error, mutate } = useSWR<
    ApiResponseSuccessType<B2Type[]>,
    ApiResponseErrorType<Object>
  >([uri, setIsLoading], fetcherAxiosGet, SWRConfig)

  if (error) {
    Alerting.create('error', error.message);
    console.error(error);
    return { isLoading, data: [] };
  }

  if (data?.success)
    return {
      isLoading,
      data: data.data,
      empty: data.data.length === 0,
      nextPage: () => {
        if (data.data.length !== 0) {
          const cursorId = lastCursorId + take;

          setLastCursorId(cursorId);
          setURI(`${process.env.NEXT_PUBLIC_API_HOST}/b2a?skip=${skip}&take=${take}&cursorId=${cursorId}`);
        }
      },
      previousPage: () => {
        const cursorId = lastCursorId - take < 0 ? 0 : lastCursorId - take;
        let query = '';

        setLastCursorId(cursorId);

        if (cursorId > 0)
          query = `?skip=${skip}&take=${take}&cursorId=${cursorId}`;
        else
          query = `?take=${take}`;

        setURI(`${process.env.NEXT_PUBLIC_API_HOST}/b2a${query}`);
      },
      update: async (id: string, newData: DataB2): Promise<boolean> => {
        const uri = `${process.env.NEXT_PUBLIC_API_HOST}/b2/${id}`;

        const updateData = await fetcherAxiosPut<DataB2, ApiResponseSuccessOrErrorType<B2Type, Object>>(uri, setIsLoading, newData);

        if (!updateData.success) {
          Alerting.create('error', updateData.message);
          console.error(updateData);

          return false;
        } else {
          mutate({
            success: true,
            data: data.data.map(b2 => {
              if (b2.id === id) {
                b2 = { ...b2, ...updateData.data };
              }

              return b2;
            })
          });
        }

        return true;
      },
      delete: async (id: string): Promise<boolean> => {
        const uri = `${process.env.NEXT_PUBLIC_API_HOST}/b2/${id}`;

        const deleteData = await fetcherAxiosDelete<ApiResponseErrorType<Object>>(uri, setIsLoading);

        if (!deleteData.success) {
          Alerting.create('error', deleteData.message);
          console.error(deleteData);

          return false;
        } else {
          mutate({
            success: true,
            data: data.data.filter(b2 => b2.id !== id)
          });
        }

        return true;
      }
    }

  return {
    isLoading,
    data: []
  };
}