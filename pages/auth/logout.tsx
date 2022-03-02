import React, { useEffect, useState } from 'react'

import { GetServerSidePropsContext } from 'next/types'
import { useRouter } from 'next/router'

import SkeletonLoader from 'tiny-skeleton-loader-react'

import { PageProps } from '@/pages/_app'
import { GetMenuHome } from '@/bin/GetMenuHome'

import Fetch from '@/src/utils/fetch'
import { verifyCookie } from '@/lib/verifyCookie'
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
    auth: await verifyCookie(req.cookies.auth),
    token: await verifyCookie(req.cookies.token),
    signature: await verifyCookie(req.cookies.signature),
    authLogoutAuthorization: process.env.GRAPHQL_AUTHORIZATION_AUTHLOGOUT as string,
  },
})

function compose_load() {
  return (
    <div className="d-flex flex-column p-2">
      <div className="col-12 d-flex flex-column">
        <div className="my-1">
          <SkeletonLoader width="100%" height="3rem" circle={false} />
        </div>
        <div className="col-12 my-1">
          <SkeletonLoader width="100%" height="0.1rem" circle={false} />
        </div>
        <div className="col-12 my-2">
          <SkeletonLoader
            width="100%"
            height="4rem"
            radius={10}
            circle={false}
          />
        </div>
      </div>
    </div>
  )
}

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
  const [loading, setLoading] = useState<boolean>(true)

  const router = useRouter()
  const _fetch = new Fetch(process.env.NEXT_PUBLIC_GRAPHQL_HOST!)

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

      setLoading(false);
    })

    return () => clearTimeout(timer);
  })

  if (loading) return compose_load()

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