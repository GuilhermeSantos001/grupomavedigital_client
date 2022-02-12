import { useState } from 'react';
import useSWR, { useSWRConfig } from 'swr'

import { fetcherAxiosPost } from '@/src/utils/fetcherAxiosPost';
import { fetcherAxiosGet } from '@/src/utils/fetcherAxiosGet';
import { fetcherAxiosPut } from '@/src/utils/fetcherAxiosPut';
import { fetcherAxiosDelete } from '@/src/utils/fetcherAxiosDelete';
import { PersonType } from '@/types/PersonType';
import { ApiResponseSuccessType } from '@/types/ApiResponseSuccessType';
import { ApiResponseErrorType } from '@/types/ApiResponseErrorType';
import { ApiResponseSuccessOrErrorType } from '@/types/ApiResponseSuccessOrErrorType';

import Alerting from '@/src/utils/alerting';

export type DataPerson = Pick<PersonType,
  | 'matricule'
  | 'name'
  | 'cpf'
  | 'rg'
  | 'birthDate'
  | 'motherName'
  | 'mail'
  | 'phone'
  | 'addressId'
  | 'scaleId'
  | 'status'
>;

declare function CreatePerson(data: DataPerson): Promise<ResponseCreatePerson>
declare function SetPerson(data: ResponseCreatePerson): void
declare function UpdatePerson(newData: DataPerson): Promise<boolean>
declare function DeletePerson(): Promise<boolean>

export type ResponseCreatePerson = {
  data: PersonType
  update: typeof UpdatePerson
  delete: typeof DeletePerson
} | undefined

export type FunctionCreatePersonTypeof = typeof CreatePerson;
export type FunctionSetPersonTypeof = typeof SetPerson;
export type FunctionUpdatePersonTypeof = typeof UpdatePerson | undefined;
export type FunctionDeletePersonTypeof = typeof DeletePerson | undefined;

export function usePersonService(id?: string) {
  const { mutate } = useSWRConfig();

  const [isLoading, setIsLoading] = useState<boolean>(id ? true : false);

  const create = async (data: DataPerson) => {
    const createUpdate = await fetcherAxiosPost<DataPerson, ApiResponseSuccessOrErrorType<PersonType, Object>>(`${process.env.NEXT_PUBLIC_API_HOST}/person`, setIsLoading, data);

    if (!createUpdate.success) {
      Alerting.create('error', createUpdate.message);
      console.error(createUpdate);
      return undefined;
    }

    const uri = `${process.env.NEXT_PUBLIC_API_HOST}/person/${createUpdate.data.id}`;

    return {
      data: createUpdate.data,
      update: async (newData: DataPerson): Promise<boolean> => {
        const updateData = await fetcherAxiosPut<DataPerson, ApiResponseSuccessOrErrorType<PersonType, Object>>(uri, setIsLoading, newData);

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
    const uri = `${process.env.NEXT_PUBLIC_API_HOST}/person/${id}`;

    const { data, error, mutate } = useSWR<
      ApiResponseSuccessType<PersonType | undefined>,
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
        update: async (newData: DataPerson): Promise<boolean> => {
          const updateData = await fetcherAxiosPut<DataPerson, ApiResponseSuccessOrErrorType<PersonType, Object>>(uri, setIsLoading, newData);

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