import { useState } from 'react';
import useSWR, { useSWRConfig } from 'swr'

import { fetcherAxiosPost } from '@/src/utils/fetcherAxiosPost';
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

declare function CreateService(data: DataService): Promise<ResponseCreateService>;
declare function SetService(data: ResponseCreateService): void;
declare function UpdateService(newData: DataService): Promise<boolean>;
declare function AssignPersonService(data: DataAssignPerson): Promise<boolean>;
declare function AssignWorkplaceService(data: DataAssignWorkplace): Promise<boolean>;
declare function UnassignPersonService(): Promise<boolean>;
declare function UnassignWorkplaceService(): Promise<boolean>;
declare function DeleteService(): Promise<boolean>;

export type ResponseCreateService = {
  data: ServiceType
  update: typeof UpdateService
  assignPerson: typeof AssignPersonService
  assignWorkplace: typeof AssignWorkplaceService
  unassignPerson: typeof UnassignPersonService
  unassignWorkplace: typeof UnassignWorkplaceService
  delete: typeof DeleteService
} | undefined;

export type FunctionCreateServiceTypeof = typeof CreateService;
export type FunctionSetServiceTypeof = typeof SetService;
export type FunctionUpdateServiceTypeof = typeof UpdateService | undefined;
export type FunctionAssignPersonServiceTypeof = typeof AssignPersonService | undefined;
export type FunctionAssignWorkplaceServiceTypeof = typeof AssignWorkplaceService | undefined;
export type FunctionUnassignPersonServiceTypeof = typeof UnassignPersonService | undefined;
export type FunctionUnassignWorkplaceServiceTypeof = typeof UnassignWorkplaceService | undefined;
export type FunctionDeleteServiceTypeof = typeof DeleteService | undefined;

export function useServiceService(id?: string) {
  const { mutate } = useSWRConfig();

  const [isLoading, setIsLoading] = useState<boolean>(id ? true : false);

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
            data: updateData.data
          });
        }

        return true;
      },
      assignPerson: async (data: DataAssignPerson): Promise<boolean> => {
        const updateData = await fetcherAxiosPut<DataAssignPerson, ApiResponseSuccessOrErrorType<{}, Object>>(uriAssignPerson, setIsLoading, { ...data, serviceId: createUpdate.data.id });

        if (!updateData.success) {
          Alerting.create('error', updateData.message);
          console.error(updateData);

          return false;
        }

        return true;
      },
      unassignPerson: async (): Promise<boolean> => {
        const updateData = await fetcherAxiosPut<{}, ApiResponseSuccessOrErrorType<{}, Object>>(uriUnassignPerson, setIsLoading, {});

        if (!updateData.success) {
          Alerting.create('error', updateData.message);
          console.error(updateData);

          return false;
        }

        return true;
      },
      assignWorkplace: async (data: DataAssignWorkplace): Promise<boolean> => {
        const updateData = await fetcherAxiosPut<DataAssignWorkplace, ApiResponseSuccessOrErrorType<{}, Object>>(uriAssignWorkplace, setIsLoading, { ...data, serviceId: createUpdate.data.id });

        if (!updateData.success) {
          Alerting.create('error', updateData.message);
          console.error(updateData);

          return false;
        }

        return true;
      },
      unassignWorkplace: async (): Promise<boolean> => {
        const updateData = await fetcherAxiosPut<{}, ApiResponseSuccessOrErrorType<{}, Object>>(uriUnassignWorkplace, setIsLoading, {});

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

  if (id) {
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
      return { isLoading, create };
    }

    if (data?.success)
      return {
        isLoading,
        data: data?.data,
        create,
        update: async (newData: DataService): Promise<boolean> => {
          const updateData = await fetcherAxiosPut<DataService, ApiResponseSuccessOrErrorType<ServiceType, Object>>(uri, setIsLoading, newData);

          if (!updateData.success) {
            Alerting.create('error', updateData.message);
            console.error(updateData);

            return false;
          } else {
            mutate({
              success: true,
              data: updateData.data
            });
          }

          return true;
        },
        assignPerson: async (data: DataAssignPerson): Promise<boolean> => {
          const updateData = await fetcherAxiosPut<DataAssignPerson, ApiResponseSuccessOrErrorType<{}, Object>>(uriAssignPerson, setIsLoading, { ...data, serviceId: id });

          if (!updateData.success) {
            Alerting.create('error', updateData.message);
            console.error(updateData);

            return false;
          }

          return true;
        },
        unassignPerson: async (): Promise<boolean> => {
          const updateData = await fetcherAxiosPut<{}, ApiResponseSuccessOrErrorType<{}, Object>>(uriUnassignPerson, setIsLoading, {});

          if (!updateData.success) {
            Alerting.create('error', updateData.message);
            console.error(updateData);

            return false;
          }

          return true;
        },
        assignWorkplace: async (data: DataAssignWorkplace): Promise<boolean> => {
          const updateData = await fetcherAxiosPut<DataAssignWorkplace, ApiResponseSuccessOrErrorType<{}, Object>>(uriAssignWorkplace, setIsLoading, { ...data, serviceId: id });

          if (!updateData.success) {
            Alerting.create('error', updateData.message);
            console.error(updateData);

            return false;
          }

          return true;
        },
        unassignWorkplace: async (): Promise<boolean> => {
          const updateData = await fetcherAxiosPut<{}, ApiResponseSuccessOrErrorType<ServiceType, Object>>(uriUnassignWorkplace, setIsLoading, {});

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
  }

  return {
    isLoading,
    create
  };
}