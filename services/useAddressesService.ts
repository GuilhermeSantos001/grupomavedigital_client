import { useState } from 'react';
import useSWR from 'swr'

import { fetcherAxiosGet } from '@/src/utils/fetcherAxiosGet';
import { fetcherAxiosPut } from '@/src/utils/fetcherAxiosPut';
import { fetcherAxiosDelete } from '@/src/utils/fetcherAxiosDelete';
import { AddressType } from '@/types/AddressType'
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

declare function UpdateAddresses(id: string, newData: DataAddress): Promise<boolean>
declare function DeleteAddresses(id: string): Promise<boolean>

export type FunctionUpdateAddressesTypeof = typeof UpdateAddresses | undefined;
export type FunctionDeleteAddressesTypeof = typeof DeleteAddresses | undefined;
export type FunctionNextPageTypeof = (() => void) | undefined;
export type FunctionPreviousPageTypeof = (() => void) | undefined;

export function useAddressesService(take: number = 10) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const skip = 1;

  const [uri, setURI] = useState<string>(`${process.env.NEXT_PUBLIC_API_HOST}/addresses?take=${take}`);

  const [lastCursorId, setLastCursorId] = useState<number>(0);

  const { data, error, mutate } = useSWR<
    ApiResponseSuccessType<AddressType[]>,
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
          setURI(`${process.env.NEXT_PUBLIC_API_HOST}/addresses?skip=${skip}&take=${take}&cursorId=${cursorId}`);
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

        setURI(`${process.env.NEXT_PUBLIC_API_HOST}/addresses${query}`);
      },
      update: async (id: string, newData: DataAddress): Promise<boolean> => {
        const uri = `${process.env.NEXT_PUBLIC_API_HOST}/address/${id}`;

        const updateData = await fetcherAxiosPut<DataAddress, ApiResponseSuccessOrErrorType<AddressType, Object>>(uri, setIsLoading, newData);

        if (!updateData.success) {
          Alerting.create('error', updateData.message);
          console.error(updateData);

          return false;
        } else {
          mutate({
            success: true,
            data: data.data.map(address => {
              if (address.id === id) {
                address = updateData.data;
              }

              return address;
            })
          });
        }

        return true;
      },
      delete: async (id: string): Promise<boolean> => {
        const uri = `${process.env.NEXT_PUBLIC_API_HOST}/address/${id}`;

        const deleteData = await fetcherAxiosDelete<ApiResponseErrorType<Object>>(uri, setIsLoading);

        if (!deleteData.success) {
          Alerting.create('error', deleteData.message);
          console.error(deleteData);

          return false;
        } else {
          mutate({
            success: true,
            data: data.data.filter(address => address.id !== id)
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