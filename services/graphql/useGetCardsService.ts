import { GetCardsDocument, GetCardsQuery, GetCardsQueryVariables, CardInfo } from '@/src/generated/graphql'
import { request, RequestDocument } from 'graphql-request'
import { SWRConfig } from '@/services/config/SWRConfig';
import useSWR from 'swr'

import { GraphqlHeaders } from '@/types/GraphqlHeaders';

declare type GetCards = Pick<GetCardsQuery, 'getCards'>;
declare type QueryResponse = {
  success: boolean;
  isValidating: boolean
  data: CardInfo[]
  error?: unknown
}

export function useGetCardsService(variables: GetCardsQueryVariables, headers: GraphqlHeaders): QueryResponse {
  const { data, error, isValidating } = useSWR<GetCards>(GetCardsDocument, (query: RequestDocument) => request<GetCards, GetCardsQueryVariables>(
    process.env.NEXT_PUBLIC_GRAPHQL_HOST!,
    query,
    variables,
    headers
  ), SWRConfig);

  if (error)
    return {
      success: false,
      error: error,
      data: [],
      isValidating,
    }

  if (data && data.getCards)
    return {
      success: true,
      isValidating,
      data: data.getCards,
    }

  return {
    success: false,
    data: [],
    isValidating
  }
}