import { useState } from 'react';

import useSWR from 'swr'
import { SWRConfig } from '@/services/config/SWRConfig';

import { fetcherAxiosPost } from '@/src/utils/fetcherAxiosPost';
import { fetcherAxiosPut } from '@/src/utils/fetcherAxiosPut';
import { fetcherAxiosGet } from '@/src/utils/fetcherAxiosGet';
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

export function useServicesService(take: number = 10) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [uri, setURI] = useState<string>(`${process.env.NEXT_PUBLIC_API_HOST}/services?take=${take}`);
  const [lastCursorId, setLastCursorId] = useState<number>(0);

  const skip = 1;

  const { data, error, mutate } = useSWR<
    ApiResponseSuccessType<ServiceType[]>,
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
          setURI(`${process.env.NEXT_PUBLIC_API_HOST}/services?skip=${skip}&take=${take}&cursorId=${cursorId}`);
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

        setURI(`${process.env.NEXT_PUBLIC_API_HOST}/services${query}`);
      },
      update: async (id: string, newData: DataService): Promise<boolean> => {
        const uri = `${process.env.NEXT_PUBLIC_API_HOST}/service/${id}`;

        const updateData = await fetcherAxiosPut<DataService, ApiResponseSuccessOrErrorType<ServiceType, Object>>(uri, setIsLoading, newData);

        if (!updateData.success) {
          Alerting.create('error', updateData.message);
          console.error(updateData);

          return false;
        } else {
          mutate({
            success: true,
            data: data.data.map(service => {
              if (service.id === id) {
                service = { ...service, ...updateData.data };
              }

              return service;
            })
          });
        }

        return true;
      },
      assignPerson: async (id: string, dataAssignPerson: DataAssignPerson): Promise<boolean> => {
        const
          uriAssignPerson = `${process.env.NEXT_PUBLIC_API_HOST}/service/assign/person`;

        const updateData = await fetcherAxiosPost<DataAssignPerson, ApiResponseSuccessOrErrorType<ServiceType, Object>>(uriAssignPerson, setIsLoading, { ...dataAssignPerson, serviceId: id });

        if (!updateData.success) {
          Alerting.create('error', updateData.message);
          console.error(updateData);

          return false;
        } else {
          mutate({
            success: true,
            data: data.data.map(service => {
              if (service.id === id) {
                service = { ...service, ...updateData.data };
              }

              return service;
            })
          });
        }

        return true;
      },
      unassignPerson: async (id: string): Promise<boolean> => {
        const
          uriUnassignPerson = `${process.env.NEXT_PUBLIC_API_HOST}/service/unassign/person/${id}`;

        const updateData = await fetcherAxiosDelete<ApiResponseSuccessOrErrorType<ServiceType, Object>>(uriUnassignPerson, setIsLoading);

        if (!updateData.success) {
          Alerting.create('error', updateData.message);
          console.error(updateData);

          return false;
        } else {
          mutate({
            success: true,
            data: data.data.map(service => {
              if (service.id === id) {
                service = { ...service, ...updateData.data };
              }

              return service;
            })
          });
        }

        return true;
      },
      assignWorkplace: async (id: string, dataAssignWorkplace: DataAssignWorkplace): Promise<boolean> => {
        const
          uriAssignWorkplace = `${process.env.NEXT_PUBLIC_API_HOST}/service/assign/workplace`;

        const updateData = await fetcherAxiosPost<DataAssignWorkplace, ApiResponseSuccessOrErrorType<ServiceType, Object>>(uriAssignWorkplace, setIsLoading, { ...dataAssignWorkplace, serviceId: id });

        if (!updateData.success) {
          Alerting.create('error', updateData.message);
          console.error(updateData);

          return false;
        } else {
          mutate({
            success: true,
            data: data.data.map(service => {
              if (service.id === id) {
                service = { ...service, ...updateData.data };
              }

              return service;
            })
          });
        }

        return true;
      },
      unassignWorkplace: async (id: string): Promise<boolean> => {
        const
          uriUnassignWorkplace = `${process.env.NEXT_PUBLIC_API_HOST}/service/unassign/workplace/${id}`;

        const updateData = await fetcherAxiosDelete<ApiResponseSuccessOrErrorType<ServiceType, Object>>(uriUnassignWorkplace, setIsLoading);

        if (!updateData.success) {
          Alerting.create('error', updateData.message);
          console.error(updateData);

          return false;
        } else {
          mutate({
            success: true,
            data: data.data.map(service => {
              if (service.id === id) {
                service = { ...service, ...updateData.data };
              }

              return service;
            })
          });
        }

        return true;
      },
      delete: async (id: string): Promise<boolean> => {
        const uri = `${process.env.NEXT_PUBLIC_API_HOST}/service/${id}`;

        const deleteData = await fetcherAxiosDelete<ApiResponseErrorType<Object>>(uri, setIsLoading);

        if (!deleteData.success) {
          Alerting.create('error', deleteData.message);
          console.error(deleteData);

          return false;
        } else {
          mutate({
            success: true,
            data: data.data.filter(service => service.id !== id)
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