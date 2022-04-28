import { CardRemoveDocument, CardRemoveMutation, CardRemoveMutationVariables } from '@/src/generated/graphql'
import { GraphQLClient } from 'graphql-request'

import { GraphqlHeaders } from '@/types/GraphqlHeaders';

declare type RemoveCards = Pick<CardRemoveMutation, 'cardRemove'>;

declare function RemoveCard(variables: CardRemoveMutationVariables, headers: GraphqlHeaders): Promise<boolean>;

export type FunctionRemoveCardTypeof = typeof RemoveCard;

declare type HookResponse = {
  remove: FunctionRemoveCardTypeof
}

export function useDeleteCardsService(): HookResponse {
  return {
    remove: async (variables: CardRemoveMutationVariables, headers: GraphqlHeaders) => {
      const
        graphQLClient = new GraphQLClient(process.env.NEXT_PUBLIC_GRAPHQL_HOST!, { headers }),
        data = await graphQLClient.request<RemoveCards, CardRemoveMutationVariables>(CardRemoveDocument, variables);

      return data.cardRemove;
    }
  }
}