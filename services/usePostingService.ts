import { useState } from 'react';
import useSWR, { useSWRConfig } from 'swr'

import { fetcherAxiosPost } from '@/src/utils/fetcherAxiosPost';
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

declare function CreatePosting(data: DataPosting): Promise<ResponseCreatePosting>
declare function SetPosting(data: ResponseCreatePosting): void
declare function UpdatePosting(newData: DataPosting): Promise<boolean>
declare function DeletePosting(): Promise<boolean>

export type ResponseCreatePosting = {
  data: PostingType
  update: typeof UpdatePosting
  delete: typeof DeletePosting
} | undefined

export type FunctionCreatePostingTypeof = typeof CreatePosting;
export type FunctionSetPostingTypeof = typeof SetPosting;
export type FunctionUpdatePostingTypeof = typeof UpdatePosting | undefined;
export type FunctionDeletePostingTypeof = typeof DeletePosting | undefined;

export function usePostingService(id?: string) {
  const { mutate } = useSWRConfig();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const create = async (data: DataPosting) => {
    const createUpdate = await fetcherAxiosPost<DataPosting, ApiResponseSuccessOrErrorType<PostingType, Object>>(`${process.env.NEXT_PUBLIC_API_HOST}/posting`, setIsLoading, data);

    if (!createUpdate.success) {
      Alerting.create('error', createUpdate.message);
      console.error(createUpdate);
      return undefined;
    }

    const uri = `${process.env.NEXT_PUBLIC_API_HOST}/posting/${createUpdate.data.id}`;

    return {
      data: createUpdate.data,
      update: async (newData: DataPosting): Promise<boolean> => {
        const updateData = await fetcherAxiosPut<DataPosting, ApiResponseSuccessOrErrorType<PostingType, Object>>(uri, setIsLoading, newData);

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
    const uri = `${process.env.NEXT_PUBLIC_API_HOST}/posting/${id}`;

    const { data, error, mutate } = useSWR<
      ApiResponseSuccessType<PostingType | undefined>,
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
        update: async (newData: DataPosting): Promise<boolean> => {
          const updateData = await fetcherAxiosPut<DataPosting, ApiResponseSuccessOrErrorType<PostingType, Object>>(uri, setIsLoading, newData);

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