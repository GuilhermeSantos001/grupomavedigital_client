import { GetUserInfoDocument, GetUserInfoQuery, GetUserInfoQueryVariables, UserInfo } from '@/src/generated/graphql'
import { request, RequestDocument } from 'graphql-request'
import useSWRImmutable from 'swr/immutable'

import { GraphqlHeaders } from '@/types/GraphqlHeaders';

declare type GetUserInfo = Pick<GetUserInfoQuery, 'getUserInfo'>;
declare type QueryResponse = {
  success: boolean;
  isValidating: boolean
  data?: UserInfo
  error?: unknown
}

export function useGetUserInfoService(variables: GetUserInfoQueryVariables, headers: GraphqlHeaders): QueryResponse {
  const { data, error, isValidating } = useSWRImmutable<GetUserInfo>(GetUserInfoDocument, (query: RequestDocument) => request<GetUserInfo, GetUserInfoQueryVariables>(
    process.env.NEXT_PUBLIC_GRAPHQL_HOST!,
    query,
    variables,
    headers
  ));

  if (error)
    return {
      success: false,
      isValidating,
      error: error
    }

  if (data && data.getUserInfo)
    return {
      success: true,
      isValidating,
      data: data.getUserInfo,
    }

  return {
    success: false,
    isValidating
  }
}