import { useState } from 'react';
import useSWR, { useSWRConfig } from 'swr'

import { fetcherAxiosPost } from '@/src/utils/fetcherAxiosPost';
import { fetcherAxiosGet } from '@/src/utils/fetcherAxiosGet';
import { fetcherAxiosPut } from '@/src/utils/fetcherAxiosPut';
import { fetcherAxiosDelete } from '@/src/utils/fetcherAxiosDelete';
import { UploadType } from '@/types/UploadType'
import { ApiResponseSuccessType } from '@/types/ApiResponseSuccessType';
import { ApiResponseErrorType } from '@/types/ApiResponseErrorType';
import { ApiResponseSuccessOrErrorType } from '@/types/ApiResponseSuccessOrErrorType';

import Alerting from '@/src/utils/alerting';

export type DataUpload = Pick<UploadType,
  | 'fileId'
  | 'authorId'
  | 'filename'
  | 'filetype'
  | 'description'
  | 'size'
  | 'compressedSize'
  | 'version'
  | 'temporary'
  | 'expiredAt'
>;

declare function CreateUpload(data: DataUpload): Promise<ResponseCreateUpload>
declare function SetUpload(data: ResponseCreateUpload): void
declare function UpdateUpload(newData: DataUpload): Promise<boolean>
declare function DeleteUpload(): Promise<boolean>

export type ResponseCreateUpload = {
  data: UploadType
  update: typeof UpdateUpload
  delete: typeof DeleteUpload
} | undefined

export type FunctionCreateUploadTypeof = typeof CreateUpload;
export type FunctionSetUploadTypeof = typeof SetUpload;
export type FunctionUpdateUploadTypeof = typeof UpdateUpload | undefined;
export type FunctionDeleteUploadTypeof = typeof DeleteUpload  | undefined;

export function useUploadService(id?: string) {
  const { mutate } = useSWRConfig();

  const [isLoading, setIsLoading] = useState<boolean>(id ? true : false);

  const create = async (data: DataUpload) => {
    const createUpdate = await fetcherAxiosPost<DataUpload, ApiResponseSuccessOrErrorType<UploadType, Object>>(`${process.env.NEXT_PUBLIC_API_HOST}/upload`, setIsLoading, data);

    if (!createUpdate.success) {
      Alerting.create('error', createUpdate.message);
      console.error(createUpdate);
      return undefined;
    }

    const uri = `${process.env.NEXT_PUBLIC_API_HOST}/upload/${createUpdate.data.id}`;

    return {
      data: createUpdate.data,
      update: async (newData: DataUpload): Promise<boolean> => {
        const updateData = await fetcherAxiosPut<DataUpload, ApiResponseSuccessOrErrorType<UploadType, Object>>(uri, setIsLoading, newData);

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
    const uri = `${process.env.NEXT_PUBLIC_API_HOST}/upload/${id}`;

    const { data, error, mutate } = useSWR<
      ApiResponseSuccessType<UploadType | undefined>,
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
        update: async (newData: DataUpload): Promise<boolean> => {
          const updateData = await fetcherAxiosPut<DataUpload, ApiResponseSuccessOrErrorType<UploadType, Object>>(uri, setIsLoading, newData);

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