import { MakePermanentUploadMutation, MakePermanentUploadDocument, MakePermanentUploadMutationVariables } from '@/src/generated/graphql'
import { request } from 'graphql-request'

import signURL from '@/src/functions/signURL'

import { GraphqlHeaders } from '@/types/GraphqlHeaders';

declare type Response = {
  data: boolean
  error?: Error
}

export const makePermanentUpload = async (variables: Omit<MakePermanentUploadMutationVariables, 'signedUrl'>, headers: GraphqlHeaders): Promise<Response> => {
  try {
    const
      signedUrl = await signURL(),
      response = await request<MakePermanentUploadMutation, MakePermanentUploadMutationVariables>(
        process.env.NEXT_PUBLIC_GRAPHQL_HOST!,
        MakePermanentUploadDocument,
        {
          ...variables,
          signedUrl
        },
        headers
      );

    return {
      data: response.makePermanentUpload,
    };
  } catch (error) {
    return {
      data: null,
      error: new Error(error instanceof Error ? error.message : JSON.stringify(error))
    }
  }
}