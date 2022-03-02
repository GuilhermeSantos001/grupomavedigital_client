import { useState } from 'react';
import useSWR, { useSWRConfig } from 'swr'

import { fetcherAxiosPost } from '@/src/utils/fetcherAxiosPost';
import { fetcherAxiosGet } from '@/src/utils/fetcherAxiosGet';
import { fetcherAxiosPut } from '@/src/utils/fetcherAxiosPut';
import { fetcherAxiosDelete } from '@/src/utils/fetcherAxiosDelete';
import { UserType } from '@/types/UserType'
import { ApiResponseSuccessType } from '@/types/ApiResponseSuccessType';
import { ApiResponseErrorType } from '@/types/ApiResponseErrorType';
import { ApiResponseSuccessOrErrorType } from '@/types/ApiResponseSuccessOrErrorType';

import Alerting from '@/src/utils/alerting';

export type DataUser = Pick<UserType,
  | 'authorization'
  | 'name'
  | 'surname'
  | 'username'
  | 'email'
  | 'cnpj'
  | 'location'
  | 'photoProfile'
  | 'privileges'
>;

export type DataUserWithPassword = DataUser & { password: string }

declare function CreateUser(data: DataUserWithPassword): Promise<ResponseCreateUser>
declare function SetUser(data: ResponseCreateUser): void
declare function UpdateUser(newData: DataUser): Promise<boolean>
declare function DeleteUser(): Promise<boolean>

export type ResponseCreateUser = {
  data: UserType
  update: typeof UpdateUser
  delete: typeof DeleteUser
} | undefined

export type FunctionCreateUserTypeof = typeof CreateUser;
export type FunctionSetUserTypeof = typeof SetUser;
export type FunctionUpdateUserTypeof = typeof UpdateUser | undefined;
export type FunctionDeleteUserTypeof = typeof DeleteUser | undefined;

export function useUserService(auth?: string) {
  const { mutate } = useSWRConfig();

  const [isLoading, setIsLoading] = useState<boolean>(auth ? true : false);

  const create = async (data: DataUserWithPassword) => {
    const createUpdate = await fetcherAxiosPost<DataUserWithPassword, ApiResponseSuccessOrErrorType<UserType, Object>>(`${process.env.NEXT_PUBLIC_API_HOST}/user`, setIsLoading, data);

    if (!createUpdate.success) {
      Alerting.create('error', createUpdate.message);
      console.error(createUpdate);
      return undefined;
    }

    const uri = `${process.env.NEXT_PUBLIC_API_HOST}/user/${createUpdate.data.authorization}`;

    return {
      data: createUpdate.data,
      update: async (newData: DataUser): Promise<boolean> => {
        const updateData = await fetcherAxiosPut<DataUser, ApiResponseSuccessOrErrorType<UserType, Object>>(uri, setIsLoading, newData);

        if (!updateData.success) {
          Alerting.create('error', updateData.message);
          console.error(updateData);

          return false;
        } else {
          mutate([uri, setIsLoading], {
            success: true,
            data: { ...createUpdate.data, ...updateData.data }
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

  if (auth) {
    const uri = `${process.env.NEXT_PUBLIC_API_HOST}/user/${auth}`;

    const { data, error, mutate } = useSWR<
      ApiResponseSuccessType<UserType | undefined>,
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
        update: async (newData: DataUser): Promise<boolean> => {
          const updateData = await fetcherAxiosPut<DataUser, ApiResponseSuccessOrErrorType<UserType, Object>>(uri, setIsLoading, newData);

          if (!updateData.success) {
            Alerting.create('error', updateData.message);
            console.error(updateData);

            return false;
          } else {
            mutate({
              success: true,
              data: { ...data?.data, ...updateData.data }
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