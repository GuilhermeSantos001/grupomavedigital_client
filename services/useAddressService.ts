import { useState } from 'react';
import useSWR, { useSWRConfig } from 'swr'

import { fetcherAxiosPost } from '@/src/utils/fetcherAxiosPost';
import { fetcherAxiosGet } from '@/src/utils/fetcherAxiosGet';
import { fetcherAxiosPut } from '@/src/utils/fetcherAxiosPut';
import { fetcherAxiosDelete } from '@/src/utils/fetcherAxiosDelete';
import { AddressType } from '@/types/AddressType';
import { ApiResponseSuccessType } from '@/types/ApiResponseSuccessType';
import { ApiResponseErrorType } from '@/types/ApiResponseErrorType';
import { ApiResponseSuccessOrErrorType } from '@/types/ApiResponseSuccessOrErrorType';

import Alerting from '@/src/utils/alerting';

export type DataAddress = Pick<AddressType,
  | 'streetId'
  | 'number'
  | 'complement'
  | 'neighborhoodId'
  | 'cityId'
  | 'districtId'
  | 'zipCode'
>;

declare function CreateAddress(data: DataAddress): Promise<ResponseCreateAddress>
declare function SetAddress(data: ResponseCreateAddress): void
declare function UpdateAddress(newData: DataAddress): Promise<boolean>
declare function DeleteAddress(): Promise<boolean>

export type ResponseCreateAddress = {
  data: AddressType
  update: typeof UpdateAddress
  delete: typeof DeleteAddress
} | undefined

export type FunctionCreateAddressTypeof = typeof CreateAddress;
export type FunctionSetAddressTypeof = typeof SetAddress;
export type FunctionUpdateAddressTypeof = typeof UpdateAddress | undefined;
export type FunctionDeleteAddressTypeof = typeof DeleteAddress | undefined;

export function useAddressService(id?: string) {
  const { mutate } = useSWRConfig();

  const [isLoading, setIsLoading] = useState<boolean>(id ? true : false);

  const create = async (data: DataAddress) => {
    const createUpdate = await fetcherAxiosPost<DataAddress, ApiResponseSuccessOrErrorType<AddressType, Object>>(`${process.env.NEXT_PUBLIC_API_HOST}/address`, setIsLoading, data);

    if (!createUpdate.success) {
      Alerting.create('error', createUpdate.message);
      console.error(createUpdate);
      return undefined;
    }

    const uri = `${process.env.NEXT_PUBLIC_API_HOST}/address/${createUpdate.data.id}`;

    return {
      data: createUpdate.data,
      update: async (newData: DataAddress): Promise<boolean> => {
        const updateData = await fetcherAxiosPut<DataAddress, ApiResponseSuccessOrErrorType<AddressType, Object>>(uri, setIsLoading, newData);

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
    const uri = `${process.env.NEXT_PUBLIC_API_HOST}/address/${id}`;

    const { data, error, mutate } = useSWR<
      ApiResponseSuccessType<AddressType | undefined>,
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
        update: async (newData: DataAddress): Promise<boolean> => {
          const updateData = await fetcherAxiosPut<DataAddress, ApiResponseSuccessOrErrorType<AddressType, Object>>(uri, setIsLoading, newData);

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