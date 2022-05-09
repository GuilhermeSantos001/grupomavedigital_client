import React, { useEffect, useMemo } from 'react'

import { GetServerSidePropsContext } from 'next/types'
import { useRouter } from 'next/router'

import { PageProps } from '@/pages/_app'
import { GetMenuHome } from '@/bin/GetMenuHome'

import Fetch from '@/src/utils/fetch'
import AuthLogout from '@/src/functions/authLogout'

const serverSideProps: PageProps = {
  title: 'Desconectando',
  description: 'Você está se desconectando do sistema',
  themeColor: '#004a6e',
  menu: GetMenuHome('mn-logout'),
  fullwidth: true
}

export const getServerSideProps = async ({ req }: GetServerSidePropsContext) => ({
  props: {
    ...serverSideProps,
    auth: req.cookies.auth ? req.cookies.auth : '',
    token: req.cookies.token ? req.cookies.token : '',
    signature: req.cookies.signature ? req.cookies.signature : '',
    authLogoutAuthorization: process.env.GRAPHQL_AUTHORIZATION_AUTHLOGOUT as string,
  },
})

export default function Logout({
  auth,
  token,
  signature,
  authLogoutAuthorization
}: {
  auth: string
  token: string
  signature: string
  authLogoutAuthorization: string
}) {
  const router = useRouter()
  const _fetch = useMemo(()=> new Fetch(process.env.NEXT_PUBLIC_GRAPHQL_HOST!), [])

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (
        auth && auth !== '' &&
        token && token !== '' &&
        signature && signature !== ''
      )
        await AuthLogout(
          _fetch,
          auth,
          token,
          signature,
          authLogoutAuthorization
        );

      router.push('/auth/login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [_fetch,router, auth, token, signature, authLogoutAuthorization]);

  return (
    <div
      data-testid="div-container"
      className="p-2"
      style={{ fontFamily: 'Fira Code' }}
    >
      <h1 data-testid="text-start" className="fw-bold">
        Grupo Mave Digital
      </h1>
      <hr data-testid="separator" className="text-muted" />
      <p className="text-enter">Espere enquanto finalizamos sua sessão...</p>
    </div>
  )
}