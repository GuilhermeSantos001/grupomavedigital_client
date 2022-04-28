import { FindCardDocument, FindCardQuery, FindCardQueryVariables, CardInfo } from '@/src/generated/graphql'
import { request } from 'graphql-request'

import { GraphqlHeaders } from '@/types/GraphqlHeaders';

declare type GetCards = Pick<FindCardQuery, 'findCard'>;

declare type Response = {
  data: CardInfo
  error?: Error
}

export const findCard = async (variables: FindCardQueryVariables, headers: GraphqlHeaders): Promise<Response> => {
  try {
    const response = await request<GetCards, FindCardQueryVariables>(
      process.env.NEXT_PUBLIC_GRAPHQL_HOST!,
      FindCardDocument,
      variables,
      headers
    );

    return {
      data: response.findCard,
    };
  } catch (error) {
    return {
      data: null,
      error: new Error(error instanceof Error ? error.message : JSON.stringify(error))
    }
  }
}