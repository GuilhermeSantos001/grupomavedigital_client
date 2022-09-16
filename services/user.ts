import { useState } from 'react';

import UserCookies from '@/cache/cookies/user';

import HttpPost from '@/services/utils/http-post';

export default function UserService() {
  const [loading, setLoading] = useState(false);

  const { login: cookies } = UserCookies();

  return {
    loading,
    register: async (
      username: string,
      email: string,
      password: string,
    ) => {
      const $response = await HttpPost('api/users', {
        username,
        email,
        password,
      }, setLoading);

      if ($response.statusCode !== 200)
        throw new Error($response.message);

      return $response;
    },
    activate: async (token: string) => {
      const $response = await HttpPost('api/users/activate', {
        token,
      }, setLoading);

      if ($response.statusCode !== 200)
        throw new Error($response.message);

      return $response;
    },
    login: async (
      email: string,
      password: string,
    ) => {
      const $response = await HttpPost('api/users/auth/login', {
        email,
        password,
      }, setLoading);

      if ($response.statusCode !== 200)
        throw new Error($response.message);

      const
        accessTokens = $response.session.accessTokens[$response.session.accessTokens.length - 1],
        accessTokenRevalidate = $response.session.accessTokenRevalidate;

      cookies.set(
        accessTokens.value,
        accessTokens.signature,
        accessTokenRevalidate.value,
        accessTokenRevalidate.signature,
      );

      return $response;
    },
    session_validate: async (id: string) => {
      const $response = await HttpPost('api/users/auth/validate', {
        id,
        token_value: cookies.find('token_value'),
        token_signature: cookies.find('token_signature'),
        token_revalidate_value: cookies.find('token_revalidate_value'),
        token_revalidate_signature: cookies.find('token_revalidate_signature'),
      }, setLoading);

      if ($response.statusCode !== 200)
        throw new Error($response.message);

      const {
        token_value,
        token_signature,
      } = $response;

      cookies.update('token_value', token_value);
      cookies.update('token_signature', token_signature);

      return $response;
    },
    logout: async (id: string) => {
      const $response = await HttpPost('api/users/auth/logout', {
        id,
        token_value: cookies.find('token_value'),
      }, setLoading);

      if ($response.statusCode !== 200)
        throw new Error($response.message);

      cookies.prune();

      return $response;
    }
  } as const;
}
