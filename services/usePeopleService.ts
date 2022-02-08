import { useState } from 'react';
import useSWR from 'swr'

import { fetcherAxiosGet } from '@/src/utils/fetcherAxiosGet';
import { fetcherAxiosPut } from '@/src/utils/fetcherAxiosPut';
import { fetcherAxiosDelete } from '@/src/utils/fetcherAxiosDelete';
import { PersonType } from '@/types/PersonType'
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

declare function UpdatePeople(id: string, newData: DataPerson): Promise<boolean>
declare function DeletePeople(id: string): Promise<boolean>

export type FunctionUpdatePeopleTypeof = typeof UpdatePeople | undefined;
export type FunctionDeletePeopleTypeof = typeof DeletePeople | undefined;
export type FunctionNextPageTypeof = (() => void) | undefined;
export type FunctionPreviousPageTypeof = (() => void) | undefined;

export function usePeopleService(take: number = 10) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const skip = 1;

  const [uri, setURI] = useState<string>(`${process.env.NEXT_PUBLIC_API_HOST}/people?take=${take}`);

  const [lastCursorId, setLastCursorId] = useState<number>(0);

  const { data, error, mutate } = useSWR<
    ApiResponseSuccessType<PersonType[]>,
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
          setURI(`${process.env.NEXT_PUBLIC_API_HOST}/people?skip=${skip}&take=${take}&cursorId=${cursorId}`);
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

        setURI(`${process.env.NEXT_PUBLIC_API_HOST}/people${query}`);
      },
      update: async (id: string, newData: DataPerson): Promise<boolean> => {
        const uri = `${process.env.NEXT_PUBLIC_API_HOST}/person/${id}`;

        const updateData = await fetcherAxiosPut<DataPerson, ApiResponseSuccessOrErrorType<PersonType, Object>>(uri, setIsLoading, newData);

        if (!updateData.success) {
          Alerting.create('error', updateData.message);
          console.error(updateData);

          return false;
        } else {
          mutate({
            success: true,
            data: data.data.map(person => {
              if (person.id === id) {
                person = updateData.data;
              }

              return person;
            })
          });
        }

        return true;
      },
      delete: async (id: string): Promise<boolean> => {
        const uri = `${process.env.NEXT_PUBLIC_API_HOST}/person/${id}`;

        const deleteData = await fetcherAxiosDelete<ApiResponseErrorType<Object>>(uri, setIsLoading);

        if (!deleteData.success) {
          Alerting.create('error', deleteData.message);
          console.error(deleteData);

          return false;
        } else {
          mutate({
            success: true,
            data: data.data.filter(person => person.id !== id)
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