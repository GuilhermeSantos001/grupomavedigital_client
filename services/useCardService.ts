import { useState } from 'react';
import { useSWRConfig } from 'swr';

import { fetcherAxiosPost } from '@/src/utils/fetcherAxiosPost';
import { fetcherAxiosPut } from '@/src/utils/fetcherAxiosPut';
import { fetcherAxiosDelete } from '@/src/utils/fetcherAxiosDelete';
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

export function useCardService() {
  const { mutate } = useSWRConfig();

  const [isLoading, setIsLoading] = useState<boolean>(false);

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
            data: { ...createUpdate.data, ...updateData.data }
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
            data: { ...createUpdate.data, ...assignPersonCard.data }
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
            data: { ...createUpdate.data, ...unassignPersonCard.data }
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

  return {
    isLoading,
    create
  };
}