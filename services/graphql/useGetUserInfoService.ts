import { GetUserInfoDocument, GetUserInfoQuery, GetUserInfoQueryVariables } from '@/src/generated/graphql'
import { request, RequestDocument } from 'graphql-request'
import useSWR from 'swr'

export type Headers = {
  authorization: string
  encodeuri: 'true' | 'false'
}

let
  variables: GetUserInfoQueryVariables,
  headers: Headers;

function setVariables(value: GetUserInfoQueryVariables) {
  variables = value;
}

function getVariables() {
  return variables;
}

function setHeaders(value: Headers) {
  headers = value;
}

function getHeaders() {
  return headers;
}

const
  fetcher = (query: RequestDocument) => request<Pick<GetUserInfoQuery, 'getUserInfo'>, GetUserInfoQueryVariables>(
    process.env.NEXT_PUBLIC_GRAPHQL_HOST!,
    query,
    getVariables(),
    getHeaders()
  )

export function useGetUserInfoService(variables: GetUserInfoQueryVariables, headers: Headers) {
  setVariables(variables);
  setHeaders(headers);

  const { data, error, isValidating } = useSWR<Pick<GetUserInfoQuery, 'getUserInfo'>>(GetUserInfoDocument, fetcher);

  if (error)
    return {
      success: false,
      isValidating,
      error: error
    }

  if (data?.getUserInfo)
    return {
      success: true,
      isValidating,
      data: data.getUserInfo,
    }

  return {
    success: false,
    isValidating,
    data: {}
  }
}