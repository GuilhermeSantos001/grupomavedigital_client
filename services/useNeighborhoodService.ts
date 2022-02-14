import { useState } from 'react';
import useSWR, { useSWRConfig } from 'swr'

import { fetcherAxiosPost } from '@/src/utils/fetcherAxiosPost';
import { fetcherAxiosGet } from '@/src/utils/fetcherAxiosGet';
import { fetcherAxiosPut } from '@/src/utils/fetcherAxiosPut';
import { fetcherAxiosDelete } from '@/src/utils/fetcherAxiosDelete';
import { NeighborhoodType } from '@/types/NeighborhoodType'
import { ApiResponseSuccessType } from '@/types/ApiResponseSuccessType';
import { ApiResponseErrorType } from '@/types/ApiResponseErrorType';
import { ApiResponseSuccessOrErrorType } from '@/types/ApiResponseSuccessOrErrorType';

import Alerting from '@/src/utils/alerting';

export type DataNeighborhood = Pick<NeighborhoodType, 'value'>;

declare function CreateNeighborhood(data: DataNeighborhood): Promise<ResponseCreateNeighborhood>
declare function SetNeighborhood(data: ResponseCreateNeighborhood): void
declare function UpdateNeighborhood(newData: DataNeighborhood): Promise<boolean>
declare function DeleteNeighborhood(): Promise<boolean>

export type ResponseCreateNeighborhood = {
  data: NeighborhoodType
  update: typeof UpdateNeighborhood
  delete: typeof DeleteNeighborhood
} | undefined

export type FunctionCreateNeighborhoodTypeof = typeof CreateNeighborhood;
export type FunctionSetNeighborhoodTypeof = typeof SetNeighborhood;
export type FunctionUpdateNeighborhoodTypeof = typeof UpdateNeighborhood | undefined;
export type FunctionDeleteNeighborhoodTypeof = typeof DeleteNeighborhood | undefined;

export function useNeighborhoodService(id?: string) {
  const { mutate } = useSWRConfig();

  const [isLoading, setIsLoading] = useState<boolean>(id ? true : false);

  const create = async (data: DataNeighborhood) => {
    const createUpdate = await fetcherAxiosPost<DataNeighborhood, ApiResponseSuccessOrErrorType<NeighborhoodType, Object>>(`${process.env.NEXT_PUBLIC_API_HOST}/neighborhood`, setIsLoading, data);

    if (!createUpdate.success) {
      Alerting.create('error', createUpdate.message);
      console.error(createUpdate);
      return undefined;
    }

    const uri = `${process.env.NEXT_PUBLIC_API_HOST}/neighborhood/${createUpdate.data.id}`;

    return {
      data: createUpdate.data,
      update: async (newData: DataNeighborhood): Promise<boolean> => {
        const updateData = await fetcherAxiosPut<DataNeighborhood, ApiResponseSuccessOrErrorType<NeighborhoodType, Object>>(uri, setIsLoading, newData);

        if (!updateData.success) {
          Alerting.create('error', updateData.message);
          console.error(updateData);

          return false;
        } else {
          mutate([uri, setIsLoading], {
            success: true,
            data: {...createUpdate.data,...updateData.data}
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
    const uri = `${process.env.NEXT_PUBLIC_API_HOST}/neighborhood/${id}`;

    const { data, error, mutate } = useSWR<
      ApiResponseSuccessType<NeighborhoodType | undefined>,
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
        update: async (newData: DataNeighborhood): Promise<boolean> => {
          const updateData = await fetcherAxiosPut<DataNeighborhood, ApiResponseSuccessOrErrorType<NeighborhoodType, Object>>(uri, setIsLoading, newData);

          if (!updateData.success) {
            Alerting.create('error', updateData.message);
            console.error(updateData);

            return false;
          } else {
            mutate({
              success: true,
              data: {...data?.data,...updateData.data}
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