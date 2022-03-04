import { useState } from 'react';
import useSWR from 'swr'

import { fetcherAxiosPost } from '@/src/utils/fetcherAxiosPost';
import { fetcherAxiosGet } from '@/src/utils/fetcherAxiosGet';
import { fetcherAxiosPut } from '@/src/utils/fetcherAxiosPut';
import { fetcherAxiosDelete } from '@/src/utils/fetcherAxiosDelete';
import { ApiResponseSuccessType } from '@/types/ApiResponseSuccessType';
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

export function useServiceWithIdService(id: string) {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const
    uri = `${process.env.NEXT_PUBLIC_API_HOST}/service/${id}`,
    uriAssignPerson = `${process.env.NEXT_PUBLIC_API_HOST}/service/assign/person`,
    uriUnassignPerson = `${process.env.NEXT_PUBLIC_API_HOST}/service/unassign/person/${id}`,
    uriAssignWorkplace = `${process.env.NEXT_PUBLIC_API_HOST}/service/assign/workplace`,
    uriUnassignWorkplace = `${process.env.NEXT_PUBLIC_API_HOST}/service/unassign/workplace/${id}`;

  const { data, error, mutate } = useSWR<
    ApiResponseSuccessType<ServiceType | undefined>,
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
      update: async (newData: DataService): Promise<boolean> => {
        const updateData = await fetcherAxiosPut<DataService, ApiResponseSuccessOrErrorType<ServiceType, Object>>(uri, setIsLoading, newData);

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
      assignPerson: async (data: DataAssignPerson): Promise<boolean> => {
        const updateData = await fetcherAxiosPost<DataAssignPerson, ApiResponseSuccessOrErrorType<{}, Object>>(uriAssignPerson, setIsLoading, { ...data, serviceId: id });

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
        const updateData = await fetcherAxiosPost<DataAssignWorkplace, ApiResponseSuccessOrErrorType<{}, Object>>(uriAssignWorkplace, setIsLoading, { ...data, serviceId: id });

        if (!updateData.success) {
          Alerting.create('error', updateData.message);
          console.error(updateData);

          return false;
        }

        return true;
      },
      unassignWorkplace: async (): Promise<boolean> => {
        const updateData = await fetcherAxiosDelete<ApiResponseSuccessOrErrorType<ServiceType, Object>>(uriUnassignWorkplace, setIsLoading);

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