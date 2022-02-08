import { useState } from 'react';
import useSWR from 'swr'

import { fetcherAxiosGet } from '@/src/utils/fetcherAxiosGet';
import { fetcherAxiosPut } from '@/src/utils/fetcherAxiosPut';
import { fetcherAxiosDelete } from '@/src/utils/fetcherAxiosDelete';
import { ServiceType } from '@/types/ServiceType';
import { ApiResponseSuccessType } from '@/types/ApiResponseSuccessType';
import { ApiResponseErrorType } from '@/types/ApiResponseErrorType';
import { ApiResponseSuccessOrErrorType } from '@/types/ApiResponseSuccessOrErrorType';

import Alerting from '@/src/utils/alerting';

export type DataService = Pick<ServiceType, 'value'>;
export type DataAssignPerson = { personId: string, serviceId?: string };
export type DataAssignWorkplace = { workplaceId: string, serviceId?: string };

declare function UpdateServices(id: string, newData: DataService): Promise<boolean>;
declare function AssignPersonService(data: DataAssignPerson): Promise<boolean>;
declare function AssignWorkplaceService(data: DataAssignWorkplace): Promise<boolean>;
declare function UnassignPersonService(): Promise<boolean>;
declare function UnassignWorkplaceService(): Promise<boolean>;
declare function DeleteServices(id: string): Promise<boolean>;

export type FunctionUpdateServicesTypeof = typeof UpdateServices | undefined;
export type FunctionAssignPersonServiceTypeof = typeof AssignPersonService | undefined;
export type FunctionAssignWorkplaceServiceTypeof = typeof AssignWorkplaceService | undefined;
export type FunctionUnassignPersonServiceTypeof = typeof UnassignPersonService | undefined;
export type FunctionUnassignWorkplaceServiceTypeof = typeof UnassignWorkplaceService | undefined;
export type FunctionDeleteServicesTypeof = typeof DeleteServices | undefined;
export type FunctionNextPageTypeof = (() => void) | undefined;
export type FunctionPreviousPageTypeof = (() => void) | undefined;

export function useServicesService(take: number = 10) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const skip = 1;

  const [uri, setURI] = useState<string>(`${process.env.NEXT_PUBLIC_API_HOST}/services?take=${take}`);

  const [lastCursorId, setLastCursorId] = useState<number>(0);

  const { data, error, mutate } = useSWR<
    ApiResponseSuccessType<ServiceType[]>,
    ApiResponseErrorType<Object>
  >([uri, setIsLoading], fetcherAxiosGet)

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
        const uri = `${process.env.NEXT_PUBLIC_API_HOST}/services/${id}`;

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
                service = updateData.data;
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

        const updateData = await fetcherAxiosPut<DataAssignPerson, ApiResponseSuccessOrErrorType<ServiceType, Object>>(uriAssignPerson, setIsLoading, { ...dataAssignPerson, serviceId: id });

        if (!updateData.success) {
          Alerting.create('error', updateData.message);
          console.error(updateData);

          return false;
        } else {
          mutate({
            success: true,
            data: data.data.map(service => {
              if (service.id === id) {
                service = updateData.data;
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

        const updateData = await fetcherAxiosPut<{}, ApiResponseSuccessOrErrorType<ServiceType, Object>>(uriUnassignPerson, setIsLoading, {});

        if (!updateData.success) {
          Alerting.create('error', updateData.message);
          console.error(updateData);

          return false;
        } else {
          mutate({
            success: true,
            data: data.data.map(service => {
              if (service.id === id) {
                service = updateData.data;
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

        const updateData = await fetcherAxiosPut<DataAssignWorkplace, ApiResponseSuccessOrErrorType<ServiceType, Object>>(uriAssignWorkplace, setIsLoading, { ...dataAssignWorkplace, serviceId: id });

        if (!updateData.success) {
          Alerting.create('error', updateData.message);
          console.error(updateData);

          return false;
        } else {
          mutate({
            success: true,
            data: data.data.map(service => {
              if (service.id === id) {
                service = updateData.data;
              }

              return service;
            })
          });
        }

        return true;
      },
      unassignWorkplace: async (id: string): Promise<boolean> => {
        const
          uriUnassignWorkplace = `${process.env.NEXT_PUBLIC_API_HOST}/service/assign/workplace/${id}`;

        const updateData = await fetcherAxiosPut<{}, ApiResponseSuccessOrErrorType<ServiceType, Object>>(uriUnassignWorkplace, setIsLoading, {});

        if (!updateData.success) {
          Alerting.create('error', updateData.message);
          console.error(updateData);

          return false;
        } else {
          mutate({
            success: true,
            data: data.data.map(service => {
              if (service.id === id) {
                service = updateData.data;
              }

              return service;
            })
          });
        }

        return true;
      },
      delete: async (id: string): Promise<boolean> => {
        const uri = `${process.env.NEXT_PUBLIC_API_HOST}/services/${id}`;

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