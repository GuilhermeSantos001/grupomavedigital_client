import { useState } from 'react';
import useSWR from 'swr'

import { fetcherAxiosGet } from '@/src/utils/fetcherAxiosGet';
import { fetcherAxiosPut } from '@/src/utils/fetcherAxiosPut';
import { fetcherAxiosDelete } from '@/src/utils/fetcherAxiosDelete';
import { DistrictType } from '@/types/DistrictType'
import { ApiResponseSuccessType } from '@/types/ApiResponseSuccessType';
import { ApiResponseErrorType } from '@/types/ApiResponseErrorType';
import { ApiResponseSuccessOrErrorType } from '@/types/ApiResponseSuccessOrErrorType';

import Alerting from '@/src/utils/alerting';

export type DataDistrict = Pick<DistrictType, 'value'>;

declare function UpdateDistricts(id: string, newData: DataDistrict): Promise<boolean>
declare function DeleteDistricts(id: string): Promise<boolean>

export type FunctionUpdateDistrictsTypeof = typeof UpdateDistricts | undefined;
export type FunctionDeleteDistrictsTypeof = typeof DeleteDistricts | undefined;
export type FunctionNextPageTypeof = (() => void) | undefined;
export type FunctionPreviousPageTypeof = (() => void) | undefined;

export function useDistrictsService(take: number = 10, refreshInterval: number = 1000) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const skip = 1;

  const [uri, setURI] = useState<string>(`${process.env.NEXT_PUBLIC_API_HOST}/districts?take=${take}`);

  const [lastCursorId, setLastCursorId] = useState<number>(0);

  const { data, error, mutate } = useSWR<
    ApiResponseSuccessType<DistrictType[]>,
    ApiResponseErrorType<Object>
  >([uri, setIsLoading], fetcherAxiosGet, { refreshInterval })

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
          setURI(`${process.env.NEXT_PUBLIC_API_HOST}/districts?skip=${skip}&take=${take}&cursorId=${cursorId}`);
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

        setURI(`${process.env.NEXT_PUBLIC_API_HOST}/districts${query}`);
      },
      update: async (id: string, newData: DataDistrict): Promise<boolean> => {
        const uri = `${process.env.NEXT_PUBLIC_API_HOST}/district/${id}`;

        const updateData = await fetcherAxiosPut<DataDistrict, ApiResponseSuccessOrErrorType<DistrictType, Object>>(uri, setIsLoading, newData);

        if (!updateData.success) {
          Alerting.create('error', updateData.message);
          console.error(updateData);

          return false;
        } else {
          mutate({
            success: true,
            data: data.data.map(district => {
              if (district.id === id) {
                district = updateData.data;
              }

              return district;
            })
          });
        }

        return true;
      },
      delete: async (id: string): Promise<boolean> => {
        const uri = `${process.env.NEXT_PUBLIC_API_HOST}/district/${id}`;

        const deleteData = await fetcherAxiosDelete<ApiResponseErrorType<Object>>(uri, setIsLoading);

        if (!deleteData.success) {
          Alerting.create('error', deleteData.message);
          console.error(deleteData);

          return false;
        } else {
          mutate({
            success: true,
            data: data.data.filter(district => district.id !== id)
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