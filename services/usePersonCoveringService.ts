import { useState } from 'react';
import useSWR, { useSWRConfig } from 'swr'

import { fetcherAxiosPost } from '@/src/utils/fetcherAxiosPost';
import { fetcherAxiosGet } from '@/src/utils/fetcherAxiosGet';
import { fetcherAxiosPut } from '@/src/utils/fetcherAxiosPut';
import { fetcherAxiosDelete } from '@/src/utils/fetcherAxiosDelete';
import { PersonCoveringType } from '@/types/PersonCoveringType'
import { ApiResponseSuccessType } from '@/types/ApiResponseSuccessType';
import { ApiResponseErrorType } from '@/types/ApiResponseErrorType';
import { ApiResponseSuccessOrErrorType } from '@/types/ApiResponseSuccessOrErrorType';

import Alerting from '@/src/utils/alerting';

export type DataPersonCovering = Pick<PersonCoveringType,
  | 'mirrorId'
  | 'personId'
  | 'reasonForAbsenceId'
>;

declare function CreatePersonCovering(data: DataPersonCovering): Promise<ResponseCreatePersonCovering>
declare function SetPersonCovering(data: ResponseCreatePersonCovering): void
declare function UpdatePersonCovering(newData: DataPersonCovering): Promise<boolean>
declare function DeletePersonCovering(): Promise<boolean>

export type ResponseCreatePersonCovering = {
  data: PersonCoveringType
  update: typeof UpdatePersonCovering
  delete: typeof DeletePersonCovering
} | undefined

export type FunctionCreatePersonCoveringTypeof = typeof CreatePersonCovering;
export type FunctionSetPersonCoveringTypeof = typeof SetPersonCovering;
export type FunctionUpdatePersonCoveringTypeof = typeof UpdatePersonCovering | undefined;
export type FunctionDeletePersonCoveringTypeof = typeof DeletePersonCovering | undefined;

export function usePersonCoveringService(id?: string) {
  const { mutate } = useSWRConfig();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const create = async (data: DataPersonCovering) => {
    const createUpdate = await fetcherAxiosPost<DataPersonCovering, ApiResponseSuccessOrErrorType<PersonCoveringType, Object>>(`${process.env.NEXT_PUBLIC_API_HOST}/person_covering`, setIsLoading, data);

    if (!createUpdate.success) {
      Alerting.create('error', createUpdate.message);
      console.error(createUpdate);
      return undefined;
    }

    const uri = `${process.env.NEXT_PUBLIC_API_HOST}/person_covering/${createUpdate.data.id}`;

    return {
      data: createUpdate.data,
      update: async (newData: DataPersonCovering): Promise<boolean> => {
        const updateData = await fetcherAxiosPut<DataPersonCovering, ApiResponseSuccessOrErrorType<PersonCoveringType, Object>>(uri, setIsLoading, newData);

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
    const uri = `${process.env.NEXT_PUBLIC_API_HOST}/person_covering/${id}`;

    const { data, error, mutate } = useSWR<
      ApiResponseSuccessType<PersonCoveringType | undefined>,
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
        update: async (newData: DataPersonCovering): Promise<boolean> => {
          const updateData = await fetcherAxiosPut<DataPersonCovering, ApiResponseSuccessOrErrorType<PersonCoveringType, Object>>(uri, setIsLoading, newData);

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