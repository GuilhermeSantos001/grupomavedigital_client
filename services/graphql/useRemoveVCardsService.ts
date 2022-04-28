import { VCardRemoveDocument, VCardRemoveMutation, VCardRemoveMutationVariables } from '@/src/generated/graphql'
import { GraphQLClient } from 'graphql-request'

import { GraphqlHeaders } from '@/types/GraphqlHeaders';

declare type RemoveVCards = Pick<VCardRemoveMutation, 'vcardRemove'>;

declare function RemoveVCard(variables: VCardRemoveMutationVariables, headers: GraphqlHeaders): Promise<boolean>;

export type FunctionRemoveVCardTypeof = typeof RemoveVCard;

declare type HookResponse = {
  remove: FunctionRemoveVCardTypeof
}

export function useRemoveVCardsService(): HookResponse {
  return {
    remove: async (variables: VCardRemoveMutationVariables, headers: GraphqlHeaders) => {
      const
        graphQLClient = new GraphQLClient(process.env.NEXT_PUBLIC_GRAPHQL_HOST!, { headers }),
        data = await graphQLClient.request<RemoveVCards, VCardRemoveMutationVariables>(VCardRemoveDocument, variables);

      return data.vcardRemove;
    }
  }
}