import { GetUserInfoDocument, GetUserInfoQuery, GetUserInfoQueryVariables, UserInfo } from '@/src/generated/graphql'
import { request, RequestDocument } from 'graphql-request'
import useSWR from 'swr'

import { GraphqlHeaders } from '@/types/GraphqlHeaders';

declare type GetUserInfo = Pick<GetUserInfoQuery, 'getUserInfo'>;
declare type QueryResponse = {
  success: boolean;
  isValidating: boolean
  data?: UserInfo
  error?: unknown
}

let
  variables: GetUserInfoQueryVariables,
  headers: GraphqlHeaders;

function setVariables(value: GetUserInfoQueryVariables) {
  variables = value;
}

function getVariables() {
  return variables;
}

function setHeaders(value: GraphqlHeaders) {
  headers = value;
}

function getHeaders() {
  return headers;
}

const
  fetcher = (query: RequestDocument) => request<GetUserInfo, GetUserInfoQueryVariables>(
    process.env.NEXT_PUBLIC_GRAPHQL_HOST!,
    query,
    getVariables(),
    getHeaders()
  )

export function useGetUserInfoService(variables: GetUserInfoQueryVariables, headers: GraphqlHeaders): QueryResponse {
  setVariables(variables);
  setHeaders(headers);

  const { data, error, isValidating } = useSWR<GetUserInfo>(GetUserInfoDocument, fetcher);

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