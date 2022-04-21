import { CardGetDocument, CardGetQuery, CardGetQueryVariables, CardInfo } from '@/src/generated/graphql'
import { request, RequestDocument } from 'graphql-request'
import { SWRConfig } from '@/services/config/SWRConfig';
import useSWR from 'swr'

import { GraphqlHeaders } from '@/types/GraphqlHeaders';

declare type GetCards = Pick<CardGetQuery, 'cardGet'>;
declare type QueryResponse = {
  success: boolean;
  isValidating: boolean
  data: CardInfo[]
  error?: unknown
}

export function useGetCardsService(variables: CardGetQueryVariables, headers: GraphqlHeaders): QueryResponse {
  const { data, error, isValidating } = useSWR<GetCards>(CardGetDocument, (query: RequestDocument) => request<GetCards, CardGetQueryVariables>(
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

  if (data && data.cardGet)
    return {
      success: true,
      isValidating,
      data: data.cardGet,
    }

  return {
    success: false,
    data: [],
    isValidating
  }
}