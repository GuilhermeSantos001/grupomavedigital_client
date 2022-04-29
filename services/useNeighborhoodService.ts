import { useState } from 'react';
import { useSWRConfig } from 'swr'

import { fetcherAxiosPost } from '@/src/utils/fetcherAxiosPost';
import { fetcherAxiosPut } from '@/src/utils/fetcherAxiosPut';
import { fetcherAxiosDelete } from '@/src/utils/fetcherAxiosDelete';
import { ApiResponseErrorType } from '@/types/ApiResponseErrorType';
import { ApiResponseSuccessOrErrorType } from '@/types/ApiResponseSuccessOrErrorType';

import type {
  DataNeighborhood
} from '@/types/NeighborhoodServiceType';

import type {
  NeighborhoodType
} from '@/types/NeighborhoodType';

import Alerting from '@/src/utils/alerting';

export function useNeighborhoodService() {
  const { mutate } = useSWRConfig();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const create = async (data: DataNeighborhood) => {
    const createUpdate = await fetcherAxiosPost<DataNeighborhood, ApiResponseSuccessOrErrorType<NeighborhoodType, Object>>(`${process.env.NEXT_PUBLIC_API_HOST}/neighborhood`, setIsLoading, data);

    if (!createUpdate.success) {
      Alerting.create('error', createUpdate.message);
      console.error(createUpdate);
      return undefined;
    }

    const uri = `${process.env.NEXT_PUBLIC_API_HOST}/neighborhood/${createUpdate.data.id}`;

    return {
      data: createUpdate.data,
      update: async (newData: DataNeighborhood): Promise<boolean> => {
        const updateData = await fetcherAxiosPut<DataNeighborhood, ApiResponseSuccessOrErrorType<NeighborhoodType, Object>>(uri, setIsLoading, newData);

        if (!updateData.success) {
          Alerting.create('error', updateData.message);
          console.error(updateData);

          return false;
        } else {
          mutate([uri, setIsLoading], {
            success: true,
            data: { ...createUpdate.data, ...updateData.data }
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
          mutate([uri, setIsLoading], {
            success: true,
            data: undefined
          });
        }

        return true;
      }
    }
  }

  return {
    isLoading,
    create
  };
}