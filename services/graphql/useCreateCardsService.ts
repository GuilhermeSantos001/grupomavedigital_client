import { CardCreateDocument, CardCreateMutation, CardCreateMutationVariables } from '@/src/generated/graphql'
import { GraphQLClient } from 'graphql-request'

import { GraphqlHeaders } from '@/types/GraphqlHeaders';

declare type CreateCards = Pick<CardCreateMutation, 'cardCreate'>;

declare function CreateCard(variables: CardCreateMutationVariables, headers: GraphqlHeaders): Promise<string>;

export type FunctionCreateCardTypeof = typeof CreateCard;

declare type HookResponse = {
  create: FunctionCreateCardTypeof
}

export function useCreateCardsService(): HookResponse {
  return {
    create: async (variables: CardCreateMutationVariables, headers: GraphqlHeaders) => {
      const
        graphQLClient = new GraphQLClient(process.env.NEXT_PUBLIC_GRAPHQL_HOST!, { headers }),
        data = await graphQLClient.request<CreateCards, CardCreateMutationVariables>(CardCreateDocument, variables);

      return data.cardCreate;
    }
  }
}