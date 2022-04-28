import { MakeTemporaryUploadMutation, MakeTemporaryUploadDocument, MakeTemporaryUploadMutationVariables } from '@/src/generated/graphql'
import { request } from 'graphql-request'

import signURL from '@/src/functions/signURL'

import { GraphqlHeaders } from '@/types/GraphqlHeaders';

declare type Response = {
  data: boolean
  error?: Error
}

export const makeTemporaryUpload = async (variables: Omit<MakeTemporaryUploadMutationVariables, 'signedUrl'>, headers: GraphqlHeaders): Promise<Response> => {
  try {
    const
      signedUrl = await signURL(),
      response = await request<MakeTemporaryUploadMutation, MakeTemporaryUploadMutationVariables>(
        process.env.NEXT_PUBLIC_GRAPHQL_HOST!,
        MakeTemporaryUploadDocument,
        {
          ...variables,
          signedUrl
        },
        headers
      );

    return {
      data: response.makeTemporaryUpload,
    };
  } catch (error) {
    return {
      data: null,
      error: new Error(error instanceof Error ? error.message : JSON.stringify(error))
    }
  }
}