import { useState } from 'react';
import useSWR, { useSWRConfig } from 'swr'

import { fetcherAxiosPost } from '@/src/utils/fetcherAxiosPost';
import { fetcherAxiosGet } from '@/src/utils/fetcherAxiosGet';
import { fetcherAxiosDelete } from '@/src/utils/fetcherAxiosDelete';
import { APIKeyType } from '@/types/APIKeyType'
import { ApiResponseSuccessType } from '@/types/ApiResponseSuccessType';
import { ApiResponseErrorType } from '@/types/ApiResponseErrorType';
import { ApiResponseSuccessOrErrorType } from '@/types/ApiResponseSuccessOrErrorType';

import Alerting from '@/src/utils/alerting';

export type ResponseAPIKey = {
  data: APIKeyType
  delete: typeof DeleteAPIKey
} | undefined

export type DataAPIKey = Pick<APIKeyType, 'title' | 'key' | 'passphrase' | 'username' | 'userMail'>;

declare function CreateAPIKey(key: DataAPIKey): Promise<ResponseAPIKey>
declare function SetAPIKey(key: ResponseAPIKey): void
declare function DeleteAPIKey(): Promise<boolean>

export type FunctionCreateAPIKeyTypeof = typeof CreateAPIKey;
export type FunctionSetAPIKeyTypeof = typeof SetAPIKey;
export type FunctionDeleteAPIKeyTypeof = typeof DeleteAPIKey | undefined;

export function useAPIKeyService(passphrase?: string) {
  const { mutate } = useSWRConfig();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const create = async (data: DataAPIKey) => {
    const createUpdate = await fetcherAxiosPost<DataAPIKey, ApiResponseSuccessOrErrorType<APIKeyType, Object>>(`${process.env.NEXT_PUBLIC_API_HOST}/security/key`, setIsLoading, data);

    if (!createUpdate.success) {
      Alerting.create('error', createUpdate.message);
      console.error(createUpdate);
      return undefined;
    }

    const uri = `${process.env.NEXT_PUBLIC_API_HOST}/security/key/${createUpdate.data.passphrase}`;

    return {
      data: createUpdate.data,
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

  if (passphrase) {
    const uri = `${process.env.NEXT_PUBLIC_API_HOST}/security/key/${passphrase}`;

    const { data, error, mutate } = useSWR<
      ApiResponseSuccessType<APIKeyType | undefined>,
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