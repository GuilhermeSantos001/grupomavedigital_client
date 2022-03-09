import { useState } from 'react';

import useSWR from 'swr'
import { SWRConfig } from '@/services/config/SWRConfig';

import { fetcherAxiosGet } from '@/src/utils/fetcherAxiosGet';
import { fetcherAxiosPut } from '@/src/utils/fetcherAxiosPut';
import { fetcherAxiosDelete } from '@/src/utils/fetcherAxiosDelete';
import { ApiResponseSuccessType } from '@/types/ApiResponseSuccessType';
import { ApiResponseErrorType } from '@/types/ApiResponseErrorType';
import { ApiResponseSuccessOrErrorType } from '@/types/ApiResponseSuccessOrErrorType';

import {
  UserType
} from '@/types/UserType';

import {
  DataUser
} from '@/types/UserServiceType';

import Alerting from '@/src/utils/alerting';

export function useUsersService(take: number = 10) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [uri, setURI] = useState<string>(`${process.env.NEXT_PUBLIC_API_HOST}/users?take=${take}`);
  const [lastCursorId, setLastCursorId] = useState<number>(0);

  const skip = 1;

  const { data, error, mutate } = useSWR<
    ApiResponseSuccessType<UserType[]>,
    ApiResponseErrorType<Object>
  >([uri, setIsLoading], fetcherAxiosGet, SWRConfig)

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
          setURI(`${process.env.NEXT_PUBLIC_API_HOST}/users?skip=${skip}&take=${take}`);
        }
      },
      previousPage: () => {
        const cursorId = lastCursorId - take < 0 ? 0 : lastCursorId - take;
        let query = '';

        setLastCursorId(cursorId);

        if (cursorId > 0)
          query = `?skip=${skip}&take=${take}`;
        else
          query = `?take=${take}`;

        setURI(`${process.env.NEXT_PUBLIC_API_HOST}/users${query}`);
      },
      update: async (auth: string, newData: DataUser): Promise<boolean> => {
        const uri = `${process.env.NEXT_PUBLIC_API_HOST}/user/${auth}`;

        const updateData = await fetcherAxiosPut<DataUser, ApiResponseSuccessOrErrorType<UserType, Object>>(uri, setIsLoading, newData);

        if (!updateData.success) {
          Alerting.create('error', updateData.message);
          console.error(updateData);

          return false;
        } else {
          mutate({
            success: true,
            data: data.data.map(user => {
              if (user.authorization === auth) {
                user = { ...user, ...updateData.data };
              }

              return user;
            })
          });
        }

        return true;
      },
      delete: async (auth: string): Promise<boolean> => {
        const uri = `${process.env.NEXT_PUBLIC_API_HOST}/user/${auth}`;

        const deleteData = await fetcherAxiosDelete<ApiResponseErrorType<Object>>(uri, setIsLoading);

        if (!deleteData.success) {
          Alerting.create('error', deleteData.message);
          console.error(deleteData);

          return false;
        } else {
          mutate({
            success: true,
            data: data.data.filter(user => user.authorization !== auth)
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