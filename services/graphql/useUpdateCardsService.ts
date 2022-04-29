import { CardUpdateDocument, CardUpdateMutation, CardUpdateMutationVariables } from '@/src/generated/graphql'
import { GraphQLClient } from 'graphql-request'

import { GraphqlHeaders } from '@/types/GraphqlHeaders';

declare type UpdateCards = Pick<CardUpdateMutation, 'cardUpdate'>;

declare function UpdateCard(variables: CardUpdateMutationVariables, headers: GraphqlHeaders): Promise<string>;

export type FunctionUpdateCardTypeof = typeof UpdateCard;

declare type HookResponse = {
  update: FunctionUpdateCardTypeof
}

export function useUpdateCardsService(): HookResponse {
  return {
    update: async (variables: CardUpdateMutationVariables, headers: GraphqlHeaders) => {
      const
        graphQLClient = new GraphQLClient(process.env.NEXT_PUBLIC_GRAPHQL_HOST!, { headers }),
        data = await graphQLClient.request<UpdateCards, CardUpdateMutationVariables>(CardUpdateDocument, variables);

      return data.cardUpdate;
    }
  }
}