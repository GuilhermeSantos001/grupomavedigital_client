import { useState } from 'react';
import useSWR, { useSWRConfig } from 'swr'

import { fetcherAxiosPost } from '@/src/utils/fetcherAxiosPost';
import { fetcherAxiosGet } from '@/src/utils/fetcherAxiosGet';
import { fetcherAxiosPut } from '@/src/utils/fetcherAxiosPut';
import { fetcherAxiosDelete } from '@/src/utils/fetcherAxiosDelete';
import { StreetType } from '@/types/StreetType';
import { ApiResponseSuccessType } from '@/types/ApiResponseSuccessType';
import { ApiResponseErrorType } from '@/types/ApiResponseErrorType';
import { ApiResponseSuccessOrErrorType } from '@/types/ApiResponseSuccessOrErrorType';

import Alerting from '@/src/utils/alerting';

export type DataStreet = Pick<StreetType, 'value'>;

declare function CreateStreet(data: DataStreet): Promise<ResponseCreateStreet>
declare function SetCostCenter(data: ResponseCreateStreet): void
declare function UpdateStreet(newData: DataStreet): Promise<boolean>
declare function DeleteStreet(): Promise<boolean>

export type ResponseCreateStreet = {
  data: StreetType
  update: typeof UpdateStreet
  delete: typeof DeleteStreet
} | undefined

export type FunctionCreateStreetTypeof = typeof CreateStreet;
export type FunctionSetStreetTypeof = typeof SetCostCenter;
export type FunctionUpdateStreetTypeof = typeof UpdateStreet | undefined;
export type FunctionDeleteStreetTypeof = typeof DeleteStreet | undefined;

export function useStreetService(id?: string) {
  const { mutate } = useSWRConfig();

  const [isLoading, setIsLoading] = useState<boolean>(id ? true : false);

  const create = async (data: DataStreet) => {
    const createUpdate = await fetcherAxiosPost<DataStreet, ApiResponseSuccessOrErrorType<StreetType, Object>>(`${process.env.NEXT_PUBLIC_API_HOST}/street`, setIsLoading, data);

    if (!createUpdate.success) {
      Alerting.create('error', createUpdate.message);
      console.error(createUpdate);
      return undefined;
    }

    const uri = `${process.env.NEXT_PUBLIC_API_HOST}/street/${createUpdate.data.id}`;

    return {
      data: createUpdate.data,
      update: async (newData: DataStreet): Promise<boolean> => {
        const updateData = await fetcherAxiosPut<DataStreet, ApiResponseSuccessOrErrorType<StreetType, Object>>(uri, setIsLoading, newData);

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
    const uri = `${process.env.NEXT_PUBLIC_API_HOST}/street/${id}`;

    const { data, error, mutate } = useSWR<
      ApiResponseSuccessType<StreetType | undefined>,
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
        update: async (newData: DataStreet): Promise<boolean> => {
          const updateData = await fetcherAxiosPut<DataStreet, ApiResponseSuccessOrErrorType<StreetType, Object>>(uri, setIsLoading, newData);

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