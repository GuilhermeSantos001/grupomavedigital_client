import { useState } from 'react';

import useSWR from 'swr'
import { SWRConfig } from '@/services/config/SWRConfig';

import { fetcherAxiosGet } from '@/src/utils/fetcherAxiosGet';
import { fetcherAxiosPut } from '@/src/utils/fetcherAxiosPut';
import { fetcherAxiosDelete } from '@/src/utils/fetcherAxiosDelete';
import { ApiResponseSuccessType } from '@/types/ApiResponseSuccessType';
import { ApiResponseErrorType } from '@/types/ApiResponseErrorType';
import { ApiResponseSuccessOrErrorType } from '@/types/ApiResponseSuccessOrErrorType';

import type {
  DataCard,
  DataPersonId
} from '@/types/CardServiceType';

import type {
  CardType
} from '@/types/CardType';

import Alerting from '@/src/utils/alerting';

export function useCardsService(take: number = 10) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [uri, setURI] = useState<string>(`${process.env.NEXT_PUBLIC_API_HOST}/cards?take=${take}`);
  const [lastCursorId, setLastCursorId] = useState<number>(0);

  const skip = 1;

  const { data, error, mutate } = useSWR<
    ApiResponseSuccessType<CardType[]>,
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
                card = { ...card, ...updateData.data };
              }

              return card;
            })
          });
        }

        return true;
      },
      assignPerson: async (id: string, dataPersonId: DataPersonId): Promise<boolean> => {
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
                card = { ...card, ...updateData.data };
              }

              return card;
            })
          });
        }

        return true;
      },
      unassignPerson: async (id: string): Promise<boolean> => {
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
                card = { ...card, ...updateData.data };
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