import { useState } from 'react';
import { useSWRConfig } from 'swr'

import { fetcherAxiosPost } from '@/src/utils/fetcherAxiosPost';
import { fetcherAxiosPut } from '@/src/utils/fetcherAxiosPut';
import { fetcherAxiosDelete } from '@/src/utils/fetcherAxiosDelete';
import { ApiResponseErrorType } from '@/types/ApiResponseErrorType';
import { ApiResponseSuccessOrErrorType } from '@/types/ApiResponseSuccessOrErrorType';

import {
  PackageHoursType
} from '@/types/PackageHoursType';

import {
  DataPackageHours
} from '@/types/PackageHoursServiceType';

import Alerting from '@/src/utils/alerting';

export function usePackageHoursService() {
  const { mutate } = useSWRConfig();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const create = async (data: DataPackageHours) => {
    const createUpdate = await fetcherAxiosPost<DataPackageHours, ApiResponseSuccessOrErrorType<PackageHoursType, Object>>(`${process.env.NEXT_PUBLIC_API_HOST}/ph`, setIsLoading, data);

    if (!createUpdate.success) {
      Alerting.create('error', createUpdate.message);
      console.error(createUpdate);
      return undefined;
    }

    const uri = `${process.env.NEXT_PUBLIC_API_HOST}/ph/${createUpdate.data.id}`;

    return {
      data: createUpdate.data,
      update: async (newData: DataPackageHours): Promise<boolean> => {
        const updateData = await fetcherAxiosPut<DataPackageHours, ApiResponseSuccessOrErrorType<PackageHoursType, Object>>(uri, setIsLoading, newData);

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