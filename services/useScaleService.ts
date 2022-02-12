import { useState } from 'react';
import useSWR, { useSWRConfig } from 'swr'

import { fetcherAxiosPost } from '@/src/utils/fetcherAxiosPost';
import { fetcherAxiosGet } from '@/src/utils/fetcherAxiosGet';
import { fetcherAxiosPut } from '@/src/utils/fetcherAxiosPut';
import { fetcherAxiosDelete } from '@/src/utils/fetcherAxiosDelete';
import { ScaleType } from '@/types/ScaleType'
import { ApiResponseSuccessType } from '@/types/ApiResponseSuccessType';
import { ApiResponseErrorType } from '@/types/ApiResponseErrorType';
import { ApiResponseSuccessOrErrorType } from '@/types/ApiResponseSuccessOrErrorType';

import Alerting from '@/src/utils/alerting';

export type DataScale = Pick<ScaleType, 'value'>;

declare function CreateScale(data: DataScale): Promise<ResponseCreateScale>
declare function SetScale(data: ResponseCreateScale): void
declare function UpdateScale(newData: DataScale): Promise<boolean>
declare function DeleteScale(): Promise<boolean>

export type ResponseCreateScale = {
  data: ScaleType
  update: typeof UpdateScale
  delete: typeof DeleteScale
} | undefined

export type FunctionCreateScaleTypeof = typeof CreateScale;
export type FunctionSetScaleTypeof = typeof SetScale;
export type FunctionUpdateScaleTypeof = typeof UpdateScale | undefined;
export type FunctionDeleteScaleTypeof = typeof DeleteScale | undefined;

export function useScaleService(id?: string) {
  const { mutate } = useSWRConfig();

  const [isLoading, setIsLoading] = useState<boolean>(id ? true : false);

  const create = async (data: DataScale) => {
    const createUpdate = await fetcherAxiosPost<DataScale, ApiResponseSuccessOrErrorType<ScaleType, Object>>(`${process.env.NEXT_PUBLIC_API_HOST}/scale`, setIsLoading, data);

    if (!createUpdate.success) {
      Alerting.create('error', createUpdate.message);
      console.error(createUpdate);
      return undefined;
    }

    const uri = `${process.env.NEXT_PUBLIC_API_HOST}/scale/${createUpdate.data.id}`;

    return {
      data: createUpdate.data,
      update: async (newData: DataScale): Promise<boolean> => {
        const updateData = await fetcherAxiosPut<DataScale, ApiResponseSuccessOrErrorType<ScaleType, Object>>(uri, setIsLoading, newData);

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
    const uri = `${process.env.NEXT_PUBLIC_API_HOST}/scale/${id}`;

    const { data, error, mutate } = useSWR<
      ApiResponseSuccessType<ScaleType | undefined>,
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
        update: async (newData: DataScale): Promise<boolean> => {
          const updateData = await fetcherAxiosPut<DataScale, ApiResponseSuccessOrErrorType<ScaleType, Object>>(uri, setIsLoading, newData);

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