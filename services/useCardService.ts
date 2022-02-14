import { useState } from 'react';
import useSWR, { useSWRConfig } from 'swr'

import { fetcherAxiosPost } from '@/src/utils/fetcherAxiosPost';
import { fetcherAxiosGet } from '@/src/utils/fetcherAxiosGet';
import { fetcherAxiosPut } from '@/src/utils/fetcherAxiosPut';
import { fetcherAxiosDelete } from '@/src/utils/fetcherAxiosDelete';
import { CardType } from '@/types/CardType'
import { ApiResponseSuccessType } from '@/types/ApiResponseSuccessType';
import { ApiResponseErrorType } from '@/types/ApiResponseErrorType';
import { ApiResponseSuccessOrErrorType } from '@/types/ApiResponseSuccessOrErrorType';

import Alerting from '@/src/utils/alerting';

export type DataCard = Pick<CardType,
  | 'costCenterId'
  | 'lotNum'
  | 'serialNumber'
  | 'lastCardNumber'
  | 'status'
>;

export type DataPersonId = Pick<CardType, 'personId'>;

declare function CreateCard(data: DataCard): Promise<ResponseCreateCard>
declare function SetCard(data: ResponseCreateCard): void
declare function UpdateCard(newData: DataCard): Promise<boolean>
declare function AssignPersonCard(data: DataPersonId): Promise<boolean>
declare function UnassignPersonCard(): Promise<boolean>
declare function DeleteCard(): Promise<boolean>

export type ResponseCreateCard = {
  data: CardType
  update: typeof UpdateCard
  assignPersonCard: typeof AssignPersonCard
  unassignPersonCard: typeof UnassignPersonCard
  delete: typeof DeleteCard
} | undefined

export type FunctionCreateCardTypeof = typeof CreateCard;
export type FunctionSetCardTypeof = typeof SetCard;
export type FunctionUpdateCardTypeof = typeof UpdateCard | undefined;
export type FunctionAssignPersonCardTypeof = typeof AssignPersonCard | undefined;
export type FunctionUnassignPersonCardTypeof = typeof UnassignPersonCard | undefined;
export type FunctionDeleteCardTypeof = typeof DeleteCard | undefined;

export function useCardService(id?: string) {
  const { mutate } = useSWRConfig();

  const [isLoading, setIsLoading] = useState<boolean>(id ? true : false);

  const create = async (data: DataCard) => {
    const createUpdate = await fetcherAxiosPost<DataCard, ApiResponseSuccessOrErrorType<CardType, Object>>(`${process.env.NEXT_PUBLIC_API_HOST}/card`, setIsLoading, data);

    if (!createUpdate.success) {
      Alerting.create('error', createUpdate.message);
      console.error(createUpdate);
      return undefined;
    }

    const
      uri = `${process.env.NEXT_PUBLIC_API_HOST}/card/${createUpdate.data.id}`,
      uriAssignPersonCard = `${process.env.NEXT_PUBLIC_API_HOST}/card/assign/${createUpdate.data.id}`,
      uriUnassignPersonCard = `${process.env.NEXT_PUBLIC_API_HOST}/card/unassign/${createUpdate.data.id}`;

    return {
      data: createUpdate.data,
      update: async (newData: DataCard): Promise<boolean> => {
        const updateData = await fetcherAxiosPut<DataCard, ApiResponseSuccessOrErrorType<CardType, Object>>(uri, setIsLoading, newData);

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
      assignPersonCard: async (data: DataPersonId): Promise<boolean> => {
        const assignPersonCard = await fetcherAxiosPut<DataPersonId, ApiResponseSuccessOrErrorType<CardType, Object>>(uriAssignPersonCard, setIsLoading, data);

        if (!assignPersonCard.success) {
          Alerting.create('error', assignPersonCard.message);
          console.error(assignPersonCard);

          return false;
        } else {
          mutate([uri, setIsLoading], {
            success: true,
            data: {...createUpdate.data, ...assignPersonCard.data}
          });
        }

        return true;
      },
      unassignPersonCard: async (): Promise<boolean> => {
        const unassignPersonCard = await fetcherAxiosPut<{}, ApiResponseSuccessOrErrorType<CardType, Object>>(uriUnassignPersonCard, setIsLoading, {});

        if (!unassignPersonCard.success) {
          Alerting.create('error', unassignPersonCard.message);
          console.error(unassignPersonCard);

          return false;
        } else {
          mutate([uri, setIsLoading], {
            success: true,
            data: {...createUpdate.data, ...unassignPersonCard.data}
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
    const uri = `${process.env.NEXT_PUBLIC_API_HOST}/card/${id}`,
      uriAssignPersonCard = `${process.env.NEXT_PUBLIC_API_HOST}/card/assign/${id}`,
      uriUnassignPersonCard = `${process.env.NEXT_PUBLIC_API_HOST}/card/unassign/${id}`;

    const { data, error, mutate } = useSWR<
      ApiResponseSuccessType<CardType | undefined>,
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
        update: async (newData: DataCard): Promise<boolean> => {
          const updateData = await fetcherAxiosPut<DataCard, ApiResponseSuccessOrErrorType<CardType, Object>>(uri, setIsLoading, newData);

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
        assignPersonCard: async (dataPersonId: DataPersonId): Promise<boolean> => {
          const assignPersonCard = await fetcherAxiosPut<DataPersonId, ApiResponseSuccessOrErrorType<CardType, Object>>(uriAssignPersonCard, setIsLoading, dataPersonId);

          if (!assignPersonCard.success) {
            Alerting.create('error', assignPersonCard.message);
            console.error(assignPersonCard);

            return false;
          } else {
            mutate({
              success: true,
              data: {...data?.data, ...assignPersonCard.data}
            });
          }

          return true;
        },
        unassignPersonCard: async (): Promise<boolean> => {
          const unassignPersonCard = await fetcherAxiosPut<{}, ApiResponseSuccessOrErrorType<CardType, Object>>(uriUnassignPersonCard, setIsLoading, {});

          if (!unassignPersonCard.success) {
            Alerting.create('error', unassignPersonCard.message);
            console.error(unassignPersonCard);

            return false;
          } else {
            mutate({
              success: true,
              data: {...data?.data, ...unassignPersonCard.data}
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