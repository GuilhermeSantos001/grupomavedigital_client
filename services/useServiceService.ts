import { useState } from 'react';
import { useSWRConfig } from 'swr'

import { fetcherAxiosPost } from '@/src/utils/fetcherAxiosPost';
import { fetcherAxiosPut } from '@/src/utils/fetcherAxiosPut';
import { fetcherAxiosDelete } from '@/src/utils/fetcherAxiosDelete';
import { ApiResponseErrorType } from '@/types/ApiResponseErrorType';
import { ApiResponseSuccessOrErrorType } from '@/types/ApiResponseSuccessOrErrorType';

import {
  DataService,
  DataAssignPerson,
  DataAssignWorkplace
} from '@/types/ServiceServiceType';

import {
  ServiceType
} from '@/types/ServiceType';

import Alerting from '@/src/utils/alerting';

export function useServiceService() {
  const { mutate } = useSWRConfig();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const create = async (data: DataService) => {
    const createUpdate = await fetcherAxiosPost<DataService, ApiResponseSuccessOrErrorType<ServiceType, Object>>(`${process.env.NEXT_PUBLIC_API_HOST}/service`, setIsLoading, data);

    if (!createUpdate.success) {
      Alerting.create('error', createUpdate.message);
      console.error(createUpdate);
      return undefined;
    }

    const
      uri = `${process.env.NEXT_PUBLIC_API_HOST}/service/${createUpdate.data.id}`,
      uriAssignPerson = `${process.env.NEXT_PUBLIC_API_HOST}/service/assign/person`,
      uriUnassignPerson = `${process.env.NEXT_PUBLIC_API_HOST}/service/unassign/person/${createUpdate.data.id}`,
      uriAssignWorkplace = `${process.env.NEXT_PUBLIC_API_HOST}/service/assign/workplace`,
      uriUnassignWorkplace = `${process.env.NEXT_PUBLIC_API_HOST}/service/unassign/workplace/${createUpdate.data.id}`;

    return {
      data: createUpdate.data,
      update: async (newData: DataService): Promise<boolean> => {
        const updateData = await fetcherAxiosPut<DataService, ApiResponseSuccessOrErrorType<ServiceType, Object>>(uri, setIsLoading, newData);

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
      assignPerson: async (data: DataAssignPerson): Promise<boolean> => {
        const updateData = await fetcherAxiosPost<DataAssignPerson, ApiResponseSuccessOrErrorType<{}, Object>>(uriAssignPerson, setIsLoading, { ...data, serviceId: createUpdate.data.id });

        if (!updateData.success) {
          Alerting.create('error', updateData.message);
          console.error(updateData);

          return false;
        }

        return true;
      },
      unassignPerson: async (): Promise<boolean> => {
        const updateData = await fetcherAxiosDelete<ApiResponseSuccessOrErrorType<{}, Object>>(uriUnassignPerson, setIsLoading);

        if (!updateData.success) {
          Alerting.create('error', updateData.message);
          console.error(updateData);

          return false;
        }

        return true;
      },
      assignWorkplace: async (data: DataAssignWorkplace): Promise<boolean> => {
        const updateData = await fetcherAxiosPost<DataAssignWorkplace, ApiResponseSuccessOrErrorType<{}, Object>>(uriAssignWorkplace, setIsLoading, { ...data, serviceId: createUpdate.data.id });

        if (!updateData.success) {
          Alerting.create('error', updateData.message);
          console.error(updateData);

          return false;
        }

        return true;
      },
      unassignWorkplace: async (): Promise<boolean> => {
        const updateData = await fetcherAxiosDelete<ApiResponseSuccessOrErrorType<{}, Object>>(uriUnassignWorkplace, setIsLoading);

        if (!updateData.success) {
          Alerting.create('error', updateData.message);
          console.error(updateData);

          return false;
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