import { VCardCreateDocument, VCardCreateMutation, VCardCreateMutationVariables, VCardMetadata } from '@/src/generated/graphql'
import { GraphQLClient } from 'graphql-request'

import { GraphqlHeaders } from '@/types/GraphqlHeaders';

declare type CreateVCards = Pick<VCardCreateMutation, 'vcardCreate'>;

declare function CreateVCard(variables: VCardCreateMutationVariables, headers: GraphqlHeaders): Promise<VCardMetadata>;

export type FunctionCreateVCardTypeof = typeof CreateVCard;

declare type HookResponse = {
  create: FunctionCreateVCardTypeof
}

export function useCreateVCardsService(): HookResponse {
  return {
    create: async (variables: VCardCreateMutationVariables, headers: GraphqlHeaders) => {
      const
        graphQLClient = new GraphQLClient(process.env.NEXT_PUBLIC_GRAPHQL_HOST!, { headers }),
        data = await graphQLClient.request<CreateVCards, VCardCreateMutationVariables>(VCardCreateDocument, variables);

      return data.vcardCreate;
    }
  }
}