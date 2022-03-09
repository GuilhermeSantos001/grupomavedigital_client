import { useState } from 'react';

import useSWR from 'swr'
import { SWRConfig } from '@/services/config/SWRConfig';

import { fetcherAxiosGet } from '@/src/utils/fetcherAxiosGet';
import { fetcherAxiosDelete } from '@/src/utils/fetcherAxiosDelete';
import { ApiResponseSuccessType } from '@/types/ApiResponseSuccessType';
import { ApiResponseErrorType } from '@/types/ApiResponseErrorType';

import type {
  APIKeyType
} from '@/types/APIKeyType';

import Alerting from '@/src/utils/alerting';

export function useAPIKeyWithIdService(passphrase: string) {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const uri = `${process.env.NEXT_PUBLIC_API_HOST}/security/key/${passphrase}`;

  const { data, error, mutate } = useSWR<
    ApiResponseSuccessType<APIKeyType | undefined>,
    ApiResponseErrorType<Object>
  >([uri, setIsLoading], fetcherAxiosGet, SWRConfig)

  if (error) {
    Alerting.create('error', error.message);
    console.error(error);
    return { isLoading };
  }

  if (data?.success)
    return {
      isLoading,
      data: data?.data,
      delete: async (): Promise<boolean> => {
        const deleteData = await fetcherAxiosDelete<ApiResponseErrorType<Object>>(uri, setIsLoading);

        if (!deleteData.success) {
          Alerting.create('error', deleteData.message);
          console.error(deleteData);

          return false;
        } else {
          mutate({
            success: false,
            data: undefined
          });
        }

        return true;
      }
    };

  return {
    isLoading
  };
}