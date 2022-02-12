import { useState } from 'react';
import useSWR from 'swr'

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

declare function UpdateCards(id: string, newData: DataCard): Promise<boolean>
declare function AssignPersonCard(id: string, dataPersonId: DataPersonId): Promise<boolean>
declare function UnassignPersonCard(id: string): Promise<boolean>
declare function DeleteCards(id: string): Promise<boolean>

export type FunctionUpdateCardsTypeof = typeof UpdateCards | undefined;
export type FunctionAssignPersonCardTypeOf = typeof AssignPersonCard | undefined;
export type FunctionUnassignPersonCardTypeOf = typeof UnassignPersonCard | undefined;
export type FunctionDeleteCardsTypeof = typeof DeleteCards | undefined;
export type FunctionNextPageTypeof = (() => void) | undefined;
export type FunctionPreviousPageTypeof = (() => void) | undefined;

export function useCardsService(take: number = 10, refreshInterval: number = 1000) {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const skip = 1;

  const [uri, setURI] = useState<string>(`${process.env.NEXT_PUBLIC_API_HOST}/cards?take=${take}`);

  const [lastCursorId, setLastCursorId] = useState<number>(0);

  const { data, error, mutate } = useSWR<
    ApiResponseSuccessType<CardType[]>,
    ApiResponseErrorType<Object>
  >([uri, setIsLoading], fetcherAxiosGet, { refreshInterval })

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
          setURI(`${process.env.NEXT_PUBLIC_API_HOST}/cards?skip=${skip}&take=${take}&cursorId=${cursorId}`);
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

        setURI(`${process.env.NEXT_PUBLIC_API_HOST}/cards${query}`);
      },
      update: async (id: string, newData: DataCard): Promise<boolean> => {
        const uri = `${process.env.NEXT_PUBLIC_API_HOST}/card/${id}`;

        const updateData = await fetcherAxiosPut<DataCard, ApiResponseSuccessOrErrorType<CardType, Object>>(uri, setIsLoading, newData);

        if (!updateData.success) {
          Alerting.create('error', updateData.message);
          console.error(updateData);

          return false;
        } else {
          mutate({
            success: true,
            data: data.data.map(card => {
              if (card.id === id) {
                card = updateData.data;
              }

              return card;
            })
          });
        }

        return true;
      },
      assignPersonCard: async (id: string, dataPersonId: DataPersonId): Promise<boolean> => {
        const
          uriAssignPersonCard = `${process.env.NEXT_PUBLIC_API_HOST}/card/assign/${id}`;

        const updateData = await fetcherAxiosPut<DataPersonId, ApiResponseSuccessOrErrorType<CardType, Object>>(uriAssignPersonCard, setIsLoading, dataPersonId);

        if (!updateData.success) {
          Alerting.create('error', updateData.message);
          console.error(updateData);

          return false;
        } else {
          mutate({
            success: true,
            data: data.data.map(card => {
              if (card.id === id) {
                card = updateData.data;
              }

              return card;
            })
          });
        }

        return true;
      },
      unassignPersonCard: async (id: string): Promise<boolean> => {
        const
          uriUnassignPersonCard = `${process.env.NEXT_PUBLIC_API_HOST}/card/unassign/${id}`;

        const updateData = await fetcherAxiosPut<{}, ApiResponseSuccessOrErrorType<CardType, Object>>(uriUnassignPersonCard, setIsLoading, {});

        if (!updateData.success) {
          Alerting.create('error', updateData.message);
          console.error(updateData);

          return false;
        } else {
          mutate({
            success: true,
            data: data.data.map(card => {
              if (card.id === id) {
                card = updateData.data;
              }

              return card;
            })
          });
        }

        return true;
      },
      delete: async (id: string): Promise<boolean> => {
        const uri = `${process.env.NEXT_PUBLIC_API_HOST}/card/${id}`;

        const deleteData = await fetcherAxiosDelete<ApiResponseErrorType<Object>>(uri, setIsLoading);

        if (!deleteData.success) {
          Alerting.create('error', deleteData.message);
          console.error(deleteData);

          return false;
        } else {
          mutate({
            success: true,
            data: data.data.filter(card => card.id !== id)
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