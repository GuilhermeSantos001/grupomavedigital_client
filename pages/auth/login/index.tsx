/**
 * @description Pagina usada quando o usuário deseja efetuar o login
 * @author GuilhermeSantos001
 * @update 28/02/2022
 */

import { useEffect, useState } from 'react'

import { useRouter } from 'next/router'

import SkeletonLoader from 'tiny-skeleton-loader-react'

import InputLogin from '@/components/InputLogin'

import { PageProps } from '@/pages/_app'
import { GetMenuHome } from '@/bin/GetMenuHome'

import { Variables } from '@/src/db/variables'

const staticProps: PageProps = {
  title: 'Entrar',
  description: 'Para acessar o portar primeiro conecte-se!',
  themeColor: '#004a6e',
  menu: GetMenuHome('mn-login'),
}

export const getStaticProps = () => {
  return {
    props: {
      ...staticProps,
      authLoginAuthorization: process.env.GRAPHQL_AUTHORIZATION_AUTHLOGIN as string,
      twofactorretrieveAuthorization: process.env.GRAPHQL_AUTHORIZATION_TWOFACTORRETRIEVE as string,
    },
  }
}

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
          <SkeletonLoader
            width="100%"
            height="4rem"
            radius={10}
            circle={false}
            style={{
              marginTop: '1rem',
            }}
          />
          <SkeletonLoader
            width="100%"
            height="5rem"
            circle={false}
            style={{
              marginTop: '1rem',
            }}
          />
          <SkeletonLoader
            width="100%"
            height="3rem"
            radius={10}
            circle={false}
            style={{
              marginTop: '1rem',
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default function Login({
  authLoginAuthorization,
  twofactorretrieveAuthorization
}: {
  authLoginAuthorization: string,
  twofactorretrieveAuthorization: string
}) {
  const [loading, setLoading] = useState<boolean>(true)

  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(async () => {
      const variables = new Variables(1, 'IndexedDB'),
        token = await variables.get<string>('token')

      if (token) {
        router.push(`/system`)
      } else {
        setLoading(false)
      }
    })

    return () => clearTimeout(timer)
  }, []);

  if (loading) return compose_load()

  return (
    <div
      data-testid="div-container"
      className="p-2"
      style={{ fontFamily: 'Fira Code' }}
    >
      <h1 data-testid="text-start" className="fw-bold">
        Conecte-se ao Ambiente Digital Interativo
      </h1>
      <hr data-testid="separator" className="text-muted" />
      <InputLogin
        api={process.env.NEXT_PUBLIC_GRAPHQL_HOST || ""}
        authLoginAuthorization={authLoginAuthorization}
        twofactorretrieveAuthorization={twofactorretrieveAuthorization}
      />
    </div>
  )
}