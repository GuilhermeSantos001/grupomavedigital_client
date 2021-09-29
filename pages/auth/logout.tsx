/**
 * @description Pagina de login
 * @author @GuilhermeSantos001
 * @update 29/09/2021
 */

import React, { useEffect, useState } from 'react'

import { compressToEncodedURIComponent } from 'lz-string'

import { useRouter } from 'next/router'

import SkeletonLoader from 'tiny-skeleton-loader-react'

import { PageProps } from '@/pages/_app'

import Variables from '@/src/db/variables'

import Alert from '@/src/utils/alerting'

const staticProps: PageProps = {
  title: 'Desconectando',
  description: 'Você está se desconectando do sistema',
  themeColor: '#004a6e',
  menu: [],
  fullwidth: true,
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

  useEffect(() => {
    const timer = setTimeout(async () => {
      const variables = new Variables(1, 'IndexedDB'),
        auth = await variables.get<string>('auth'),
        privileges = await variables.get<string[]>('privileges'),
        token = await variables.get<string>('token'),
        signature = await variables.get<string>('signature')

      fetch(`${process.env.NEXT_PUBLIC_GRAPHQL_HOST}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization:
            'vlta#eke08uf=48uCuFustLr3ChL9a1*wrE_ayi0L*oFl-UHidlST8moj9f8C5L4',
          encodeuri: 'true',
        },
        body: JSON.stringify({
          query: `
          query DisconnectUserToSystem($auth: String!, $privileges: [String!]!, $token: String!, $signature: String!) {
            success: authLogout(auth: $auth, privileges: $privileges, token: $token, signature: $signature)
          }
          `,
          variables: {
            auth: compressToEncodedURIComponent(auth),
            privileges: compressToEncodedURIComponent(
              JSON.stringify(privileges)
            ),
            token: compressToEncodedURIComponent(token),
            signature: compressToEncodedURIComponent(signature),
          },
        }),
      })
        .then((response) => response.json())
        .then(async ({ data, errors }) => {
          if (errors)
            return errors.forEach((error) => Alert.create(error.message))

          const { success } = data || {}

          if (!success) {
            Alert.create('Não foi possível encerrar a sua sessão.')
          }

          await variables.clear()

          router.push('/auth/login')
        })
        .catch((err) => {
          Alert.create(
            'Ocorreu um erro com o servidor. Tente novamente mais tarde!'
          )

          throw new Error(err)
        })

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
