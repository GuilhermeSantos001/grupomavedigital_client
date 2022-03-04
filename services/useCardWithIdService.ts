import { useState } from 'react';
import useSWR from 'swr'

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

export function useCardWithIdService(id: string) {
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
    return { isLoading };
  }

  if (data?.success)
    return {
      isLoading,
      data: data?.data,
      update: async (newData: DataCard): Promise<boolean> => {
        const updateData = await fetcherAxiosPut<DataCard, ApiResponseSuccessOrErrorType<CardType, Object>>(uri, setIsLoading, newData);

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
      assignPersonCard: async (dataPersonId: DataPersonId): Promise<boolean> => {
        const assignPersonCard = await fetcherAxiosPut<DataPersonId, ApiResponseSuccessOrErrorType<CardType, Object>>(uriAssignPersonCard, setIsLoading, dataPersonId);

        if (!assignPersonCard.success) {
          Alerting.create('error', assignPersonCard.message);
          console.error(assignPersonCard);

          return false;
        } else {
          mutate({
            success: true,
            data: { ...data?.data, ...assignPersonCard.data }
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
            data: { ...data?.data, ...unassignPersonCard.data }
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

  return {
    isLoading
  };
}