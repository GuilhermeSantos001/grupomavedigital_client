import { useState } from 'react';
import useSWR from 'swr'

import { fetcherAxiosGet } from '@/src/utils/fetcherAxiosGet';
import { fetcherAxiosPut } from '@/src/utils/fetcherAxiosPut';
import { fetcherAxiosDelete } from '@/src/utils/fetcherAxiosDelete';
import { PostingType } from '@/types/PostingType';
import { ApiResponseSuccessType } from '@/types/ApiResponseSuccessType';
import { ApiResponseErrorType } from '@/types/ApiResponseErrorType';
import { ApiResponseSuccessOrErrorType } from '@/types/ApiResponseSuccessOrErrorType';

import Alerting from '@/src/utils/alerting';

export type DataPosting = Pick<PostingType,
  | 'author'
  | 'costCenterId'
  | 'periodStart'
  | 'periodEnd'
  | 'originDate'
  | 'description'
  | 'coveringId'
  | 'coverageId'
  | 'coveringWorkplaceId'
  | 'coverageWorkplaceId'
  | 'paymentMethod'
  | 'paymentValue'
  | 'paymentDatePayable'
  | 'paymentStatus'
  | 'paymentDatePaid'
  | 'paymentDateCancelled'
  | 'foremanApproval'
  | 'managerApproval'
  | 'status'
>;

declare function UpdatePostings(id: string, newData: DataPosting): Promise<boolean>
declare function DeletePostings(id: string): Promise<boolean>

export type FunctionUpdatePostingsTypeof = typeof UpdatePostings | undefined;
export type FunctionDeletePostingsTypeof = typeof DeletePostings | undefined;
export type FunctionNextPageTypeof = (() => void) | undefined;
export type FunctionPreviousPageTypeof = (() => void) | undefined;

export function usePostingsService(take: number = 10) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const skip = 1;

  const [uri, setURI] = useState<string>(`${process.env.NEXT_PUBLIC_API_HOST}/postings?take=${take}`);

  const [lastCursorId, setLastCursorId] = useState<number>(0);

  const { data, error, mutate } = useSWR<
    ApiResponseSuccessType<PostingType[]>,
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
          setURI(`${process.env.NEXT_PUBLIC_API_HOST}/postings?skip=${skip}&take=${take}&cursorId=${cursorId}`);
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

        setURI(`${process.env.NEXT_PUBLIC_API_HOST}/postings${query}`);
      },
      update: async (id: string, newData: DataPosting): Promise<boolean> => {
        const uri = `${process.env.NEXT_PUBLIC_API_HOST}/posting/${id}`;

        const updateData = await fetcherAxiosPut<DataPosting, ApiResponseSuccessOrErrorType<PostingType, Object>>(uri, setIsLoading, newData);

        if (!updateData.success) {
          Alerting.create('error', updateData.message);
          console.error(updateData);

          return false;
        } else {
          mutate({
            success: true,
            data: data.data.map(posting => {
              if (posting.id === id) {
                posting = updateData.data;
              }

              return posting;
            })
          });
        }

        return true;
      },
      delete: async (id: string): Promise<boolean> => {
        const uri = `${process.env.NEXT_PUBLIC_API_HOST}/posting/${id}`;

        const deleteData = await fetcherAxiosDelete<ApiResponseErrorType<Object>>(uri, setIsLoading);

        if (!deleteData.success) {
          Alerting.create('error', deleteData.message);
          console.error(deleteData);

          return false;
        } else {
          mutate({
            success: true,
            data: data.data.filter(posting => posting.id !== id)
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