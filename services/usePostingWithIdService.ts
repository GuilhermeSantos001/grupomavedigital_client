import { useState } from 'react';
import useSWR from 'swr'

import { fetcherAxiosGet } from '@/src/utils/fetcherAxiosGet';
import { fetcherAxiosPut } from '@/src/utils/fetcherAxiosPut';
import { fetcherAxiosDelete } from '@/src/utils/fetcherAxiosDelete';
import { ApiResponseSuccessType } from '@/types/ApiResponseSuccessType';
import { ApiResponseErrorType } from '@/types/ApiResponseErrorType';
import { ApiResponseSuccessOrErrorType } from '@/types/ApiResponseSuccessOrErrorType';

import type {
  DataPosting
} from '@/types/PostingServiceType';

import type {
  PostingType
} from '@/types/PostingType';

import Alerting from '@/src/utils/alerting';

export function usePostingWithIdService(id: string) {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const uri = `${process.env.NEXT_PUBLIC_API_HOST}/posting/${id}`;

  const { data, error, mutate } = useSWR<
    ApiResponseSuccessType<PostingType | undefined>,
    ApiResponseErrorType<Object>
  >([uri, setIsLoading], fetcherAxiosGet)

  if (error) {
    Alerting.create('error', error.message);
    console.error(error);
    return { isLoading };
  }

  if (data?.success)
    return {
      isLoading,
      data: data?.data,
      update: async (newData: DataPosting): Promise<boolean> => {
        const updateData = await fetcherAxiosPut<DataPosting, ApiResponseSuccessOrErrorType<PostingType, Object>>(uri, setIsLoading, newData);

        if (!updateData.success) {
          Alerting.create('error', updateData.message);
          console.error(updateData);

          return false;
        } else {
          mutate({
            success: true,
            data: { ...data?.data, ...updateData.data }
          });
        }

        return true;
      },
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