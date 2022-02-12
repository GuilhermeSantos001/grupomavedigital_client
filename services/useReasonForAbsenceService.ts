import { useState } from 'react';
import useSWR, { useSWRConfig } from 'swr'

import { fetcherAxiosPost } from '@/src/utils/fetcherAxiosPost';
import { fetcherAxiosGet } from '@/src/utils/fetcherAxiosGet';
import { fetcherAxiosPut } from '@/src/utils/fetcherAxiosPut';
import { fetcherAxiosDelete } from '@/src/utils/fetcherAxiosDelete';
import { ReasonForAbsenceType } from '@/types/ReasonForAbsenceType'
import { ApiResponseSuccessType } from '@/types/ApiResponseSuccessType';
import { ApiResponseErrorType } from '@/types/ApiResponseErrorType';
import { ApiResponseSuccessOrErrorType } from '@/types/ApiResponseSuccessOrErrorType';

import Alerting from '@/src/utils/alerting';

export type DataReasonForAbsence = Pick<ReasonForAbsenceType, 'value'>;

declare function CreateReasonForAbsence(data: DataReasonForAbsence): Promise<ResponseCreateReasonForAbsence>
declare function SetReasonForAbsence(data: ResponseCreateReasonForAbsence): void
declare function UpdateReasonForAbsence(newData: DataReasonForAbsence): Promise<boolean>
declare function DeleteReasonForAbsence(): Promise<boolean>

export type ResponseCreateReasonForAbsence = {
  data: ReasonForAbsenceType
  update: typeof UpdateReasonForAbsence
  delete: typeof DeleteReasonForAbsence
} | undefined

export type FunctionCreateReasonForAbsenceTypeof = typeof CreateReasonForAbsence;
export type FunctionSetReasonForAbsenceTypeof = typeof SetReasonForAbsence;
export type FunctionUpdateReasonForAbsenceTypeof = typeof UpdateReasonForAbsence | undefined;
export type FunctionDeleteReasonForAbsenceTypeof = typeof DeleteReasonForAbsence | undefined;

export function useReasonForAbsenceService(id?: string) {
  const { mutate } = useSWRConfig();

  const [isLoading, setIsLoading] = useState<boolean>(id ? true : false);

  const create = async (data: DataReasonForAbsence) => {
    const createUpdate = await fetcherAxiosPost<DataReasonForAbsence, ApiResponseSuccessOrErrorType<ReasonForAbsenceType, Object>>(`${process.env.NEXT_PUBLIC_API_HOST}/reasonforabsence`, setIsLoading, data);

    if (!createUpdate.success) {
      Alerting.create('error', createUpdate.message);
      console.error(createUpdate);
      return undefined;
    }

    const uri = `${process.env.NEXT_PUBLIC_API_HOST}/reasonforabsence/${createUpdate.data.id}`;

    return {
      data: createUpdate.data,
      update: async (newData: DataReasonForAbsence): Promise<boolean> => {
        const updateData = await fetcherAxiosPut<DataReasonForAbsence, ApiResponseSuccessOrErrorType<ReasonForAbsenceType, Object>>(uri, setIsLoading, newData);

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
    const uri = `${process.env.NEXT_PUBLIC_API_HOST}/reasonforabsence/${id}`;

    const { data, error, mutate } = useSWR<
      ApiResponseSuccessType<ReasonForAbsenceType | undefined>,
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
        update: async (newData: DataReasonForAbsence): Promise<boolean> => {
          const updateData = await fetcherAxiosPut<DataReasonForAbsence, ApiResponseSuccessOrErrorType<ReasonForAbsenceType, Object>>(uri, setIsLoading, newData);

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