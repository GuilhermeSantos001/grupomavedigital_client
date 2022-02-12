import { useState } from 'react';
import useSWR from 'swr'

import { fetcherAxiosGet } from '@/src/utils/fetcherAxiosGet';
import { fetcherAxiosPut } from '@/src/utils/fetcherAxiosPut';
import { fetcherAxiosDelete } from '@/src/utils/fetcherAxiosDelete';
import { ReasonForAbsenceType } from '@/types/ReasonForAbsenceType'
import { ApiResponseSuccessType } from '@/types/ApiResponseSuccessType';
import { ApiResponseErrorType } from '@/types/ApiResponseErrorType';
import { ApiResponseSuccessOrErrorType } from '@/types/ApiResponseSuccessOrErrorType';

import Alerting from '@/src/utils/alerting';

export type DataReasonForAbsence = Pick<ReasonForAbsenceType, 'value'>;

declare function UpdateReasonForAbsence(id: string, newData: DataReasonForAbsence): Promise<boolean>
declare function DeleteReasonForAbsence(id: string): Promise<boolean>

export type FunctionUpdateReasonForAbsencesTypeof = typeof UpdateReasonForAbsence | undefined;
export type FunctionDeleteReasonForAbsencesTypeof = typeof DeleteReasonForAbsence | undefined;
export type FunctionNextPageTypeof = (() => void) | undefined;
export type FunctionPreviousPageTypeof = (() => void) | undefined;

export function useReasonForAbsencesService(take: number = 10, refreshInterval: number = 1000) {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const skip = 1;

  const [uri, setURI] = useState<string>(`${process.env.NEXT_PUBLIC_API_HOST}/reasonforabsences?take=${take}`);

  const [lastCursorId, setLastCursorId] = useState<number>(0);

  const { data, error, mutate } = useSWR<
    ApiResponseSuccessType<ReasonForAbsenceType[]>,
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
          setURI(`${process.env.NEXT_PUBLIC_API_HOST}/reasonforabsences?skip=${skip}&take=${take}&cursorId=${cursorId}`);
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

        setURI(`${process.env.NEXT_PUBLIC_API_HOST}/reasonforabsences${query}`);
      },
      update: async (id: string, newData: DataReasonForAbsence): Promise<boolean> => {
        const uri = `${process.env.NEXT_PUBLIC_API_HOST}/reasonforabsence/${id}`;

        const updateData = await fetcherAxiosPut<DataReasonForAbsence, ApiResponseSuccessOrErrorType<ReasonForAbsenceType, Object>>(uri, setIsLoading, newData);

        if (!updateData.success) {
          Alerting.create('error', updateData.message);
          console.error(updateData);

          return false;
        } else {
          mutate({
            success: true,
            data: data.data.map(reasonforabsence => {
              if (reasonforabsence.id === id) {
                reasonforabsence = updateData.data;
              }

              return reasonforabsence;
            })
          });
        }

        return true;
      },
      delete: async (id: string): Promise<boolean> => {
        const uri = `${process.env.NEXT_PUBLIC_API_HOST}/reasonforabsence/${id}`;

        const deleteData = await fetcherAxiosDelete<ApiResponseErrorType<Object>>(uri, setIsLoading);

        if (!deleteData.success) {
          Alerting.create('error', deleteData.message);
          console.error(deleteData);

          return false;
        } else {
          mutate({
            success: true,
            data: data.data.filter(reasonforabsence => reasonforabsence.id !== id)
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