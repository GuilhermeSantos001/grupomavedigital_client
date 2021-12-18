/**
 * @description Pagina usada quando o usuario deseja encerrar a sessão
 * @author @GuilhermeSantos001
 * @update 05/10/2021
 */

import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/router'

import SkeletonLoader from 'tiny-skeleton-loader-react'

import { PageProps } from '@/pages/_app'

import Fetch from '@/src/utils/fetch'
import Variables from '@/src/db/variables'
import AuthLogout from '@/src/functions/authLogout'

const staticProps: PageProps = {
  title: 'Desconectando',
  description: 'Você está se desconectando do sistema',
  themeColor: '#004a6e',
  menu: [],
  fullwidth: true
}

export const getStaticProps = () => ({
  props: staticProps,
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

const Logout = (): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(true)

  const router = useRouter()
  const _fetch = new Fetch(process.env.NEXT_PUBLIC_GRAPHQL_HOST)

  useEffect(() => {
    const timer = setTimeout(async () => {
      const variables = new Variables(1, 'IndexedDB');

      if (await AuthLogout(_fetch)) {
        await variables.clear()

        router.push('/auth/login')
      }

      setLoading(false)
    })

    return () => clearTimeout(timer)
  }, [])

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

export default Logout
