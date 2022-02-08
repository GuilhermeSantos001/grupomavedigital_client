import { useState } from 'react';
import useSWR, { useSWRConfig } from 'swr'

import { fetcherAxiosPost } from '@/src/utils/fetcherAxiosPost';
import { fetcherAxiosGet } from '@/src/utils/fetcherAxiosGet';
import { fetcherAxiosPut } from '@/src/utils/fetcherAxiosPut';
import { fetcherAxiosDelete } from '@/src/utils/fetcherAxiosDelete';
import { WorkplaceType } from '@/types/WorkplaceType';
import { ApiResponseSuccessType } from '@/types/ApiResponseSuccessType';
import { ApiResponseErrorType } from '@/types/ApiResponseErrorType';
import { ApiResponseSuccessOrErrorType } from '@/types/ApiResponseSuccessOrErrorType';

import Alerting from '@/src/utils/alerting';

export type DataWorkplace = Pick<WorkplaceType,
  | "name"
  | "scaleId"
  | "entryTime"
  | "exitTime"
  | "addressId"
  | "status"
>;

declare function CreateWorkplace(data: DataWorkplace): Promise<ResponseCreateWorkplace>
declare function SetWorkplace(data: ResponseCreateWorkplace): void
declare function UpdateWorkplace(newData: DataWorkplace): Promise<boolean>
declare function DeleteWorkplace(): Promise<boolean>

export type ResponseCreateWorkplace = {
  data: WorkplaceType
  update: typeof UpdateWorkplace
  delete: typeof DeleteWorkplace
} | undefined

export type FunctionCreateWorkplaceTypeof = typeof CreateWorkplace;
export type FunctionSetWorkplaceTypeof = typeof SetWorkplace;
export type FunctionUpdateWorkplaceTypeof = typeof UpdateWorkplace | undefined;
export type FunctionDeleteWorkplaceTypeof = typeof DeleteWorkplace | undefined;

export function useWorkplaceService(id?: string) {
  const { mutate } = useSWRConfig();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const create = async (data: DataWorkplace) => {
    const createUpdate = await fetcherAxiosPost<DataWorkplace, ApiResponseSuccessOrErrorType<WorkplaceType, Object>>(`${process.env.NEXT_PUBLIC_API_HOST}/workplace`, setIsLoading, data);

    if (!createUpdate.success) {
      Alerting.create('error', createUpdate.message);
      console.error(createUpdate);
      return undefined;
    }

    const uri = `${process.env.NEXT_PUBLIC_API_HOST}/workplace/${createUpdate.data.id}`;

    return {
      data: createUpdate.data,
      update: async (newData: DataWorkplace): Promise<boolean> => {
        const updateData = await fetcherAxiosPut<DataWorkplace, ApiResponseSuccessOrErrorType<WorkplaceType, Object>>(uri, setIsLoading, newData);

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
    const uri = `${process.env.NEXT_PUBLIC_API_HOST}/workplace/${id}`;

    const { data, error, mutate } = useSWR<
      ApiResponseSuccessType<WorkplaceType | undefined>,
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
        update: async (newData: DataWorkplace): Promise<boolean> => {
          const updateData = await fetcherAxiosPut<DataWorkplace, ApiResponseSuccessOrErrorType<WorkplaceType, Object>>(uri, setIsLoading, newData);

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