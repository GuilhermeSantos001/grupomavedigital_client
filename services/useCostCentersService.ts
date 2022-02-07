import { useState } from 'react';
import useSWR from 'swr'

import { fetcherAxiosGet } from '@/src/utils/fetcherAxiosGet';
import { fetcherAxiosPut } from '@/src/utils/fetcherAxiosPut';
import { fetcherAxiosDelete } from '@/src/utils/fetcherAxiosDelete';
import { CostCenterType } from '@/types/CostCenterType'
import { ApiResponseSuccessType } from '@/types/ApiResponseSuccessType';
import { ApiResponseErrorType } from '@/types/ApiResponseErrorType';
import { ApiResponseSuccessOrErrorType } from '@/types/ApiResponseSuccessOrErrorType';

import Alerting from '@/src/utils/alerting';

declare function UpdateCostCenters(id: string, newData: Pick<CostCenterType, 'value'>): Promise<boolean>
declare function DeleteCostCenters(id: string): Promise<boolean>

export type FunctionUpdateCostCentersTypeof = typeof UpdateCostCenters | undefined;
export type FunctionDeleteCostCentersTypeof = typeof DeleteCostCenters | undefined;
export type FunctionNextPageTypeof = (() => void) | undefined;
export type FunctionPreviousPageTypeof = (() => void) | undefined;

export function useCostCentersService(take: number = 10) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const skip = 1;

  const [uri, setURI] = useState<string>(`${process.env.NEXT_PUBLIC_API_HOST}/costcenters?take=${take}`);

  const [lastCursorId, setLastCursorId] = useState<number>(0);

  const { data, error, mutate } = useSWR<
    ApiResponseSuccessType<CostCenterType[]>,
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
          setURI(`${process.env.NEXT_PUBLIC_API_HOST}/costcenters?skip=${skip}&take=${take}&cursorId=${cursorId}`);
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

        setURI(`${process.env.NEXT_PUBLIC_API_HOST}/costcenters${query}`);
      },
      update: async (id: string, newData: Pick<CostCenterType, 'value'>): Promise<boolean> => {
        const uri = `${process.env.NEXT_PUBLIC_API_HOST}/costcenter/${id}`;

        const updateData = await fetcherAxiosPut<Pick<CostCenterType, 'value'>, ApiResponseSuccessOrErrorType<CostCenterType, Object>>(uri, setIsLoading, newData);

        if (!updateData.success) {
          Alerting.create('error', updateData.message);
          console.error(updateData);

          return false;
        } {
          mutate({
            success: true,
            data: data.data.map(costCenter => {
              if (costCenter.id === id) {
                costCenter = updateData.data;
              }

              return costCenter;
            })
          });
        }

        return true;
      },
      delete: async (id: string): Promise<boolean> => {
        const uri = `${process.env.NEXT_PUBLIC_API_HOST}/costcenter/${id}`;

        const deleteData = await fetcherAxiosDelete<ApiResponseErrorType<Object>>(uri, setIsLoading);

        if (!deleteData.success) {
          Alerting.create('error', deleteData.message);
          console.error(deleteData);

          return false;
        } else {
          mutate({
            success: true,
            data: data.data.filter(costCenter => costCenter.id !== id)
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