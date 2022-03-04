import { useState } from 'react';
import { useSWRConfig } from 'swr'

import { fetcherAxiosPost } from '@/src/utils/fetcherAxiosPost';
import { fetcherAxiosPut } from '@/src/utils/fetcherAxiosPut';
import { fetcherAxiosDelete } from '@/src/utils/fetcherAxiosDelete';
import { ApiResponseErrorType } from '@/types/ApiResponseErrorType';
import { ApiResponseSuccessOrErrorType } from '@/types/ApiResponseSuccessOrErrorType';

import type {
  DataPersonCoverage
} from '@/types/PersonCoverageServiceType';

import type {
  PersonCoverageType
} from '@/types/PersonCoverageType';

import Alerting from '@/src/utils/alerting';

export function usePersonCoverageService() {
  const { mutate } = useSWRConfig();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const create = async (data: DataPersonCoverage) => {
    const createUpdate = await fetcherAxiosPost<DataPersonCoverage, ApiResponseSuccessOrErrorType<PersonCoverageType, Object>>(`${process.env.NEXT_PUBLIC_API_HOST}/person_coverage`, setIsLoading, data);

    if (!createUpdate.success) {
      Alerting.create('error', createUpdate.message);
      console.error(createUpdate);
      return undefined;
    }

    const uri = `${process.env.NEXT_PUBLIC_API_HOST}/person_coverage/${createUpdate.data.id}`;

    return {
      data: createUpdate.data,
      update: async (newData: DataPersonCoverage): Promise<boolean> => {
        const updateData = await fetcherAxiosPut<DataPersonCoverage, ApiResponseSuccessOrErrorType<PersonCoverageType, Object>>(uri, setIsLoading, newData);

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