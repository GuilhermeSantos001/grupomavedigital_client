import { GetCardsByAuthorDocument, GetCardsByAuthorQuery, GetCardsByAuthorQueryVariables, CardInfo } from '@/src/generated/graphql'
import { request, RequestDocument } from 'graphql-request'
import { SWRConfig } from '@/services/config/SWRConfig';
import useSWR from 'swr'

import { GraphqlHeaders } from '@/types/GraphqlHeaders';

declare type GetCards = Pick<GetCardsByAuthorQuery, 'getCardsByAuthor'>;
declare type QueryResponse = {
  success: boolean;
  isValidating: boolean
  data: CardInfo[]
  error?: unknown
}

export function useGetCardsService(variables: GetCardsByAuthorQueryVariables, headers: GraphqlHeaders): QueryResponse {
  const { data, error, isValidating } = useSWR<GetCards>(GetCardsByAuthorDocument, (query: RequestDocument) => request<GetCards, GetCardsByAuthorQueryVariables>(
    process.env.NEXT_PUBLIC_GRAPHQL_HOST!,
    query,
    variables,
    headers
  ), { revalidateOnFocus: true  });

  if (error)
    return {
      success: false,
      error: error,
      data: [],
      isValidating,
    }

  if (data && data.getCardsByAuthor)
    return {
      success: true,
      isValidating,
      data: data.getCardsByAuthor,
    }

  return {
    success: false,
    data: [],
    isValidating
  }
}