import { useState } from 'react';
import useSWR, { useSWRConfig } from 'swr'

import { fetcherAxiosPost } from '@/src/utils/fetcherAxiosPost';
import { fetcherAxiosGet } from '@/src/utils/fetcherAxiosGet';
import { fetcherAxiosPut } from '@/src/utils/fetcherAxiosPut';
import { fetcherAxiosDelete } from '@/src/utils/fetcherAxiosDelete';
import { DistrictType } from '@/types/DistrictType';
import { ApiResponseSuccessType } from '@/types/ApiResponseSuccessType';
import { ApiResponseErrorType } from '@/types/ApiResponseErrorType';
import { ApiResponseSuccessOrErrorType } from '@/types/ApiResponseSuccessOrErrorType';

import Alerting from '@/src/utils/alerting';

export type DataDistrict = Pick<DistrictType, 'value'>;

declare function CreateDistrict(data: DataDistrict): Promise<ResponseCreateDistrict>
declare function SetDistrict(data: ResponseCreateDistrict): void
declare function UpdateDistrict(newData: DataDistrict): Promise<boolean>
declare function DeleteDistrict(): Promise<boolean>

export type ResponseCreateDistrict = {
  data: DistrictType
  update: typeof UpdateDistrict
  delete: typeof DeleteDistrict
} | undefined

export type FunctionCreateDistrictTypeof = typeof CreateDistrict;
export type FunctionSetDistrictTypeof = typeof SetDistrict;
export type FunctionUpdateDistrictTypeof = typeof UpdateDistrict | undefined;
export type FunctionDeleteDistrictTypeof = typeof DeleteDistrict | undefined;

export function useDistrictService(id?: string) {
  const { mutate } = useSWRConfig();

  const [isLoading, setIsLoading] = useState<boolean>(id ? true : false);

  const create = async (data: DataDistrict) => {
    const createUpdate = await fetcherAxiosPost<DataDistrict, ApiResponseSuccessOrErrorType<DistrictType, Object>>(`${process.env.NEXT_PUBLIC_API_HOST}/district`, setIsLoading, data);

    if (!createUpdate.success) {
      Alerting.create('error', createUpdate.message);
      console.error(createUpdate);
      return undefined;
    }

    const uri = `${process.env.NEXT_PUBLIC_API_HOST}/district/${createUpdate.data.id}`;

    return {
      data: createUpdate.data,
      update: async (newData: DataDistrict): Promise<boolean> => {
        const updateData = await fetcherAxiosPut<DataDistrict, ApiResponseSuccessOrErrorType<DistrictType, Object>>(uri, setIsLoading, newData);

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
    const uri = `${process.env.NEXT_PUBLIC_API_HOST}/district/${id}`;

    const { data, error, mutate } = useSWR<
      ApiResponseSuccessType<DistrictType | undefined>,
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
        update: async (newData: DataDistrict): Promise<boolean> => {
          const updateData = await fetcherAxiosPut<DataDistrict, ApiResponseSuccessOrErrorType<DistrictType, Object>>(uri, setIsLoading, newData);

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