import { useState } from 'react';
import { useSWRConfig } from 'swr'

import { fetcherAxiosPost } from '@/src/utils/fetcherAxiosPost';
import { fetcherAxiosPut } from '@/src/utils/fetcherAxiosPut';
import { fetcherAxiosDelete } from '@/src/utils/fetcherAxiosDelete';
import { ApiResponseErrorType } from '@/types/ApiResponseErrorType';
import { ApiResponseSuccessOrErrorType } from '@/types/ApiResponseSuccessOrErrorType';

import {
  UserType
} from '@/types/UserType';

import {
  DataUser,
  DataUserWithPassword
} from '@/types/UserServiceType';

import Alerting from '@/src/utils/alerting';

export function useUserService() {
  const { mutate } = useSWRConfig();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const create = async (data: DataUserWithPassword) => {
    const createUpdate = await fetcherAxiosPost<DataUserWithPassword, ApiResponseSuccessOrErrorType<UserType, Object>>(`${process.env.NEXT_PUBLIC_API_HOST}/user`, setIsLoading, data);

    if (!createUpdate.success) {
      Alerting.create('error', createUpdate.message);
      console.error(createUpdate);
      return undefined;
    }

    const uri = `${process.env.NEXT_PUBLIC_API_HOST}/user/${createUpdate.data.authorization}`;

    return {
      data: createUpdate.data,
      update: async (newData: DataUser): Promise<boolean> => {
        const updateData = await fetcherAxiosPut<DataUser, ApiResponseSuccessOrErrorType<UserType, Object>>(uri, setIsLoading, newData);

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