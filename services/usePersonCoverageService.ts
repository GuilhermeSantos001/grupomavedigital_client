import { useState } from 'react';
import useSWR, { useSWRConfig } from 'swr'

import { fetcherAxiosPost } from '@/src/utils/fetcherAxiosPost';
import { fetcherAxiosGet } from '@/src/utils/fetcherAxiosGet';
import { fetcherAxiosPut } from '@/src/utils/fetcherAxiosPut';
import { fetcherAxiosDelete } from '@/src/utils/fetcherAxiosDelete';
import { PersonCoverageType } from '@/types/PersonCoverageType';
import { ApiResponseSuccessType } from '@/types/ApiResponseSuccessType';
import { ApiResponseErrorType } from '@/types/ApiResponseErrorType';
import { ApiResponseSuccessOrErrorType } from '@/types/ApiResponseSuccessOrErrorType';

import Alerting from '@/src/utils/alerting';

export type DataPersonCoverage = Pick<PersonCoverageType,
  | 'mirrorId'
  | 'personId'
  | 'modalityOfCoverage'
>;

declare function CreatePersonCoverage(data: DataPersonCoverage): Promise<ResponseCreatePersonCoverage>
declare function SetPersonCoverage(data: ResponseCreatePersonCoverage): void
declare function UpdatePersonCoverage(newData: DataPersonCoverage): Promise<boolean>
declare function DeletePersonCoverage(): Promise<boolean>

export type ResponseCreatePersonCoverage = {
  data: PersonCoverageType
  update: typeof UpdatePersonCoverage
  delete: typeof DeletePersonCoverage
} | undefined

export type FunctionCreatePersonCoverageTypeof = typeof CreatePersonCoverage;
export type FunctionSetPersonCoverageTypeof = typeof SetPersonCoverage;
export type FunctionUpdatePersonCoverageTypeof = typeof UpdatePersonCoverage | undefined;
export type FunctionDeletePersonCoverageTypeof = typeof DeletePersonCoverage | undefined;

export function usePersonCoverageService(id?: string) {
  const { mutate } = useSWRConfig();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const create = async (data: DataPersonCoverage) => {
    const createUpdate = await fetcherAxiosPost<DataPersonCoverage, ApiResponseSuccessOrErrorType<PersonCoverageType, Object>>(`${process.env.NEXT_PUBLIC_API_HOST}/person_coverage`, setIsLoading, data);

    if (!createUpdate.success) {
      Alerting.create('error', createUpdate.message);
      console.error(createUpdate);
      return undefined;
    }

    const uri = `${process.env.NEXT_PUBLIC_API_HOST}/person_coverage/${createUpdate.data.id}`;

    return {
      data: createUpdate.data,
      update: async (newData: DataPersonCoverage): Promise<boolean> => {
        const updateData = await fetcherAxiosPut<DataPersonCoverage, ApiResponseSuccessOrErrorType<PersonCoverageType, Object>>(uri, setIsLoading, newData);

        if (!updateData.success) {
          Alerting.create('error', updateData.message);
          console.error(updateData);

          return false;
        } else {
          mutate([uri, setIsLoading], {
            success: true,
            data: {...createUpdate.data, ...updateData.data}
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
    const uri = `${process.env.NEXT_PUBLIC_API_HOST}/person_coverage/${id}`;

    const { data, error, mutate } = useSWR<
      ApiResponseSuccessType<PersonCoverageType | undefined>,
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
        update: async (newData: DataPersonCoverage): Promise<boolean> => {
          const updateData = await fetcherAxiosPut<DataPersonCoverage, ApiResponseSuccessOrErrorType<PersonCoverageType, Object>>(uri, setIsLoading, newData);

          if (!updateData.success) {
            Alerting.create('error', updateData.message);
            console.error(updateData);

            return false;
          } else {
            mutate({
              success: true,
              data: {...data?.data, ...updateData.data}
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