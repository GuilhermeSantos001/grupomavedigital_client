import { FindCardDocument, FindCardQuery, FindCardQueryVariables, CardInfo } from '@/src/generated/graphql'
import { request, RequestDocument } from 'graphql-request'
import { SWRConfig } from '@/services/config/SWRConfig';
import useSWR from 'swr'

import { GraphqlHeaders } from '@/types/GraphqlHeaders';

declare type GetCards = Pick<FindCardQuery, 'findCard'>;
declare type QueryResponse = {
  success: boolean;
  isValidating: boolean
  data?: CardInfo
  error?: unknown
}

export function useFindCardService(variables: FindCardQueryVariables, headers: GraphqlHeaders): QueryResponse {
  const { data, error, isValidating } = useSWR<GetCards>(FindCardDocument, (query: RequestDocument) => request<GetCards, FindCardQueryVariables>(
    process.env.NEXT_PUBLIC_GRAPHQL_HOST!,
    query,
    variables,
    headers
  ), SWRConfig);

  if (error)
    return {
      success: false,
      error: error,
      isValidating,
    }

  if (data && data.findCard)
    return {
      success: true,
      isValidating,
      data: data.findCard,
    }

  return {
    success: false,
    isValidating
  }
}