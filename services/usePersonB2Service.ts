import { useState } from 'react';
import { useSWRConfig } from 'swr'

import { fetcherAxiosPost } from '@/src/utils/fetcherAxiosPost';
import { fetcherAxiosPut } from '@/src/utils/fetcherAxiosPut';
import { fetcherAxiosDelete } from '@/src/utils/fetcherAxiosDelete';
import { ApiResponseErrorType } from '@/types/ApiResponseErrorType';
import { ApiResponseSuccessOrErrorType } from '@/types/ApiResponseSuccessOrErrorType';

import {
  PersonB2Type
} from '@/types/PersonB2Type';

import {
  DataPersonB2
} from '@/types/PersonB2ServiceType';

import Alerting from '@/src/utils/alerting';

export function usePersonB2Service() {
  const { mutate } = useSWRConfig();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const create = async (data: DataPersonB2) => {
    const createUpdate = await fetcherAxiosPost<DataPersonB2, ApiResponseSuccessOrErrorType<PersonB2Type, Object>>(`${process.env.NEXT_PUBLIC_API_HOST}/b2/people`, setIsLoading, data);

    if (!createUpdate.success) {
      Alerting.create('error', createUpdate.message);
      console.error(createUpdate);
      return undefined;
    }

    const uri = `${process.env.NEXT_PUBLIC_API_HOST}/b2/people/${createUpdate.data.id}`;

    return {
      data: createUpdate.data,
      update: async (newData: DataPersonB2): Promise<boolean> => {
        const updateData = await fetcherAxiosPut<DataPersonB2, ApiResponseSuccessOrErrorType<PersonB2Type, Object>>(uri, setIsLoading, newData);

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