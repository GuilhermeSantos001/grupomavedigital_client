import { useState } from 'react';
import useSWR, { useSWRConfig } from 'swr'

import { fetcherAxiosPost } from '@/src/utils/fetcherAxiosPost';
import { fetcherAxiosGet } from '@/src/utils/fetcherAxiosGet';
import { fetcherAxiosPut } from '@/src/utils/fetcherAxiosPut';
import { fetcherAxiosDelete } from '@/src/utils/fetcherAxiosDelete';
import { CostCenterType } from '@/types/CostCenterType'
import { ApiResponseSuccessType } from '@/types/ApiResponseSuccessType';
import { ApiResponseErrorType } from '@/types/ApiResponseErrorType';
import { ApiResponseSuccessOrErrorType } from '@/types/ApiResponseSuccessOrErrorType';

import Alerting from '@/src/utils/alerting';

export type DataCostCenter = Pick<CostCenterType, 'value'>;

declare function CreateCostCenter(data: DataCostCenter): Promise<ResponseCreateCostCenter>
declare function SetCostCenter(data: ResponseCreateCostCenter): void
declare function UpdateCostCenter(newData: DataCostCenter): Promise<boolean>
declare function DeleteCostCenter(): Promise<boolean>

export type ResponseCreateCostCenter = {
  data: CostCenterType
  update: typeof UpdateCostCenter
  delete: typeof DeleteCostCenter
} | undefined

export type FunctionCreateCostCenterTypeof = typeof CreateCostCenter;
export type FunctionSetCostCenterTypeof = typeof SetCostCenter;
export type FunctionUpdateCostCenterTypeof = typeof UpdateCostCenter | undefined;
export type FunctionDeleteCostCenterTypeof = typeof DeleteCostCenter | undefined;

export function useCostCenterService(id?: string) {
  const { mutate } = useSWRConfig();

  const [isLoading, setIsLoading] = useState<boolean>(id ? true : false);

  const create = async (data: DataCostCenter) => {
    const createUpdate = await fetcherAxiosPost<DataCostCenter, ApiResponseSuccessOrErrorType<CostCenterType, Object>>(`${process.env.NEXT_PUBLIC_API_HOST}/costcenter`, setIsLoading, data);

    if (!createUpdate.success) {
      Alerting.create('error', createUpdate.message);
      console.error(createUpdate);
      return undefined;
    }

    const uri = `${process.env.NEXT_PUBLIC_API_HOST}/costcenter/${createUpdate.data.id}`;

    return {
      data: createUpdate.data,
      update: async (newData: DataCostCenter): Promise<boolean> => {
        const updateData = await fetcherAxiosPut<DataCostCenter, ApiResponseSuccessOrErrorType<CostCenterType, Object>>(uri, setIsLoading, newData);

        if (!updateData.success) {
          Alerting.create('error', updateData.message);
          console.error(updateData);

          return false;
        } else {
          mutate([uri, setIsLoading], {
            success: true,
            data: {...createUpdate.data, ...updateData.data}
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
    const uri = `${process.env.NEXT_PUBLIC_API_HOST}/costcenter/${id}`;

    const { data, error, mutate } = useSWR<
      ApiResponseSuccessType<CostCenterType | undefined>,
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
        update: async (newData: DataCostCenter): Promise<boolean> => {
          const updateData = await fetcherAxiosPut<DataCostCenter, ApiResponseSuccessOrErrorType<CostCenterType, Object>>(uri, setIsLoading, newData);

          if (!updateData.success) {
            Alerting.create('error', updateData.message);
            console.error(updateData);

            return false;
          } else {
            mutate({
              success: true,
              data: {...data?.data, ...updateData.data}
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